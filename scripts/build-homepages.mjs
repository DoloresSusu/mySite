import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const locales = {
    zh: {
        htmlLang: "zh-CN",
        code: "中文",
        path: "zh",
        title: "多乐 Dolores | AI 产品人",
        description: "多乐 Dolores 的个人网站：AI 产品、Loxovi AI 录音设备、小程序与网页实验、周周黑客松社群、生活与创作。",
        ogLocale: "zh_CN",
        jobTitle: "AI 产品人",
        schemaDescription: "AI 产品人，Loxovi AI Recorder 联合创始人，周周黑客松社群主理人。",
        nav: ["关于", "生活", "项目", "AI 框架", "留言"],
        hero: {
            lead: "做 AI 产品，也认真创造和生活。",
            body: "Loxovi AI Recorder 联合创始人，万人 AI 社群周周黑客松社群主理人，前互联网大厂出海业务产品 / 项目经理。香港中文大学（深圳）金融硕士。",
            altMain: "多乐在山间黄昏时刻的照片",
            altAccent: "多乐在城市落日街头的照片"
        },
        about: {
            title: "先认识我，再理解我做的事。",
            paragraphs: [
                "我是多乐 Dolores，ENFJ。现在主要在做 AI 产品、内容实验和社群连接。我喜欢把抽象的灵感落成具体的作品，也相信审美、判断力和行动力是同一件事的不同面。",
                "经历上，我在 SHEIN 和 Lazada 做过出海业务产品，也在腾讯、美团、中金、德勤等环境里工作或实习过。现在更关心的是：怎么把 AI 真正变成好用、好看、有人味的产品和体验。"
            ],
            qr: ["微信", "公众号", "小红书"],
            qrAlts: ["多乐个人微信二维码", "公众号二维码", "小红书二维码"]
        },
        life: {
            title: "比“爱生活”更具体一点，是认真感受当下。",
            intro: "人生是一场华丽而盛大的冒险。我喜欢有风的地方、带一点镜头感的日常，也偏爱那些既有少年感，又有生命力的人和事。",
            prev: "上一张",
            next: "下一张",
            alts: [
                "多乐在超市货架前的照片",
                "多乐在山间黄昏时刻的照片",
                "多乐与红色背景和白猫雕塑的照片",
                "多乐在山间运动步道上的背影",
                "多乐在城市街道落日中的照片"
            ],
            captions: [
                "松弛感，也是一种判断力。",
                "喜欢有风的地方，也喜欢把想法做成东西。",
                "对画面、线条和比例，一直都有感觉。",
                "钟情少年感和生命力。",
                "工作之外，也认真把自己活成一个有趣的人。"
            ]
        },
        projects: {
            title: "我不只表达观点，也把东西真的做出来。",
            clawchipTitle: "Loxovi AI Recorder",
            clawchipSummary: "一款配有电子墨水屏的便携 AI 录音设备，把语音内容转化为清晰可见的下一步行动。",
            clawchipPoints: [
                "我做了产品定义、概念表达和对外呈现。",
                "重点不只是“做硬件”，而是把 AI 能力放进更顺手的使用路径里。",
                "这个项目最能代表我把想法落成产品原型的能力。"
            ],
            detail: "查看项目详情",
            officialSite: "访问 Loxovi 官网",
            framework: "打开 AI 硬件框架",
            clawchipPosterAlt: "Loxovi AI Recorder 吸附在手机背面的产品图",
            clawchipPrototypeAlt: "手指按下 Loxovi AI Recorder 录音键的产品图",
            reportTitle: "AI 硬件创业者学习报告",
            reportText: "用第一性原理和 MECE 框架拆解 Plaud、Omi、Bee、Limitless、Rabbit、Harvey 与 Loxovi，快速判断一个 AI 硬件项目的需求、硬件必要性、AI 闭环、商业模式和风险边界。",
            reportAria: "打开 AI 硬件创业者学习报告",
            reportStats: ["判断域", "竞品案例", "天学习路径"],
            reportAction: "打开报告 →",
            skillfitTitle: "SkillFit AI Skill 测评工具站",
            skillfitSummary: "一个从具体任务出发，帮助用户判断哪个 AI Skill 更适合自己的轻量工具站。我用它验证 AI 时代 Skill 发现和评测的新入口。",
            skillfitPoints: [
                "不是做“另一个商店”，而是做任务到 Skill 的决策层。",
                "用 SEO / AEO 页面承接真实搜索需求。",
                "后续可以通过用户提交和 Skill Arena 做社区共创。"
            ],
            openSkillfit: "打开 SkillFit",
            playfulTitle: "网页小游戏 / 小程序实验",
            playfulSummary: "我会把一些轻量想法快速做成网页端可玩的实验，用来验证感觉、交互和叙事，而不是停留在概念里。",
            playNow: "↗ 立即试玩",
            gameAlt1: "Endless Glide 游戏首页缩略图",
            gameAlt2: "Zootopia Match 3 游戏首页缩略图",
            experimentDetail: "查看实验详情",
            communityTitle: "周周黑客松社群",
            communitySummary: "除了做产品，我也长期在做社群组织和连接。周周黑客松对我来说，不只是活动，而是把有想法的人聚到一起，让行动发生。",
            communityPoints: [
                "我在里面承担主理与组织角色。",
                "它体现的是连接力、推动力和持续性。",
                "线上 idea 变线下连接，这件事本身就很有价值。"
            ]
        },
        guestbook: {
            title: "看完这个网站，也欢迎留下一句话。",
            loading: "留言读取中",
            loadingDetail: "正在加载公开留言。",
            formTitle: "给 Dolores 留言",
            note: "可以写下你对网站、项目、AI 硬件或内容方向的反馈。留言会公开展示，请不要填写隐私信息。",
            nameLabel: "名字 / 昵称",
            namePlaceholder: "你的名字",
            messageLabel: "留言",
            messagePlaceholder: "想对我或这个网站说点什么？",
            submit: "留下留言"
        }
    },
    en: {
        htmlLang: "en",
        code: "EN",
        path: "",
        title: "Dolores Su | AI Product Builder",
        description: "Dolores Su's personal website: AI products, Loxovi AI Recorder, playful web experiments, Hackathon Weekly, life, and creative work.",
        ogLocale: "en_US",
        jobTitle: "AI Product Builder",
        schemaDescription: "AI product builder, co-founder of Loxovi AI Recorder, and Hackathon Weekly community builder.",
        nav: ["About", "Life", "Projects", "AI Framework", "Guestbook"],
        hero: {
            lead: "I build AI products—and take creating and living seriously.",
            body: "Co-founder of Loxovi AI Recorder and community lead of Hackathon Weekly, an AI community with more than 10,000 members. Former product and project manager for global businesses at major internet companies. MSc in Finance from CUHK-Shenzhen.",
            altMain: "Dolores in the mountains at sunset",
            altAccent: "Dolores on a city street at sunset"
        },
        about: {
            title: "Meet the person, then the work.",
            paragraphs: [
                "I’m Dolores, an ENFJ working across AI products, content experiments, and community. I enjoy turning abstract ideas into tangible work, and I see taste, judgment, and the ability to act as different sides of the same quality.",
                "I previously worked on global product initiatives at SHEIN and Lazada, and gained experience at Tencent, Meituan, CICC, and Deloitte. Today I care most about turning AI into products and experiences that are useful, beautiful, and unmistakably human."
            ],
            qr: ["WeChat", "Official Account", "Xiaohongshu"],
            qrAlts: ["Dolores's WeChat QR code", "WeChat Official Account QR code", "Xiaohongshu QR code"]
        },
        life: {
            title: "Loving life means paying close attention to the moment.",
            intro: "Life is a vivid, magnificent adventure. I love windy places, everyday scenes with a cinematic quality, and people and ideas that carry both youthful spirit and real vitality.",
            prev: "Previous photo",
            next: "Next photo",
            alts: [
                "Dolores in front of supermarket shelves",
                "Dolores in the mountains at sunset",
                "Dolores beside a white cat sculpture",
                "Dolores hiking on a mountain trail",
                "Dolores on a city street at sunset"
            ],
            captions: [
                "Ease can be a form of judgment.",
                "I love windy places—and turning ideas into things.",
                "I have always cared about image, line, and proportion.",
                "Drawn to youthful spirit and vitality.",
                "Outside work, I take becoming an interesting person seriously."
            ]
        },
        projects: {
            title: "I don’t just share ideas. I make them real.",
            clawchipTitle: "Loxovi AI Recorder",
            clawchipSummary: "A pocket AI recorder with a quiet e-paper display that turns what you say into a visible next step.",
            clawchipPoints: [
                "I led product definition, concept communication, and external storytelling.",
                "The goal is not simply to make hardware, but to place AI inside a more natural user journey.",
                "This project best represents how I turn an idea into a product prototype."
            ],
            detail: "View case study",
            officialSite: "Visit Loxovi",
            framework: "Open the AI hardware framework",
            clawchipPosterAlt: "Loxovi AI Recorder attached to the back of a phone",
            clawchipPrototypeAlt: "A fingertip pressing the record button on Loxovi AI Recorder",
            reportTitle: "A Field Guide for AI Hardware Builders",
            reportText: "A first-principles, MECE analysis of Plaud, Omi, Bee, Limitless, Rabbit, Harvey, and Loxovi—designed to assess demand, hardware necessity, the AI loop, business models, and risk boundaries.",
            reportAria: "Open the field guide for AI hardware builders",
            reportStats: ["decision areas", "product cases", "day learning path"],
            reportAction: "Open the report →",
            skillfitTitle: "SkillFit AI Skill Advisor",
            skillfitSummary: "A lightweight tool that starts with a real task and helps people decide which AI Skill fits best. It explores a new discovery and evaluation layer for the AI Skill era.",
            skillfitPoints: [
                "Not another store, but a decision layer between a task and the right Skill.",
                "SEO and AEO pages capture real search intent.",
                "User submissions and a Skill Arena can support community co-creation."
            ],
            openSkillfit: "Open SkillFit",
            playfulTitle: "Web Games / Mini-App Experiments",
            playfulSummary: "I quickly turn small ideas into playable web experiments to test feeling, interaction, and storytelling rather than leaving them as concepts.",
            playNow: "↗ Play now",
            gameAlt1: "Endless Glide homepage thumbnail",
            gameAlt2: "Zootopia Match 3 homepage thumbnail",
            experimentDetail: "View experiments",
            communityTitle: "Hackathon Weekly Community",
            communitySummary: "Alongside product work, I build communities and connections. Hackathon Weekly is more than a series of events—it brings people with ideas together and helps action happen.",
            communityPoints: [
                "I lead and organize the community.",
                "It reflects my ability to connect, mobilize, and sustain momentum.",
                "Turning online ideas into offline relationships creates real value."
            ]
        },
        guestbook: {
            title: "If the site sparked a thought, leave a note.",
            loading: "Loading messages",
            loadingDetail: "Fetching public guestbook entries.",
            formTitle: "Leave Dolores a note",
            note: "Share feedback on the site, projects, AI hardware, or content direction. Messages are public, so please don’t include private information.",
            nameLabel: "Name",
            namePlaceholder: "Your name",
            messageLabel: "Message",
            messagePlaceholder: "What would you like to say?",
            submit: "Post message"
        }
    },
    es: {
        htmlLang: "es",
        code: "ES",
        path: "es",
        title: "Dolores Su | Creadora de productos de IA",
        description: "Sitio personal de Dolores Su: productos de IA, la grabadora con IA Loxovi, experimentos web, Hackathon Weekly, vida y creación.",
        ogLocale: "es_ES",
        jobTitle: "Creadora de productos de IA",
        schemaDescription: "Creadora de productos de IA, cofundadora de la grabadora con IA Loxovi y responsable de Hackathon Weekly.",
        nav: ["Perfil", "Vida", "Proyectos", "Marco de IA", "Mensajes"],
        hero: {
            lead: "Creo productos de IA y me tomo en serio tanto crear como vivir.",
            body: "Cofundadora de la grabadora con IA Loxovi y responsable de Hackathon Weekly, una comunidad de IA con más de 10.000 miembros. Anteriormente trabajé como product y project manager en negocios globales de grandes empresas tecnológicas. Máster en Finanzas por CUHK-Shenzhen.",
            altMain: "Dolores en las montañas al atardecer",
            altAccent: "Dolores en una calle de la ciudad al atardecer"
        },
        about: {
            title: "Primero la persona; después, su trabajo.",
            paragraphs: [
                "Soy Dolores, ENFJ. Trabajo entre productos de IA, experimentos de contenido y comunidad. Me gusta convertir ideas abstractas en obras concretas, y creo que el gusto, el criterio y la capacidad de actuar son caras de una misma cualidad.",
                "Trabajé en productos globales en SHEIN y Lazada, y pasé por entornos como Tencent, Meituan, CICC y Deloitte. Hoy me interesa transformar la IA en productos y experiencias útiles, bellos y genuinamente humanos."
            ],
            qr: ["WeChat", "Cuenta oficial", "Xiaohongshu"],
            qrAlts: ["Código QR de WeChat de Dolores", "Código QR de la cuenta oficial", "Código QR de Xiaohongshu"]
        },
        life: {
            title: "Amar la vida es prestar atención al presente.",
            intro: "La vida es una aventura intensa y magnífica. Me gustan los lugares con viento, los momentos cotidianos con aire cinematográfico y las personas e ideas con juventud y vitalidad.",
            prev: "Foto anterior",
            next: "Foto siguiente",
            alts: ["Dolores frente a unas estanterías", "Dolores en las montañas al atardecer", "Dolores junto a una escultura de gato blanco", "Dolores caminando por la montaña", "Dolores en una calle al atardecer"],
            captions: ["La calma también es una forma de criterio.", "Me gustan los lugares con viento y convertir ideas en cosas.", "Siempre me han importado la imagen, la línea y la proporción.", "Me atraen la juventud y la vitalidad.", "Fuera del trabajo, también me tomo en serio ser una persona interesante."]
        },
        projects: {
            title: "No solo comparto ideas. Las convierto en realidad.",
            clawchipTitle: "Grabadora con IA Loxovi",
            clawchipSummary: "Una grabadora de bolsillo con pantalla de tinta electrónica que convierte lo que dices en un siguiente paso visible.",
            clawchipPoints: ["Me encargué de la definición de producto, la expresión del concepto y su presentación externa.", "El objetivo no es solo fabricar hardware, sino integrar la IA en un recorrido más natural.", "Este proyecto representa cómo convierto una idea en un prototipo de producto."],
            detail: "Ver el proyecto",
            officialSite: "Visitar Loxovi",
            framework: "Abrir el marco de hardware de IA",
            clawchipPosterAlt: "Grabadora con IA Loxovi acoplada a un teléfono",
            clawchipPrototypeAlt: "Un dedo pulsando el botón de grabación de Loxovi",
            reportTitle: "Guía para emprendedores de hardware de IA",
            reportText: "Un análisis de Plaud, Omi, Bee, Limitless, Rabbit, Harvey y Loxovi con primeros principios y MECE para evaluar demanda, necesidad del hardware, ciclo de IA, modelo de negocio y riesgos.",
            reportAria: "Abrir la guía para emprendedores de hardware de IA",
            reportStats: ["áreas de decisión", "casos analizados", "días de aprendizaje"],
            reportAction: "Abrir informe →",
            skillfitTitle: "Asesor de AI Skills SkillFit",
            skillfitSummary: "Una herramienta ligera que parte de una tarea real y ayuda a decidir qué AI Skill encaja mejor. Explora una nueva forma de descubrir y evaluar Skills.",
            skillfitPoints: ["No es otra tienda, sino una capa de decisión entre la tarea y el Skill adecuado.", "Las páginas SEO / AEO responden a búsquedas reales.", "Los envíos de usuarios y Skill Arena permiten cocrear con la comunidad."],
            openSkillfit: "Abrir SkillFit",
            playfulTitle: "Juegos web / Experimentos con miniapps",
            playfulSummary: "Convierto ideas pequeñas en experimentos web jugables para probar sensaciones, interacción y narrativa, en vez de dejarlas como conceptos.",
            playNow: "↗ Jugar",
            gameAlt1: "Miniatura de Endless Glide",
            gameAlt2: "Miniatura de Zootopia Match 3",
            experimentDetail: "Ver experimentos",
            communityTitle: "Comunidad Hackathon Weekly",
            communitySummary: "Además de crear productos, conecto personas y organizo comunidad. Hackathon Weekly reúne a gente con ideas y ayuda a que la acción ocurra.",
            communityPoints: ["Dirijo y organizo la comunidad.", "Refleja mi capacidad para conectar, impulsar y mantener el ritmo.", "Convertir ideas en línea en relaciones fuera de línea crea valor real."]
        },
        guestbook: {
            title: "Si la web te inspiró una idea, déjame un mensaje.",
            loading: "Cargando mensajes",
            loadingDetail: "Consultando los mensajes públicos.",
            formTitle: "Deja un mensaje a Dolores",
            note: "Comparte tu opinión sobre la web, los proyectos, el hardware de IA o el contenido. Los mensajes son públicos; no incluyas información privada.",
            nameLabel: "Nombre",
            namePlaceholder: "Tu nombre",
            messageLabel: "Mensaje",
            messagePlaceholder: "¿Qué te gustaría decir?",
            submit: "Publicar mensaje"
        }
    },
    pt: {
        htmlLang: "pt-BR",
        code: "PT",
        path: "pt",
        title: "Dolores Su | Criadora de produtos de IA",
        description: "Site pessoal de Dolores Su: produtos de IA, o gravador com IA Loxovi, experimentos web, Hackathon Weekly, vida e criação.",
        ogLocale: "pt_BR",
        jobTitle: "Criadora de produtos de IA",
        schemaDescription: "Criadora de produtos de IA, cofundadora do gravador com IA Loxovi e líder da Hackathon Weekly.",
        nav: ["Sobre", "Vida", "Projetos", "Framework de IA", "Mensagens"],
        hero: {
            lead: "Crio produtos de IA e levo a sério tanto criar quanto viver.",
            body: "Cofundadora do gravador com IA Loxovi e líder da Hackathon Weekly, uma comunidade de IA com mais de 10 mil membros. Ex-product/project manager em negócios globais de grandes empresas de tecnologia. Mestre em Finanças pela CUHK-Shenzhen.",
            altMain: "Dolores nas montanhas ao pôr do sol",
            altAccent: "Dolores em uma rua da cidade ao pôr do sol"
        },
        about: {
            title: "Primeiro, conheça a pessoa. Depois, o trabalho.",
            paragraphs: [
                "Sou Dolores, ENFJ. Trabalho com produtos de IA, experimentos de conteúdo e comunidade. Gosto de transformar ideias abstratas em trabalhos concretos e acredito que gosto, discernimento e capacidade de agir são lados da mesma qualidade.",
                "Trabalhei com produtos globais na SHEIN e na Lazada e passei por ambientes como Tencent, Meituan, CICC e Deloitte. Hoje, quero transformar IA em produtos e experiências úteis, bonitos e genuinamente humanos."
            ],
            qr: ["WeChat", "Conta oficial", "Xiaohongshu"],
            qrAlts: ["QR code do WeChat de Dolores", "QR code da conta oficial", "QR code do Xiaohongshu"]
        },
        life: {
            title: "Amar a vida é prestar atenção ao presente.",
            intro: "A vida é uma aventura vívida e grandiosa. Gosto de lugares com vento, momentos cotidianos com atmosfera cinematográfica e pessoas e ideias cheias de juventude e vitalidade.",
            prev: "Foto anterior",
            next: "Próxima foto",
            alts: ["Dolores diante de prateleiras de supermercado", "Dolores nas montanhas ao pôr do sol", "Dolores ao lado de uma escultura de gato branco", "Dolores em uma trilha na montanha", "Dolores em uma rua da cidade ao pôr do sol"],
            captions: ["Leveza também é uma forma de discernimento.", "Gosto de lugares com vento e de transformar ideias em coisas.", "Imagem, linha e proporção sempre importaram para mim.", "Gosto de juventude e vitalidade.", "Fora do trabalho, também levo a sério ser uma pessoa interessante."]
        },
        projects: {
            title: "Não compartilho apenas ideias. Eu as torno reais.",
            clawchipTitle: "Gravador com IA Loxovi",
            clawchipSummary: "Um gravador de bolso com tela e-paper que transforma o que você diz em um próximo passo visível.",
            clawchipPoints: ["Conduzi a definição do produto, a expressão do conceito e a apresentação externa.", "O objetivo não é apenas criar hardware, mas inserir a IA em uma jornada mais natural.", "Este projeto representa como transformo uma ideia em um protótipo de produto."],
            detail: "Ver projeto",
            officialSite: "Visitar Loxovi",
            framework: "Abrir o framework de hardware de IA",
            clawchipPosterAlt: "Gravador com IA Loxovi acoplado a um celular",
            clawchipPrototypeAlt: "Um dedo pressionando o botão de gravação do Loxovi",
            reportTitle: "Guia para criadores de hardware de IA",
            reportText: "Uma análise de Plaud, Omi, Bee, Limitless, Rabbit, Harvey e Loxovi com primeiros princípios e MECE para avaliar demanda, necessidade do hardware, ciclo de IA, modelo de negócio e riscos.",
            reportAria: "Abrir o guia para criadores de hardware de IA",
            reportStats: ["áreas de decisão", "casos analisados", "dias de aprendizado"],
            reportAction: "Abrir relatório →",
            skillfitTitle: "Consultor de AI Skills SkillFit",
            skillfitSummary: "Uma ferramenta leve que começa por uma tarefa real e ajuda a decidir qual AI Skill se encaixa melhor. Ela explora uma nova camada de descoberta e avaliação.",
            skillfitPoints: ["Não é outra loja, mas uma camada de decisão entre a tarefa e o Skill certo.", "Páginas SEO / AEO atendem a intenções reais de busca.", "Envios de usuários e Skill Arena permitem cocriação com a comunidade."],
            openSkillfit: "Abrir SkillFit",
            playfulTitle: "Jogos web / Experimentos com miniapps",
            playfulSummary: "Transformo ideias pequenas em experimentos web jogáveis para testar sensação, interação e narrativa, em vez de deixá-las apenas como conceitos.",
            playNow: "↗ Jogar agora",
            gameAlt1: "Miniatura do Endless Glide",
            gameAlt2: "Miniatura do Zootopia Match 3",
            experimentDetail: "Ver experimentos",
            communityTitle: "Comunidade Hackathon Weekly",
            communitySummary: "Além de criar produtos, construo comunidades e conexões. A Hackathon Weekly reúne pessoas com ideias e ajuda a ação a acontecer.",
            communityPoints: ["Lidero e organizo a comunidade.", "Ela reflete minha capacidade de conectar, mobilizar e manter o ritmo.", "Transformar ideias online em relações offline cria valor real."]
        },
        guestbook: {
            title: "Se o site despertou uma ideia, deixe uma mensagem.",
            loading: "Carregando mensagens",
            loadingDetail: "Buscando mensagens públicas.",
            formTitle: "Deixe uma mensagem para Dolores",
            note: "Compartilhe sua opinião sobre o site, os projetos, hardware de IA ou conteúdo. As mensagens são públicas; não inclua informações privadas.",
            nameLabel: "Nome",
            namePlaceholder: "Seu nome",
            messageLabel: "Mensagem",
            messagePlaceholder: "O que você gostaria de dizer?",
            submit: "Publicar mensagem"
        }
    },
    fr: {
        htmlLang: "fr",
        code: "FR",
        path: "fr",
        title: "Dolores Su | Créatrice de produits IA",
        description: "Site personnel de Dolores Su : produits IA, l’enregistreur IA Loxovi, expériences web, Hackathon Weekly, vie et création.",
        ogLocale: "fr_FR",
        jobTitle: "Créatrice de produits IA",
        schemaDescription: "Créatrice de produits IA, cofondatrice de l’enregistreur IA Loxovi et responsable de Hackathon Weekly.",
        nav: ["À propos", "Vie", "Projets", "Cadre IA", "Messages"],
        hero: {
            lead: "Je crée des produits IA, tout en prenant la création et la vie au sérieux.",
            body: "Cofondatrice de l’enregistreur IA Loxovi et responsable de Hackathon Weekly, une communauté IA de plus de 10 000 membres. Ancienne product/project manager pour des activités internationales de grandes entreprises tech. Master en finance de CUHK-Shenzhen.",
            altMain: "Dolores dans les montagnes au coucher du soleil",
            altAccent: "Dolores dans une rue au coucher du soleil"
        },
        about: {
            title: "D’abord la personne, ensuite le travail.",
            paragraphs: [
                "Je suis Dolores, ENFJ. Je travaille entre produits IA, expériences de contenu et communauté. J’aime transformer des idées abstraites en réalisations concrètes, et je considère le goût, le jugement et la capacité d’agir comme les facettes d’une même qualité.",
                "J’ai travaillé sur des produits internationaux chez SHEIN et Lazada, et évolué dans des environnements tels que Tencent, Meituan, CICC et Deloitte. Aujourd’hui, je veux transformer l’IA en produits et expériences utiles, beaux et profondément humains."
            ],
            qr: ["WeChat", "Compte officiel", "Xiaohongshu"],
            qrAlts: ["QR code WeChat de Dolores", "QR code du compte officiel", "QR code Xiaohongshu"]
        },
        life: {
            title: "Aimer la vie, c’est être pleinement attentive au présent.",
            intro: "La vie est une aventure vive et magnifique. J’aime les lieux traversés par le vent, les scènes du quotidien à l’allure cinématographique, et les personnes comme les idées pleines de jeunesse et d’énergie.",
            prev: "Photo précédente",
            next: "Photo suivante",
            alts: ["Dolores devant des rayons de supermarché", "Dolores dans les montagnes au coucher du soleil", "Dolores près d’une sculpture de chat blanc", "Dolores sur un sentier de montagne", "Dolores dans une rue au coucher du soleil"],
            captions: ["L’aisance est aussi une forme de jugement.", "J’aime les lieux venteux et transformer les idées en objets.", "L’image, la ligne et la proportion m’ont toujours importé.", "Attirée par la jeunesse et la vitalité.", "En dehors du travail, je prends aussi au sérieux le fait de devenir une personne intéressante."]
        },
        projects: {
            title: "Je ne partage pas seulement des idées. Je les rends réelles.",
            clawchipTitle: "Enregistreur IA Loxovi",
            clawchipSummary: "Un enregistreur de poche avec écran e-paper qui transforme ce que vous dites en une prochaine étape visible.",
            clawchipPoints: ["J’ai dirigé la définition du produit, l’expression du concept et sa présentation externe.", "L’objectif n’est pas seulement de fabriquer du hardware, mais d’intégrer l’IA dans un parcours plus naturel.", "Ce projet représente ma capacité à transformer une idée en prototype de produit."],
            detail: "Voir le projet",
            officialSite: "Visiter Loxovi",
            framework: "Ouvrir le cadre hardware IA",
            clawchipPosterAlt: "Enregistreur IA Loxovi fixé au dos d’un téléphone",
            clawchipPrototypeAlt: "Un doigt appuyant sur le bouton d’enregistrement de Loxovi",
            reportTitle: "Guide pour les créateurs de hardware IA",
            reportText: "Une analyse de Plaud, Omi, Bee, Limitless, Rabbit, Harvey et Loxovi fondée sur les premiers principes et MECE, pour évaluer la demande, la nécessité du hardware, la boucle IA, le modèle économique et les risques.",
            reportAria: "Ouvrir le guide pour les créateurs de hardware IA",
            reportStats: ["axes de décision", "cas analysés", "jours d’apprentissage"],
            reportAction: "Ouvrir le rapport →",
            skillfitTitle: "Conseiller AI Skills SkillFit",
            skillfitSummary: "Un outil léger qui part d’une tâche réelle pour aider à choisir l’AI Skill le plus adapté. Il explore une nouvelle couche de découverte et d’évaluation.",
            skillfitPoints: ["Pas une boutique de plus, mais une couche de décision entre la tâche et le bon Skill.", "Les pages SEO / AEO répondent à de véritables intentions de recherche.", "Les contributions des utilisateurs et Skill Arena permettent de cocréer avec la communauté."],
            openSkillfit: "Ouvrir SkillFit",
            playfulTitle: "Jeux web / Expériences mini-apps",
            playfulSummary: "Je transforme rapidement de petites idées en expériences web jouables pour tester le ressenti, l’interaction et la narration, plutôt que de les laisser au stade du concept.",
            playNow: "↗ Jouer",
            gameAlt1: "Miniature d’Endless Glide",
            gameAlt2: "Miniature de Zootopia Match 3",
            experimentDetail: "Voir les expériences",
            communityTitle: "Communauté Hackathon Weekly",
            communitySummary: "En plus de créer des produits, je développe des communautés et des liens. Hackathon Weekly rassemble des personnes qui ont des idées et les aide à passer à l’action.",
            communityPoints: ["Je dirige et organise la communauté.", "Elle reflète ma capacité à connecter, mobiliser et maintenir l’élan.", "Transformer des idées en ligne en relations réelles crée une vraie valeur."]
        },
        guestbook: {
            title: "Si ce site vous inspire une idée, laissez-moi un mot.",
            loading: "Chargement des messages",
            loadingDetail: "Récupération des messages publics.",
            formTitle: "Laisser un mot à Dolores",
            note: "Partagez votre avis sur le site, les projets, le hardware IA ou les contenus. Les messages sont publics : n’incluez aucune information privée.",
            nameLabel: "Nom",
            namePlaceholder: "Votre nom",
            messageLabel: "Message",
            messagePlaceholder: "Que souhaitez-vous me dire ?",
            submit: "Publier le message"
        }
    }
};

