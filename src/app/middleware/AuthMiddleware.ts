import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Caminhos que devem ser protegidos
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  
  // Verificar token de autenticação
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Se o caminho é administrativo e o usuário não está autenticado
  if (isAdminPath && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configurar caminhos para aplicar o middleware
export const config = {
  // Aplicar apenas nos caminhos especificados
  matcher: ['/admin/:path*']
};