/**
 * MOTEUR DE RÉPÉTITION ESPACÉE (SRS) TYPE ANKI
 * 
 * Ce fichier est rigoureusement isolé de l'affichage.
 * Il implémente les règles précises de mémorisation :
 * - 4 boutons d'évaluation : Encore (1), Difficile (2), Correct (3), Facile (4)
 * - Facteur de facilité (EF) : démarre à 2.5, plancher absolu à 1.3
 *   * Encore : -0.20
 *   * Difficile : -0.15
 *   * Correct : 0
 *   * Facile : +0.15
 * - Étapes d'apprentissage pour carte neuve : 1 minute puis 10 minutes.
 *   Sortie d'apprentissage :
 *   * Réponse normale : 1 jour
 *   * Réponse Facile : 4 jours
 * - Révisions de cartes mûres :
 *   * Difficile : intervalle * 1.2
 *   * Correct : intervalle * EF
 *   * Facile : intervalle * EF * 1.3
 *   * Encore : réapprentissage à 10 min, prochain intervalle = ancien / 2 (min 1 jour)
 * - Fuzz factor : variation aléatoire de ±5% sur les intervalles en jours
 * - Plafonds journaliers : 20 cartes neuves / jour, 200 révisions / jour
 * - Carte problématique (Leech) : signalée après 8 échecs ("Encore")
 * - 3 formats de question :
 *   1. Carte neuve (< 2 étapes) -> QCM 4 choix (distracteurs même thème + même nature)
 *   2. Carte en cours (< 21 jours) -> Réponse écrite
 *   3. Carte mûre (> 21 jours) -> Réponse écrite
 * - Correction tolérante : accents, casse, ponctuation et espaces nettoyés, synonymes acceptés.
 */

class SrsEngine {
  constructor(cardsData = []) {
    this.allCards = cardsData;
    this.cardStates = {}; // id -> CardSRSState
    this.dailyLimits = {
      maxNewPerDay: 20,
      maxReviewsPerDay: 200
    };
    this.dailyCounts = {
      date: this.getTodayDateString(),
      newCardsCount: 0,
      reviewsCount: 0
    };
  }

  getTodayDateString() {
    return new Date().toISOString().split('T')[0];
  }

  // Initialise l'état d'une carte si absent
  initCardState(cardId) {
    if (!this.cardStates[cardId]) {
      this.cardStates[cardId] = {
        cardId: cardId,
        easeFactor: 2.5,
        interval: 0, // En jours (0 = en apprentissage sous-journée)
        learningStep: 0, // 0 = 1 min, 1 = 10 min, 2 = mûre/graduée
        dueDate: null, // Timestamp en millisecondes
        lapses: 0, // Nombre d'échecs (Encore)
        reviewsCount: 0,
        isLeech: false,
        relearning: false
      };
    }
    return this.cardStates[cardId];
  }

  // Vérifie et réinitialise les compteurs quotidiens si on a changé de jour
  checkDailyReset() {
    const today = this.getTodayDateString();
    if (this.dailyCounts.date !== today) {
      this.dailyCounts = {
        date: today,
        newCardsCount: 0,
        reviewsCount: 0
      };
    }
  }

  // Calcule la variation de ±5% sur un intervalle en jours
  applyFuzz(intervalInDays) {
    if (intervalInDays <= 1) return intervalInDays;
    const fuzzDelta = (Math.random() * 0.10) - 0.05; // [-0.05, +0.05]
    const fuzzed = Math.round(intervalInDays * (1 + fuzzDelta));
    return Math.max(1, fuzzed);
  }

