import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag,
  Share2
} from 'lucide-react';

import { getNewsDetails, getLatestNews } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsDetailPageProps {
  params: {
    id: string;
  };
}

// Gerar metadados dinâmicos
export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const news = await getNewsDetails(params.id);
  
  if (!news) {
    return {
      title: 'Notícia não encontrada',
    };
  }

  return {
    title: news.title,
    description: news.summary,
    openGraph: {
      title: news.title,
      description: news.summary,
      images: news.imageUrl ? [news.imageUrl] : [],
    },
  };
}

// Componente de carregamento
function NewsDetailSkeleton() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Skeleton className="h-10 w-3/4" />
      <div className="flex gap-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  );
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = params;
  
  const news = await getNewsDetails(id);
  
  if (!news) {
    notFound();
  }

  // Formatar data de publicação
  const formattedDate = format(
    new Date(news.publishDate), 
    "dd 'de' MMMM 'de' yyyy", 
    { locale: ptBR }
  );

  // Buscar notícias relacionadas (últimas 3, excluindo a atual)
  const latestNews = await getLatestNews(4);
  const relatedNews = latestNews.filter(item => item._id !== id).slice(0, 3);

  // Extrair nome do autor
  let authorName = 'Sindicato dos Estivadores';
  if (typeof news.author === 'object' && news.author && 'name' in news.author) {
    authorName = news.author.name;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Button variant="outline" asChild className="mb-8">
            <Link href="/noticias">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Notícias
            </Link>
          </Button>

          <article className="space-y-6 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{news.title}</h1>
            
            <div className="flex flex-wrap gap-3 items-center text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span className="text-sm">{authorName}</span>
              </div>
              {news.tags && news.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4" />
                  <div className="flex flex-wrap gap-2">
                    {news.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Link href={`/noticias?tag=${tag}`}>{tag}</Link>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {news.imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            <div className="mt-4 text-lg leading-relaxed">
              <div className="news-content prose prose-blue max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>
            
            <Separator className="my-8" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Compartilhar:</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.href : ''
                  )}`} target="_blank" rel="noopener noreferrer">
                    Facebook
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.href : ''
                  )}&text=${encodeURIComponent(news.title)}`} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `${news.title} - ${typeof window !== 'undefined' ? window.location.href : ''}`
                  )}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Notícias Relacionadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedNews.length > 0 ? (
                relatedNews.map((item) => (
                  <div key={item._id} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <Link
                      href={`/noticias/${item._id}`}
                      className="font-medium hover:text-primary transition-colors">
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(
                          new Date(item.publishDate),
                          "dd/MM/yyyy",
                          { locale: ptBR }
                        )}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  Não há notícias relacionadas disponíveis.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                O Sindicato dos Estivadores de Rio Grande trabalha 
                constantemente para manter a categoria informada sobre 
                todas as questões relevantes do setor portuário.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sobre">Conheça nossa história</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/contato">Entre em contato</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}