export type Badge = 'destaque' | 'luxo' | 'oportunidade' | 'lancamento' | 'exclusivo';

export interface MockProperty {
  id: string;
  title: string;
  neighborhood: string;
  city: string;
  price: string;
  type: 'sale' | 'rent';
  badges: Badge[];
  bedrooms: number;
  suites: number;
  bathrooms: number;
  garages: number;
  size: number;
  image: string;
  gallery?: string[];
}

export interface MockNeighborhood {
  id: string;
  name: string;
  city: string;
  image: string;
  propertiesCount: number;
  averagePrice: string;
}

export interface MockBroker {
  id: string;
  name: string;
  role: string;
  specialty: string;
  photo: string;
  whatsapp: string;
  instagram: string;
  propertiesCount: number;
}

export interface MockPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  readingTime: string;
}

export interface MockTestimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  message: string;
}

export interface MockStat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

export const mockBrand = {
  name: 'LuxuryEstate',
  tagline: 'Onde o luxo encontra o seu novo lar.',
  subtitle:
    'Curadoria exclusiva de imóveis de alto padrão, com a discrição e excelência que sua história merece.',
  primaryColor: '#9747FF',
  secondaryColor: '#0F0820',
  whatsapp: '5583999378382',
};

export const mockProperties: MockProperty[] = [
  {
    id: '1',
    title: 'Mansão Contemporânea Beira-Mar',
    neighborhood: 'Jardim Europa',
    city: 'São Paulo',
    price: '5.200.000',
    type: 'sale',
    badges: ['destaque', 'luxo'],
    bedrooms: 5,
    suites: 4,
    bathrooms: 6,
    garages: 4,
    size: 820,
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: '2',
    title: 'Cobertura Tríplex Vista Mar',
    neighborhood: 'Leblon',
    city: 'Rio de Janeiro',
    price: '45.000',
    type: 'rent',
    badges: ['destaque', 'exclusivo'],
    bedrooms: 4,
    suites: 3,
    bathrooms: 5,
    garages: 3,
    size: 540,
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: '3',
    title: 'Residência Alphaville Premium',
    neighborhood: 'Alphaville',
    city: 'São Paulo',
    price: '8.900.000',
    type: 'sale',
    badges: ['lancamento', 'luxo'],
    bedrooms: 6,
    suites: 5,
    bathrooms: 7,
    garages: 6,
    size: 1100,
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: '4',
    title: 'Penthouse Itaim Bibi',
    neighborhood: 'Itaim Bibi',
    city: 'São Paulo',
    price: '12.500.000',
    type: 'sale',
    badges: ['luxo', 'exclusivo'],
    bedrooms: 4,
    suites: 4,
    bathrooms: 5,
    garages: 4,
    size: 680,
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: '5',
    title: 'Casa Moderna com Piscina Infinita',
    neighborhood: 'Trancoso',
    city: 'Bahia',
    price: '38.000',
    type: 'rent',
    badges: ['oportunidade'],
    bedrooms: 5,
    suites: 5,
    bathrooms: 6,
    garages: 3,
    size: 720,
    image:
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: '6',
    title: 'Apartamento Premium Jardins',
    neighborhood: 'Jardins',
    city: 'São Paulo',
    price: '4.200.000',
    type: 'sale',
    badges: ['destaque'],
    bedrooms: 3,
    suites: 3,
    bathrooms: 4,
    garages: 3,
    size: 320,
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: '7',
    title: 'Villa Mediterrânea',
    neighborhood: 'Búzios',
    city: 'Rio de Janeiro',
    price: '6.700.000',
    type: 'sale',
    badges: ['lancamento'],
    bedrooms: 5,
    suites: 4,
    bathrooms: 5,
    garages: 4,
    size: 900,
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: '8',
    title: 'Loft Industrial Reformado',
    neighborhood: 'Vila Madalena',
    city: 'São Paulo',
    price: '18.000',
    type: 'rent',
    badges: ['oportunidade', 'destaque'],
    bedrooms: 2,
    suites: 2,
    bathrooms: 3,
    garages: 2,
    size: 210,
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
  },
];

