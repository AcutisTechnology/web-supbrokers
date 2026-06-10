export interface ScriptCard {
  id: string;
  label: string;
  messages: string[];
  estrategia: string;
  padrao: string;
  insight: string;
  isBlocoFinal?: boolean;
}

export interface ProfileCard {
  id: string;
  type: string;
  iconEmoji: string;
  bgColorClass: string;
  borderColorClass: string;
  titleColorClass: string;
  characteristics: string;
  focus: string[];
  howToSpeak: string;
  conductExample: string;
  padrao: string;
  insight: string;
}

export interface PosturaSection {
  profile: string;
  iconEmoji: string;
  description: string;
}

export interface Etapa {
  id: number;
  title: string;
  iconEmoji: string;
  listDescription: string;
  pageSubtitle: string;
  regras?: string[];
  regrasBg?: "yellow" | "green";
  cards?: ScriptCard[];
  blocoFinal?: ScriptCard;
  profileCards?: ProfileCard[];
  posturaBlock?: {
    sections: PosturaSection[];
    estrategia: string;
    padrao: string;
  };
}

export const ETAPAS: Etapa[] = [
  {
    id: 1,
    title: "Etapa 1 — Reconhecimento e Rapport",
    iconEmoji: "💬",
    listDescription:
      "5 abordagens diferentes para iniciar contato com leads. Quebre o gelo, gere confiança imediata e inicie a conversa sem parecer um vendedor chato.",
    pageSubtitle:
      "O objetivo desta etapa não é vender o imóvel, mas sim vender a próxima interação. Use estas abordagens para quebrar o gelo e fazer o lead responder.",
    cards: [
      {
        id: "abordagem-1",
        label: "ABORDAGEM 1 — CONTEXTO + MEMÓRIA (ÂNCORA REAL)",
        messages: [
          "Fala, [Nome]... você chegou a ver aquele anúncio que você se cadastrou hoje mais cedo sobre os imóveis na [região]?",
        ],
        estrategia:
          "Você não se apresenta. Você ativa a memória do lead. Isso tira você do padrão de vendedor e te coloca como continuidade de algo que ele já fez.",
        padrao: "Reconhecimento, Continuidade, Redução de resistência",
        insight:
          '"Lead não responde estranho... responde familiar. Se ele lembrar de você, ele responde. Se não lembrar, você vira mais um."',
      },
      {
        id: "abordagem-2",
        label: "ABORDAGEM 2 — PERGUNTA DIRETA (MICRO COMPROMISSO)",
        messages: [
          "[Nome]? Ainda está procurando imóvel ou já resolveu isso?",
        ],
        estrategia:
          "Pergunta simples, binária, impossível de ignorar. Você força uma tomada de posição: sim → conversa abre, não → você economiza tempo.",
        padrao: "Decisão rápida, Quebra de inércia, Curiosidade leve",
        insight:
          '"Lead não responde texto... responde decisão. Quanto mais fácil responder, maior a taxa de resposta."',
      },
      {
        id: "abordagem-3",
        label: "ABORDAGEM 3 — QUASE CONFUSÃO (QUEBRA DE PADRÃO)",
        messages: [
          "[Nome], deixa eu te perguntar rápido... você chegou a ver aquele imóvel ou acabou passando?",
        ],
        estrategia:
          "Você entra com um tom de continuidade + leve dúvida. Parece que você já estava falando com ele antes — ativa atenção.",
        padrao: "Quebra de padrão, Curiosidade, Efeito \"pera aí\"",
        insight:
          '"Quando parece que a conversa já estava acontecendo... o lead entra nela."',
      },
      {
        id: "abordagem-4",
        label: "ABORDAGEM 4 — TEMPO ESPECÍFICO (ANCORAGEM FORTE)",
        messages: [
          "[Nome], você viu aquele anúncio hoje por volta das [horário]? Queria entender melhor o que você está buscando.",
        ],
        estrategia:
          "Você coloca um detalhe específico (tempo). Isso: tira cara de disparo em massa, aumenta credibilidade, ancora na realidade.",
        padrao: "Especificidade, Autoridade implícita, Realismo",
        insight:
          '"Quanto mais específico você parece... menos vendedor você soa."',
      },
      {
        id: "abordagem-5",
        label: "ABORDAGEM 5 — ABERTURA CURIOSA (SEM EXPLICAÇÃO)",
        messages: [
          "[Nome]? (espera responder)",
          "Vi seu cadastro aqui... queria entender uma coisa rápida sobre o que você está buscando.",
        ],
        estrategia:
          "Você não entra vendendo. Você abre loop de curiosidade. O lead responde só pra entender o que você quer.",
        padrao: "Curiosidade, Loop aberto, Atenção ativa",
        insight:
          '"A melhor abertura não é a que explica... é a que faz o lead perguntar \'o que ele quer?\'"',
      },
    ],
  },
  {
    id: 2,
    title: "Etapa 2 — Sondagem",
    iconEmoji: "🔍",
    listDescription:
      "Descubra o que o cliente realmente quer comprar. Regras obrigatórias e 5 scripts para qualificar o lead e dominar a conversa.",
    pageSubtitle:
      "A sondagem é o coração da venda. É aqui que você descobre o que o cliente realmente quer comprar, para poder oferecer exatamente isso.",
    regrasBg: "yellow",
    regras: [
      "Nunca faça duas perguntas na mesma mensagem.",
      "Nunca responda uma pergunta do lead sem devolver outra pergunta no final.",
      "O objetivo da sondagem não é descobrir se ele tem dinheiro, é descobrir o que ele quer resolver.",
      "Se você não sabe o motivo da compra, você não tem como vender.",
      "Nunca mande áudio na sondagem (a menos que o lead mande primeiro).",
      "Se o lead for monossilábico (responder só \"sim\" ou \"não\"), mude o ângulo da pergunta.",
      "Quem faz as perguntas, domina a conversa.",
    ],
    cards: [
      {
        id: "sondagem-1",
        label: "SONDAGEM 1 — PERMISSÃO + CONTROLE",
        messages: [
          "[Nome], para eu não te mandar um monte de opções que não tem nada a ver com o que você quer... me conta rápido: o que é inegociável para você nesse imóvel?",
        ],
        estrategia:
          "Você pede permissão para ajudar e já assume o controle fazendo a primeira pergunta de qualificação.",
        padrao: "Reciprocidade, Foco no benefício do cliente",
        insight:
          '"O lead adora falar do que ele quer, ele só odeia quando você tenta empurrar o que você tem."',
      },
      {
        id: "sondagem-2",
        label: "SONDAGEM 2 — PERSONALIZAÇÃO",
        messages: [
          "Entendi. E hoje, você está buscando algo mais para investimento ou para moradia mesmo?",
        ],
        estrategia:
          "Pergunta de múltipla escolha simples. Ajuda a categorizar o lead imediatamente.",
        padrao: "Facilidade cognitiva, Categorização",
        insight:
          '"Perguntas abertas travam o lead. Dê opções para ele escolher."',
      },
      {
        id: "sondagem-3",
        label: "SONDAGEM 3 — CONTEXTO DE VIDA",
        messages: [
          "Legal. E me tira uma dúvida... você está buscando mudar de onde você mora hoje por algum motivo específico (espaço, localização, segurança)?",
        ],
        estrategia: "Vai direto na dor ou desejo que motiva a compra.",
        padrao: "Investigação de dor, Empatia",
        insight:
          '"Ninguém compra imóvel. As pessoas compram a solução para um problema de espaço, segurança ou status."',
      },
      {
        id: "sondagem-4",
        label: "SONDAGEM 4 — FILTRO NATURAL",
        messages: [
          "Perfeito. Só para eu alinhar as expectativas aqui... você tem alguma preferência de região ou está aberto a sugestões dentro do seu perfil?",
        ],
        estrategia:
          "Filtra a flexibilidade do lead sem parecer um interrogatório.",
        padrao: "Alinhamento de expectativas, Flexibilidade",
        insight:
          '"Se o lead é inflexível na região, você já sabe o nível de dificuldade da venda."',
      },
      {
        id: "sondagem-5",
        label: "SONDAGEM 5 — DESEJO / VISÃO FUTURA",
        messages: [
          "Se você pudesse desenhar o imóvel ideal para você hoje, o que não poderia faltar de jeito nenhum?",
        ],
        estrategia:
          "Faz o lead visualizar o futuro e te dar a lista exata do que ele valoriza.",
        padrao: "Visualização, Engajamento emocional",
        insight:
          '"Quando um lead descreve o imóvel ideal, ele está te dando o roteiro exato de como vender para ele."',
      },
    ],
  },
  {
    id: 3,
    title: "Etapa 3 — Apresentação",
    iconEmoji: "🖥️",
    listDescription:
      "Construa autoridade, use prova social e valide o alinhamento financeiro antes de agendar a visita. Nunca envie fotos sem contexto.",
    pageSubtitle:
      "(Autoridade + Prova Social + Alinhamento Financeiro). Aqui você não mostra imóveis, você demonstra como eles resolvem o problema do cliente.",
    regrasBg: "yellow",
    regras: [
      "Nunca envie fotos do imóvel sem antes criar o valor percebido na conversa.",
      "Sempre ancore o valor antes de apresentar o preço, nunca o contrário.",
      "Valide o alinhamento financeiro sutilmente antes de agendar a visita.",
      "Construa micro-compromissos a cada envio ('se fizer sentido, vamos visitar?').",
      "A apresentação não é sobre paredes, é sobre como o imóvel resolve a dor do cliente.",
      "Use prova social frequentemente (outros clientes, velocidade de venda da região).",
      "Não envie mais que 3 opções de uma vez. O Paradoxo da Escolha mata a venda.",
      "O silêncio após enviar o preço é seu melhor amigo. Deixe o lead processar.",
    ],
    cards: [
      {
        id: "apresentacao-1",
        label: "APRESENTAÇÃO 1 — AUTORIDADE PESSOAL",
        messages: [
          "[Nome], com base no que você me falou sobre precisar de [Dor/Desejo do Cliente], separei uma opção a dedo aqui na [Região].",
          "É um perfil de imóvel que costuma sair muito rápido justamente por causa de [Característica Forte]. Posso te mandar os detalhes e o valor para você dar uma olhada?",
        ],
        estrategia:
          "Você se posiciona como um especialista que faz uma curadoria específica, não como um catálogo humano.",
        padrao: "Autoridade, Guarda, Escassez Implícita",
        insight:
          '"O cliente não quer um buscador de imóveis, ele quer um consultor que poupe o tempo dele e filtre a ruída."',
      },
      {
        id: "apresentacao-2",
        label: "APRESENTAÇÃO 2 — PROVA SOCIAL",
        messages: [
          "Eu atendi um casal semana passada com um perfil muito parecido com o seu. Eles também queriam muito [Desejo Específico]. Nós encontramos uma unidade no [Empreendimento/Bairro] que resolveu exatamente isso.",
          "Acabou de entrar uma unidade vizinha a essa. Quer que eu te mande as fotos para você avaliar?",
        ],
        estrategia:
          "Liga o comportamento e o sucesso de terceiros para validar a escolha antes mesmo de mostrar o imóvel.",
        padrao: "Prova Social, Similaridade, Redução de Risco",
        insight:
          '"As pessoas confiam profundamente nas decisões de pessoas parecidas com elas. Use isso a seu favor."',
      },
      {
        id: "apresentacao-3",
        label: "APRESENTAÇÃO 3 — ALINHAMENTO FINANCEIRO INICIAL",
        messages: [
          "[Nome], encontrei duas opções excelentes para você. Uma delas é exatamente o que você pediu, mas fica na faixa de [Valor Maior]. A outra exige abrir mão de [Característica Secundária], mas fica na faixa de [Valor Menor].",
          "Qual dessas duas linhas faz mais sentido para o seu momento financeiro hoje?",
        ],
        estrategia:
          "Faz a sondagem financeira sem parecer invasivo, ancorando valores e dando o controle da escolha.",
        padrao: "Contraste, Empoderamento, Ancoragem de Preço",
        insight:
          '"Nunca pergunte \'quanto você tem para gastar\'. Ofereça opções contrastantes e deixe ele revelar o próprio teto."',
      },
      {
        id: "apresentacao-4",
        label: "APRESENTAÇÃO 4 — ESCASSEZ REAL",
        messages: [
          "Vou ser bem transparente com você, [Nome]. Pelo valor de [Orçamento] na região de [Bairro], nós não vamos encontrar algo com [Característica Específica] facilmente.",
          "Mas se você tiver flexibilidade na localização, eu tenho uma opção fantástica a 10 minutos dali. Faz sentido olharmos essa alternativa?",
        ],
        estrategia:
          "Alinha expectativas irreais imediatamente com a verdade, o que gera respeito e escassez real do produto desejado.",
        padrao: "Honestidade Radical, Ancoragem de Realidade",
        insight:
          '"O corretor que dá \'não\' com propriedade ganha mais confiança do que aquele que diz \'sim\' para tudo e não entrega nada."',
      },
      {
        id: "apresentacao-5",
        label: "APRESENTAÇÃO 5 — ANCORAGEM DE VALOR",
        messages: [
          "Você me comentou que a segurança era inegociável por causa das crianças, certo?",
          "Separei um imóvel que tem [Característica de Segurança Premium]. O valor é [Preço]. Quer ver um vídeo rápido de como funciona a estrutura lá?",
        ],
        estrategia:
          "Liga a característica do imóvel diretamente à dor mais profunda relatada na etapa de sondagem.",
        padrao: "Ressonância Emocional, Solução Específica",
        insight:
          '"Venda a noite de sono tranquila e a segurança da família, não os tijolos da porta blindada."',
      },
    ],
    blocoFinal: {
      id: "bloco-final-3",
      label: "BLOCO FINAL — VALIDAÇÃO DE ENCAIXE",
      isBlocoFinal: true,
      messages: [
        "Pelo que vimos até aqui, e pelas fotos que te mandei, essa opção resolve o seu problema de [Dor Principal que o lead relatou]?",
        "Se sim, o próximo passo natural é irmos lá conhecer pessoalmente. Como está sua agenda para [Dia 1] ou [Dia 2]?",
      ],
      estrategia:
        "Garante que não há objeções ocultas antes de puxar para a visita física.",
      padrao: "Micro-compromisso, Fechamento em Duas Opções",
      insight:
        '"Se ele não concordar que o imóvel resolve o problema no WhatsApp, ele não vai concordar na visita. Valide o interesse antes de gastar gasolina."',
    },
  },
  {
    id: 4,
    title: "Etapa 4 — Agendamento",
    iconEmoji: "📅",
    listDescription:
      "Transforme interesse em ação. Aprenda a conduzir o cliente para a visita física usando a escolha ilusória e ancoragem de compromisso.",
    pageSubtitle:
      "(Transformar Interesse em Ação). O objetivo aqui é tirar o cliente do WhatsApp e levá-lo para o imóvel com o mínimo de atrito possível.",
    regrasBg: "yellow",
    regras: [
      "Nunca pergunte 'quando você quer visitar?'. Quem lidera a venda dá as opções.",
      "Sempre ofereça duas opções de horários (A Escolha Ilusória). Isso muda o foco de 'vou ou não vou' para 'qual horário é melhor'.",
      "Se o cliente hesitar no agendamento, volte imediatamente para a dor/desejo que ele relatou na sondagem.",
      "Nunca aceite um 'vou ver com minha esposa e te aviso' sem agendar uma data exata para o retorno.",
      "O agendamento deve parecer o próximo passo lógico e natural, não um favor que o cliente está fazendo.",
      "Crie um senso de urgência real e ético (ex: chaves com outro corretor, alta procura na região).",
      "Facilite a vida do cliente: após agendar, mande a localização exata, onde estacionar e ponto de referência.",
      "A visita física é o momento do fechamento. Prepare o terreno emocional antes de chegarem lá.",
    ],
    cards: [
      {
        id: "agendamento-1",
        label: "AGENDAMENTO 1 — A ESCOLHA ILUSÓRIA",
        messages: [
          "[Nome], como essa unidade atende exatamente a questão do [Dor/Desejo] que conversamos, o ideal é vermos pessoalmente antes que saia da pauta.",
          "Para você, fica melhor amanhã na parte da manhã ou na quinta-feira no final da tarde?",
        ],
        estrategia:
          "Você não pergunta se ele quer. Você assume que ele quer e apenas negocia o horário.",
        padrao: "Falso Dilema, Liderança de Processo",
        insight:
          '"O cérebro humano tem preguiça de pensar. Quando você dá duas opções, ele escolhe uma ao invés de criar uma terceira (que seria não-ir)."',
      },
      {
        id: "agendamento-2",
        label: "AGENDAMENTO 2 — A URGÊNCIA SUAVE",
        messages: [
          "Consegui a liberação das chaves dessa unidade para amanhã. Como é um imóvel que costuma ter muita visitação no final de semana, queria te levar antes.",
          "Consigo te encaixar na minha agenda às 10h ou às 14h. Qual prefere?",
        ],
        estrategia:
          "Cria um motivo plausível e benéfico para o cliente agir rápido, sem parecer pressão de vendedor desesperado.",
        padrao: "Escassez, Exclusividade, Gatilho de Antecipação",
        insight:
          '"As pessoas valorizam mais aquilo que podem perder. Mostre que você está dando uma vantagem competitiva a ele."',
      },
      {
        id: "agendamento-3",
        label: "AGENDAMENTO 3 — O COMPROMISSO DE VALOR",
        messages: [
          "Perfeito, [Nome]. Eu vou bloquear um horário na minha agenda exclusivamente para te apresentar todos os detalhes dessa opção e tirar todas as dúvidas.",
          "Podemos deixar agendado para quarta às 15h? Assim já deixo tudo preparado para te receber.",
        ],
        estrategia:
          "Eleva o nível da visita de um \"passeio\" para uma consultoria exclusiva, gerando reciprocidade.",
        padrao: "Reciprocidade, Profissionalismo, Ancoragem de Tempo",
        insight:
          '"Se você trata a visita como um favor, o cliente desaparece. Se você trata como uma consultoria de alto valor, ele comparece."',
      },
      {
        id: "agendamento-4",
        label: "AGENDAMENTO 4 — A RECUSA ESTRATÉGICA (PARA LEADS ENROLADOS)",
        messages: [
          "Entendo que sua agenda está corrida, [Nome]. Como essa unidade específica tem tido muita procura, eu não consigo segurar a disponibilidade dela por muito tempo.",
          "Faz sentido deixarmos uma visita pré-agendada para sábado de manhã, ou prefere que eu pause sua busca por enquanto?",
        ],
        estrategia:
          "Coloca o lead contra a parede de forma educada. Ou ele se compromete, ou você mostra desapego.",
        padrao: "Desapego, Aversão à Perda, Ultimato Suave",
        insight:
          '"O corretor que não tem medo de perder a venda é o que mais vende. O desapego é por atração imediata."',
      },
      {
        id: "agendamento-5",
        label: "AGENDAMENTO 5 — O ALINHAMENTO DE EXPECTATIVAS",
        messages: [
          "Legal! Só para alinhar: a ideia dessa visita é vermos se o espaço físico atende a expectativa da sua família, já que a parte financeira e a localização nós já validamos.",
          "Sendo assim, sexta-feira às 16h funciona para você e para o [Nome do Esposo/Marido]?",
        ],
        estrategia:
          "Isola objeções antes mesmo da visita. Se ele for e gostar, não tem desculpa para não avançar.",
        padrao: "Fechamento em Micro-passo, Isolamento de Objeção",
        insight:
          '"Nunca vá para uma visita sem saber exatamente o que precisa acontecer lá para o cliente comprar."',
      },
    ],
    blocoFinal: {
      id: "bloco-final-4",
      label: "BLOCO FINAL — CONFIRMAÇÃO BLINDADA",
      isBlocoFinal: true,
      messages: [
        "Maravilha, [Nome]. Visita confirmada para [Dia] às [Horário].",
        "Vou te mandar a localização exata. Como minha agenda é bem ajustada, caso aconteça algum imprevisto, peço só que me avise com um pouquinho de antecedência, combinado?",
      ],
      estrategia:
        "Gera um compromisso moral forte. Reduz drasticamente a taxa de no-show (furo).",
      padrao: "Compromisso e Coerência, Contrato Psicológico",
      insight:
        '"O cliente fura com o corretor porque acha que o tempo do corretor não vale nada. Mostre que seu tempo é valioso e ele te respeitará."',
    },
  },
  {
    id: 5,
    title: "Etapa 5 — Pós-Visita",
    iconEmoji: "✅",
    listDescription:
      "Transforme interesse em decisão. Saiba como conduzir até a proposta sem parecer desesperado, contornando objeções ocultas.",
    pageSubtitle:
      "(Transformar Interesse em Decisão). O jogo real começa quando o cliente sai do imóvel. Saiba como conduzir até a proposta sem parecer desesperado.",
    regrasBg: "yellow",
    regras: [
      "O pós-visita começa no momento em que o cliente sai do imóvel.",
      "Seja o guia, não o cobrador. O cliente precisa sentir que você está ajudando-o a decidir, não empurrando a venda.",
      "Use a técnica do 'Sim Menor' antes de pedir o 'Sim Maior' (a proposta).",
      "Mantenha o controle do próximo passo. Nunca termine uma interação sem agendar a próxima.",
      "O silêncio estratégico após uma pergunta de fechamento é fundamental.",
      "Nunca pergunte 'E aí, o que achou?'. Isso abre espaço para objeções vagas.",
      "Se o cliente esfriar, volte para a dor original. Lembre-o do porquê ele começou a procurar.",
      "Antecipe objeções comuns daquele imóvel antes que o cliente as levante.",
      "Se o imóvel não serviu, descubra exatamente o porquê para calibrar a próxima visita.",
    ],
    cards: [
      {
        id: "pos-visita-1",
        label: "PÓS-VISITA 1 — RECONEXÃO + VALIDAÇÃO",
        messages: [
          "[Nome], foi um prazer apresentar o imóvel para você. Pensando no que conversamos sobre [Dor/Desejo], como você sentiu o espaço para o dia a dia da sua família?",
          "Tem algum ponto específico que você gostaria de rever ou que ficou em dúvida?",
        ],
        estrategia:
          "Valida a experiência e foca na sensação de moradia, não nas características físicas do imóvel.",
        padrao: "Foco no Benefício, Pergunta Aberta Direcionada",
        insight:
          '"O cliente compra a transformação, não o tijolo. Faça-o imaginar a vida lá dentro."',
      },
      {
        id: "pos-visita-2",
        label: "PÓS-VISITA 2 — REFORÇO DIRECIONADO",
        messages: [
          "Lembrei de você agora, [Nome]. Consegui confirmar uma informação sobre [Dúvida levantada na visita, ex: sol da manhã/vaga extra]. É exatamente como imaginávamos.",
          "Isso te dá mais tranquilidade para avançarmos com uma proposta?",
        ],
        estrategia:
          "Usa uma dúvida real para gerar um micro-compromisso e testar o fechamento.",
        padrao: "Resolução de Atrito, Fechamento Teste",
        insight:
          '"Toda dúvida resolvida é um passo em direção ao \'sim\'. Cobre esse avanço."',
      },
      {
        id: "pos-visita-3",
        label: "PÓS-VISITA 3 — OBJEÇÃO DISFARÇADA",
        messages: [
          "Notei que você ficou pensativo quando vimos a parte de [Cômodo/Área]. Sendo bem transparente, a maioria dos meus clientes também tem essa mesma impressão inicial.",
          "O que exatamente te preocupou ali? O tamanho ou a disposição?",
        ],
        estrategia:
          "Traz a objeção oculta para a luz antes que ela minta a venda silenciosamente.",
        padrao: "Normalização, Isolamento de Objeção",
        insight:
          '"A objeção que você não conhece é a única que você não pode contornar."',
      },
      {
        id: "pos-visita-4",
        label: "PÓS-VISITA 4 — STATUS DE DECISÃO",
        messages: [
          "[Nome], para eu não ser aquele corretor chato que fica cobrando, em que momento da decisão vocês estão hoje?",
          "Estão prontos para fazer uma oferta nesse, ou ainda preferem que eu busque outras opções com um perfil diferente?",
        ],
        estrategia:
          "Dá o controle ao cliente enquanto força um posicionamento claro e honesto.",
        padrao: "Honestidade Radical, Falso Dilema",
        insight:
          '"O \'não\' rápido é o segundo melhor resultado em vendas. O pior é o \'talvez\' eterno."',
      },
      {
        id: "pos-visita-5",
        label: "PÓS-VISITA 5 — URGÊNCIA INTELIGENTE",
        messages: [
          "Te atualizando com total transparência: o proprietário acabou de me avisar que vai receber outra visita amanhã cedo nessa unidade.",
          "Como vocês gostaram muito, achei justo avisar. Querem que eu segure a preferência com uma proposta formal hoje?",
        ],
        estrategia:
          "Cria escassez real sem pressão barata de vendedor desesperado.",
        padrao: "Escassez, Exclusividade, Gatilho de Proteção",
        insight:
          '"O medo de perder é duas vezes maior que o desejo de ganhar."',
      },
      {
        id: "pos-visita-6",
        label: "PÓS-VISITA 6 — CONDUÇÃO PARA PRÓXIMO PASSO",
        messages: [
          "Considerando que o imóvel atende 90% do que vocês buscam, o próximo passo natural seria formalizarmos uma proposta para testar a flexibilidade do proprietário.",
          "Qual valor faria sentido para vocês fecharem negócio hoje?",
        ],
        estrategia:
          "Transforma o interesse em ação prática, tirando o peso do \"compra\" e focando no \"teste\".",
        padrao: "Redução de Risco, Chamada para Ação Direta",
        insight: '"Quem não pede a venda, não vende. Facilite o \'sim\'."',
      },
    ],
    blocoFinal: {
      id: "bloco-final-5",
      label: "BLOCO FINAL — MANUTENÇÃO ATIVA",
      isBlocoFinal: true,
      messages: [
        "Entendo perfeitamente, [Nome]. O momento tem que ser o ideal para vocês. Vou pausar as buscas ativas por enquanto.",
        "Se entrar alguma oportunidade fora da curva com aquele perfil exato que conversamos, você quer que eu te avise ou prefere que eu não incomode?",
      ],
      estrategia:
        "Mantém a porta aberta para o futuro sem parecer desesperado ou invasivo.",
      padrao: "Desapego, Permissão Contínua",
      insight:
        '"O follow-up infinito sem permissão vira spam. Peça permissão para continuar agregando valor."',
    },
  },
  {
    id: 6,
    title: "Etapa 6 — Fechamento",
    iconEmoji: "🔒",
    listDescription:
      "Forçar sem forçar. A arte da condução. O momento da verdade para levar o cliente à assinatura sem parecer ansioso pela comissão.",
    pageSubtitle: "(Forçar Sem Forçar / A Arte da Condução)",
    regrasBg: "yellow",
    regras: [
      "Toda mensagem deve terminar com uma pergunta (exceto momentos de validação emocional).",
      "Conduzir a decisão com segurança, não com urgência forçada.",
      "Reforçar que a decisão já faz sentido com base no que o cliente demonstrou.",
      "Criar sensação de oportunidade sem parecer escassez fake.",
      "Sempre levar o cliente para um pequeno próximo passo (micro compromisso).",
      "Nunca pressionar diretamente o cliente.",
      "Utilizar a reserva como ferramenta estratégica (redução de risco).",
      "Validar emocionalmente a escolha do cliente.",
      "Posicionar o corretor como líder da decisão, não como alguém pedindo aprovação.",
    ],
    cards: [
      {
        id: "fechamento-1",
        label: "FECHAMENTO 1 — VALIDAÇÃO + CONDUÇÃO",
        messages: [
          "[Nome], fico feliz que vocês tenham gostado do imóvel 🧡",
          "Pelo que você me falou, ele encaixou bem no que vocês estavam buscando, né?",
          "Faz sentido para vocês avançarem nisso agora ou ainda tem algum ponto que você quer alinhar melhor?",
        ],
        estrategia:
          "Aqui você não tenta vender. Você valida tudo que já foi construído nas etapas anteriores e conduz o cliente para assumir a própria decisão. É uma confirmação guiada, não uma pressão.",
        padrao: "Validação + coerência + auto-decisão",
        insight:
          '"O cliente não quer ser convencido... ele quer perceber que já decidiu."',
      },
      {
        id: "fechamento-2",
        label: "FECHAMENTO 2 — RESERVA COMO SEGURANÇA",
        messages: [
          "Perfeito, [Nome]. Como esse tipo de unidade gira rápido, posso fazer o seguinte...",
          "Posso deixar ela reservada para você até amanhã, sem compromisso — só pra garantir que ninguém avance nela antes de vocês decidirem.",
          "Faz sentido para você segurar essa unidade enquanto vocês alinham os próximos passos?",
        ],
        estrategia:
          "Você não pede fechamento. Você oferece proteção. A reserva tira o risco de perder e dá tempo para o cliente decidir com calma.",
        padrao: "Redução de risco + escassez legítima + antecipação",
        insight:
          '"A reserva não é sobre vender... é sobre não perder o cliente no momento certo."',
      },
      {
        id: "fechamento-3",
        label: "FECHAMENTO 3 — ESPELHO DA DECISÃO",
        messages: [
          "[Nome], sendo bem direto contigo... vocês gostaram da localização, da planta e das condições, certo?",
          "Tem algum ponto que ainda está travando ou é mais questão de decidir o momento agora?",
        ],
        estrategia:
          "Você organiza a mente do cliente e reduz a decisão a um ponto único: agir ou não.",
        padrao: "Clareza + redução de complexidade",
        insight:
          '"Quando você organiza a decisão... o cliente para de fugir dela."',
      },
      {
        id: "fechamento-4",
        label: "FECHAMENTO 4 — FUTURO PROJETADO",
        messages: [
          "Imagina vocês daqui a alguns meses já instalados ali, com mais espaço, segurança e qualidade de vida...",
          "Você consegue se ver vivendo ali com a sua família?",
        ],
        estrategia:
          "Você leva o cliente para o futuro, reforçando emocionalmente a decisão.",
        padrao: "Visualização + pertencimento + antecipação",
        insight:
          '"O cliente fecha quando ele se vê lá dentro... não quando ele entende fora."',
      },
      {
        id: "fechamento-5",
        label: "FECHAMENTO 5 — MICRO COMPROMISSO",
        messages: [
          "Perfeito, [Nome]. Então vamos fazer o seguinte, pra não perder essa oportunidade...",
          "Quer que eu já deixe isso pré-alinhado aqui pra você e te explico o próximo passo com calma?",
        ],
        estrategia:
          "Você não pede a venda. Você pede um pequeno avanço. Isso reduz resistência e mantém o cliente em movimento.",
        padrao: "Progressão + compromisso leve",
        insight: '"Grandes decisões começam com pequenos \'sins\'."',
      },
    ],
    blocoFinal: {
      id: "bloco-final-6",
      label: "BLOCO FINAL — VALIDAÇÃO EMOCIONAL",
      isBlocoFinal: true,
      messages: [
        "Fechado então, [Nome]. E parabéns, viu... vocês estão muito próximos de conquistar algo que muita gente quer, mas poucos realmente fazem acontecer 🧡",
        "Me diz — quer que eu já te encaminhe os próximos passos pra gente seguir com isso?",
      ],
      estrategia:
        "Você reforça a decisão emocionalmente e já conduz para o próximo passo.",
      padrao: "Pertencimento + validação + progresso",
      insight:
        '"O cliente precisa sentir que está avançando... não sendo vendido."',
    },
  },
  {
    id: 7,
    title: "Etapa 7 — Adaptação por Perfil de Cliente",
    iconEmoji: "👥",
    listDescription:
      "Aprenda a ajustar sua comunicação, postura e argumentos para maximizar a conversão em clientes MCMV, Médio e Alto Padrão.",
    pageSubtitle:
      "Aprenda a ler o cliente e ajustar sua comunicação, postura e argumentos para maximizar a conversão em diferentes padrões de imóveis.",
    regrasBg: "green",
    regras: [
      "O cliente não compra o imóvel, ele compra o que o imóvel representa para a realidade dele.",
      "Nunca use a mesma linguagem para públicos diferentes. O que convence um, afasta o outro.",
      "MCMV compra segurança, aprovação e a realização do sonho da casa própria.",
      "Médio Padrão compra upgrade de vida, status inteligente e custo-benefício.",
      "Alto Padrão compra exclusividade, tempo, conveniência e liquidez.",
      "Adapte seu vocabulário, sua vestimenta e seu ritmo de fala ao perfil do cliente.",
    ],
    profileCards: [
      {
        id: "mcmv",
        type: "Minha Casa Minha Vida (MCMV)",
        iconEmoji: "🛡️",
        bgColorClass: "bg-blue-50",
        borderColorClass: "border-blue-200",
        titleColorClass: "text-blue-700",
        characteristics:
          "Inseguro, primeira compra, focado no valor da parcela, medo de não ter o crédito aprovado.",
        focus: ["Segurança", "facilidade de pagamento", "realização do sonho"],
        howToSpeak:
          "Simples, acolhedor, didático e paciente. Evite jargões imobiliários complexos.",
        conductExample:
          "\"Fica tranquilo, [Nome]. Eu vou te ajudar em cada passo da aprovação. A parcela vai ficar menor que o seu aluguel atual e o processo é super seguro.\"",
        padrao: "Redução de Medo + Validação + Guiamento",
        insight:
          "O cliente MCMV precisa de um guia que pegue na mão dele, não de um vendedor.",
      },
      {
        id: "medio",
        type: "Médio Padrão",
        iconEmoji: "🎯",
        bgColorClass: "bg-green-50",
        borderColorClass: "border-green-200",
        titleColorClass: "text-green-700",
        characteristics:
          "Já tem imóvel ou paga um aluguel alto. Busca upgrade, compara muito as opções, focado em custo-benefício e localização.",
        focus: [
          "Valorização",
          "qualidade de vida",
          "status inteligente",
          "otimização de espaço",
        ],
        howToSpeak:
          "Consultivo, focado em dados, comparativo, profissional e lógico.",
        conductExample:
          "\"Considerando o valor do m² da região, essa planta entrega a melhor otimização de espaço. É um upgrade claro para sua família com excelente potencial de valorização.\"",
        padrao: "Lógica + Status + Justificativa Racional",
        insight:
          "Ele quer ter certeza absoluta de que está fazendo um \"negócio inteligente\". Dê os dados para ele justificar a emoção.",
      },
      {
        id: "alto-padrao",
        type: "Alto Padrão / Luxo",
        iconEmoji: "👑",
        bgColorClass: "bg-amber-50",
        borderColorClass: "border-amber-200",
        titleColorClass: "text-amber-700",
        characteristics:
          "Sem tempo, delega decisões, focado em exclusividade. Não quer saber de preço, quer saber de valor, privacidade e conveniência.",
        focus: [
          "Exclusividade",
          "tempo",
          "networking",
          "liquidez",
          "assinatura do projeto",
        ],
        howToSpeak:
          "Direto, objetivo, escasso, alto nível. Fale menos, ouça mais.",
        conductExample:
          "\"[Nome], separei apenas duas opções que atendem seu nível de exigência. Ambas com liquidez altíssima, privacidade total e prontas para sua transição.\"",
        padrao: "Escassez + Exclusividade + Autoridade",
        insight:
          "Para o alto padrão, o seu tempo vale mais que o dinheiro dele. Seja breve, cirúrgico e impecável.",
      },
    ],
    posturaBlock: {
      sections: [
        {
          profile: "Para MCMV",
          iconEmoji: "🛡️",
          description:
            "Seja acessível e extremamente empático. Comemore as pequenas vitórias com o cliente (como a aprovação do crédito). Mostre que você está do lado dele contra a burocracia do banco.",
        },
        {
          profile: "Para Médio Padrão",
          iconEmoji: "🎯",
          description:
            "Posicione-se como um consultor de negócios. Você precisa entender profundamente de taxas, financiamento, valorização de m² e infraestrutura da região. Seja o especialista lógico.",
        },
        {
          profile: "Para Alto Padrão",
          iconEmoji: "👑",
          description:
            "Atue como um assessor de patrimônio. Vista-se impecavelmente, fale pouco, ouça muito. Nunca demonstre ansiedade pela venda. Transmita a mesma exclusividade que o imóvel oferece.",
        },
      ],
      estrategia:
        "Se você se portar como um vendedor de MCMV (focado apenas em aprovação e parcela) ao atender um cliente de Alto Padrão, você perderá a venda por falta de alinhamento de autoridade. O cliente precisa enxergar em você o nível do imóvel que ele está comprando.",
      padrao: "Espelhamento de Autoridade + Rapport de Identidade",
    },
  },
];

export function getEtapa(id: number): Etapa | undefined {
  return ETAPAS.find((e) => e.id === id);
}

export function getCopyText(messages: string[]): string {
  return messages.join("\n\n");
}
