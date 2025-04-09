import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-linear-65 from-red-950 to-red-700 text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Informações */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image 
                src="logo.svg" 
                alt="Sindestiva Rio Grande" 
                width={50} 
                height={50}
                className="h-10 w-auto"
              />
              <span className="font-bold text-xl">Sindestiva Rio Grande</span>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Defendendo os direitos e promovendo o bem-estar dos trabalhadores portuários de Rio Grande desde sua fundação.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="text-gray-400 hover:text-white transition-colors">
                  Notícias
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/historia" className="text-gray-400 hover:text-white transition-colors">
                  Nossa História
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="text-gray-400 hover:text-white transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  Rua 24 de Maio, 673<br />
                  Rio Grande, RS - CEP 96200-001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+555332313166" className="text-gray-400 hover:text-white transition-colors">
                  (53) 3231-3166

                </a>
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href="tel:+555332326771" className="text-gray-400 hover:text-white transition-colors">
                  (53) 3232-6771

                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <a href="mailto:contato@estivadoresriogrande.org.br" className="text-gray-400 hover:text-white transition-colors">
                  contato@estivariogrande.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Horário de Funcionamento */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horário de Funcionamento</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <span className="font-medium">Segunda a Sexta:</span> 8h às 18h
              </li>
              <li className="text-gray-400">
                <span className="font-medium">Sábado:</span> 9h às 12h
              </li>
              <li className="text-gray-400">
                <span className="font-medium">Domingo:</span> Fechado
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Siga-nos</h4>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {currentYear} BDSystems. Todos os direitos reservados. Sindicato dos Estivadores e dos Trabalhadores em Carvão e Mineral de Rio Grande, Pelotas e São José do Norte.
          </p>
        </div>
      </div>
    </footer>
  );
}