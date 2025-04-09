import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Card,
  // CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { News } from '@/types'

interface NewsCardProps {
  news: News
  compact?: boolean
}

export function NewsCard({ news, compact = false }: NewsCardProps) {
  // Formatar data
  const formattedDate = format(
    new Date(news.publishDate),
    compact ? 'dd/MM/yyyy' : "dd 'de' MMMM 'de' yyyy",
    { locale: ptBR },
  )

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full overflow-hidden">
        {news.imageUrl ? (
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">Sem imagem</span>
          </div>
        )}
      </div>

      <CardHeader className="flex-grow pb-2">
        <div className="flex justify-between items-start mb-2">
          <div className="space-x-2">
            {news.tags &&
              news.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
          </div>
          <CardDescription className="text-xs">{formattedDate}</CardDescription>
        </div>
        <CardTitle className="text-xl leading-tight line-clamp-2">
          <Link
            href={`/noticias/${news._id}`}
            className="hover:text-primary transition-colors"
          >
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
        <Link
          href={`/noticias/${news._id}`}
          className="text-primary text-sm font-medium hover:underline"
        >
          Ler matéria completa
        </Link>
      </CardFooter>
    </Card>
  )
}
