'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Inicio de sesión con Google exitoso' });
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Error de autenticación de Google',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
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
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              O continuar con
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full"
        >
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 381.5 512 244 512 110.1 512 0 401.9 0 265.8 0 129.7 110.1 20 244 20c66.5 0 123.9 24.8 166.3 65.9L362.4 141.6C325.7 107.9 289.4 88 244 88c-88.6 0-160.1 71.1-160.1 177.8 0 106.7 71.5 177.8 160.1 177.8 100.2 0 144.3-73.8 148.8-109.2H244v-87.5h243.9c1.3 12.6 2.1 25.8 2.1 39.5z"
            ></path>
          </svg>
          Google
        </Button>
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