export const mockNeighborhoods: MockNeighborhood[] = [
  {
    id: '1',
    name: 'Leblon e Ipanema',
    city: 'Rio de Janeiro',
    image:
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1600&q=80',
    propertiesCount: 38,
    averagePrice: '8.4M',
  },
  {
    id: '2',
    name: 'Jardins',
    city: 'São Paulo',
    image:
      'https://images.unsplash.com/photo-1542317854-3c9b3a5dac17?auto=format&fit=crop&w=1600&q=80',
    propertiesCount: 52,
    averagePrice: '6.1M',
  },
  {
    id: '3',
    name: 'Trancoso',
    city: 'Bahia',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    propertiesCount: 21,
    averagePrice: '4.8M',
  },
  {
    id: '4',
    name: 'Alphaville',
    city: 'São Paulo',
    image:
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
    propertiesCount: 44,
    averagePrice: '7.2M',
  },
];

export const mockBrokers: MockBroker[] = [
  {
    id: '1',
    name: 'Roberto Silveira',
    role: 'CEO & Fundador',
    specialty: 'Imóveis de alto padrão',
    photo:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    whatsapp: '5583999378382',
    instagram: 'roberto.silveira',
    propertiesCount: 28,
  },
  {
    id: '2',
    name: 'Camila Andrade',
    role: 'Especialista em Lançamentos',
    specialty: 'Apartamentos de luxo',
    photo:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    whatsapp: '5583999378382',
    instagram: 'camila.andrade',
    propertiesCount: 41,
  },
  {
    id: '3',
    name: 'Marcos Tavares',
    role: 'Consultor Sênior',
    specialty: 'Casas e mansões',
    photo:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    whatsapp: '5583999378382',
    instagram: 'marcos.tavares',
    propertiesCount: 33,
  },
  {
    id: '4',
    name: 'Júlia Mendes',
    role: 'Consultora Internacional',
    specialty: 'Imóveis no exterior',
    photo:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    whatsapp: '5583999378382',
    instagram: 'julia.mendes',
    propertiesCount: 19,
  },
];

export const mockPosts: MockPost[] = [
  {
    id: '1',
    title: 'As 5 tendências do imóvel de luxo sustentável para 2025',
    category: 'Lifestyle',
    excerpt:
      'Como a tecnologia verde está mudando a concepção de alto padrão no mercado imobiliário brasileiro.',
    image:
      'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2025-04-12',
    readingTime: '6 min',
  },
  {
    id: '2',
    title: 'Por que investir no litoral catarinense agora?',
    category: 'Investimento',
    excerpt:
      'Análise completa da valorização recente no Balneário Camboriú e cidades vizinhas.',
    image:
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2025-03-28',
    readingTime: '8 min',
  },
  {
    id: '3',
    title: 'Arquitetura biofílica: o conceito que está conquistando o alto padrão',
    category: 'Arquitetura',
    excerpt:
      'Entenda como casas que se integram à natureza estão redefinindo o conforto premium.',
    image:
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2025-03-15',
    readingTime: '5 min',
  },
];

export const mockTestimonials: MockTestimonial[] = [
  {
    id: '1',
    name: 'Roberto Silveira',
    role: 'CEO, TechGlobal',
    avatar:
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    message:
      'A LuxuryEstate não apenas encontrou uma casa para minha família, eles entenderam perfeitamente o estilo de vida que buscávamos. Processo impecável, discreto e extremamente profissional.',
  },
  {
    id: '2',
    name: 'Camila Andrade',
    role: 'Diretora, Andrade Holding',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    message:
      'Atendimento de nível internacional. Em apenas três visitas encontramos a cobertura ideal. A curadoria deles é cirúrgica.',
  },
  {
    id: '3',
    name: 'Marcos Tavares',
    role: 'Sócio, Tavares Investimentos',
    avatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    message:
      'Confiei a eles uma negociação delicada de mais de R$ 20 milhões. Sigilo, agilidade e domínio total do mercado. Recomendo sem reservas.',
  },
];

export const mockStats: MockStat[] = [
  { label: 'Anos de Mercado', value: 18, suffix: '+' },
  { label: 'Imóveis Vendidos', value: 2300, suffix: '+' },
  { label: 'Em Ativos Geridos', value: 850, prefix: 'R$ ', suffix: 'M+' },
  { label: 'Discrição Garantida', value: 100, suffix: '%' },
];
