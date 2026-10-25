/**
 * VOCABULAIRE ET CONTENU PÉDAGOGIQUE : LES BASES DE L'INTELLIGENCE ARTIFICIELLE
 * 
 * Programme initial sur 15 jours (15 fiches), conçu pour vulgariser au maximum
 * les concepts clés tout en conservant les termes techniques exacts.
 * Conçu de manière modulaire pour accueillir facilement de futurs modules (Vision, Agents, Éthique).
 */

const TARGET_LANGUAGE = 'fr';

// Les 3 modules initiaux (15 jours)
const MODULES = [
  {
    id: 1,
    title: "De l'Algorithme au Machine Learning",
    subtitle: "Comprendre le changement de paradigme fondamental (Jours 1 à 5)",
    color: "#3B82F6",
    badge: "Initié IA"
  },
  {
    id: 2,
    title: "Le Deep Learning et les Réseaux de Neurones",
    subtitle: "Décortiquer ce qu'il y a sous le capot des technologies modernes (Jours 6 à 10)",
    color: "#10B981",
    badge: "Architecte Neuronal"
  },
  {
    id: 3,
    title: "Les Grands Modèles de Langage (LLM)",
    subtitle: "Maîtriser le fonctionnement des IA génératives actuelles (Jours 11 à 15)",
    color: "#F59E0B",
    badge: "Maître des LLM"
  }
];

