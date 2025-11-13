import Link from 'next/link'

export default function BlogBreadcrumb({ articleTitle }) {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' }
  ]

  if (articleTitle) {
    breadcrumbItems.push({
      name: articleTitle,
      href: null,
      isCurrent: true
    })
  } else {
    breadcrumbItems[breadcrumbItems.length - 1].isCurrent = true
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href || item.name} className="flex items-center">
          {index > 0 && (
            <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {item.isCurrent ? (
            <span className="text-gray-900 font-medium">{item.name}</span>
          ) : (
            <Link 
              href={item.href}
              className="hover:text-gray-700 transition-colors"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

