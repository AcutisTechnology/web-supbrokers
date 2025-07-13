import { Catalog, CatalogWithProperties, CreateCatalogRequest, UpdateCatalogRequest, CatalogProperty } from '../types/catalog';
import { Property } from '../../imoveis/services/property-service';

// Mock data para catálogos
const mockCatalogs: Catalog[] = [
  {
    id: '1',
    name: 'Apartamentos de Luxo',
    description: 'Seleção exclusiva de apartamentos premium na região central',
    target_audience: 'Executivos e empresários',
    color: '#9747ff',
    icon: 'Building2',
    properties_count: 12,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:45:00Z',
    is_active: true
  },
  {
    id: '2',
    name: 'Casas Familiares',
    description: 'Residências espaçosas ideais para famílias com crianças',
    target_audience: 'Famílias com filhos',
    color: '#22c55e',
    icon: 'Home',
    properties_count: 8,
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-18T16:20:00Z',
    is_active: true
  },
  {
    id: '3',
    name: 'Investimentos Rentáveis',
    description: 'Imóveis com alto potencial de valorização e rentabilidade',
    target_audience: 'Investidores',
    color: '#f59e0b',
    icon: 'TrendingUp',
    properties_count: 15,
    created_at: '2024-01-05T11:00:00Z',
    updated_at: '2024-01-22T13:30:00Z',
    is_active: true
  }
];

// Mock data para propriedades
const mockProperties: Property[] = [
  {
    title: 'Apartamento Moderno no Centro',
    description: 'Lindo apartamento com vista panorâmica da cidade',
    slug: 'apartamento-moderno-centro-001',
    street: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    size: 85,
    bedrooms: 2,
    garages: 1,
    rent: true,
    sale: false,
    value: '450000',
    iptu_value: '180',
    code: 'APT001',
    qr_code: 'qr_apt001',
    active: true,
    highlighted: true,
    characteristics: [
      { text: 'Sacada com vista' },
      { text: 'Cozinha planejada' },
      { text: 'Ar condicionado' }
    ],
    attachments: [
      { name: 'foto1.jpg', url: '/images/properties/apt001_1.jpg' },
      { name: 'foto2.jpg', url: '/images/properties/apt001_2.jpg' }
    ],
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    title: 'Casa Térrea com Quintal',
    description: 'Casa espaçosa com amplo quintal e área gourmet',
    slug: 'casa-terrea-quintal-002',
    street: 'Rua dos Jardins, 456',
    neighborhood: 'Jardim Primavera',
    size: 150,
    bedrooms: 3,
    garages: 2,
    rent: false,
    sale: true,
    value: '680000',
    iptu_value: '320',
    code: 'CASA002',
    qr_code: 'qr_casa002',
    active: true,
    highlighted: false,
    characteristics: [
      { text: 'Quintal amplo' },
      { text: 'Área gourmet' },
      { text: 'Churrasqueira' }
    ],
    attachments: [
      { name: 'foto1.jpg', url: '/images/properties/casa002_1.jpg' },
      { name: 'foto2.jpg', url: '/images/properties/casa002_2.jpg' }
    ],
    created_at: '2024-01-12T14:20:00Z'
  },
  {
    title: 'Cobertura Duplex Premium',
    description: 'Cobertura luxuosa com piscina privativa e vista mar',
    slug: 'cobertura-duplex-premium-003',
    street: 'Avenida Beira Mar, 789',
    neighborhood: 'Copacabana',
    size: 220,
    bedrooms: 4,
    garages: 3,
    rent: true,
    sale: true,
    value: '1200000',
    iptu_value: '850',
    code: 'COB003',
    qr_code: 'qr_cob003',
    active: true,
    highlighted: true,
    characteristics: [
      { text: 'Piscina privativa' },
      { text: 'Vista para o mar' },
      { text: 'Elevador privativo' },
      { text: 'Área gourmet completa' }
    ],
    attachments: [
      { name: 'foto1.jpg', url: '/images/properties/cob003_1.jpg' },
      { name: 'foto2.jpg', url: '/images/properties/cob003_2.jpg' },
      { name: 'foto3.jpg', url: '/images/properties/cob003_3.jpg' }
    ],
    created_at: '2024-01-08T16:45:00Z'
  }
];

// Mock data para relacionamentos catálogo-propriedade
const mockCatalogProperties: CatalogProperty[] = [
  {
    id: '1',
    catalog_id: '1',
    property_id: 'apartamento-moderno-centro-001',
    position: 1,
    added_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    catalog_id: '1',
    property_id: 'cobertura-duplex-premium-003',
    position: 2,
    added_at: '2024-01-16T11:15:00Z'
  },
  {
    id: '3',
    catalog_id: '2',
    property_id: 'casa-terrea-quintal-002',
    position: 1,
    added_at: '2024-01-12T14:20:00Z'
  },
  {
    id: '4',
    catalog_id: '3',
    property_id: 'cobertura-duplex-premium-003',
    position: 1,
    added_at: '2024-01-08T16:45:00Z'
  }
];