// Les 15 fiches pédagogiques du programme initial de 15 jours
const FICHES = [
  // --- MODULE 1 : De l'Algorithme au Machine Learning ---
  {
    id: 1,
    moduleId: 1,
    day: 1,
    number: 1,
    title: "Algorithme classique vs Intelligence Artificielle",
    notionCle: "Programmation déterministe (règles manuelles) vs Apprentissage statistique (déduction des règles par les données).",
    summary: "Dans l'informatique classique, un programmeur écrit à la main chaque règle : « Si la condition A est vraie, fais B ». C'est rigide. En Intelligence Artificielle, on ne dicte pas les règles à l'ordinateur : on lui montre des milliers d'exemples et c'est la machine qui déduit par elle-même les règles statistiques qui relient les données aux réponses.",
    dailyExample: "Une recette de cuisine traditionnelle où chaque étape est décrite au gramme près (algorithme classique) vs un enfant qui apprend à reconnaître un chien en en voyant 100 dans la rue sans qu'on lui donne une formule mathématique de chien (IA).",
    takeaway: "L'informatique classique exécute des règles dictées par l'humain ; l'IA apprend elle-même les règles à partir des données."
  },
  {
    id: 2,
    moduleId: 1,
    day: 2,
    number: 2,
    title: "Les Données et l'Entraînement (Dataset & Training)",
    notionCle: "Les données sont le carburant de l'IA (Dataset). L'entraînement consiste à réduire les erreurs par répétition.",
    summary: "Une IA ne naît pas intelligente : au départ, ses réponses sont complètement aléatoires. Le Dataset est l'ensemble de données d'apprentissage qu'on lui fournit. L'entraînement (Training) est le processus itératif au cours duquel le modèle compare ses prédictions à la réalité, calcule son taux d'erreur (Loss) et s'ajuste pour devenir de plus en plus précis.",
    dailyExample: "S'entraîner aux tirs au panier de basket : au premier tir, tu rates complètement. À chaque tentative, ton cerveau analyse la trajectoire manquée et ajuste imperceptiblement la force du bras jusqu'à enfiler les paniers avec précision.",
    takeaway: "Sans données de qualité, pas d'IA (Garbage in, Garbage out). L'entraînement est la répétition nécessaire pour corriger les erreurs."
  },
  {
    id: 3,
    moduleId: 1,
    day: 3,
    number: 3,
    title: "L'Apprentissage Supervisé (Supervised Learning)",
    notionCle: "Données étiquetées (Inputs X → Labels Y). La machine apprend avec un corrigé.",
    summary: "C'est la forme d'IA la plus répandue dans l'industrie. Chaque donnée d'entrée est accompagnée de sa bonne réponse fournie par un humain (l'étiquette ou label). Le modèle apprend à faire correspondre les entrées aux sorties pour être capable ensuite de prédire la bonne étiquette sur une nouvelle donnée qu'il n'a jamais vue.",
    dailyExample: "Le filtre anti-spam de ta boîte mail : des millions de courriels étiquetés manuellement « Spam » ou « Non-Spam ». Quand un nouvel email arrive aujourd'hui, l'IA sait immédiatement dans quel dossier le classer.",
    takeaway: "En apprentissage supervisé, l'IA s'entraîne comme un élève avec un manuel d'exercices où les réponses sont écrites à la dernière page."
  },
  {
    id: 4,
    moduleId: 1,
    day: 4,
    number: 4,
    title: "L'Apprentissage Non-Supervisé & Par Renforcement (Unsupervised & RL)",
    notionCle: "Découverte de motifs cachés (Clustering) vs Apprentissage par essais-erreurs avec récompenses.",
    summary: "En apprentissage non-supervisé, les données n'ont aucune étiquette : l'IA explore seule et regroupe les éléments similaires (Clustering). En apprentissage par renforcement (Reinforcement Learning), un agent virtuel explore un environnement et apprend à maximiser un score grâce à un système de récompenses et de pénalités.",
    dailyExample: "Spotify qui regroupe des millions d'utilisateurs ayant des goûts musicaux proches sans que personne ne leur ait collé d'étiquette (non-supervisé) vs une IA qui apprend à jouer à Mario Bros en gagnant des points quand elle avance et en perdant quand elle touche un ennemi (renforcement).",
    takeaway: "Le non-supervisé classe sans étiquette ; le renforcement apprend par essais, erreurs et récompenses (comme dresser un chiot)."
  },
  {
    id: 5,
    moduleId: 1,
    day: 5,
    number: 5,
    title: "Le Réseau de Neurones Artificiels (Neural Network)",
    notionCle: "Couches interconnectées de calculs simples inspirées par les neurones du cerveau biologique.",
    summary: "Un réseau de neurones artificiels s'inspire du cerveau humain : il se compose d'une couche d'entrée (Input), de couches intermédiaires (dites cachées) et d'une couche de sortie (Output). Chaque neurone reçoit des signaux, applique un calcul mathématique simple pondéré par une force de connexion (un poids), et transmet le résultat au neurone suivant si un seuil est franchi.",
    dailyExample: "Un filtre à café à plusieurs étages : les premiers étages filtrent les grains grossiers (lignes simples, contrastes), les étages du milieu repèrent des formes (cercles, textures), et le dernier étage conclut : « c'est un ballon de football ».",
    takeaway: "Un réseau de neurones résout des énigmes complexes en combinant des millions de petites opérations mathématiques très simples en cascade."
  },

  // --- MODULE 2 : Le Deep Learning et les Réseaux de Neurones ---
  {
    id: 6,
    moduleId: 2,
    day: 6,
    number: 6,
    title: "L'Apprentissage Profond (Deep Learning)",
    notionCle: "L'empilement de dizaines de couches de neurones pour extraire des concepts abstraits automatiquement.",
    summary: "Le Deep Learning est un sous-ensemble du Machine Learning qui utilise des réseaux de neurones possédant un très grand nombre de couches superposées (d'où le terme « profond »). Sa force révolutionnaire est qu'il n'a plus besoin qu'un ingénieur humain lui explique quelles caractéristiques chercher dans une image ou un son : il les découvre seul grâce à la puissance des processeurs graphiques (GPU).",
    dailyExample: "La reconnaissance faciale de ton smartphone : le système n'a pas besoin qu'on lui décrive la distance exacte entre tes deux yeux, il analyse des dizaines de couches de motifs pour t'identifier en une fraction de seconde, même dans la pénombre.",
    takeaway: "Le Deep Learning a rendu l'IA autonome dans l'extraction des caractéristiques visuelles, sonores et textuelles."
  },
  {
    id: 7,
    moduleId: 2,
    day: 7,
    number: 7,
    title: "Les Poids et les Biais (Weights & Biases) : Les curseurs de l'IA",
    notionCle: "Les paramètres numériques internes ajustés par l'algorithme de descente de gradient.",
    summary: "Ce qu'un modèle d'IA mémorise dans son fichier final, ce ne sont ni des phrases ni des images, mais des milliards de nombres appelés « Poids » (Weights). Chaque poids représente la force de la connexion entre deux neurones. L'apprentissage consiste à faire glisser ces curseurs millimètre par millimètre grâce à un algorithme mathématique appelé la « descente de gradient ».",
    dailyExample: "La table de mixage géante d'un studio de musique avec 100 milliards de petits potentiomètres. L'ingénieur du son les ajuste un par un jusqu'à ce que le son global soit d'une pureté parfaite sans grésillement.",
    takeaway: "« Ce que sait l'IA », ce sont simplement des milliards de curseurs numériques (les poids) réglés avec précision par le calcul."
  },
  {
    id: 8,
    moduleId: 2,
    day: 8,
    number: 8,
    title: "Le Surapprentissage (Overfitting) : Le piège du par cœur",
    notionCle: "Quand le modèle retient par cœur les détails du dataset sans comprendre le principe général.",
    summary: "L'Overfitting est le risque numéro un en IA : le modèle devient tellement parfait sur ses données d'entraînement qu'il a mémorisé le bruit et les moindres détails insignifiants. Problème : dès qu'on lui présente une donnée nouvelle, il se montre incapable de la traiter. Pour l'éviter, on garde toujours un échantillon de test secret (Validation Set) pour vérifier qu'il sait généraliser.",
    dailyExample: "Un élève qui révise son contrôle en apprenant par cœur les corrigés exacts des annales avec les chiffres : le jour du devoir en classe, le professeur change juste un chiffre dans l'énoncé et l'élève se retrouve totalement bloqué.",
    takeaway: "Une bonne IA doit comprendre la tendance générale, jamais régurgiter par cœur ses données d'entraînement."
  },
  {
    id: 9,
    moduleId: 2,
    day: 9,
    number: 9,
    title: "Les Embeddings (Plongements vectoriels) : La géométrie du sens",
    notionCle: "Convertir des mots ou des concepts en listes de coordonnées numériques pour mesurer leur proximité.",
    summary: "Les ordinateurs ne comprennent pas les lettres ni le langage humain. Un Embedding est une technique mathématique qui transforme chaque mot ou phrase en une longue liste de coordonnées (un vecteur de nombres, souvent 1536 dimensions). Deux mots ayant un sens proche se retrouvent situés tout près l'un de l'autre dans cet espace géométrique.",
    dailyExample: "Sur une carte de France, Paris et Versailles sont proches. Dans l'espace des embeddings, « Chien » et « Loup » ont des coordonnées voisines, tandis que « Frigo » est très loin. Mieux : mathématiquement, Vecteur(Roi) - Vecteur(Homme) + Vecteur(Femme) = Vecteur(Reine) !",
    takeaway: "Les embeddings donnent une adresse GPS à chaque concept : ils permettent à l'IA de calculer la proximité des idées par la géométrie."
  },
  {
    id: 10,
    moduleId: 2,
    day: 10,
    number: 10,
    title: "L'Architecture Transformer & le Mécanisme d'Attention",
    notionCle: "L'invention de 2017 (Google) qui permet de traiter tous les mots d'un coup en pesant leurs relations.",
    summary: "Avant 2017, les IA lisaient les textes mot par mot de gauche à droite et oubliaient le début des phrases longues. Les chercheurs de Google ont inventé l'architecture Transformer (« Attention Is All You Need ») : elle analyse tous les mots d'une phrase simultanément en braquant des projecteurs (mécanisme d'attention) pour mesurer à quel point chaque mot dépend des autres.",
    dailyExample: "Dans la phrase : « L'animal n'a pas traversé la rue car il était trop fatigué », le mécanisme d'attention relie immédiatement le mot « il » à « l'animal » plutôt qu'à « la rue » en tenant compte de tout le contexte.",
    takeaway: "Le Transformer est le cœur technologique de ChatGPT, Claude et Gemini : il comprend le contexte global d'un texte d'un seul coup d'œil."
  },

  // --- MODULE 3 : Les Grands Modèles de Langage (LLM) ---
  {
    id: 11,
    moduleId: 3,
    day: 11,
    number: 11,
    title: "Les LLM (Large Language Models)",
    notionCle: "Modèles massifs entraînés à prédire le mot suivant le plus probable sur des milliards de textes.",
    summary: "Un LLM (comme GPT-4, Claude ou Gemini) est un réseau de neurones géant basé sur l'architecture Transformer, entraîné sur une immense bibliothèque de textes (livres, articles, code, encyclopédies). Son mécanisme fondamental est d'une simplicité désarmante : étant donné une série de mots de départ, prédire la suite la plus cohérente statistiquement.",
    dailyExample: "La saisie prédictive de ton smartphone qui suggère le mot suivant au-dessus de ton clavier, mais démultipliée par des milliards de paramètres, capable de traduire 50 langues, d'écrire un poème ou de coder une application.",
    takeaway: "Un LLM est un moteur de prédiction statistique ultra-puissant du mot suivant, produisant un langage fluide et naturel."
  },
  {
    id: 12,
    moduleId: 3,
    day: 12,
    number: 12,
    title: "Les Tokens et la Fenêtre de Contexte (Context Window)",
    notionCle: "L'unité atomique de découpage du texte (~3/4 d'un mot) et la mémoire vive immédiate du modèle.",
    summary: "Les LLM ne lisent pas lettre par lettre : ils découpent le texte en « Tokens » (morceaux de mots d'environ 4 caractères en français). La Fenêtre de Contexte (Context Window) représente le nombre maximal de tokens que l'IA peut garder simultanément dans sa mémoire de travail pendant un échange.",
    dailyExample: "La taille du bureau de travail sur lequel un étudiant peut étaler ses feuilles de cours. Si la fenêtre fait 8 000 tokens, seules 10 pages tiennent sur le bureau. Si la fenêtre atteint 1 million de tokens (comme Gemini Pro), l'IA peut garder en mémoire 10 romans entiers simultanément !",
    takeaway: "Le token est la monnaie d'échange du texte pour l'IA ; la fenêtre de contexte est la taille de sa mémoire de travail immédiate."
  },
  {
    id: 13,
    moduleId: 3,
    day: 13,
    number: 13,
    title: "L'Alignement et le RLHF : Du perroquet à l'assistant",
    notionCle: "Apprentissage par renforcement guidé par l'humain pour rendre l'IA polie, utile et sécurisée.",
    summary: "Un LLM brut sorti de son entraînement initial se contente de continuer le texte sans filtre : il peut insulter, inventer des théories folles ou donner des recettes de poison. L'étape d'alignement (notamment via le RLHF - Reinforcement Learning from Human Feedback) consiste à faire évaluer ses réponses par des annotateurs humains pour lui apprendre à répondre comme un tuteur poli, utile et responsable.",
    dailyExample: "Apprivoiser un perroquet sauvage qui répète tout ce qu'il a entendu dans la jungle pour lui apprendre les bonnes manières et faire de lui un majordome fiable et serviable.",
    takeaway: "Le pré-entraînement donne la culture générale à l'IA ; l'alignement lui donne ses bonnes manières, sa politesse et ses règles de sécurité."
  },
  {
    id: 14,
    moduleId: 3,
    day: 14,
    number: 14,
    title: "Les Hallucinations : Pourquoi l'IA invente des faits",
    notionCle: "L'IA n'a pas de conscience de la vérité objective : elle génère ce qui est le plus plausible statistiquement.",
    summary: "Une « hallucination » se produit lorsqu'une IA générative affirme avec une assurance absolue un fait totalement faux (une fausse date historique, une fausse loi, une étude médicale inventée). L'IA ne « ment » pas : elle ne sait tout simplement pas ce qui est vrai ou faux dans le monde réel, elle calcule seulement la suite de mots la plus vraisemblable.",
    dailyExample: "Un candidat brillant à un oral qui ne connaît pas la réponse à une question mais qui invente une explication très technique et fluide avec un aplomb tel que tout le monde a l'impression qu'il dit vrai.",
    takeaway: "L'éloquence n'est pas la vérité : ne croyez jamais une IA sur parole sans vérifier ses sources sur les sujets critiques."
  },
  {
    id: 15,
    moduleId: 3,
    day: 15,
    number: 15,
    title: "Le Prompt Engineering & l'Avenir (RAG & Agents)",
    notionCle: "Comment guider l'IA avec précision, lui brancher des documents externes (RAG) et des outils.",
    summary: "Le Prompt est l'instruction donnée à l'IA. Le Prompt Engineering est l'art de formuler sa demande (attribuer un rôle d'expert, donner le contexte, préciser les contraintes et donner des exemples). Pour éliminer les hallucinations, on utilise aujourd'hui le RAG (Retrieval-Augmented Generation) qui fournit à l'IA des documents fiables avant qu'elle ne réponde, et les Agents IA qui exécutent des tâches complexes.",
    dailyExample: "Dire à un collaborateur : « Écris-moi un truc sur l'histoire » (résultat décevant) vs lui dire : « Agis comme un professeur d'histoire pour lycéens, résume la Révolution française en 5 points clés avec des dates précises » (résultat parfait).",
    takeaway: "L'IA est un miroir de vos consignes : la qualité de ce que vous en retirez dépend directement de la clarté de votre prompt."
  }
];

