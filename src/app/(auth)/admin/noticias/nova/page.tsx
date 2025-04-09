import {
  Newspaper,
  // PlusCircle
} from 'lucide-react'
import { NewsForm } from '@/components/NewsForm'
import { Separator } from '@/components/ui/separator'

export default function CreateNewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Newspaper className="h-6 w-6" />
        <h2 className="text-3xl font-bold tracking-tight">Nova Notícia</h2>
      </div>
      <p className="text-muted-foreground">
        Crie uma nova notícia para publicar no site do sindicato.
      </p>
      <Separator />
      <NewsForm />
    </div>
  )
}
