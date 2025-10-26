import BottomNav from './BottomNav'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-maroon-800 text-white p-4 fixed top-0 left-0 right-0 z-10 shadow-lg">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold">☕ Kafe App</h1>
          <p className="text-sm text-maroon-200">Meja A1</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-4 max-w-md mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}

export default Layout