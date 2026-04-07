import Image from "next/image"
import Link from "next/link"
import { FeaturedHotels } from "@/components/hotel/featured-hotels"
import { SearchForm } from "@/components/search/search-form"
import { BLUR_DATA_URL } from "@/lib/image-placeholder"

export default function HomePage() {
  return (
    <main className="flex flex-col flex-1">
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/75" />

        <div className="relative z-10 mb-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-medium border border-white/25">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Reservas disponíveis agora
          </span>
        </div>

        <div className="relative z-10 text-center mb-8 px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
            Sua próxima viagem
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
              começa aqui.
            </span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-white/75 max-w-xl mx-auto leading-relaxed">
            Compare hotéis, resorts e pousadas no Brasil inteiro. Reserve com segurança e os
            melhores preços.
          </p>
        </div>

        <div className="relative z-20 w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 p-6">
            <SearchForm />
          </div>
        </div>

        <div className="relative z-10 mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/65 text-sm">
          {TRUST_ITEMS.map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {item}
            </span>
          ))}
        </div>

        <div className="absolute bottom-8 z-10 animate-bounce">
          <svg
            className="w-6 h-6 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-blue-600">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">
                Para onde ir?
              </p>
              <h2 className="text-3xl font-bold text-slate-900">Destinos populares</h2>
            </div>
            <Link
              href="/search"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Ver todos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:[grid-template-rows:240px_240px]">
            <Link
              href={`/search?destination=${encodeURIComponent("Rio de Janeiro, RJ")}`}
              className="group relative col-span-2 rounded-2xl overflow-hidden aspect-video md:aspect-auto md:row-span-2"
            >
              <Image
                src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1200&q=80"
                alt="Rio de Janeiro"
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 md:p-7">
                <span className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">
                  Sudeste
                </span>
                <h3 className="text-xl md:text-3xl font-bold text-white leading-tight">
                  Rio de Janeiro
                </h3>
                <p className="text-white/70 text-sm mt-1">3 hotéis disponíveis</p>
              </div>
            </Link>

            <Link
              href={`/search?destination=${encodeURIComponent("São Paulo, SP")}`}
              className="group relative rounded-2xl overflow-hidden aspect-square md:aspect-auto"
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/d/d9/S%C3%A3o_Paulo_City.jpg"
                alt="São Paulo"
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-base md:text-lg font-bold text-white">São Paulo</h3>
                <p className="text-white/65 text-xs mt-0.5">3 hotéis</p>
              </div>
            </Link>

            <Link
              href={`/search?destination=${encodeURIComponent("Florianópolis, SC")}`}
              className="group relative rounded-2xl overflow-hidden aspect-square md:aspect-auto"
            >
              <Image
                src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80"
                alt="Florianópolis"
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-base md:text-lg font-bold text-white">Florianópolis</h3>
                <p className="text-white/65 text-xs mt-0.5">2 hotéis</p>
              </div>
            </Link>
          </div>

          <Link
            href={`/search?destination=${encodeURIComponent("Gramado, RS")}`}
            className="group relative mt-4 block rounded-2xl overflow-hidden h-36"
          >
            <Image
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80"
              alt="Gramado"
              fill
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center px-6 md:px-10">
              <div>
                <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                  Sul do Brasil
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-0.5">Gramado</h3>
                <p className="text-white/65 text-xs mt-1">1 hotel disponível</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <FeaturedHotels />

      <section className="px-4 sm:px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">
              Por que nós?
            </p>
            <h2 className="text-3xl font-bold text-slate-900">Viaje com tranquilidade</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="group flex flex-col items-start p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center mb-4 text-blue-600 group-hover:text-white transition-colors duration-200">
                  {b.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5">{b.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">
              Avaliações reais
            </p>
            <h2 className="text-3xl font-bold text-slate-900">O que nossos hóspedes dizem</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? "text-amber-400" : "text-gray-200"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">"{t.title}"</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">"{t.comment}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-400 truncate">{t.hotel}</p>
                  </div>
                  {t.verified && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-green-600 shrink-0">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verificado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 sm:px-6 py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-blue-900/82" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
            Pronto para sua próxima aventura?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Encontre o hotel ideal e economize até 30% reservando pela nossa plataforma.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Buscar hotéis agora
          </Link>
        </div>
      </section>
    </main>
  )
}

const TRUST_ITEMS = [
  "Cancelamento gratuito",
  "Melhor preço garantido",
  "Suporte 24h",
  "Pagamento seguro",
]

const STATS = [
  { value: "500+", label: "Hotéis parceiros" },
  { value: "10", label: "Destinos no Brasil" },
  { value: "50k+", label: "Hóspedes satisfeitos" },
  { value: "4.8★", label: "Avaliação média" },
]

const BENEFITS = [
  {
    title: "Melhores preços",
    description:
      "Compare centenas de opções e garanta o melhor custo-benefício para sua hospedagem.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Reserva segura",
    description: "Processo transparente com confirmação instantânea. Seus dados sempre protegidos.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "Avaliações reais",
    description: "Leia opiniões verificadas de hóspedes reais e tome decisões com confiança.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
  },
  {
    title: "Suporte 24 horas",
    description:
      "Nossa equipe está disponível a qualquer hora para ajudar antes, durante e após a viagem.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
]

const TESTIMONIALS = [
  {
    name: "Maria Silva",
    avatar: "https://i.pravatar.cc/150?img=1",
    hotel: "Hotel Copacabana Palace",
    rating: 5,
    title: "Experiência inesquecível!",
    comment:
      "Tudo perfeito, do check-in ao check-out. Equipe atenciosa, quarto impecável e café da manhã espetacular. Vista de tirar o fôlego!",
    verified: true,
  },
  {
    name: "Roberto Lima",
    avatar: "https://i.pravatar.cc/150?img=14",
    hotel: "Costão do Santinho Resort",
    rating: 5,
    title: "Férias perfeitas em família!",
    comment:
      "Resort maravilhoso! As crianças amaram o parque aquático e aproveitamos muito o spa. O all-inclusive vale cada centavo.",
    verified: true,
  },
  {
    name: "Juliana Ferreira",
    avatar: "https://i.pravatar.cc/150?img=10",
    hotel: "Hotel Unique",
    rating: 5,
    title: "Design impressionante!",
    comment:
      "O hotel é uma obra de arte. Da arquitetura aos detalhes da decoração, tudo é impecável. O rooftop bar é simplesmente incrível!",
    verified: true,
  },
]
