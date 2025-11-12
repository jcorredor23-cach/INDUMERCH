
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          InduControl
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/inventory" className="hover:text-gray-300">
                Inventario
              </Link>
            </li>
            <li>
              <Link href="/history" className="hover:text-gray-300">
                Historial
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