// CARTES DE MÉMORISATION ESPACÉE ANKI POUR L'IA
const FLASHCARDS = [
  // Module 1 : Fondations
  {
    id: "card_ia_1",
    ficheId: 1,
    moduleId: 1,
    term: "Machine Learning (Apprentissage Automatique)",
    grammarNature: "nom_masculin",
    question: "Quelle discipline de l'IA permet aux ordinateurs d'apprendre à résoudre des tâches à partir de données sans être explicitement programmés avec des règles fixes ?",
    definition: "Le champ d'études où les algorithmes déduisent automatiquement des modèles statistiques à partir d'exemples d'entraînement.",
    shortDefinition: "Discipline où les machines apprennent à partir de données sans règles rigides manuelles",
    example: "Le filtre antispam qui s'améliore au fil des emails classés par les utilisateurs.",
    synonyms: ["machine learning", "apprentissage automatique", "apprentissage statistique", "ml"],
    distractors: ["Algorithme déterministe", "Compilation binaire", "Mémoire cache"]
  },
  {
    id: "card_ia_2",
    ficheId: 2,
    moduleId: 1,
    term: "Dataset (Jeu de données)",
    grammarNature: "nom_masculin",
    question: "Comment appelle-t-on la collection d'exemples (textes, images ou nombres) fournie à un algorithme pour lui permettre d'apprendre ?",
    definition: "L'ensemble structuré de données utilisé pour entraîner, valider et tester un modèle d'intelligence artificielle.",
    shortDefinition: "Collection structurée de données servant de base à l'entraînement d'une IA",
    example: "Une base de 50 000 photos de radiographies médicales pour entraîner un système de détection.",
    synonyms: ["dataset", "jeu de donnees", "base de donnees d entrainement", "donnees d apprentissage"],
    distractors: ["Microprocesseur", "Système d'exploitation", "Protocole réseau"]
  },
  {
    id: "card_ia_3",
    ficheId: 3,
    moduleId: 1,
    term: "Apprentissage supervisé",
    grammarNature: "nom_masculin",
    question: "Quel paradigme d'apprentissage machine consiste à entraîner l'algorithme avec des données qui contiennent déjà la bonne réponse (données étiquetées) ?",
    definition: "La méthode d'entraînement où chaque donnée d'entrée est associée à une étiquette cible connue fournie par un humain.",
    shortDefinition: "Méthode d'entraînement où l'IA apprend à partir de données avec corrigé (étiquettes)",
    example: "Prédire le prix d'une maison à partir de sa surface en apprenant sur des milliers de ventes passées.",
    synonyms: ["apprentissage supervise", "supervised learning", "mode supervise"],
    distractors: ["Apprentissage non supervisé", "Apprentissage par renforcement", "Programmation orientée objet"]
  },
  {
    id: "card_ia_4",
    ficheId: 4,
    moduleId: 1,
    term: "Apprentissage par renforcement",
    grammarNature: "nom_masculin",
    question: "Quel mode d'apprentissage permet à un agent virtuel d'apprendre par essais et erreurs en cherchant à maximiser une récompense dans un environnement ?",
    definition: "L'approche où un système apprend une stratégie optimale d'actions en recevant des récompenses positives ou des pénalités.",
    shortDefinition: "Apprentissage par essais et erreurs guidé par des récompenses et des pénalités",
    example: "L'IA AlphaGo apprenant à vaincre les champions du monde en jouant des millions de parties contre elle-même.",
    synonyms: ["apprentissage par renforcement", "reinforcement learning", "rl"],
    distractors: ["Apprentissage supervisé", "Régression linéaire", "Compression de données"]
  },
  {
    id: "card_ia_5",
    ficheId: 5,
    moduleId: 1,
    term: "Réseau de neurones artificiels",
    grammarNature: "nom_masculin",
    question: "Quel modèle de calcul composé de couches de nœuds interconnectés pondérés s'inspire du fonctionnement des neurones du cerveau biologique ?",
    definition: "Un réseau mathématique structuré en couches de neurones artificiels effectuant des transformations numériques successives.",
    shortDefinition: "Modèle informatique composé de couches de neurones interconnectés par des poids",
    example: "Un réseau de neurones convolutif capable d'identifier un piéton sur la caméra d'une voiture.",
    synonyms: ["reseau de neurones", "reseau neuronal", "neural network", "reseau de neurones artificiels"],
    distractors: ["Arbre binaire de recherche", "Table de hachage", "Serveur mandataire"]
  },

  // Module 2 : Deep Learning & Architecture
  {
    id: "card_ia_6",
    ficheId: 6,
    moduleId: 2,
    term: "Deep Learning (Apprentissage Profond)",
    grammarNature: "nom_masculin",
    question: "Quel sous-domaine de l'apprentissage automatique utilise des réseaux de neurones composés d'un très grand nombre de couches pour extraire des motifs abstraits ?",
    definition: "La branche du Machine Learning reposant sur des architectures neuronales profondes à multiples couches de traitement.",
    shortDefinition: "Branche de l'IA utilisant des réseaux de neurones profonds pour apprendre des représentations complexes",
    example: "La traduction automatique instantanée de langues étrangères avec reconnaissance vocale.",
    synonyms: ["deep learning", "apprentissage profond", "reseaux profonds"],
    distractors: ["Machine learning classique", "Algorithme glouton", "Cryptographie asymétrique"]
  },
  {
    id: "card_ia_7",
    ficheId: 7,
    moduleId: 2,
    term: "Poids synaptiques (Weights)",
    grammarNature: "nom_masculin_pluriel",
    question: "Comment appelle-t-on les paramètres numériques internes qui définissent la force de connexion entre les neurones d'une IA, ajustés lors de l'apprentissage ?",
    definition: "Les coefficients mathématiques modifiables d'un réseau qui déterminent l'influence d'un neurone sur le neurone suivant.",
    shortDefinition: "Valeurs numériques ajustées pendant l'entraînement déterminant la force des connexions",
    example: "Les 175 milliards de poids d'un modèle comme GPT-3 représentant l'ensemble de sa mémoire.",
    synonyms: ["poids", "weights", "parametres du modele", "coefficients neuronaux"],
    distractors: ["Hyperparamètres", "Adresses IP", "Codes sources"]
  },
  {
    id: "card_ia_8",
    ficheId: 8,
    moduleId: 2,
    term: "Overfitting (Surapprentissage)",
    grammarNature: "nom_masculin",
    question: "Quel écueil se produit lorsqu'un modèle apprend par cœur les moindres détails et bruits de son dataset et devient incapable de généraliser à de nouvelles données ?",
    definition: "L'état d'un modèle qui colle excessivement aux données d'entraînement au détriment de sa performance sur des données inconnues.",
    shortDefinition: "Erreur où l'IA apprend par cœur ses données d'entraînement sans savoir généraliser",
    example: "Une IA qui reconnaît parfaitement 10 photos de chats données, mais échoue sur n'importe quel autre chat.",
    synonyms: ["overfitting", "surapprentissage", "surajustement", "memorisation excessive"],
    distractors: ["Sous-apprentissage", "Convergence rapide", "Descente de gradient"]
  },
  {
    id: "card_ia_9",
    ficheId: 9,
    moduleId: 2,
    term: "Embedding (Plongement vectoriel)",
    grammarNature: "nom_masculin",
    question: "Quelle technique convertit un mot, une phrase ou une image en une liste de coordonnées numériques (vecteur) où la proximité reflète la ressemblance de sens ?",
    definition: "La représentation d'un concept textuel ou visuel sous la forme d'un vecteur dans un espace géométrique multidimensionnel.",
    shortDefinition: "Représentation d'un mot ou concept sous forme de vecteur numérique traduisant son sens",
    example: "Associer au mot « Paris » un vecteur de 1536 nombres très proche géométriquement du vecteur « France ».",
    synonyms: ["embedding", "plongement vectoriel", "vecteur semantique", "representation vectorielle"],
    distractors: ["Encodage binaire", "Table de correspondance", "Indexation textuelle"]
  },
  {
    id: "card_ia_10",
    ficheId: 10,
    moduleId: 2,
    term: "Mécanisme d'attention (Attention Mechanism)",
    grammarNature: "nom_masculin",
    question: "Quel mécanisme clé au cœur des Transformers permet à l'IA d'analyser l'importance relative de chaque mot par rapport à tous les autres au sein d'une phrase ?",
    definition: "Le composant mathématique qui calcule des scores de pertinence mutuelle entre les différents éléments d'une séquence textuelle.",
    shortDefinition: "Mécanisme permettant à l'IA de focaliser son calcul sur les mots clés reliés par le sens",
    example: "Relier le pronom « il » au sujet mentionné trois lignes plus haut dans un paragraphe complexe.",
    synonyms: ["mecanisme d attention", "self attention", "attention", "attention croisee"],
    distractors: ["Boucle récurrente", "Rétropropagation", "Convolution spatiale"]
  },

  // Module 3 : Grands Modèles de Langage (LLM)
  {
    id: "card_ia_11",
    ficheId: 11,
    moduleId: 3,
    term: "LLM (Large Language Model)",
    grammarNature: "nom_masculin",
    question: "Comment désigne-t-on les modèles d'IA géants entraînés sur de gigantesques volumes de textes pour générer, traduire et comprendre le langage naturel ?",
    definition: "Un modèle d'apprentissage profond à grande échelle fondé sur l'architecture Transformer, dédié au traitement et à la génération du langage.",
    shortDefinition: "Grand modèle de langage entraîné sur des milliards de textes pour générer du langage naturel",
    example: "Des modèles comme GPT-4 d'OpenAI, Claude d'Anthropic ou Gemini de Google.",
    synonyms: ["llm", "large language model", "grand modele de langage", "modele linguistique"],
    distractors: ["Moteur de recherche", "Navigateur web", "Base de données relationnelle"]
  },
  {
    id: "card_ia_12",
    ficheId: 12,
    moduleId: 3,
    term: "Token",
    grammarNature: "nom_masculin",
    question: "Quelle unité de base minimale (morceau de mot d'environ 3 à 4 caractères) est utilisée par les LLM pour découper, lire et générer du texte ?",
    definition: "Le fragment textuel atomique (mot entier, syllabe ou ponctuation) traité comme une unité numérique par le modèle.",
    shortDefinition: "Unité élémentaire de texte (environ 3/4 d'un mot) traitée par une IA linguistique",
    example: "Le mot « extraordinaire » découpé en 3 tokens : « extra », « ordin », « aire ».",
    synonyms: ["token", "jeton textuel", "unite de token", "jeton"],
    distractors: ["Pixel", "Caractère ASCII", "Octet binaire"]
  },
  {
    id: "card_ia_13",
    ficheId: 13,
    moduleId: 3,
    term: "RLHF (Apprentissage par retour humain)",
    grammarNature: "nom_masculin",
    question: "Quelle méthode d'alignement affine un LLM brut en utilisant les préférences et jugements d'utilisateurs humains pour le rendre poli, utile et sûr ?",
    definition: "L'apprentissage par renforcement à partir des rétroactions humaines (Reinforcement Learning from Human Feedback).",
    shortDefinition: "Méthode d'alignement utilisant les avis humains pour rendre l'IA serviable et sécurisée",
    example: "Des annotateurs choisissant la réponse la plus claire et bienveillante entre deux propositions de l'IA.",
    synonyms: ["rlhf", "apprentissage par retour humain", "alignement rlhf", "reinforcement learning from human feedback"],
    distractors: ["Pré-entraînement massif", "Test unitaire automatique", "Nettoyage de base de données"]
  },
  {
    id: "card_ia_14",
    ficheId: 14,
    moduleId: 3,
    term: "Hallucination",
    grammarNature: "nom_feminin",
    question: "Quel terme désigne le phénomène où une IA générative invente avec une grande certitude des faits, citations ou sources totalement faux ?",
    definition: "La production par un modèle de langage d'un énoncé erroné ou imaginaire non corroboré par les faits, généré par complétion probabiliste.",
    shortDefinition: "Affirmation totalement fausse ou inventée produite avec assurance par une IA",
    example: "Une IA citant un faux article de loi ou inventant le livre d'un philosophe célèbre.",
    synonyms: ["hallucination", "confabulation", "invention de faits", "erreur d hallucination"],
    distractors: ["Bogue informatique", "Perte de mémoire", "Saturation de contexte"]
  },
  {
    id: "card_ia_15",
    ficheId: 15,
    moduleId: 3,
    term: "Prompt",
    grammarNature: "nom_masculin",
    question: "Comment appelle-t-on la consigne textuelle (requête, instruction ou question) transmise à une IA générative pour lui dicter la réponse attendue ?",
    definition: "L'instruction en langage naturel servant d'amorce et de cadre pour orienter la génération de texte ou d'image d'un modèle.",
    shortDefinition: "Instruction ou question fournie à une IA pour guider sa réponse",
    example: "« Rédige un poème en alexandrins sur l'océan avec un ton mélancolique ».",
    synonyms: ["prompt", "invite", "consigne", "requete d amorce"],
    distractors: ["Code source", "Requête SQL", "Algorithme de tri"]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TARGET_LANGUAGE, MODULES, FICHES, FLASHCARDS };
}
