import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { NewsCard } from '@/components/NewsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { getLatestNews } from '@/lib/api';
import { ArrowRight, Ship, Award, FileText, Briefcase, Users, Ambulance, Handshake } from 'lucide-react';

// Componente de carregamento para notícias
function NewsCardSkeleton() {
  return (
    <Card className="h-full">
      <div className="space-y-3">
        <Skeleton className="h-48 w-full" />
        <div className="p-6 space-y-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </Card>
  );
}

function NewsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-65 from-red-950 to-red-700 text-white">
        {/* <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Porto de Rio Grande"
            fill
            priority
            className="object-cover opacity-30"
          />
        </div> */}
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Sindicato dos Estivadores de Rio Grande
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Defendendo os direitos e representando os interesses da categoria desde sua fundação. Juntos somos mais fortes!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="destructive" size="lg">
                <Link href="/sobre">Conheça Nossa História</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contato" className='text-slate-600'>Entre em Contato</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              O Sindicato dos Estivadores de Rio Grande oferece diversos serviços para apoiar os trabalhadores portuários e suas famílias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="bg-primary/10 p-3 w-fit rounded-lg mb-4">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Defesa do Trabalho/Trabalhador</CardTitle>
                <CardDescription>Lutando sempre pela categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Dedicação e valorização ao trabalho portuário, defendendo os direitos do trabalhador e sempre lutando por melhores condições e aprimoramento do trabalho.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="p-0 flex items-center text-primary">
                  <Link href="/servicos#capacitacao">
                    Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="bg-primary/10 p-3 w-fit rounded-lg mb-4">
                  <Ambulance className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Assistência Médica</CardTitle>
                <CardDescription>Cuidando da saúde dos trabalhadores</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Convênios médicos, odontológicos e atendimento especializado para trabalhadores associados e seus dependentes.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="p-0 flex items-center text-primary">
                  <Link href="/servicos#saude">
                    Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="bg-primary/10 p-3 w-fit rounded-lg mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Assessoria Jurídica</CardTitle>
                <CardDescription>Suporte especializado em questões trabalhistas</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Oferecemos consultoria jurídica para questões relacionadas a direitos trabalhistas, previdência e outros assuntos relevantes para a categoria.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="p-0 flex items-center text-primary">
                  <Link href="/servicos#juridico">
                    Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>


          </div>
        </div>
      </section>

      {/* Últimas Notícias */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Últimas Notícias</h2>
            <Button asChild variant="outline">
              <Link href="/noticias" className="flex items-center">
                Ver Todas <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Suspense fallback={<NewsLoading />}>
            <LatestNewsSection />
          </Suspense>
        </div>
      </section>

      {/* Quem Somos */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Quem Somos</h2>
              <p className="text-lg mb-4">
                O Sindicato dos Estivadores de Rio Grande é uma entidade que representa e defende os interesses dos trabalhadores portuários da região desde sua fundação.
              </p>
              <p className="text-lg mb-6">
                Nosso compromisso é lutar por melhores condições de trabalho, segurança, capacitação profissional e bem-estar dos associados e suas famílias.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <Ship className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Tradição</h3>
                    <p className="text-sm text-muted-foreground">Décadas de história e luta</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Representatividade</h3>
                    <p className="text-sm text-muted-foreground">Forte atuação sindical</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Profissionalismo</h3>
                    <p className="text-sm text-muted-foreground">Excelência no trabalho</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Compromisso</h3>
                    <p className="text-sm text-muted-foreground">Dedicação aos associados</p>
                  </div>
                </div>
              </div>
              <Button asChild variant="destructive" size="lg">
                <Link href="/sobre">Conheça Nossa História</Link>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/estivadores.jpg"
                alt="Estivadores trabalhando no porto"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// Componente para buscar e exibir as últimas notícias
async function LatestNewsSection() {
  // Buscar últimas notícias (limite de 3)
  const latestNews = await getLatestNews(3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {latestNews && latestNews.length > 0 ? (
        latestNews.map((news) => (
          <NewsCard key={news._id} news={news} />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          Nenhuma notícia encontrada.
        </p>
      )}
    </div>
  );
}