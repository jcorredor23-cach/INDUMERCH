import Image from 'next/image';

export function Logo() {
  return (
    <Image
      src="/icon-192x192.png"
      alt="InduControl Logo"
      width={180}
      height={100}
      className="h-10 w-10 rounded-xl"
      priority
    />
  );
}
