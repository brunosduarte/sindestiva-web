'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Newspaper, 
  Users, 
  Settings, 
  Home, 
  LogOut, 
  // Menu, 
  ChevronLeft,
  ChevronRight, 
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export default function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const userName = session?.user?.name || 'Usuário';
  const userRole = session?.user?.role === 'admin' ? 'Administrador' : 'Editor';
  const userInitial = userName.charAt(0).toUpperCase();

  const sidebarLinks = [
    { 
      href: '/admin', 
      icon: <Home className="h-5 w-5" />, 
      label: 'Dashboard',
      exact: true
    },
    { 
      href: '/admin/noticias', 
      icon: <Newspaper className="h-5 w-5" />, 
      label: 'Notícias',
      exact: false
    },
    {
      href: '/admin/perfil',
      icon: <User className="h-5 w-5" />,
      label: 'Meu Perfil',
      exact: true
    },
  ];

  // Mostrar opções de administrador apenas para usuários admin
  if (session?.user?.role === 'admin') {
    sidebarLinks.push({ 
      href: '/admin/usuarios', 
      icon: <Users className="h-5 w-5" />, 
      label: 'Usuários',
      exact: false
    });
    sidebarLinks.push({ 
      href: '/admin/configuracoes', 
      icon: <Settings className="h-5 w-5" />, 
      label: 'Configurações',
      exact: true
    });
  }

  return (
    <aside
      className={cn(
        'bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm transition-all duration-300 ease-in-out z-20',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center px-4 border-b dark:border-gray-700">
          <div className={cn('overflow-hidden', collapsed ? 'justify-center w-full' : 'pl-1')}>
            {collapsed ? (
              <div className="flex justify-center">
                <Image 
                  src="/images/logo.png" 
                  alt="Logo Sindicato" 
                  width={40} 
                  height={40}
                />
              </div>
            ) : (
              <Link href="/admin" className="flex items-center gap-2">
                <Image 
                  src="/images/logo.png" 
                  alt="Logo Sindicato" 
                  width={36} 
                  height={36}
                />
                <span className="font-bold text-primary truncate">
                  Estivadores Admin
                </span>
              </Link>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = link.exact 
                ? pathname === link.href 
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
              
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  {link.icon}
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t dark:border-gray-700">
          <div className={cn(
            'flex items-center',
            collapsed ? 'flex-col space-y-2' : 'space-x-3'
          )}>
            <Avatar>
              <AvatarImage src="/images/avatar.png" alt={userName} />
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            
            {!collapsed && (
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{userName}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{userRole}</span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className={cn(collapsed ? 'mt-2' : '')}
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}