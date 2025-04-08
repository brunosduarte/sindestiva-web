import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper, Search, Tag } from 'lucide-react';

import { getAllNews } from '@/lib/api';
import { NewsCard } from '@/components/NewsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
// import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Notícias',
  description: 'Últimas notícias e comunicados do Sindicato dos Estivadores de Rio Grande',
};

interface NewsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    tag?: string;
  };
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const search = searchParams.search || '';
  const tag = searchParams.tag || '';
  
  const { data: news, pagination } = await getAllNews(page, 9, tag, search);

  // Lista de tags populares para filtro
  const popularTags = [
    'Notícias', 'Eventos', 'Comunicados', 'Assembleia', 'Porto', 
    'Benefícios', 'Jurídico', 'Saúde'
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Newspaper className="h-8 w-8" />
            Notícias
          </h1>
          <p className="text-muted-foreground mt-1">
            Fique por dentro das últimas novidades do Sindicato dos Estivadores de Rio Grande
          </p>
        </div>
        
        <div className="w-full md:w-auto">
          <form className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input 
              type="search" 
              name="search" 
              placeholder="Buscar notícias..." 
              className="pl-8 w-full"
              defaultValue={search}
            />
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Suspense fallback={<p>Carregando notícias...</p>}>
            {news && news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <NewsCard key={item._id} news={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma notícia encontrada</h3>
                <p className="text-muted-foreground mb-6">
                  {search 
                    ? `Não encontramos resultados para "${search}"`
                    : tag 
                      ? `Não há notícias com a tag "${tag}"`
                      : 'Não há notícias disponíveis no momento'}
                </p>
                <Button asChild variant="outline">
                  <Link href="/noticias">Ver todas as notícias</Link>
                </Button>
              </div>
            )}
          </Suspense>

          {/* Paginação */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {page > 1 && (
                <Button asChild variant="outline">
                  <Link
                    href={{ 
                      pathname: '/noticias',
                      query: { 
                        ...(search ? { search } : {}),
                        ...(tag ? { tag } : {}),
                        page: page - 1 
                      }
                    }}
                  >
                    Anterior
                  </Link>
                </Button>
              )}
              
              <span className="flex items-center px-4">
                Página {page} de {pagination.totalPages}
              </span>
              
              {page < pagination.totalPages && (
                <Button asChild variant="outline">
                  <Link
                    href={{ 
                      pathname: '/noticias',
                      query: { 
                        ...(search ? { search } : {}),
                        ...(tag ? { tag } : {}),
                        page: page + 1 
                      }
                    }}
                  >
                    Próxima
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Tags populares */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5" />
                <h3 className="font-semibold">Tags Populares</h3>
              </div>
              <Separator className="mb-4" />
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tagName) => (
                  <Button
                    key={tagName}
                    variant={tag === tagName ? "default" : "outline"}
                    size="sm"
                    asChild
                    className="rounded-full"
                  >
                    <Link href={`/noticias?tag=${tagName}`}>
                      {tagName}
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Informações adicionais */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Sobre o Sindicato</h3>
              <Separator className="mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                O Sindicato dos Estivadores de Rio Grande luta pelos direitos e pelo bem-estar da categoria desde sua fundação.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sobre">Saiba Mais</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}