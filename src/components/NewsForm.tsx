'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
import { DateRange as CalendarDateRange } from 'react-day-picker'

// Importar componentes Lucide
import { Loader2, Save, X, Calendar } from 'lucide-react'

// Importar componentes UI
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import 'react-quill/dist/quill.snow.css'

// Importar tipos e funções de API
import { News, NewsFormData } from '@/types'
import { createNews, updateNews } from '@/lib/api'
import { ptBR } from 'date-fns/locale'

// Importar React Quill dinamicamente para evitar erros SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

// Schema de validação
const newsFormSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  summary: z.string().min(10, 'O resumo deve ter pelo menos 10 caracteres'),
  content: z.string().min(20, 'O conteúdo deve ter pelo menos 20 caracteres'),
  imageUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  published: z.boolean().default(false),
  publishDate: z.date().optional(),
  tags: z.string().optional(),
})

type NewsFormValues = z.infer<typeof newsFormSchema>

interface NewsFormProps {
  initialData?: News
  isEditing?: boolean
}

export function NewsForm({ initialData, isEditing = false }: NewsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editorContent, setEditorContent] = useState('')

  // Preparar valores iniciais
  const defaultValues: Partial<NewsFormValues> = {
    title: initialData?.title || '',
    summary: initialData?.summary || '',
    content: initialData?.content || '',
    imageUrl: initialData?.imageUrl || '',
    published: initialData?.published || false,
    publishDate: initialData?.publishDate
      ? new Date(initialData.publishDate)
      : new Date(),
    tags: initialData?.tags ? initialData.tags.join(', ') : '',
  }

  // Inicializar formulário
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues,
  })

  // Atualizar editor quando dados iniciais mudarem
  useEffect(() => {
    if (initialData?.content) {
      setEditorContent(initialData.content)
      form.setValue('content', initialData.content)
    }
  }, [initialData, form])

  // Configurações do editor Quill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      [{ align: [] }],
      ['clean'],
    ],
  }

  // Enviar formulário
  const onSubmit = async (data: NewsFormValues) => {
    setIsSubmitting(true)

    try {
      // Preparar os dados para envio
      const formData: NewsFormData = {
        title: data.title,
        summary: data.summary,
        content: data.content,
        published: data.published,
        tags: data.tags
          ? data.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      }

      // Adicionar URL da imagem se existir
      if (data.imageUrl) {
        formData.imageUrl = data.imageUrl
      }

      // Adicionar data de publicação se existir
      if (data.publishDate) {
        formData.publishDate = data.publishDate.toISOString()
      }

      // Criar nova notícia ou atualizar existente
      if (isEditing && initialData?._id) {
        await updateNews(initialData._id, formData)
        toast.success('Notícia atualizada com sucesso!')
      } else {
        await createNews(formData)
        toast.success('Notícia criada com sucesso!')
      }

      // Redirecionar para a lista de notícias
      router.push('/admin/noticias')
      router.refresh()
    } catch (error) {
      console.error('Erro ao salvar notícia:', error)
      toast.error('Erro ao salvar notícia. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Manipular mudanças no editor
  const handleEditorChange = (content: string) => {
    setEditorContent(content)
    form.setValue('content', content, { shouldValidate: true })
  }

  // Adicionar tag
  const addTag = (tag: string) => {
    const currentTags = form.getValues('tags') || ''
    const tagsArray = currentTags
      ? currentTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []

    if (tag && !tagsArray.includes(tag)) {
      const newTags = [...tagsArray, tag].join(', ')
      form.setValue('tags', newTags, { shouldValidate: true })
    }
  }

  // Remover tag
  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || ''
    const tagsArray = currentTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const newTags = tagsArray.filter((tag) => tag !== tagToRemove).join(', ')
    form.setValue('tags', newTags, { shouldValidate: true })
  }

  // Renderizar tags
  const renderTags = () => {
    const tags = form.getValues('tags')
    if (!tags) return null

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
          .map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remover tag</span>
              </button>
            </Badge>
          ))}
      </div>
    )
  }

  // Sugestões de tags para notícias
  const tagSuggestions = [
    'Notícias',
    'Eventos',
    'Comunicados',
    'Assembleia',
    'Porto',
    'Benefícios',
    'Jurídico',
    'Saúde',
    'Trabalho',
    'Educação',
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o título da notícia"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Resumo <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escreva um breve resumo da notícia"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    O resumo será exibido nos cards de notícias e nas
                    visualizações prévias.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Conteúdo <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="min-h-[300px]">
                      <ReactQuill
                        theme="snow"
                        modules={modules}
                        value={editorContent}
                        onChange={handleEditorChange}
                        placeholder="Escreva o conteúdo completo da notícia aqui..."
                        className="h-[250px] mb-12" // Espaço para a barra de ferramentas
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Publicar notícia</FormLabel>
                        <FormDescription>
                          Marque para tornar a notícia visível no site.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publishDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Publicação</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarDateRange
                            selected={field.value}
                            onChange={(date: Date | null) =>
                              field.onChange(date)
                            }
                            locale={ptBR}
                            dateFormat="dd/MM/yyyy"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          />
                          <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Quando a notícia deve ser publicada.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://exemplo.com/imagem.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL de uma imagem para ilustrar a notícia.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            placeholder="Digite tags separadas por vírgula"
                            {...field}
                          />
                          {renderTags()}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Tags para categorizar a notícia.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <div className="text-sm font-medium mb-2">Sugestões:</div>
                  <div className="flex flex-wrap gap-2">
                    {tagSuggestions.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary"
                        onClick={() => addTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Atualizar' : 'Salvar'}
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/noticias')}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
