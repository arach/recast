export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold gradient-text mb-4">ReCast</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Transform your brand into living code. Create adaptive identities that respond to context while maintaining consistency.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/arach/recast" className="text-gray-600 dark:text-gray-400 hover:text-recast-blue transition">
                GitHub
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-recast-blue transition">
                Twitter
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-recast-blue transition">
                Discord
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-recast-blue transition">Features</a></li>
              <li><a href="#templates" className="text-gray-600 dark:text-gray-400 hover:text-recast-blue transition">Templates</a></li>
              <li><a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-recast-blue transition">Pricing</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-recast-blue transition">API Docs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-recast-blue transition">About</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-recast-blue transition">Blog</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-recast-blue transition">Careers</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-recast-blue transition">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {currentYear} ReCast. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-recast-blue transition text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-recast-blue transition text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}