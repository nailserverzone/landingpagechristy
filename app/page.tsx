import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7D6D6] flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl mx-auto">
        {/* Gift box illustration */}
        <div className="mb-8 flex justify-center">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="50" width="100" height="65" rx="4" fill="white" stroke="#E8B4B4" strokeWidth="2"/>
            <rect x="10" y="38" width="100" height="18" rx="4" fill="white" stroke="#E8B4B4" strokeWidth="2"/>
            <rect x="52" y="10" width="16" height="82" rx="8" fill="#F9C5C5"/>
            <rect x="10" y="42" width="100" height="10" rx="2" fill="#F9C5C5"/>
            <ellipse cx="60" cy="38" rx="12" ry="14" fill="none" stroke="#F9C5C5" strokeWidth="3"/>
            <ellipse cx="60" cy="38" rx="12" ry="14" fill="none" stroke="#F9C5C5" strokeWidth="3" transform="scale(-1,1) translate(-120,0)"/>
          </svg>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl text-[#1E2D5A] mb-4">
          Digital Gift Box
        </h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Create a beautiful, interactive gift experience for someone special.
          Upload photos, write a personal letter, add music — all inside an animated gift box.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#1E2D5A] text-white rounded-full font-medium text-lg hover:bg-[#2a3d7a] transition-colors shadow-lg"
          >
            Create a Gift Box →
          </Link>
          <Link
            href="/gift/demo"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#1E2D5A] rounded-full font-medium text-lg hover:bg-gray-50 transition-colors shadow-md border border-gray-200"
          >
            See Demo
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '📸', label: 'Photo Gallery' },
            { icon: '💌', label: 'Personal Letter' },
            { icon: '🎵', label: 'Music Player' },
            { icon: '🎁', label: 'Gift Card' },
          ].map((item) => (
            <div key={item.label} className="bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-sm text-gray-600 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
