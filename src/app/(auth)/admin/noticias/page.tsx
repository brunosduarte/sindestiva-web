'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Newspaper,
  PlusCircle,
  Edit,
  Trash2,
  EyeIcon,
  Search,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

import { fetchMyNews, fetchNews, deleteNews } from '@/lib/api'
import { News } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
  // DialogClose,
} from '@/components/ui/dialog'
import {
  Tabs,
  // TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

export default function AdminNewsList() {
  const { data: _session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentTab, setCurrentTab] = useState('all')
  const [page, setPage] = useState(1)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Buscar todas as notícias ou apenas as minhas, dependendo da aba selecionada
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['news', currentTab, page, searchTerm],
    queryFn: () => {
      const params = {
        page,
        limit: 10,
        ...(searchTerm ? { search: searchTerm } : {}),
      }

      return currentTab === 'my' ? fetchMyNews(params) : fetchNews(params)
    },
  })

  // Remover notícia
  const handleDeleteNews = async (id: string) => {
    try {
      await deleteNews(id)
      toast.success('Notícia excluída com sucesso')
      refetch()
      setDeleteConfirmId(null)
    } catch (error) {
      console.error('Erro ao excluir notícia:', error)
      toast.error('Erro ao excluir notícia')
    }
  }

  // Ativar confirmação de exclusão
  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id)
  }

  // Cancelar exclusão
  const cancelDelete = () => {
    setDeleteConfirmId(null)
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
  }

  // Lidar com mudança na caixa de pesquisa com debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1) // Volta para a primeira página quando pesquisa
  }

  // Resetar filtros
  const resetFilters = () => {
    setSearchTerm('')
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Newspaper className="h-6 w-6" />
          <h2 className="text-3xl font-bold tracking-tight">Notícias</h2>
        </div>
        <Button asChild>
          <Link href="/admin/noticias/nova">
            <PlusCircle className="mr-2 h-4 w-4" /> Nova Notícia
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar notícia..."
            className="pl-8 max-w-xs"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <Tabs
          defaultValue="all"
          className="w-fit"
          onValueChange={setCurrentTab}
        >
          <TabsList>
            <TabsTrigger value="all">Todas as Notícias</TabsTrigger>
            <TabsTrigger value="my">Minhas Notícias</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-destructive">Erro ao carregar notícias</p>
          <Button variant="outline" onClick={() => refetch()} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      ) : !data || !data.news || data.news.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma notícia encontrada
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm
              ? `Não encontramos resultados para "${searchTerm}"`
              : 'Comece criando sua primeira notícia'}
          </p>
          {searchTerm && (
            <Button variant="outline" onClick={resetFilters} className="mb-4">
              Limpar pesquisa
            </Button>
          )}
          <Button asChild>
            <Link href="/admin/noticias/nova">
              <PlusCircle className="mr-2 h-4 w-4" /> Criar Nova Notícia
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Publicação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.news.map((news: News) => (
                  <TableRow key={news._id}>
                    <TableCell className="font-medium max-w-[300px] truncate">
                      {news.title}
                    </TableCell>
                    <TableCell>
                      {news.published ? (
                        <Badge variant="default" className="bg-green-600">
                          Publicada
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Rascunho</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(news.publishDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/noticias/${news._id}`} target="_blank">
                            <EyeIcon className="h-4 w-4" />
                            <span className="sr-only">Visualizar</span>
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/admin/noticias/${news._id}/editar`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => confirmDelete(news._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {data.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </Button>

              <span className="text-sm">
                Página {page} de {data.pagination?.totalPages || 1}
              </span>

              <Button
                variant="outline"
                disabled={
                  !data.pagination || page >= data.pagination.totalPages
                }
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}

      {/* Diálogo de confirmação para excluir notícia */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta notícia? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirmId && handleDeleteNews(deleteConfirmId)
              }
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
