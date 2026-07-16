'use client';

import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
}

export function Avatar({ src, alt = 'Avatar', size = 'md', fallback }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-lg',
  };

  if (src) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 flex-shrink-0`}>
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0`}>
      {fallback?.[0]?.toUpperCase() || '?'}
    </div>
  );
}
