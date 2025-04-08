'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Schema de validação
const loginSchema = z.object({
  email: z.string().email('Digite um email válido'),
  password: z.string().min(6, 'A senha deve conter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obter erro de callback
  const callbackError = searchParams.get('error');
  
  // Inicializar formulário com react-hook-form e zod
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo.png"
              alt="Logo Sindicato dos Estivadores de Rio Grande"
              width={80}
              height={80}
            />
          </div>
          <CardTitle className="text-2xl font-bold">Entrar no Sistema</CardTitle>
          <CardDescription>
            Acesse o painel administrativo para gerenciar o conteúdo do site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(error || callbackError) && (
            <Alert variant="destructive">
              <AlertDescription>
                {error || (callbackError === 'CredentialsSignin' 
                  ? 'Email ou senha incorretos' 
                  : 'Erro ao fazer login')}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu.email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p>
            Voltar para a{' '}
            <Link href="/" className="text-primary font-medium hover:underline">
              página inicial
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );

  // Função de envio do formulário
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciais inválidas. Verifique seu email e senha.');
        toast.error('Falha ao fazer login');
      } else {
        toast.success('Login realizado com sucesso!');
        
        // Redirecionar para a página anterior ou para o painel admin
        const callbackUrl = searchParams.get('callbackUrl') || '/admin';
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Ocorreu um erro durante o login. Tente novamente.');
      toast.error('Erro ao tentar fazer login');
    } finally {
      setIsLoading(false);
    }
  };
}