import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 py-16">
      <div className="flex flex-col items-center max-w-md text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">Serviços</h1>
        <h2 className="text-2xl font-semibold mb-2">Serviços que prestamos</h2>
        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida para outro
          endereço.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Página Inicial
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/noticias">Ver Notícias</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
