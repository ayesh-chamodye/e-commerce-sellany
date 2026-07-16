export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SellAny</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </a>
            <a
              href="#"
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}