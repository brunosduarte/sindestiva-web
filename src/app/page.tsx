import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { NewsCard } from '@/components/NewsCard';
import { getLatestNews } from '@/lib/api';

export default async function Home() {
  // Buscar últimas notícias (limite de 3)
  const latestNews = await getLatestNews(3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Porto de Rio Grande"
            fill
            priority
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Sindicato dos Estivadores de Rio Grande
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Defendendo os direitos e representando os interesses da categoria desde sua fundação. Juntos somos mais fortes!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/sobre">Conheça Nossa História</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contato">Entre em Contato</Link>
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
            <Card>
              <CardHeader>
                <CardTitle>Assessoria Jurídica</CardTitle>
                <CardDescription>Suporte especializado em questões trabalhistas</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Oferecemos consultoria jurídica para questões relacionadas a direitos trabalhistas, previdência e outros assuntos relevantes para a categoria.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link href="/servicos#juridico">Saiba Mais</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assistência Médica</CardTitle>
                <CardDescription>Cuidando da saúde dos trabalhadores</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Convênios médicos, odontológicos e atendimento especializado para trabalhadores associados e seus dependentes.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link href="/servicos#saude">Saiba Mais</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Qualificação Profissional</CardTitle>
                <CardDescription>Cursos e treinamentos especializados</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Programas de capacitação, cursos técnicos e treinamentos para aprimoramento profissional e segurança no trabalho.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link href="/servicos#capacitacao">Saiba Mais</Link>
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
              <Link href="/noticias">Ver Todas</Link>
            </Button>
          </div>

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
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Faça Parte do Nosso Sindicato</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Junte-se a nós e fortaleça a luta pelos direitos dos trabalhadores portuários. Unidos somos mais fortes!
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contato">Associe-se Agora</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}