export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resale</h3>
            <p className="text-gray-600 text-sm">
              A clean client commerce storefront built with Next.js.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 text-sm">Home</a>
              </li>
              <li>
                <a href="/tags" className="text-gray-600 hover:text-gray-900 text-sm">Tags</a>
              </li>
              <li>
                <a href="/blog" className="text-gray-600 hover:text-gray-900 text-sm">Blog</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">About</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Resale. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
