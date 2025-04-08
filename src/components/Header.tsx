'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut, FileText, Settings } from 'lucide-react';

// Links públicos visíveis para todos os usuários
const publicMenuItems = [
  { label: 'Início', href: '/' },
  { label: 'Notícias', href: '/noticias' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'História', href: '/historia' },
  { label: 'Serviços', href: '/servicos' },
  { label: 'Contato', href: '/contato' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm dark:bg-gray-950 dark:border-gray-800">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="logo.svg" 
            alt="Sindestiva Rio Grande" 
            width={150} 
            height={150}
            className="h-10 w-auto"
          />
          <span className="hidden font-bold text-xl md:inline-block">
            Sindicato dos Estivadores do Porto de Rio Grande
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {publicMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href
                  ? 'text-primary'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/images/avatar.png" alt={session.user.name} />
                    <AvatarFallback>
                      {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/admin">
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    <span>Painel Administrativo</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/admin/noticias">
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    <span>Gerenciar Notícias</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/admin/perfil">
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Área Restrita</Link>
            </Button>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="font-semibold">Menu</div>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Fechar menu</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <nav className="flex flex-col gap-4 py-6">
                  {publicMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-base font-medium transition-colors hover:text-primary ${
                        pathname === item.href
                          ? 'text-primary'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto">
                  {session ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-4 border-b">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/images/avatar.png" alt={session.user.name} />
                          <AvatarFallback>
                            {session.user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{session.user.name}</div>
                          <div className="text-xs text-muted-foreground">{session.user.email}</div>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full justify-start">
                            <FileText className="w-4 h-4 mr-2" />
                            Painel Administrativo
                          </Button>
                        </Link>
                        <Link href="/admin/noticias" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full justify-start">
                            <FileText className="w-4 h-4 mr-2" />
                            Gerenciar Notícias
                          </Button>
                        </Link>
                        <Link href="/admin/perfil" onClick={() => setIsMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full justify-start">
                            <User className="w-4 h-4 mr-2" />
                            Meu Perfil
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start" 
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleSignOut();
                          }}>
                          <LogOut className="w-4 h-4 mr-2" />
                          Sair
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button asChild variant="default" className="w-full">
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Área Restrita
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}