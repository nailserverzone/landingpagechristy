'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/Button';

interface ShareLinkProps {
  slug: string;
}

export function ShareLink({ slug }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/gift/${slug}`
    : `/gift/${slug}`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-center space-y-6">
      <div className="text-5xl">🎁</div>
      <h2 className="font-serif text-2xl text-[#1E2D5A]">Your gift box is ready!</h2>
      <p className="text-gray-500 text-sm">
        Share this link with your recipient. They'll be able to open the gift box
        and experience everything you've prepared.
      </p>

      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <p className="font-mono text-sm text-gray-700 break-all mb-3">{url}</p>
        <Button onClick={copy} className="w-full" variant={copied ? 'secondary' : 'primary'}>
          {copied ? '✓ Copied!' : 'Copy Link'}
        </Button>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <QRCodeSVG value={url} size={160} level="M" />
          <p className="text-xs text-gray-400 mt-2 text-center">Scan to open</p>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        This link will work as long as the gift is active. You can create another gift at any time.
      </p>
    </div>
  );
}
