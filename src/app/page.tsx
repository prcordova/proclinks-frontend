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
            <h1 className="text-6xl font-bold mb-6">
              Compartilhe todos os seus links em um
              <span className="text-primary"> único lugar</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Crie sua página personalizada, compartilhe seus links e conecte-se com seu público de forma profissional e elegante.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                  Criar minha página
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg">Explorar perfis</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <Link 
            href="#features" 
            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors animate-bounce"
          >
            <KeyboardArrowDownIcon 
              sx={{ 
                fontSize: 32,
                color: 'primary.main'
              }} 
            />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-900 pt-8">
            Tudo que você precisa para sua presença digital
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-2xl p-4 mb-4 h-48 md:h-64 flex items-center justify-center overflow-hidden">
                <Image 
                  src="/assets/imgs/colors.png" 
                  alt="Personalização" 
                  width={200} 
                  height={200}
                  className="w-auto h-full object-contain rounded-xl"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Design Personalizado</h3>
              <p className="text-gray-600">
                Customize cores, fontes e layouts para combinar com sua marca
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-2xl p-4 mb-4 h-48 md:h-64 flex items-center justify-center overflow-hidden">
                <Image 
                  src="/assets/imgs/colors.png" 
                  alt="Analytics" 
                  width={200} 
                  height={200}
                  className="w-auto h-full object-contain rounded-xl"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics Detalhado</h3>
              <p className="text-gray-600">
                Acompanhe visitas, cliques e interações em tempo real
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-2xl p-4 mb-4 h-48 md:h-64 flex items-center justify-center overflow-hidden">
                <Image 
                  src="/assets/imgs/colors.png" 
                  alt="Social" 
                  width={200} 
                  height={200}
                  className="w-auto h-full object-contain rounded-xl"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Feed Social</h3>
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

       
   
    </main>
  );
}
