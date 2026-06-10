export interface DiaCard {
  dia: number;
  title: string;
  message: string;
  estrategia: string;
  padrao: string;
  insight: string;
}

export interface Nicho {
  id: string;
  title: string;
  iconEmoji: string;
  subtitle: string;
  description: string;
  bgColorClass: string;
  borderColorClass: string;
  ctaColorClass: string;
  titleColorClass: string;
  days: DiaCard[];
}

export const NICHOS: Nicho[] = [
  {
    id: "mcmv",
    title: "Minha Casa Minha Vida",
    iconEmoji: "🏠",
    subtitle: "Sequência de resgate de 10 dias",
    description:
      "Sequência de 10 dias validada para o segmento econômico. Foco em dor financeira, subsídio e facilidade de entrada.",
    bgColorClass: "bg-[#e8f5f0]",
    borderColorClass: "border-[#c3e8d5]",
    ctaColorClass: "text-[#0d7a47]",
    titleColorClass: "text-[#0d5c35]",
    days: [
      {
        dia: 1,
        title: "RECONEXÃO",
        message:
          "Oi [Nome], tudo bem? Há um tempo atrás conversamos sobre você sair do aluguel. Essa meta ainda está de pé para esse ano ou os planos mudaram?",
        estrategia:
          "Uma pergunta binária e de baixo atrito. Não estamos vendendo nada ainda, apenas verificando se o lead ainda está no mercado ou se já resolveu a dor.",
        padrao:
          "Ativa a consistência. Ninguém gosta de admitir que desistiu de um sonho importante. A pergunta 'os planos mudaram?' pica o orgulho sutilmente.",
        insight:
          "Se o lead disser 'ainda está de pé', ele acabou de reabrir a porta para você apresentar o imóvel.",
      },
      {
        dia: 2,
        title: "O CUSTO DA INAÇÃO",
        message:
          "[Nome], fiz uma conta rápida aqui. Desde a nossa última conversa, você já pagou aproximadamente R$ [Valor] em aluguel. É um dinheiro que não volta mais. Vamos fazer uma simulação pra ver se essa parcela do aluguel já paga o do seu apartamento?",
        estrategia:
          "Mostra ao lead o prejuízo financeiro invisível que ele está acumulando por não tomar uma decisão.",
        padrao:
          "Aversão à perda. O ser humano odeia perder dinheiro mais do que gosta de ganhar. Mostrar o valor perdido em aluguel gera desconforto imediato.",
        insight:
          "Calcule o valor real (ex: 6 meses × R$ 1.500 = R$ 9.000). O número exato choca mais do que uma frase genérica.",
      },
      {
        dia: 3,
        title: "A NOVIDADE DO GOVERNO",
        message:
          "Passando só pra te dar uma notícia boa, [Nome]. O governo atualizou as faixas de subsídio do Minha Casa Minha Vida. Na prática, isso significa que a entrada diminuiu bastante para o seu perfil de renda. Quer que eu veja quanto o governo liberou pra você?",
        estrategia:
          "Traz uma informação nova e altamente relevante que muda o cenário anterior (que talvez fosse de recuo por falta de entrada).",
        padrao:
          "Curiosidade e Autoridade. Você se posiciona como um portador de boas notícias do mercado, não apenas um vendedor.",
        insight:
          "A palavra 'subsídio' soa como 'dinheiro grátis'. Todos querem saber quanto 'ganharam'.",
      },
      {
        dia: 4,
        title: "PROVA SOCIAL",
        message:
          "[Nome], hoje foi um dia especial. Entreguei a chave para uma família que, assim como você, achava que a entrada seria um impedimento. Conseguimos parcelar a entrada deles e aprovar o crédito em 48h. Lembrei de você na hora.",
        estrategia:
          "Usa o sucesso de um terceiro semelhante para mostrar que a conquista é possível e o obstáculo é contornável.",
        padrao:
          "Prova Social e Similaridade. 'Se alguém como eu conseguiu, eu também consigo'.",
        insight:
          "Sempre que possível, envie uma foto real (sua entregando a chave, barrando o rosto do cliente por privacidade) junto com a mensagem.",
      },
      {
        dia: 5,
        title: "O MEDO OCULTO",
        message:
          "Sendo bem transparente com você, [Nome]: a maioria dos meus clientes trava na hora da simulação porque tem medo de ver um valor de entrada alto. É esse o receio que está te segurando agora?",
        estrategia:
          "Tira o 'elefante da sala'. Fala abertamente sobre o medo da reprovação bancária, que é a maior trava oculta no segmento MCMV.",
        padrao:
          "Empatia e Validação. Quando você verbaliza o medo do cliente, ele sente que você o entende profundamente.",
        insight:
          "Ao normalizar o medo ('a maioria dos meus clientes...'), o lead se sente menos julgado e tende a se abrir.",
      },
      {
        dia: 6,
        title: "ESCASSEZ REAL",
        message:
          "Oi [Nome]. O condomínio [Nome do Imóvel] que te mostrei está com as últimas 3 unidades com a documentação grátis (ITBI e Registro). Como sei que o seu orçamento de entrada era apertado, achei importante te avisar antes que acabe.",
        estrategia:
          "Cria urgência não pelo imóvel em si, mas pelas condições facilitadas que resolvem a dor financeira do lead.",
        padrao:
          "Escassez. A sensação de que o tempo está acabando força o cérebro a tomar uma decisão rápida para não ficar de fora.",
        insight:
          "Nunca minta sobre a escassez. Use o gatilho com base em benefícios reais que a construtora está encerrando.",
      },
      {
        dia: 7,
        title: "O CONVITE DE BAIXO ATRITO",
        message:
          "[Nome], vou estar na região amanhã visitando o decorado do [Nome do Imóvel]. Sem compromisso nenhum, quer me encontrar lá rapidinho só pra você ver como é a planta e tirar a dúvida se é isso mesmo que você quer?",
        estrategia:
          "Reduz drasticamente a pressão de 'comprar'. O convite é apenas para 'ver' e 'tirar a dúvida'.",
        padrao:
          "Compromisso mínimo. As pessoas dizem 'sim' para pequenos passos inofensivos muito mais facilmente do que para grandes decisões.",
        insight:
          "A frase 'sem compromisso nenhum' desativa a defesa automática anti-vendedor do lead.",
      },
      {
        dia: 8,
        title: "O CONTRASTE DO FUTURO",
        message:
          "Imagina o Natal do ano que vem, [Nome]. Você prefere estar comemorando com a sua família pagando aluguel na casa dos outros, ou decorando a sala do seu apartamento próprio? A decisão que muda esse cenário precisa ser tomada hoje.",
        estrategia:
          "Tira o lead da matemática e das taxas e o leva para a emoção pura da conquista e do lar.",
        padrao:
          "Visualização do Futuro. O cérebro não distingue bem entre o que é imaginado vividamente e o que é real. A imagem do 'Natal na própria sala' é poderosa.",
        insight:
          "Datas comemorativas (Natal, aniversários, fim de ano) são âncoras emocionais fortíssimas no segmento MCMV.",
      },
      {
        dia: 9,
        title: "A SIMULAÇÃO PRONTA",
        message:
          "[Nome], fiz uma pré-simulação baseada na sua renda presumida. A parcela ficou MUITO próxima do valor de um aluguel nessa mesma região, e a entrada conseguimos deixar em até 36x. Posso te levar 5 minutinhos para te mostrar os números?",
        estrategia:
          "Mostra que você trabalhou por ele. Você não está pedindo esforço, está entregando o resultado mastigado.",
        padrao:
          "Reciprocidade. Se você já fez o trabalho de simular as condições a favor dele, ele se sente compelido a pelo menos ouvir.",
        insight:
          "Se a parcela ficar muito boa, isso quase imediatamente cria a obrigação de 'não vou dar conta de pagar'.",
      },
      {
        dia: 10,
        title: "O ULTIMATO ELEGANTE",
        message:
          "[Nome], estou fechando minha lista de atendimentos prioritários deste mês e não quero ficar sendo chato insistindo. Entendo que talvez não seja o seu momento agora. Posso encerrar seu atendimento por aqui, ou você ainda quer a minha ajuda para sair do aluguel?",
        estrategia:
          "A famosa 'Takeaway close' (tirar a isca da criança). O corretor desaparece e coloca a responsabilidade da decisão no lead.",
        padrao:
          "Gatilho de Perda Excludente. O cliente percebe que o corretor está indo embora. Se ele realmente quer comprar, ele vai levantar a mão e pedir para não ser descartado.",
        insight: "Se ele não responder, arquive. Limpe seu funil.",
      },
    ],
  },
  {
    id: "medio-padrao",
    title: "Médio Padrão",
    iconEmoji: "🏢",
    subtitle: "Sequência de resgate de 10 dias",
    description:
      "Abordagem consultiva para clientes em ascensão. Foco em upgrade de vida, localização e custo-benefício.",
    bgColorClass: "bg-[#e8f0fa]",
    borderColorClass: "border-[#c3d4f5]",
    ctaColorClass: "text-[#1a4fbf]",
    titleColorClass: "text-[#102f8a]",
    days: [
      {
        dia: 1,
        title: "RECONEXÃO INTELIGENTE",
        message:
          "Olá [Nome], tudo bem? Há um tempo conversamos sobre o seu projeto de mudar para um apartamento com uma estrutura melhor. Esse plano de fazer um upgrade de imóvel ainda está no radar para este ano ou você decidiu adiar?",
        estrategia:
          "Retoma a conversa de forma educada e sem pressão. O foco não é 'comprar', mas sim o 'projeto de mudança'.",
        padrao:
          "Micro-compromisso. Ao perguntar sobre o 'radar', você tira o peso da transação financeira imediata.",
        insight:
          "Use a palavra 'upgrade'. No médio padrão, o cliente não quer apenas uma casa, ele quer evolução e progresso.",
      },
      {
        dia: 2,
        title: "EVOLUÇÃO DE VIDA",
        message:
          "[Nome], tenho notado que muitos clientes do seu perfil estão buscando novos imóveis porque a casa atual já não reflete o momento profissional e familiar deles. Faz sentido para você buscar algo que acompanhe o seu crescimento atual?",
        estrategia:
          "Conecta a compra do imóvel ao sucesso pessoal do lead. Posiciona o imóvel como um troféu merecido e um reflexo de identidade.",
        padrao:
          "Identidade e Pertencimento. O ser humano busca alinhar o ambiente ao seu status e conforto percebidos.",
        insight:
          "Clientes de médio padrão compram a percepção de sucesso. O imóvel atual muitas vezes ficou 'pequeno' para as novas necessidades.",
      },
      {
        dia: 3,
        title: "QUALIDADE DE VIDA",
        message:
          "[Nome], me lembra que a [localização / varanda / lazer] era um ponto importante para você. Passar horas no trânsito ou não ter um espaço de lazer adequado aos finais de semana tem um custo invisível muito alto. Isso tem te incomodado hoje?",
        estrategia:
          "Toca na dor diária (trânsito, falta de conforto, restrição de espaço) que muitas vezes é ignorada na correria do dia a dia.",
        padrao:
          "Aversão à perda de tempo/conforto. Fazer o lead quantificar o estresse diário aumenta a urgência da mudança.",
        insight:
          "Sempre personalize com a dor específica que ele mencionou no primeiro atendimento. A personalização é a alma da conversão.",
      },
      {
        dia: 4,
        title: "INSATISFAÇÃO ATUAL",
        message:
          "Sendo bem franco, [Nome]... A maioria das pessoas adia a mudança de imóvel porque a logística de procurar, aprovar crédito e mudar parece exaustiva. Mas o conforto de ter um espaço definitivo compensa tudo. O que tem sido o maior obstáculo para você dar esse passo hoje?",
        estrategia:
          "Antecipa uma objeção logística e já entrega o benefício emocional para superá-la. Estimula a sinceridade.",
        padrao:
          "Compromisso e coerência. Nomear o 'medo' do processo burocrático cria conexão e abre espaço para ele falar a real objeção.",
        insight:
          "Se ele responder que não é a burocracia, mas sim o investimento ou a venda do imóvel atual, você acabou de qualificar o verdadeiro obstáculo.",
      },
      {
        dia: 5,
        title: "COMPARAÇÃO DE MERCADO",
        message:
          "[Nome], fiz um comparativo rápido de mercado hoje. O valor médio do metro quadrado na sua região atual comparado com as oportunidades no [Bairro Desejado] mostra uma janela excelente para a troca. Posso te enviar um resumo rápido mostrando essa valorização?",
        estrategia:
          "Usa dados racionais (metro quadrado, valorização) para justificar a decisão que no fundo é simplesmente emocional.",
        padrao:
          "Decisão baseada em dados. Ninguém recusa um insight exclusivo de mercado que o posicione de forma mais inteligente financeiramente.",
        insight:
          "Mande um material bem formatado. Mostre que a troca não é apenas 'gasto', é realocação inteligente de patrimônio.",
      },
      {
        dia: 6,
        title: "PROVA SOCIAL",
        message:
          "Hoje finalizei um atendimento com uma família que estava exatamente na mesma situação que você, [Nome]. Eles também tinham dúvidas se era o momento certo de ir para um [3 quartos / condomínio clube]. Ver a satisfação deles com o novo espaço me fez lembrar da nossa conversa.",
        estrategia:
          "Usa o sucesso de alguém com as mesmas dúvidas e desejos. Reduz a percepção de risco do cliente.",
        padrao:
          "Identidade e Similaridade. Se alguém com um perfil parecido tomou a decisão e está satisfeito, o cérebro do lead sente segurança para agir igual.",
        insight:
          "Adapte o perfil do imóvel citado para combinar exatamente com o que o seu lead está buscando.",
      },
      {
        dia: 7,
        title: "OPORTUNIDADE",
        message:
          "[Nome], uma excelente unidade no [Nome do Empreendimento] acabou de voltar para a disponibilidade da tabela. Está muito alinhada com o que você buscava e com condições de negociação flexíveis esta semana. Acho que seria profissional da minha parte te avisar primeiro.",
        estrategia:
          "Cria urgência não agressiva e eleva o nível do serviço. A oportunidade surgiu e você o trata com o alto valor de relacionamento.",
        padrao:
          "Escassez e Exclusividade. A ideia de 'voltar para tabela' ou 'prioridade' aciona o medo de perder uma excelente condição.",
        insight:
          "Use esse gatilho de forma ética. Apresente unidades que realmente se destaquem pelo andar, vista ou negociação.",
      },
      {
        dia: 8,
        title: "POSICIONAMENTO",
        message:
          "Sei que o seu tempo é bastante concorrido. Para não ficar enviando opções que não fazem sentido, fiz uma curadoria e selecionei apenas 3 imóveis com 'match' exato com o seu momento atual. Tenho apenas 2 minutos para dar uma alinhada nesse material hiper-selecionado?",
        estrategia:
          "Eleva o nível do seu atendimento. Você se posiciona não como um panfleteiro, mas como um curador imobiliário estratégico.",
        padrao:
          "Identidade e Paradoxo da Escolha. Reduzir as opções facilita a decisão e mostra que você fez o trabalho duro por ele.",
        insight:
          "A expressão 'material hiper-selecionado' e 'curadoria' são extremamente profissionais. O cliente médio padrão valoriza quem poupa o tempo dele.",
      },
      {
        dia: 9,
        title: "BLOQUEIO REAL",
        message:
          "Deixa eu te fazer uma pergunta bem objetiva, [Nome]: o que está travando o seu projeto hoje é a necessidade de vender o seu imóvel atual primeiro, ou é alguma preocupação com as taxas de financiamento atuais? Pergunto para saber como posso ser mais útil na sua estratégia.",
        estrategia:
          "Vai direto nos pontos cegos clássicos do médio padrão (permuta ou juros) forçando o lead a revelar a objeção final.",
        padrao:
          "Ilusão de Alternativas. Você dá duas opções de problemas comuns, e o cliente naturalmente tende a escolher um ao revelar o verdadeiro motivo.",
        insight:
          "Se ele disser que precisa vender o atual, você acabou de ganhar a chance de angariar o imóvel dele para venda.",
      },
      {
        dia: 10,
        title: "ENCERRAMENTO E REATIVAÇÃO",
        message:
          "[Nome], estou organizando minha agenda de curadorias ativas para este mês. Como não tivemos avanço recente, imagino que o projeto de mudança tenha sido pausado. Vou arquivar o seu atendimento por aqui para não tomar seu tempo. Caso os planos mudem lá na frente, sigo à disposição. Um excelente mês para você!",
        estrategia:
          "A clássica 'Takeaway Close' (tirar a isca da criança). Mostra desapego, profissionalismo e organização.",
        padrao:
          "Gatilho de Perda. Se ele tiver qualquer interesse de compra oculto, ele vai reagir para não perder a sua assessoria qualificada.",
        insight:
          "Neste segmento, o cliente odeia se sentir 'descartado' se ele ainda se considera um potencial comprador. Seja educado, porém firme.",
      },
    ],
  },
  {
    id: "alto-padrao",
    title: "Alto Padrão",
    iconEmoji: "💎",
    subtitle: "Sequência de resgate de 10 dias",
    description:
      "Gatilhos de exclusividade e escassez premium. Foco em status, liquidez, segurança patrimonial e design.",
    bgColorClass: "bg-[#f0e8fa]",
    borderColorClass: "border-[#d8c3f5]",
    ctaColorClass: "text-[#6b1abf]",
    titleColorClass: "text-[#45108a]",
    days: [
      {
        dia: 1,
        title: "RECONEXÃO ELEGANTE",
        message:
          "[Nome], fiquei pensando naquele imóvel que te mostrei... ainda faz sentido pra você ou mudou o foco?",
        estrategia:
          "Retoma a conversa com leveza e controle, sem parecer insistente.",
        padrao: "Autoridade + respeito ao espaço",
        insight: "Alto padrão não gosta de insistência... gosta de precisão.",
      },
      {
        dia: 2,
        title: "ESTILO DE VIDA",
        message:
          "Aquilo que você buscava ali ainda conversa com o estilo de vida que você quer hoje?",
        estrategia:
          "Tira a conversa do imóvel e leva para identidade.",
        padrao: "Identidade + pertencimento",
        insight: "Ele não compra imóvel... compra o que aquilo representa.",
      },
      {
        dia: 3,
        title: "POSICIONAMENTO",
        message:
          "Você está buscando algo pontual ou uma mudança de nível mesmo?",
        estrategia:
          "Posiciona a decisão como algo estratégico.",
        padrao: "Autopercepção",
        insight: "Quem compra alto padrão compra posicionamento.",
      },
      {
        dia: 4,
        title: "EXCLUSIVIDADE",
        message:
          "Algumas unidades desse padrão são bem específicas... você ainda quer algo nesse nível ou abriu o leque?",
        estrategia: "Ativa senso de exclusividade.",
        padrao: "Escassez + seletividade",
        insight: "Exclusividade gera valor automático.",
      },
      {
        dia: 5,
        title: "CRITÉRIO",
        message:
          "Hoje, o que pesa mais pra você: localização, arquitetura ou experiência do imóvel?",
        estrategia: "Refina decisão.",
        padrao: "Clareza + critério",
        insight: "Sem critério, o cliente não decide.",
      },
      {
        dia: 6,
        title: "PROVA SOCIAL DISCRETA",
        message:
          "Clientes com um perfil parecido com o seu têm buscado esse tipo de imóvel... você se vê nesse movimento?",
        estrategia: "Usa prova social sem parecer marketing.",
        padrao: "Pertencimento",
        insight: "Alto padrão segue padrão de grupo.",
      },
      {
        dia: 7,
        title: "OPORTUNIDADE",
        message:
          "Algumas oportunidades nesse nível não ficam muito tempo disponíveis... você prefere acompanhar ou deixar passar?",
        estrategia: "Gera urgência sem pressão.",
        padrao: "Escassez + escolha",
        insight: "O timing vale mais que o preço.",
      },
      {
        dia: 8,
        title: "DECISÃO",
        message:
          "Você sente que está próximo de decidir ou ainda analisando cenário?",
        estrategia: "Força posicionamento mental.",
        padrao: "Autoavaliação",
        insight: "Clareza gera ação.",
      },
      {
        dia: 9,
        title: "BLOQUEIO",
        message:
          "O que ainda pesa mais hoje: escolha, timing ou oportunidade?",
        estrategia: "Identifica trava.",
        padrao: "Nomeação",
        insight: "Quem identifica o bloqueio... o destrói.",
      },
      {
        dia: 10,
        title: "ENCERRAMENTO E POSICIONAMENTO",
        message:
          "[Nome], vou encerrar por aqui pra não ser invasivo... mas se quiser retomar com algo mais alinhado ao teu perfil, me chama.",
        estrategia: "Sai com elegância e mantém autoridade.",
        padrao: "Autonomia + respeito",
        insight: "Quem sai bem... volta mais forte.",
      },
    ],
  },
];

export function getNicho(id: string): Nicho | undefined {
  return NICHOS.find((n) => n.id === id);
}
