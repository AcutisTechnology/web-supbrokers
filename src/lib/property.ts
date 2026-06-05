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

// Mapa reverso: label → primeiro ID correspondente (para dados legados salvos como label)
const LABEL_TO_ID: Record<string, string> = {};
for (const [id, label] of Object.entries(PROPERTY_CHARACTERISTICS_LABELS)) {
  if (!LABEL_TO_ID[label]) {
    LABEL_TO_ID[label] = id;
  }
}

/**
 * Converte qualquer formato de characteristic.text para o ID canônico.
 * Lida com 3 casos:
 *  1. Já é um ID válido  → retorna direto
 *  2. Sufixo legado "Form" → remove o sufixo
 *  3. Label legado  → faz busca reversa no mapa
 */
export function resolveCharacteristicId(text: string): string {
  if (PROPERTY_CHARACTERISTICS_LABELS[text]) return text;
  const stripped = text.endsWith('Form') ? text.slice(0, -4) : null;
  if (stripped && PROPERTY_CHARACTERISTICS_LABELS[stripped]) return stripped;
  return LABEL_TO_ID[text] ?? text;
}
