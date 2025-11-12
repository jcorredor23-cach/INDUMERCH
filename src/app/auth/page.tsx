'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Inicio de sesión exitoso' });
        router.push('/');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: 'Cuenta creada exitosamente' });
        router.push('/');
      }
    } catch (error: any) {
      toast({
        title: 'Error de autenticación',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="mb-8">
            <Logo />
        </div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </Button>
        </form>
        <Button
          variant="link"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full"
        >
          {isLogin
            ? '¿No tienes una cuenta? Regístrate'
            : '¿Ya tienes una cuenta? Inicia sesión'}
        </Button>
      </div>
    </div>
  );
}
