import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Star, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  coverUrl?: string | null;
  category: string;
  priceFrom: number;
  priceTo?: number | null;
  deliveryDays: number;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  compact?: boolean;
}

export default function ServiceCard({
  id,
  title,
  description,
  coverUrl,
  category,
  priceFrom,
  priceTo,
  deliveryDays,
  username,
  displayName,
  avatarUrl,
  compact = false
}: ServiceCardProps) {
  return (
    <div className="group relative bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10">
      {/* Cover Image */}
      <div className="aspect-[16/9] w-full relative overflow-hidden">
        {coverUrl ? (
          <Image 
            src={coverUrl} 
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-gray-400 text-lg">{title.substring(0, 2).toUpperCase()}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="bg-gray-900/80 backdrop-blur-sm border-gray-700 text-gray-300">
            {category}
          </Badge>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/services/${id}`}>
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 hover:text-purple-400 transition-colors">
            {title}
          </h3>
        </Link>
        
        {/* Description - only show if not compact */}
        {!compact && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{description}</p>
        )}
        
        {/* Freelancer Info */}
        <Link href={`/profile/${username}`} className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-800 relative">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                {displayName[0]}
              </div>
            )}
          </div>
          <span className="text-sm text-gray-300 hover:text-purple-400 transition-colors">{displayName}</span>
        </Link>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          {/* Delivery Time */}
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{deliveryDays} day{deliveryDays !== 1 ? 's' : ''}</span>
          </div>
          
          {/* Price */}
          <div className="text-right">
            <p className="text-xs text-gray-400">Starting at</p>
            <p className="text-white font-semibold">
              ${priceFrom.toFixed(2)}
              {priceTo && <span className="text-gray-400 text-xs"> - ${priceTo.toFixed(2)}</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
