import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6">
              Compartilhe todos os seus links em um
              <span className="text-primary"> único lugar</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Crie sua página personalizada, compartilhe seus links e conecte-se com seu público de forma profissional e elegante.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Criar minha página
              </Button>
              <Link href="/explore">
                <Button variant="outline" size="lg">Explorar páginas</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <Link href="#features" className="animate-bounce">
            <Image 
              src="/icons/arrow-down.svg" 
              alt="Rolar para baixo" 
              width={24} 
              height={24}
            />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Tudo que você precisa para sua presença digital
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Image 
                  src="/icons/customize.svg" 
                  alt="Personalização" 
                  width={32} 
                  height={32}
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">Design Personalizado</h3>
              <p className="text-gray-600">
                Customize cores, fontes e layouts para combinar com sua marca
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Image 
                  src="/icons/analytics.svg" 
                  alt="Analytics" 
                  width={32} 
                  height={32}
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">Analytics Detalhado</h3>
              <p className="text-gray-600">
                Acompanhe visitas, cliques e interações em tempo real
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Image 
                  src="/icons/social.svg" 
                  alt="Social" 
                  width={32} 
                  height={32}
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">Feed Social</h3>
              <p className="text-gray-600">
                Conecte-se com outros criadores e aumente sua rede
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Usado por milhares de criadores
            </h2>
            <p className="text-xl text-gray-600">
              Junte-se à comunidade de criadores que já estão expandindo sua presença online
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">10K+</h3>
              <p className="text-gray-600">Usuários ativos</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">1M+</h3>
              <p className="text-gray-600">Links compartilhados</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">5M+</h3>
              <p className="text-gray-600">Visitas mensais</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">98%</h3>
              <p className="text-gray-600">Satisfação</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Comece a expandir sua presença digital hoje
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Crie sua página gratuitamente em menos de 5 minutos e comece a compartilhar seus links de forma profissional
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Criar minha página gratuitamente
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
