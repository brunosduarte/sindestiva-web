import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, ArrowRight } from 'lucide-react';
import { 
  Card, 
  // CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { News } from '@/types';

interface NewsCardProps {
  news: News;
  compact?: boolean;
}

export function NewsCard({ news, compact = false }: NewsCardProps) {
  // Formatar data
  const formattedDate = format(
    new Date(news.publishDate), 
    compact ? "dd/MM/yyyy" : "dd 'de' MMMM 'de' yyyy", 
    { locale: ptBR }
  );

  // Extrair nome do autor se disponível
  let authorName = 'Sindicato dos Estivadores';
  if (typeof news.author === 'object' && news.author && 'name' in news.author) {
    authorName = news.author.name;
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
      <Link href={`/noticias/${news._id}`} className="group">
        <div className="relative h-48 w-full overflow-hidden">
          {news.imageUrl ? (
            <Image
              src={news.imageUrl}
              alt={news.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">Sem imagem</span>
            </div>
          )}
        </div>
      </Link>
      
      <CardHeader className="flex-grow pb-2">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-wrap gap-2">
            {news.tags && news.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Link href={`/noticias?tag=${tag}`}>{tag}</Link>
              </Badge>
            ))}
          </div>
          <CardDescription className="text-xs flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formattedDate} • {authorName}
          </CardDescription>
        </div>
        <CardTitle className="text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/noticias/${news._id}`} className="hover:text-primary transition-colors">
            {news.title}
          </Link>
        </CardTitle>
        {!compact && (
          <CardDescription className="line-clamp-3 mt-2">
            {news.summary}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardFooter className="pt-2">
        <Button variant="ghost" className="px-0 text-primary" asChild>
          <Link href={`/noticias/${news._id}`}>
            Ler matéria completa
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}