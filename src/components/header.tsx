import { Logo } from './logo';

export function Header() {
  return (
    <header className="text-center pt-8 pb-6">
      <div className="flex justify-center mb-4">
        <Logo />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-800 font-headline">InduControl Fundición</h1>
    </header>
  );
}
