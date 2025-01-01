import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex space-x-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Home</Link>
          <Link href="/input" className="text-sm text-gray-600 hover:text-gray-900">Input Parameters</Link>
          <Link href="/output" className="text-sm text-gray-600 hover:text-gray-900">Results</Link>
          <Link href="/advanced" className="text-sm text-gray-600 hover:text-gray-900">Advanced Options</Link>
        </div>
        <div>
          <Link href="/help" className="text-sm text-gray-600 hover:text-gray-900">Help/FAQs</Link>
        </div>
      </div>
    </footer>
  )
}
