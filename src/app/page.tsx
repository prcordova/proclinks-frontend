import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              Compartilhe todos os seus links em um
              <span className="text-primary"> único lugar</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8">
              Crie sua página personalizada, compartilhe seus links e conecte-se com seu público de forma profissional e elegante.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90">
                  Criar minha página
                </Button>
              </Link>
              <Link href="/explorer">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explorar perfis
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <Link 
            href="#features" 
            className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors animate-bounce"
          >
            <KeyboardArrowDownIcon 
              sx={{ 
                fontSize: { xs: 24, md: 32 },
                color: 'primary.main'
              }} 
            />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-8 text-gray-900">
            Tudo que você precisa para sua presença digital
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-4 flex flex-col h-full">
              <div className="bg-primary/10 rounded-2xl p-4 mb-4 aspect-square flex items-center justify-center overflow-hidden">
                <Image 
                  src="/assets/imgs/img1.jpg" 
                  alt="Personalização" 
                  width={200} 
                  height={200}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Design Personalizado</h3>
              <p className="text-sm md:text-base text-gray-600">
                Customize cores, fontes e layouts para combinar com sua marca
              </p>
            </div>

            <div className="text-center p-4 flex flex-col h-full">
              <div className="bg-primary/10 rounded-2xl p-4 mb-4 aspect-square flex items-center justify-center overflow-hidden">
                <Image 
                  src="/assets/imgs/img2.jpg" 
                  alt="Analytics" 
                  width={200} 
                  height={200}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Analytics Detalhado</h3>
              <p className="text-sm md:text-base text-gray-600">
                Acompanhe visitas, cliques e interações em tempo real
              </p>
            </div>

            <div className="text-center p-4 flex flex-col h-full">
              <div className="bg-primary/10 rounded-2xl p-4 mb-4 aspect-square flex items-center justify-center overflow-hidden">
                <Image 
                  src="/assets/imgs/img3.jpg" 
                  alt="Social" 
                  width={200} 
                  height={200}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Feed Social</h3>
              <p className="text-sm md:text-base text-gray-600">
                Conecte-se com outros criadores e aumente sua rede
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Usado por milhares de criadores
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              Junte-se à comunidade de criadores que já estão expandindo sua presença online
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="p-4 flex flex-col items-center justify-center">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">10K+</h3>
              <p className="text-sm md:text-base text-gray-600">Usuários ativos</p>
            </div>
            <div className="p-4 flex flex-col items-center justify-center">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">1M+</h3>
              <p className="text-sm md:text-base text-gray-600">Links compartilhados</p>
            </div>
            <div className="p-4 flex flex-col items-center justify-center">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">5M+</h3>
              <p className="text-sm md:text-base text-gray-600">Visitas mensais</p>
            </div>
            <div className="p-4 flex flex-col items-center justify-center">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">98%</h3>
              <p className="text-sm md:text-base text-gray-600">Satisfação</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