  // Traitement d'une réponse utilisateur (1: Encore, 2: Difficile, 3: Correct, 4: Facile)
  rateCard(cardId, rating) {
    this.checkDailyReset();
    const state = this.initCardState(cardId);
    const now = Date.now();
    state.reviewsCount += 1;

    // Mise à jour du facteur de facilité (Ease Factor)
    if (rating === 1) { // Encore
      state.easeFactor = Math.max(1.3, state.easeFactor - 0.20);
      state.lapses += 1;
      if (state.lapses >= 8) {
        state.isLeech = true;
      }
    } else if (rating === 2) { // Difficile
      state.easeFactor = Math.max(1.3, state.easeFactor - 0.15);
    } else if (rating === 3) { // Correct
      // Pas de modification du facteur de facilité
    } else if (rating === 4) { // Facile
      state.easeFactor += 0.15;
    }

    // Gestion du cycle d'apprentissage et des intervalles
    if (state.learningStep < 2 || state.relearning) {
      // Carte en apprentissage ou réapprentissage
      if (rating === 1) { // Encore
        // Retourne à la première étape (1 minute)
        state.learningStep = 0;
        state.dueDate = now + 1 * 60 * 1000; // 1 minute
      } else if (rating === 2) { // Difficile
        // Reste à l'étape actuelle, délai de 5 minutes
        state.dueDate = now + 5 * 60 * 1000;
      } else if (rating === 3) { // Correct
        if (state.learningStep === 0) {
          // Passe à la deuxième étape (10 minutes)
          state.learningStep = 1;
          state.dueDate = now + 10 * 60 * 1000; // 10 minutes
        } else {
          // Sortie d'apprentissage vers statut mûr avec 1 jour
          state.learningStep = 2;
          state.relearning = false;
          state.interval = 1;
          state.dueDate = now + 24 * 60 * 60 * 1000;
          this.dailyCounts.newCardsCount += 1;
        }
      } else if (rating === 4) { // Facile
        // Sort immédiatement d'apprentissage avec 4 jours
        state.learningStep = 2;
        state.relearning = false;
        state.interval = 4;
        state.dueDate = now + 4 * 24 * 60 * 60 * 1000;
        this.dailyCounts.newCardsCount += 1;
      }
    } else {
      // Carte mûre (déjà graduée)
      this.dailyCounts.reviewsCount += 1;

      if (rating === 1) { // Encore sur carte mûre
        state.relearning = true;
        state.learningStep = 1;
        state.dueDate = now + 10 * 60 * 1000; // Réapprentissage 10 min
        state.interval = Math.max(1, Math.floor(state.interval / 2));
      } else if (rating === 2) { // Difficile
        const calculated = state.interval * 1.2;
        state.interval = this.applyFuzz(calculated);
        state.dueDate = now + state.interval * 24 * 60 * 60 * 1000;
      } else if (rating === 3) { // Correct
        const calculated = state.interval * state.easeFactor;
        state.interval = this.applyFuzz(calculated);
        state.dueDate = now + state.interval * 24 * 60 * 60 * 1000;
      } else if (rating === 4) { // Facile
        const calculated = state.interval * state.easeFactor * 1.3;
        state.interval = this.applyFuzz(calculated);
        state.dueDate = now + state.interval * 24 * 60 * 60 * 1000;
      }
    }

    return {
      state,
      nextIntervalStr: this.formatInterval(state)
    };
  }

  // Formatage lisible du prochain intervalle
  formatInterval(state) {
    if (state.learningStep === 0) return "1 min";
    if (state.learningStep === 1) return "10 min";
    if (state.interval === 1) return "1 j";
    return `${state.interval} j`;
  }

  // Détermine le format de question adéquat selon l'état de la carte
  getQuestionFormat(cardId) {
    const state = this.initCardState(cardId);
    if (state.learningStep < 2 && !state.relearning && state.interval === 0) {
      return "mcq"; // Carte neuve : QCM
    } else if (state.interval <= 21) {
      return "written"; // Carte en cours : écrite
    } else {
      return "written"; // Carte mûre (> 21 jours) : écrite
    }
  }

  // Génère un QCM à 4 choix pour une carte neuve
  // Les 3 mauvaises réponses sont impérativement tirées du même module ET même nature grammaticale
  generateMCQ(targetCard) {
    const sameModuleAndNature = this.allCards.filter(c =>
      c.id !== targetCard.id &&
      c.moduleId === targetCard.moduleId &&
      c.grammarNature === targetCard.grammarNature
    );

    let candidates = [...sameModuleAndNature];

    // Si le vivier strict est inférieur à 3, on élargit d'abord à la même nature grammaticale
    if (candidates.length < 3) {
      const sameNature = this.allCards.filter(c =>
        c.id !== targetCard.id &&
        c.grammarNature === targetCard.grammarNature &&
        !candidates.some(cand => cand.id === c.id)
      );
      candidates = candidates.concat(sameNature);
    }

    // Si toujours insuffisant, même module
    if (candidates.length < 3) {
      const sameModule = this.allCards.filter(c =>
        c.id !== targetCard.id &&
        c.moduleId === targetCard.moduleId &&
        !candidates.some(cand => cand.id === c.id)
      );
      candidates = candidates.concat(sameModule);
    }

    // Mélange et sélectionne 3 distracteurs
    this.shuffle(candidates);
    const chosenDistractors = candidates.slice(0, 3).map(c => c.term);

    // Si la carte a des distracteurs suggérés manuellement dans sa fiche
    if (chosenDistractors.length < 3 && targetCard.distractors) {
      for (const d of targetCard.distractors) {
        if (!chosenDistractors.includes(d) && d !== targetCard.term && chosenDistractors.length < 3) {
          chosenDistractors.push(d);
        }
      }
    }

    const options = [targetCard.term, ...chosenDistractors];
    this.shuffle(options);

    return {
      correctAnswer: targetCard.term,
      options: options
    };
  }