// Simulação de delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Serviços mockados
export const catalogMockService = {
  // Listar todos os catálogos
  async getCatalogs(): Promise<Catalog[]> {
    await delay(800);
    return [...mockCatalogs];
  },

  // Obter catálogo por ID
  async getCatalogById(id: string): Promise<Catalog | null> {
    await delay(600);
    return mockCatalogs.find(catalog => catalog.id === id) || null;
  },

  // Obter catálogo com propriedades
  async getCatalogWithProperties(id: string): Promise<CatalogWithProperties | null> {
    await delay(1000);
    const catalog = mockCatalogs.find(c => c.id === id);
    if (!catalog) return null;

    const catalogProps = mockCatalogProperties.filter(cp => cp.catalog_id === id);
    
    return {
      ...catalog,
      properties: catalogProps
    };
  },

  // Obter propriedades de um catálogo com detalhes completos
  async getCatalogProperties(catalogId: string): Promise<Property[]> {
    await delay(900);
    const catalogProps = mockCatalogProperties
      .filter(cp => cp.catalog_id === catalogId)
      .sort((a, b) => a.position - b.position);
    
    const properties = catalogProps
      .map(cp => mockProperties.find(p => p.slug === cp.property_id))
      .filter(Boolean) as Property[];
    
    return properties;
  },

  // Criar novo catálogo
  async createCatalog(data: CreateCatalogRequest): Promise<Catalog> {
    await delay(1200);
    
    const newCatalog: Catalog = {
      id: (mockCatalogs.length + 1).toString(),
      ...data,
      properties_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true
    };
    
    mockCatalogs.push(newCatalog);
    return newCatalog;
  },

  // Atualizar catálogo
  async updateCatalog(id: string, data: UpdateCatalogRequest): Promise<Catalog | null> {
    await delay(1000);
    
    const catalogIndex = mockCatalogs.findIndex(c => c.id === id);
    if (catalogIndex === -1) return null;
    
    mockCatalogs[catalogIndex] = {
      ...mockCatalogs[catalogIndex],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    return mockCatalogs[catalogIndex];
  },

  // Deletar catálogo
  async deleteCatalog(id: string): Promise<boolean> {
    await delay(800);
    
    const catalogIndex = mockCatalogs.findIndex(c => c.id === id);
    if (catalogIndex === -1) return false;
    
    // Remove o catálogo
    mockCatalogs.splice(catalogIndex, 1);
    
    // Remove todas as propriedades associadas
    const propsToRemove = mockCatalogProperties
      .filter(cp => cp.catalog_id === id)
      .map(cp => cp.id);
    
    propsToRemove.forEach(propId => {
      const propIndex = mockCatalogProperties.findIndex(cp => cp.id === propId);
      if (propIndex !== -1) {
        mockCatalogProperties.splice(propIndex, 1);
      }
    });
    
    return true;
  },

  // Adicionar propriedade ao catálogo
  async addPropertyToCatalog(catalogId: string, propertySlug: string): Promise<CatalogProperty | null> {
    await delay(700);
    
    // Verifica se o catálogo existe
    const catalog = mockCatalogs.find(c => c.id === catalogId);
    if (!catalog) return null;
    
    // Verifica se a propriedade existe
    const property = mockProperties.find(p => p.slug === propertySlug);
    if (!property) return null;
    
    // Verifica se a propriedade já está no catálogo
    const existingRelation = mockCatalogProperties.find(
      cp => cp.catalog_id === catalogId && cp.property_id === propertySlug
    );
    if (existingRelation) return existingRelation;
    
    // Calcula a próxima posição
    const catalogProps = mockCatalogProperties.filter(cp => cp.catalog_id === catalogId);
    const nextPosition = catalogProps.length > 0 
      ? Math.max(...catalogProps.map(cp => cp.position)) + 1 
      : 1;
    
    // Cria a nova relação
    const newRelation: CatalogProperty = {
      id: (mockCatalogProperties.length + 1).toString(),
      catalog_id: catalogId,
      property_id: propertySlug,
      position: nextPosition,
      added_at: new Date().toISOString()
    };
    
    mockCatalogProperties.push(newRelation);
    
    // Atualiza o contador de propriedades do catálogo
    catalog.properties_count = catalogProps.length + 1;
    catalog.updated_at = new Date().toISOString();
    
    return newRelation;
  },

  // Remover propriedade do catálogo
  async removePropertyFromCatalog(catalogId: string, propertySlug: string): Promise<boolean> {
    await delay(600);
    
    const relationIndex = mockCatalogProperties.findIndex(
      cp => cp.catalog_id === catalogId && cp.property_id === propertySlug
    );
    
    if (relationIndex === -1) return false;
    
    // Remove a relação
    mockCatalogProperties.splice(relationIndex, 1);
    
    // Atualiza o contador de propriedades do catálogo
    const catalog = mockCatalogs.find(c => c.id === catalogId);
    if (catalog) {
      const remainingProps = mockCatalogProperties.filter(cp => cp.catalog_id === catalogId);
      catalog.properties_count = remainingProps.length;
      catalog.updated_at = new Date().toISOString();
    }
    
    return true;
  },

  // Obter todas as propriedades disponíveis (não no catálogo)
  async getAvailableProperties(catalogId?: string): Promise<Property[]> {
    await delay(800);
    
    if (!catalogId) {
      return [...mockProperties];
    }
    
    // Filtra propriedades que não estão no catálogo especificado
    const catalogPropertyIds = mockCatalogProperties
      .filter(cp => cp.catalog_id === catalogId)
      .map(cp => cp.property_id);
    
    return mockProperties.filter(p => !catalogPropertyIds.includes(p.slug));
  },

  // Reordenar propriedades no catálogo
  async reorderCatalogProperties(catalogId: string, propertyOrders: { propertyId: string; position: number }[]): Promise<boolean> {
    await delay(500);
    
    // Atualiza as posições das propriedades
    propertyOrders.forEach(({ propertyId, position }) => {
      const relation = mockCatalogProperties.find(
        cp => cp.catalog_id === catalogId && cp.property_id === propertyId
      );
      if (relation) {
        relation.position = position;
      }
    });
    
    // Atualiza a data de modificação do catálogo
    const catalog = mockCatalogs.find(c => c.id === catalogId);
    if (catalog) {
      catalog.updated_at = new Date().toISOString();
    }
    
    return true;
  }
};

// Hook para usar o serviço mockado
export const useCatalogMockService = () => {
  return catalogMockService;
};