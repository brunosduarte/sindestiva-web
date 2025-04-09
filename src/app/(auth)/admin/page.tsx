import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Newspaper,
  PlusCircle,
  Users,
  Eye,
  Clock,
  AlertCircle,
} from 'lucide-react'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  // Em produção, você buscaria essas informações da API
  const dashboardStats = {
    totalNews: 12,
    draftNews: 3,
    publishedNews: 9,
    recentViews: 156,
    totalUsers: 5,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button asChild>
          <Link href="/admin/noticias/nova">
            <PlusCircle className="mr-2 h-4 w-4" /> Nova Notícia
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Notícias
            </CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalNews}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.publishedNews} publicadas,{' '}
              {dashboardStats.draftNews} rascunhos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Visualizações Recentes
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.recentViews}
            </div>
            <p className="text-xs text-muted-foreground">Nos últimos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              Administradores e editores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Notícias Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.draftNews}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando publicação
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/noticias/nova">
                <PlusCircle className="mr-2 h-4 w-4" /> Criar Nova Notícia
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/noticias">
                <Newspaper className="mr-2 h-4 w-4" /> Gerenciar Notícias
              </Link>
            </Button>
            {session?.user.role === 'admin' && (
              <Button asChild variant="outline" className="justify-start">
                <Link href="/admin/usuarios">
                  <Users className="mr-2 h-4 w-4" /> Gerenciar Usuários
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Atualizações e lembretes importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border p-4">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Lembrete</p>
                  <p className="text-sm text-muted-foreground">
                    Você tem {dashboardStats.draftNews} notícias em rascunho que
                    precisam ser revisadas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border p-4">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Dica</p>
                  <p className="text-sm text-muted-foreground">
                    Imagens de alta qualidade melhoram o engajamento nas
                    notícias.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
