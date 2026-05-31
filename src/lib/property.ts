export const PROPERTY_FALLBACK_IMAGE =
  "https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg";

export const PROPERTY_CHARACTERISTICS_LABELS: Record<string, string> = {
  // Características do imóvel
  aquecimento: "Aquecimento",
  arCondicionado: "Ar condicionado",
  areaServico: "Área de serviço",
  armariosCozinha: "Armários na cozinha",
  armariosQuarto: "Armários no quarto",
  banheiroQuarto: "Banheiro no quarto",
  churrasqueira: "Churrasqueira",
  internet: "Internet",
  mobiliado: "Mobiliado",
  piscina: "Piscina",
  porteiro24h: "Porteiro 24h",
  quartoServico: "Quarto de serviço",
  tvCabo: "TV a cabo",
  varanda: "Varanda",
  // Características do condomínio
  academiaCondominio: "Academia",
  areaMurada: "Área murada",
  condominioFechado: "Condomínio fechado",
  elevador: "Elevador",
  permitidoAnimais: "Permitido animais",
  piscinaCondominio: "Piscina",
  portaoEletronico: "Portão eletrônico",
  portaria: "Portaria",
  salaoFestasCondominio: "Salão de festas",
  seguranca24h: "Segurança 24h",
  // Aliases legados (IDs com sufixo Form guardados em versões anteriores)
  porteiro24hForm: "Porteiro 24h",
  tvCaboForm: "TV a cabo",
};

export function resolveCharacteristicLabel(text: string): string {
  return PROPERTY_CHARACTERISTICS_LABELS[text] ?? text;
}
