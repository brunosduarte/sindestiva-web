import { notFound } from 'next/navigation'
import {
  Edit,
  // Newspaper
} from 'lucide-react'
import { NewsForm } from '@/components/NewsForm'
import { Separator } from '@/components/ui/separator'
import { getNewsDetails } from '@/lib/api'

interface EditNewsPageProps {
  params: {
    id: string
  }
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = params

  const news = await getNewsDetails(id)

  if (!news) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Edit className="h-6 w-6" />
        <h2 className="text-3xl font-bold tracking-tight">Editar Notícia</h2>
      </div>
      <p className="text-muted-foreground">
        Edite os detalhes da notícia selecionada.
      </p>
      <Separator />
      <NewsForm initialData={news} isEditing />
    </div>
  )
}
