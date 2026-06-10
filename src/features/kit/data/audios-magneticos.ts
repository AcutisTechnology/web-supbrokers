export interface GuideCard {
  id: number;
  iconEmoji: string;
  title: string;
  description: string;
  padrao: string;
  insight: string;
}

export interface AudioCard {
  id: number;
  title: string;
  roteiro: string;
  estrategia: string;
  padrao: string;
  insight: string;
}

export const GUIDES: GuideCard[] = [
  {
    id: 1,
    iconEmoji: "🕐",
    title: "Duração do Áudio (20–45s)",
    description:
      "Mantenha o áudio entre 20 e 45 segundos. Áudios longos são ignorados. Seja direto: diga o nome, o motivo, o valor e o CTA. Quanto mais curto e denso, mais profissional você parece.",
    padrao:
      "Economia de Energia. O cérebro evita tarefas que parecem exigir muito esforço (como ouvir um podcast de 3 minutos de um desconhecido).",
    insight:
      "Se o áudio passou de 1 minuto, apague e grave de novo. Você está palestrando, não prospectando.",
  },
  {
    id: 2,
    iconEmoji: "🔊",
    title: "Tom de Voz Natural",
    description:
      "Fale sorrindo levemente (isso altera a ressonância) e mantenha um tom calmo e acolhedor de um consultor. Abandone a empolgação artificial de 'locutor de rádio' e evite soar como um vendedor desesperado.",
    padrao:
      "Neurônios-espelho. O lead espelha a emoção que você transmite. Se soa ansioso, ele recua. Se soa seguro, ele confia.",
    insight:
      "Grave o áudio como se estivesse dando um conselho financeiro valioso para um amigo próximo.",
  },
  {
    id: 3,
    iconEmoji: "〰️",
    title: "Ritmo e Pausas",
    description:
      "Não atropele as palavras. Use pausas de 1 a 2 segundos após fazer perguntas importantes ou revelar dados de impacto. Isso força o cliente a processar a informação antes de responder.",
    padrao:
      "Processamento Cognitivo. A pausa cria um 'vazio' que o cérebro tenta preencher, aumentando o foco na sua mensagem.",
    insight:
      "A pausa estratégica depois de falar a condição de pagamento é onde a venda acontece na cabeça do cliente.",
  },
  {
    id: 4,
    iconEmoji: "📋",
    title: "Estrutura do Áudio",
    description:
      "Todo áudio forte segue uma linha: 1) Abertura (Nome), 2) Contexto/Motivo rápido, 3) Informação de valor/Insight, 4) Call to Action (CTA) simples em formato de pergunta fechada.",
    padrao:
      "Carga Cognitiva Estruturada. Histórias com início, meio e fim fáceis de digerir diminuem o atrito de decisão.",
    insight:
      "Nunca termine com 'qualquer dúvida me avisa'. Termine com uma pergunta que exija 'sim' ou 'não'.",
  },
  {
    id: 5,
    iconEmoji: "✖️",
    title: "O Que Não Fazer",
    description:
      "Não envie áudio solto (mande uma frase de gancho antes). Não use jargões imobiliários complexos (INCC, ITBI, Habite-se) sem traduzir para o cliente. Não grave com barulho de trânsito ou eco excessivo.",
    padrao:
      "Aversão à Incerteza. Um áudio surpresa gera ansiedade. O cliente precisa saber do que se trata antes de dar o play.",
    insight:
      "O texto antes do áudio é o 'trailer'. O áudio é o 'filme'. Sem um bom trailer, ninguém dá play.",
  },
  {
    id: 6,
    iconEmoji: "🎯",
    title: "Quando Usar Áudio",
    description:
      "Use para: explicar cenários complexos de forma empática, passar urgência real (últimas unidades), resgatar contatos frios ou contornar objeções emocionais severas. Não use para: passar endereço e listas de preço.",
    padrao:
      "Transferência Emocional. Dados são lógicos, voz é emocional. Use a voz quando precisar transmitir intenção e confiança.",
    insight:
      "Tabela de preços vai em PDF ou texto. A justificativa de por que comprar agora vai em áudio.",
  },
  {
    id: 7,
    iconEmoji: "🏹",
    title: "Objetivo do Áudio",
    description:
      "O único objetivo no primeiro momento é tirar o lead do estado de 'Visualizou' para 'Digitando...'. Você está buscando a resposta, o engajamento, não a venda imediata do imóvel inteiro.",
    padrao:
      "Micro-compromissos. Vendas de alto ticket são feitas de pequenos 'sins'. Responder é o primeiro sim.",
    insight:
      "Se o lead respondeu, o áudio funcionou. A venda é consequência do diálogo que você acabou de iniciar.",
  },
];

