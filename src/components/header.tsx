import { Logo } from './logo';

export function Header() {
  return (
    <header className="text-center pt-8 pb-6">
      <div className="flex justify-center mb-4">
        <Logo />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-800 font-headline">InduControl Fundición (Comamfer SAS)</h1>
      <p className="text-gray-600 mt-1">Gestión de Coladas, Inventario y Tiempos de Producción</p>
      <p className="text-sm font-semibold text-red-500 mt-2">Base de Datos de MP y Clientes actualizada con información de Fundición de Acero y Aleaciones.</p>
    </header>
  );
}
