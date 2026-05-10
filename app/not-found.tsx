import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7D6D6] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-6">📦</div>
      <h1 className="font-serif text-3xl text-[#1E2D5A] mb-3">Gift Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        This gift box doesn't exist or may have been deactivated.
        Double-check the link and try again.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#1E2D5A] text-white rounded-full hover:bg-[#2a3d7a] transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