export const AUDIOS: AudioCard[] = [
  {
    id: 1,
    title: "Abertura Forte",
    roteiro:
      "Oi [Nome], tudo bem? Aqui é o [Seu Nome]. Vi que você demonstrou interesse no [Empreendimento]. Pra eu não tomar seu tempo mandando um monte de material que não faz sentido, me tira uma dúvida rápida: você tá buscando sair do aluguel agora ou é um projeto mais pro final do ano?",
    estrategia:
      "Vai direto ao ponto, mostra respeito pelo tempo do lead e faz uma pergunta binária fácil de responder.",
    padrao:
      "Redução de Carga Cognitiva. O cérebro prefere escolhas simples (A ou B) do que perguntas abertas complexas.",
    insight:
      "O primeiro áudio não vende o imóvel, vende a resposta. Facilite o 'sim' ou o 'não'.",
  },
  {
    id: 2,
    title: "Quebra de Crença",
    roteiro:
      "[Nome], uma coisa que muita gente me pergunta é sobre o valor da entrada. A maioria acha que precisa ter 20, 30 mil na mão pra comprar esse perfil de imóvel. Mas a verdade é que a gente consegue parcelar a entrada em até 36x. Isso muda o cenário pra você hoje?",
    estrategia:
      "Antecipa a maior objeção (dinheiro de entrada) e já entrega a solução antes mesmo do lead perguntar.",
    padrao:
      "Quebra de Padrão e Alívio. Remover um obstáculo presumido gera alívio imediato e abertura para ouvir mais.",
    insight:
      "Se você mata a objeção antes dela nascer, o lead baixa a guarda e a conversa flui.",
  },
  {
    id: 3,
    title: "Identificação",
    roteiro:
      "[Nome], lembrei de você agora. Acabei de aprovar o crédito de um cliente que tinha exatamente o mesmo perfil de renda que o seu, e ele também achava que não ia dar certo. Conseguimos uma condição excelente. Quer que eu faça uma simulação sem compromisso só pra você ter uma ideia de valores?",
    estrategia:
      "Usa uma história real para gerar conexão e mostrar que a conquista é totalmente possível para a realidade dele.",
    padrao:
      "Prova Social e Similaridade. As pessoas confiam mais em decisões tomadas por pessoas parecidas com elas.",
    insight:
      "As pessoas compram quando sentem que 'alguém como eu' também conseguiu. A similaridade vende.",
  },
  {
    id: 4,
    title: "Conversa Direta",
    roteiro:
      "Sendo bem transparente com você, [Nome]. Eu vejo muita gente perdendo dinheiro pagando aluguel por anos, simplesmente por medo de fazer uma simulação. O 'não' você já tem. O que acha de a gente gastar 5 minutinhos pra ver se o banco libera o seu 'sim'?",
    estrategia:
      "Abordagem franca que desafia o lead a sair da inércia e enfrentar o medo da reprovação bancária.",
    padrao:
      "Aversão à Perda. Mostrar que a inércia custa dinheiro (aluguel) dói mais do que o medo de tentar.",
    insight:
      "Transparência gera autoridade. O corretor que fala a verdade, mesmo que doa um pouco, vende mais.",
  },
  {
    id: 5,
    title: "Visão de Futuro",
    roteiro:
      "Imagina só, [Nome]... Daqui a um ano, você prefere estar renovando o contrato de aluguel e pagando reajuste, ou pegando a chave do seu próprio apartamento? A decisão que muda o seu próximo ano precisa ser tomada hoje. Vamos dar o primeiro passo?",
    estrategia:
      "Tira o foco do processo burocrático (taxas, documentos) e foca no resultado emocional e na transformação de vida.",
    padrao:
      "Visualização e Contraste. O cérebro reage fortemente ao contraste entre um futuro doloroso e um futuro desejado.",
    insight:
      "Venda o destino (a casa própria e a paz), não o avião (o financiamento e a burocracia).",
  },
  {
    id: 6,
    title: "Dor Atual",
    roteiro:
      "[Nome], me conta uma coisa: o que mais te incomoda hoje onde você mora? É a falta de espaço, a localização ou o fato de estar pagando por algo que não é seu? Pergunto isso pra entender exatamente como posso te ajudar.",
    estrategia:
      "Faz o lead verbalizar a própria dor, o que aumenta a urgência interna dele de resolver o problema.",
    padrao:
      "Autopersuasão. Quando o cliente fala o problema em voz alta, ele mesmo se convence de que precisa da solução.",
    insight:
      "O cliente não compra porque você falou que é bom. Ele compra porque ele mesmo admitiu que precisa.",
  },
  {
    id: 7,
    title: "Prova Social",
    roteiro:
      "Passando pra compartilhar uma notícia boa, [Nome]. Só essa semana, três famílias aqui da região conseguiram aprovação no Minha Casa Minha Vida com parcelas menores que o aluguel delas. O mercado tá muito aquecido. Não quer aproveitar essa onda pra ver o seu também?",
    estrategia:
      "Mostra movimento, sucesso de outras pessoas na mesma região e cria um ambiente de oportunidade.",
    padrao:
      "Efeito Manada (FOMO). O medo de ficar de fora de uma oportunidade que os vizinhos estão aproveitando é um gatilho fortíssimo.",
    insight:
      "Ninguém quer ser o único a ficar para trás pagando aluguel enquanto os outros avançam.",
  },
  {
    id: 8,
    title: "Urgência Natural",
    roteiro:
      "[Nome], a construtora acabou de me avisar que liberou as últimas unidades com documentação grátis. Como eu sei que você tava com o orçamento mais justo pra entrada, lembrei de você na hora. Posso segurar uma dessas pra gente simular?",
    estrategia:
      "Cria um senso de urgência real baseado em um benefício financeiro claro, sem parecer um vendedor desesperado.",
    padrao:
      "Escassez e Exclusividade. A combinação de 'últimas unidades' com 'lembrei de você' faz o lead se sentir especial e apressado.",
    insight:
      "Urgência sem benefício é pressão chata. Urgência com benefício é oportunidade de ouro.",
  },
  {
    id: 9,
    title: "Diagnóstico",
    roteiro:
      "Pra eu ser bem assertivo e não te mandar opções fora do seu perfil, [Nome]... Hoje, o que é inegociável pra você num imóvel? Tem que ter varanda, vaga de garagem, ou o foco principal é o valor da parcela caber no bolso?",
    estrategia:
      "Qualifica o lead enquanto demonstra profissionalismo, curadoria e cuidado com as preferências dele.",
    padrao:
      "Reciprocidade e Comprometimento. Ao mostrar que você quer acertar na mosca, o lead se sente na obrigação de responder com clareza.",
    insight:
      "Quem pergunta domina a conversa. Quem só responde e manda link, perde a venda.",
  },
  {
    id: 10,
    title: "Convite Final",
    roteiro:
      "[Nome], vou estar amanhã na região do [Empreendimento] acompanhando uma visita. O decorado tá incrível. Sem compromisso nenhum, quer dar uma passadinha lá só pra você conhecer a planta e tomar um café comigo? Prometo que não vou te forçar a comprar nada.",
    estrategia:
      "Um convite de baixíssimo atrito, focado na experiência (café, conhecer) e não na transação (comprar, assinar).",
    padrao:
      "Desarme de Objeções. A promessa de 'não forçar a comprar nada' abaixa o escudo defensivo do cliente.",
    insight:
      "O 'sem compromisso' é a chave mágica que abre a porta do decorado. O resto é com o encanto do imóvel.",
  },
];
