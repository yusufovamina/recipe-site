export default function ThankYouPage() {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 md:px-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Thank You!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Your order has been placed successfully. We will contact you soon!</p>
          <a href="/menu" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            Back to Menu
          </a>
        </div>
      </div>
    );
  }