  // Évaluation d'une réponse écrite
  evaluateWrittenAnswer(userInput, targetCard) {
    const normalize = (str) => {
      if (!str) return "";
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Enlève les accents
        .replace(/[^a-z0-9]/g, " ") // Remplace la ponctuation par des espaces
        .replace(/\s+/g, " ")
        .trim();
    };

    const cleanInput = normalize(userInput);
    const cleanTerm = normalize(targetCard.term);

    // Comparaison exacte normalisée
    if (cleanInput === cleanTerm) {
      return {
        isCorrect: true,
        isExact: true,
        diffHighlight: null
      };
    }

    // Vérification des synonymes autorisés
    if (targetCard.synonyms && Array.isArray(targetCard.synonyms)) {
      for (const syn of targetCard.synonyms) {
        if (cleanInput === normalize(syn)) {
          return {
            isCorrect: true,
            isExact: false,
            synonymMatched: syn,
            diffHighlight: this.computeDiff(targetCard.term, userInput)
          };
        }
      }
    }

    // Distance de Levenshtein pour tolérer une légère faute de frappe (1 ou 2 caractères selon la longueur)
    const distance = this.levenshtein(cleanInput, cleanTerm);
    const maxAllowedDistance = cleanTerm.length > 8 ? 2 : (cleanTerm.length > 4 ? 1 : 0);

    if (distance <= maxAllowedDistance && cleanInput.length >= 3) {
      return {
        isCorrect: true,
        isExact: false,
        approximate: true,
        diffHighlight: this.computeDiff(targetCard.term, userInput)
      };
    }

    return {
      isCorrect: false,
      isExact: false,
      diffHighlight: this.computeDiff(targetCard.term, userInput)
    };
  }

  // Calcul du surlignage différentiel de mots
  computeDiff(canonical, userAttempt) {
    const canonWords = canonical.split(/\s+/);
    const attemptWords = (userAttempt || "").split(/\s+/).map(w => w.toLowerCase());

    return canonWords.map(word => {
      const cleanW = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const isPresent = attemptWords.some(aw => aw.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === cleanW);
      return {
        text: word,
        matched: isPresent
      };
    });
  }

  // Distance de Levenshtein
  levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  // Renvoie la file de révision pour la session actuelle en respectant les plafonds journaliers
  getDueCards(activeModuleIds = null) {
    this.checkDailyReset();
    const now = Date.now();

    let pool = this.allCards;
    if (activeModuleIds && Array.isArray(activeModuleIds) && activeModuleIds.length > 0) {
      pool = pool.filter(c => activeModuleIds.includes(c.moduleId));
    }

    const reviewCards = [];
    const learningCards = [];
    const newCards = [];

    for (const card of pool) {
      const state = this.initCardState(card.id);

      if (state.dueDate === null) {
        // Carte jamais vue
        newCards.push(card);
      } else if (state.learningStep < 2 || state.relearning) {
        // En cours d'apprentissage court
        if (state.dueDate <= now) {
          learningCards.push(card);
        }
      } else {
        // Carte mûre
        if (state.dueDate <= now) {
          reviewCards.push(card);
        }
      }
    }

    // Respect des plafonds journaliers
    const remainingNewAllowance = Math.max(0, this.dailyLimits.maxNewPerDay - this.dailyCounts.newCardsCount);
    const remainingReviewAllowance = Math.max(0, this.dailyLimits.maxReviewsPerDay - this.dailyCounts.reviewsCount);

    const allowedNewCards = newCards.slice(0, remainingNewAllowance);
    const allowedReviewCards = reviewCards.slice(0, remainingReviewAllowance);

    // Priorité : Cartes en apprentissage court d'abord, puis révisions dues, puis nouvelles cartes
    return [...learningCards, ...allowedReviewCards, ...allowedNewCards];
  }

  // Renvoie le statut global de la collection pour la grille d'accueil
  // Tiers : 0 = non vue (gris), 1 = apprentissage (bleu), 2 = jeune < 21j (vert), 3 = mûre > 21j (or)
  getCardMasteryTier(cardId) {
    const state = this.initCardState(cardId);
    if (!state.dueDate && state.interval === 0) return 0; // Grise
    if (state.learningStep < 2 || state.relearning) return 1; // Apprentissage
    if (state.interval > 21) return 3; // Dorée (> 21 jours)
    return 2; // Colorée jeune (1 à 21 jours)
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Sérialisation pour sauvegarde / export
  exportData() {
    return {
      cardStates: this.cardStates,
      dailyCounts: this.dailyCounts,
      dailyLimits: this.dailyLimits
    };
  }

  // Restauration depuis un objet importé
  importData(data) {
    if (data && data.cardStates) {
      this.cardStates = data.cardStates;
      if (data.dailyCounts) this.dailyCounts = data.dailyCounts;
      if (data.dailyLimits) this.dailyLimits = data.dailyLimits;
      return true;
    }
    return false;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SrsEngine };
}