const languageNames = {
    zh: "中文",
    en: "English",
    es: "Español",
    pt: "Português",
    fr: "Français"
};

function list(items) {
    return items.map((item) => `<li>${item}</li>`).join("");
}

function languageHref(from, to) {
    if (!from.path) return to.path ? `${to.path}/index.html` : "index.html";
    return to.path ? `../${to.path}/index.html` : "../index.html";
}

function renderLanguageMenu(locale) {
    const links = Object.entries(locales).map(([key, target]) => `
                    <a href="${languageHref(locale, target)}" lang="${target.htmlLang}"${key === locale.key ? ' aria-current="page"' : ""}>
                        <span>${languageNames[key]}</span><strong>${target.code}</strong>
                    </a>`).join("");

    return `<details class="language-menu">
                <summary aria-label="Choose language"><span>${locale.code}</span><i aria-hidden="true"></i></summary>
                <div class="language-menu-panel">${links}
                </div>
            </details>`;
}

function renderPage(key, locale) {
    locale.key = key;
    const prefix = locale.path ? "../" : "";
    const canonicalPath = locale.canonicalPath ?? locale.path;
    const canonical = `https://doloressu.com/${canonicalPath ? `${canonicalPath}/` : ""}`;
    const projectPrefix = key === "zh"
        ? "../projects"
        : key === "en"
            ? (locale.path ? "projects" : "en/projects")
            : "../en/projects";
    const learningPrefix = locale.path ? "../learning" : "learning";
    const gamesPrefix = locale.path ? "../games" : "games";
    const alternates = Object.entries(locales).map(([altKey, alt]) =>
        `    <link rel="alternate" hreflang="${altKey === "zh" ? "zh-Hans" : altKey}" href="https://doloressu.com/${alt.path ? `${alt.path}/` : ""}">`
    ).join("\n");
    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: key === "zh" ? "多乐 Dolores" : "Dolores Su",
        alternateName: ["多乐", "Dolores Su", "Dolo"],
        url: canonical,
        jobTitle: locale.jobTitle,
        description: locale.schemaDescription,
        sameAs: [
            "https://github.com/DoloresSusu",
            "https://www.linkedin.com/in/doloressu/",
            "https://hackathonweekly.com"
        ]
    };

    return `<!DOCTYPE html>
<html lang="${locale.htmlLang}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${locale.title}</title>
    <meta name="description" content="${locale.description}">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#f4efe8">
    <link rel="canonical" href="${canonical}">
    <link rel="alternate" type="text/plain" href="https://doloressu.com/llms.txt" title="LLM-readable site summary">
${alternates}
    <link rel="alternate" hreflang="x-default" href="https://doloressu.com/">
    <meta property="og:locale" content="${locale.ogLocale}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Dolores Su">
    <meta property="og:title" content="${locale.title}">
    <meta property="og:description" content="${locale.description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="https://doloressu.com/assets/life-2.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${locale.title}">
    <meta name="twitter:description" content="${locale.hero.lead}">
    <meta name="twitter:image" content="https://doloressu.com/assets/life-2.jpg">
    <link rel="icon" type="image/png" sizes="128x128" href="${prefix}assets/favicon-128.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&amp;family=Manrope:wght@400;500;600;700;800&amp;family=Noto+Serif+SC:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
    <link rel="stylesheet" href="${prefix}style.css">
    <link rel="stylesheet" href="${prefix}assets/guestbook.css">
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    <script defer src="/_vercel/insights/script.js"></script>
</head>

<body>
    <div class="page-shell">
        <div class="ambient ambient-left"></div>
        <div class="ambient ambient-right"></div>

        <header class="site-header">
            <a class="site-mark" href="#top">Dolores</a>
            <div class="header-actions">
                <nav class="site-nav" aria-label="Primary">
                    <a href="#about">${locale.nav[0]}</a>
                    <a href="#life">${locale.nav[1]}</a>
                    <a href="#projects">${locale.nav[2]}</a>
                    <a href="${learningPrefix}/ai-hardware-framework.html">${locale.nav[3]}</a>
                    <a href="#guestbook">${locale.nav[4]}</a>
                </nav>
                ${renderLanguageMenu(locale)}
            </div>
        </header>

        <main id="top">
            <section class="hero">
                <div class="hero-copy">
                    <p class="eyebrow">AI Product / Community / Creative Tech</p>
                    <h1>${key === "zh" ? "多乐 Dolores" : "Dolores Su"}</h1>
                    <p class="hero-lead">${locale.hero.lead}</p>
                    <p class="hero-body">${locale.hero.body}</p>
                    <p class="hero-manifesto">Life is short, take chances, be positive, and live now.</p>
                </div>
                <div class="hero-visual">
                    <figure class="portrait-card portrait-main">
                        <img src="${prefix}assets/life-2.jpg" alt="${locale.hero.altMain}" width="1050" height="1400" fetchpriority="high" decoding="async">
                    </figure>
                    <figure class="portrait-card portrait-accent">
                        <img src="${prefix}assets/life-5.jpg" alt="${locale.hero.altAccent}" width="1050" height="1400" loading="lazy" decoding="async">
                    </figure>
                </div>
            </section>

            <section class="about section-grid" id="about">
                <div class="section-heading">
                    <p class="eyebrow">01 / About</p>
                    <h2>${locale.about.title}</h2>
                </div>
                <div class="about-content">
                    <p>${locale.about.paragraphs[0]}</p>
                    <p>${locale.about.paragraphs[1]}</p>
                </div>
                <div class="about-links">
                    <a href="mailto:sumengxinuibe@163.com">sumengxinuibe@163.com</a>
                    <a href="https://github.com/DoloresSusu" target="_blank" rel="noopener noreferrer">GitHub / DoloresSusu</a>
                    <a href="https://www.linkedin.com/in/doloressu/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
                <div class="about-qr-strip">
                    <figure class="qr-item"><img src="${prefix}assets/wechat-qr.jpg" alt="${locale.about.qrAlts[0]}" width="855" height="852" loading="lazy" decoding="async"><figcaption>${locale.about.qr[0]}</figcaption></figure>
                    <figure class="qr-item"><img src="${prefix}assets/wechat-channel-qr.png" alt="${locale.about.qrAlts[1]}" width="328" height="334" loading="lazy" decoding="async"><figcaption>${locale.about.qr[1]}</figcaption></figure>
                    <figure class="qr-item"><img src="${prefix}assets/xiaohongshu-qr.jpeg" alt="${locale.about.qrAlts[2]}" width="253" height="256" loading="lazy" decoding="async"><figcaption>${locale.about.qr[2]}</figcaption></figure>
                </div>
            </section>

            <section class="life section-grid" id="life">
                <div class="section-heading"><p class="eyebrow">02 / Life</p><h2>${locale.life.title}</h2></div>
                <div class="life-intro"><p>${locale.life.intro}</p></div>
                <div class="carousel-shell">
                    <button class="carousel-button" type="button" aria-label="${locale.life.prev}" data-target="life-carousel" data-direction="prev">‹</button>
                    <div class="life-gallery" id="life-carousel">
                        ${locale.life.captions.map((caption, index) => `<figure class="gallery-item"><img src="${prefix}assets/life-${index + 1}.jpg" alt="${locale.life.alts[index]}" width="1050" height="1400" loading="lazy" decoding="async"><figcaption>${caption}</figcaption></figure>`).join("\n                        ")}
                    </div>
                    <button class="carousel-button" type="button" aria-label="${locale.life.next}" data-target="life-carousel" data-direction="next">›</button>
                </div>
            </section>

            <section class="projects section-grid" id="projects">
                <div class="section-heading"><p class="eyebrow">03 / Projects</p><h2>${locale.projects.title}</h2></div>
                <article class="project-card project-feature">
                    <div class="project-copy">
                        <p class="project-kicker">Featured Project</p>
                        <h3>${locale.projects.clawchipTitle}</h3>
                        <p class="project-summary">${locale.projects.clawchipSummary}</p>
                        <ul class="project-points">${list(locale.projects.clawchipPoints)}</ul>
                        <div class="project-links"><a href="${projectPrefix}/clawchip.html">${locale.projects.detail}</a><a href="https://loxovi.ai/" target="_blank" rel="noopener noreferrer">${locale.projects.officialSite}</a><a href="https://www.kickstarter.com/projects/1304096223/loxovi-e-paper-ai-notetakermeetings-end-next-steps-stay" target="_blank" rel="noopener noreferrer">Kickstarter</a><a href="${learningPrefix}/ai-hardware-framework.html">${locale.projects.framework}</a></div>
                    </div>
                    <div class="project-media project-clawchip">
                        <img class="card-shot" src="${prefix}assets/clawchip-hero.webp" alt="${locale.projects.clawchipPosterAlt}" width="768" height="768" loading="eager" decoding="async">
                        <img class="floating-shot" src="${prefix}assets/clawchip-press.webp" alt="${locale.projects.clawchipPrototypeAlt}" width="960" height="960" loading="eager" decoding="async">
                    </div>
                </article>

                <a class="learning-bridge" href="${learningPrefix}/ai-hardware-framework.html" aria-label="${locale.projects.reportAria}">
                    <div class="learning-bridge-copy"><p class="project-kicker">Learning Report / AI Hardware</p><h3>${locale.projects.reportTitle}</h3><p>${locale.projects.reportText}</p></div>
                    <div class="learning-bridge-meta"><span><strong>4</strong>${locale.projects.reportStats[0]}</span><span><strong>6</strong>${locale.projects.reportStats[1]}</span><span><strong>30</strong>${locale.projects.reportStats[2]}</span></div>
                    <div class="learning-bridge-action">${locale.projects.reportAction}</div>
                </a>

                <div class="project-grid">
                    <article class="project-card"><div class="project-copy">
                        <p class="project-kicker">Tool Site</p><h3>${locale.projects.skillfitTitle}</h3><p class="project-summary">${locale.projects.skillfitSummary}</p>
                        <ul class="project-points">${list(locale.projects.skillfitPoints)}</ul>
                        <div class="project-links"><a href="${projectPrefix}/skillfit.html">${locale.projects.detail}</a><a href="https://get-skill-fit.com/" target="_blank" rel="noopener noreferrer">${locale.projects.openSkillfit}</a></div>
                    </div></article>
                    <article class="project-card"><div class="project-copy">
                        <p class="project-kicker">Playful Build</p><h3>${locale.projects.playfulTitle}</h3><p class="project-summary">${locale.projects.playfulSummary}</p>
                        <div class="game-preview-grid">
                            <a class="game-preview-card" href="${gamesPrefix}/endless_glide/index.html" target="_blank" rel="noopener noreferrer" aria-label="Endless Glide"><div class="game-cover"><img src="${prefix}assets/endless-glide-thumb.jpg" alt="${locale.projects.gameAlt1}" width="900" height="675" loading="eager" decoding="async"></div><div class="game-preview-meta"><strong>Endless Glide</strong><span>${locale.projects.playNow}</span></div></a>
                            <a class="game-preview-card" href="${gamesPrefix}/zootopia_match3/index.html" target="_blank" rel="noopener noreferrer" aria-label="Zootopia Match 3"><div class="game-cover"><img src="${prefix}assets/zootopia-match3-thumb.jpg" alt="${locale.projects.gameAlt2}" width="900" height="675" loading="eager" decoding="async"></div><div class="game-preview-meta"><strong>Zootopia Match 3</strong><span>${locale.projects.playNow}</span></div></a>
                        </div>
                        <div class="project-links"><a href="${projectPrefix}/playful-builds.html">${locale.projects.experimentDetail}</a></div>
                    </div></article>
                    <article class="project-card"><div class="project-copy">
                        <p class="project-kicker">Community</p><h3>${locale.projects.communityTitle}</h3><p class="project-summary">${locale.projects.communitySummary}</p>
                        <ul class="project-points">${list(locale.projects.communityPoints)}</ul>
                        <div class="project-links"><a href="https://hackathonweekly.com" target="_blank" rel="noopener noreferrer">Hackathon Weekly</a></div>
                    </div></article>
                </div>
            </section>

            <section class="guestbook-section section-grid" id="guestbook" data-guestbook data-guestbook-locale="${key}" data-guestbook-page="homepage">
                <div class="section-heading"><p class="eyebrow">04 / Guestbook</p><h2>${locale.guestbook.title}</h2></div>
                <div class="guestbook-shell">
                    <div class="guestbook-intro"><div class="guestbook-list" data-guestbook-list><article class="guestbook-empty"><span>${locale.guestbook.loading}</span><strong>${locale.guestbook.loadingDetail}</strong></article></div></div>
                    <aside class="guestbook-form-card">
                        <strong>${locale.guestbook.formTitle}</strong><p class="guestbook-note">${locale.guestbook.note}</p>
                        <form data-guestbook-form>
                            <label class="guestbook-field"><span>${locale.guestbook.nameLabel}</span><input name="name" type="text" maxlength="40" autocomplete="name" placeholder="${locale.guestbook.namePlaceholder}" required></label>
                            <label class="guestbook-field"><span>${locale.guestbook.messageLabel}</span><textarea name="message" maxlength="500" placeholder="${locale.guestbook.messagePlaceholder}" required></textarea></label>
                            <button class="guestbook-submit" type="submit">${locale.guestbook.submit}</button>
                            <p class="guestbook-status" data-guestbook-status aria-live="polite"></p>
                        </form>
                    </aside>
                </div>
            </section>
        </main>
    </div>
    <script src="${prefix}assets/guestbook-config.js"></script>
    <script src="${prefix}assets/guestbook.js"></script>
    <script src="${prefix}assets/site.js"></script>
</body>
</html>
`;
}

for (const [key, locale] of Object.entries(locales)) {
    const destination = locale.path ? join(root, locale.path, "index.html") : join(root, "index.html");
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, renderPage(key, locale), "utf8");
}

const englishAlias = { ...locales.en, path: "en", canonicalPath: "" };
await writeFile(join(root, "en", "index.html"), renderPage("en", englishAlias), "utf8");

console.log(`Generated ${Object.keys(locales).length} localized homepages plus the /en/ compatibility page.`);
