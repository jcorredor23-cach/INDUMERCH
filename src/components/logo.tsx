import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Logo() {
  const logoImage = PlaceHolderImages.find(img => img.id === 'logo');

  if (!logoImage) {
    return null;
  }

  return (
    <Image
      src={logoImage.imageUrl}
      alt={logoImage.description}
      width={180}
      height={100}
      data-ai-hint={logoImage.imageHint}
      className="h-20 w-auto rounded-xl shadow-md"
      priority
    />
  );
}
