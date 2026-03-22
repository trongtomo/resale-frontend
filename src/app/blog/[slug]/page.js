import MarkdownRenderer from '@/components/MarkdownRenderer'
import StrapiBlocks from '@/components/StrapiBlocks'
import BlogBreadcrumb from '@/components/BlogBreadcrumb'
import { getArticleBySlug } from '@/services/articles'
import { formatDate } from '@/utils/format'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 600 // Revalidate every 10 minutes for individual articles

export async function generateMetadata({ params }) {
  const { slug } = await params
  
  try {
    const data = await getArticleBySlug(slug)
    const article = data.data?.[0]
    
    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.'
      }
    }

    return {
      title: article.seo?.metaTitle || article.title,
      description: article.seo?.metaDescription || article.description || 'Read this article on our blog',
      openGraph: {
        title: article.seo?.metaTitle || article.title,
        description: article.seo?.metaDescription || article.description || 'Read this article on our blog',
        images: article.seo?.shareImage?.url ? [
          {
            url: article.seo.shareImage.url,
            width: 1200,
            height: 630,
            alt: article.title,
          }
        ] : article.cover?.url ? [
          {
            url: article.cover.url,
            width: 1200,
            height: 630,
            alt: article.title,
          }
        ] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    }
  }
}

export default async function ArticlePage({ params }) {
  const { slug } = await params
  let article = null
  let error = null

  try {
    const data = await getArticleBySlug(slug)
    article = data.data?.[0]
    
    if (!article) {
      notFound()
    }
  } catch (err) {
    error = err.message
    console.error('Failed to fetch article:', err)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Failed to load article: {error}</p>
          <Link 
            href="/blog" 
            className="inline-block bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Hero Section with Cover Image */}
      <div className="relative">
        {article.cover?.url ? (
          <div className="w-full bg-gray-100 dark:bg-gray-800">
            <img
              src={article.cover.url}
              alt={article.cover.alternativeText || article.title}
              className="w-full object-cover"
              style={{ maxHeight: '500px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end justify-center">
              <div className="text-center text-white max-w-4xl px-4 pb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 drop-shadow-lg">{article.title}</h1>
                {article.description && (
                  <p className="text-lg md:text-xl text-gray-100 mb-3 drop-shadow">{article.description}</p>
                )}
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-200">
                  <span>Published: {formatDate(article.publishedAt, { format: 'DD-MM-YYYY' })}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">{article.title}</h1>
                {article.description && (
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4">{article.description}</p>
                )}
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <span>Published: {formatDate(article.publishedAt, { format: 'DD-MM-YYYY' })}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogBreadcrumb articleTitle={article.title} />
        <article className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800">
          {/* Render article content */}
          {article.content ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-700 p-8 md:p-12 border border-gray-200 dark:border-gray-700">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                <MarkdownRenderer content={article.content} />
              </div>
            </div>
          ) : article.blocks && article.blocks.length > 0 ? (
            <StrapiBlocks blocks={article.blocks} />
          ) : article.description ? (
            <div className="text-gray-700 leading-relaxed">
              <MarkdownRenderer content={article.description} />
            </div>
          ) : null}
        </article>

        {/* Article Tags */}
        {article.tag_articles && article.tag_articles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tag_articles.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link 
            href="/blog" 
            className="inline-block bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
