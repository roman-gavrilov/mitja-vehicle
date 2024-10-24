export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
      <p className="text-gray-600 text-center mb-6">Sorry, the page you are looking for does not exist.</p>
      <a
        href="/dashboard"
        className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Return to Dashboard
      </a>
    </div>
  )
}