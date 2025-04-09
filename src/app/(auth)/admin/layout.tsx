import { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

import { Button } from '@/components/ui/button'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  // Verificar se o usuário está autenticado
  const session = await getServerSession(authOptions)

  // Se não estiver autenticado, redirecionar para a página de login
  if (!session) {
    redirect('/login?callbackUrl=/admin')
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-lg font-semibold">Painel Administrativo</h1>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/" target="_blank">
                  Visualizar Site
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
