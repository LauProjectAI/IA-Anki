/**
 * APPLICATION IA-ANKI : CONTRÔLEUR D'INTERFACE & LOGIQUE DE JEU
 * 
 * Orchestre les révisions de répétition espacée (Anki), l'atelier interactif
 * (Tokens, Neurones, Embeddings), les combos et le mode Sprint 60s.
 */

const STORAGE_SCHEMA_VERSION_IA = "IA_ANKI_v1";

class IAAnkiApp {
  constructor() {
    this.srsEngine = new SrsEngine(FLASHCARDS);
    this.soundFx = window.soundFx;
    this.playground = window.aiPlayground;

    // État persistant
    this.state = {
      version: STORAGE_SCHEMA_VERSION_IA,
      xp: 0,
      level: 1,
      dailyGoal: 20,
      activeModules: [1, 2, 3],
      sprintHighScore: 0,
      streakHistory: {},
      reducedMotion: false
    };

    // État de session active Anki
    this.session = {
      queue: [],
      currentIndex: 0,
      currentCard: null,
      currentQuestionFormat: null,
      isFlipped: false,
      combo: 0,
      maxSessionCombo: 0,
      sessionCardsCount: 0,
      sessionCorrectCount: 0,
      sessionXpGained: 0,
      sessionNewAcquired: []
    };

    // État Sprint 60s
    this.sprint = {
      active: false,
      timer: 60,
      intervalId: null,
      score: 0,
      currentCard: null
    };

    this.init();
  }

  init() {
    this.loadState();
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.renderCalendar30Days();
    this.renderCollectionGrid();
    this.renderFichesCourseView();
    this.updateHeaderStats();
    this.renderDailyRing();

    // Initialisation des ateliers visuels
    if (this.playground) {
      this.playground.renderTokenSimulatorUI();
      setTimeout(() => {
        this.playground.renderNeuralCanvas();
        this.playground.renderEmbeddingCanvas();
      }, 100);
    }
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_SCHEMA_VERSION_IA);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.state) this.state = Object.assign(this.state, parsed.state);
        if (parsed.srs) this.srsEngine.importData(parsed.srs);
      }
    } catch (e) {
      console.warn("Initialisation fraîche IA-Anki:", e);
    }
  }

  saveState() {
    try {
      const dataToSave = {
        state: this.state,
        srs: this.srsEngine.exportData()
      };
      localStorage.setItem(STORAGE_SCHEMA_VERSION_IA, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Erreur de sauvegarde locale:", e);
    }
  }

  // ==========================================================================
  // SYSTÈME DE POINTS, NIVEAUX & COMBOS
  // ==========================================================================

  getComboMultiplier() {
    if (this.session.combo >= 20) return 3.0;
    if (this.session.combo >= 10) return 2.5;
    if (this.session.combo >= 5) return 2.0;
    if (this.session.combo >= 3) return 1.5;
    return 1.0;
  }

  addExperience(basePoints) {
    const mult = this.getComboMultiplier();
    const pointsToAdd = Math.round(basePoints * mult);

    const oldLevel = Math.floor(this.state.xp / 500) + 1;
    this.state.xp += pointsToAdd;
    const newLevel = Math.floor(this.state.xp / 500) + 1;

    this.session.sessionXpGained += pointsToAdd;
    this.updateHeaderStats();

    if (newLevel > oldLevel) {
      this.state.level = newLevel;
      this.triggerLevelUp(newLevel);
    }

    this.saveState();
    return pointsToAdd;
  }

  triggerLevelUp(levelNum) {
    this.soundFx?.playLevelUp();
    const modal = document.getElementById('level-up-modal');
    const numDisplay = document.getElementById('level-up-num-display');
    if (modal && numDisplay) {
      numDisplay.textContent = levelNum;
      modal.classList.add('active');
      setTimeout(() => modal.classList.remove('active'), 1500);
    }
  }

  updateComboVisuals() {
    const comboEl = document.getElementById('session-combo-badge');
    const comboNum = document.getElementById('session-combo-val');
    const comboMult = document.getElementById('session-combo-mult');
    const cardWrapper = document.getElementById('flashcard-wrapper');

    if (!comboEl || !comboNum || !comboMult) return;

    comboNum.textContent = this.session.combo;
    const mult = this.getComboMultiplier();
    comboMult.textContent = `x${mult}`;

    comboEl.classList.remove('combo-tier-1', 'combo-tier-2');
    if (cardWrapper) cardWrapper.classList.remove('combo-glow');
    document.body.classList.remove('combo-pulse-active');

    if (this.session.combo >= 3) comboEl.classList.add('combo-tier-1');
    if (this.session.combo >= 5) comboEl.classList.add('combo-tier-2');
    if (this.session.combo === 10) {
      if (navigator.vibrate) navigator.vibrate(40);
      const stage = document.getElementById('card-stage');
      stage?.classList.add('screen-vibrate');
      setTimeout(() => stage?.classList.remove('screen-vibrate'), 350);
    }
    if (this.session.combo >= 20) {
      document.body.classList.add('combo-pulse-active');
    }
  }

  markTodayWorked() {
    const today = this.srsEngine.getTodayDateString();
    if (!this.state.streakHistory[today]) {
      this.state.streakHistory[today] = true;
      this.renderCalendar30Days();
      this.saveState();
    }
  }

  renderDailyRing() {
    const ringProgress = document.getElementById('ring-progress-svg');
    const ringCount = document.getElementById('ring-count-display');
    if (!ringProgress || !ringCount) return;

    this.srsEngine.checkDailyReset();
    const count = this.srsEngine.dailyCounts.reviewsCount + this.srsEngine.dailyCounts.newCardsCount;
    const goal = this.state.dailyGoal || 20;

    ringCount.textContent = `${count}/${goal}`;
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(1, count / goal);
    const offset = circumference - (progress * circumference);

    ringProgress.style.strokeDasharray = `${circumference}`;
    ringProgress.style.strokeDashoffset = `${offset}`;
  }

  renderCalendar30Days() {
    const container = document.getElementById('calendar-30d-container');
    if (!container) return;
    container.innerHTML = '';

    const todayStr = this.srsEngine.getTodayDateString();
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayNum = d.getDate();

      const cell = document.createElement('div');
      cell.className = 'cal-day-cell tabular-num';
      cell.textContent = dayNum;

      if (dStr === todayStr) cell.classList.add('today');
      if (this.state.streakHistory[dStr]) cell.classList.add('worked');

      container.appendChild(cell);
    }
  }

  renderCollectionGrid() {
    const grid = document.getElementById('collection-grid-container');
    if (!grid) return;
    grid.innerHTML = '';

    FLASHCARDS.forEach(card => {
      const tier = this.srsEngine.getCardMasteryTier(card.id);
      const state = this.srsEngine.initCardState(card.id);

      const tile = document.createElement('div');
      tile.className = `collection-tile tier-${tier}`;
      tile.setAttribute('data-card-id', card.id);

      let intervalText = "Nouvelle";
      let statusIcon = "⚪";
      if (tier === 1) {
        intervalText = "Apprentissage";
        statusIcon = "🔵";
      } else if (tier === 2) {
        intervalText = `${state.interval} j`;
        statusIcon = "🟢";
      } else if (tier === 3) {
        intervalText = `Mûre (${state.interval} j)`;
        statusIcon = "⭐";
      }

      tile.innerHTML = `
        <div class="tile-top">
          <span class="tile-module-pill">Jour ${card.ficheId}</span>
          <span class="tile-status-icon">${statusIcon}</span>
        </div>
        <div class="tile-term">${card.term}</div>
        <div class="tile-interval tabular-num">${intervalText}</div>
      `;

      tile.addEventListener('click', () => {
        this.openFicheModal(card.ficheId);
      });

      grid.appendChild(tile);
    });
  }

  // ==========================================================================
  // SESSION DE RÉVISION ANKI (SRS)
  // ==========================================================================

  startRevisionSession() {
    this.srsEngine.checkDailyReset();
    const due = this.srsEngine.getDueCards(this.state.activeModules);

    if (due.length === 0) {
      alert("Toutes vos révisions d'IA du jour sont terminées ! Vous pouvez explorer l'Atelier Interactif (Playground) ou lancer un Sprint 60s.");
      return;
    }

    this.session = {
      queue: [...due],
      currentIndex: 0,
      currentCard: null,
      currentQuestionFormat: null,
      isFlipped: false,
      combo: 0,
      maxSessionCombo: 0,
      sessionCardsCount: 0,
      sessionCorrectCount: 0,
      sessionXpGained: 0,
      sessionNewAcquired: []
    };

    this.switchView('session');
    this.presentNextCard();
  }

  presentNextCard() {
    if (this.session.currentIndex >= this.session.queue.length) {
      this.finishSession();
      return;
    }

    const card = this.session.queue[this.session.currentIndex];
    this.session.currentCard = card;
    this.session.isFlipped = false;

    const format = this.srsEngine.getQuestionFormat(card.id);
    this.session.currentQuestionFormat = format;

    const wrapper = document.getElementById('flashcard-wrapper');
    if (wrapper) {
      wrapper.className = 'flashcard-wrapper';
      if (this.session.combo >= 3) wrapper.classList.add('combo-glow');
    }

    this.renderCardFront(card, format);
    this.renderCardBack(card);

    const controlsBar = document.getElementById('review-controls-bar');
    const flipBtn = document.getElementById('btn-show-answer');
    if (controlsBar) controlsBar.style.display = 'none';
    if (flipBtn) flipBtn.style.display = 'flex';

    const counterDisplay = document.getElementById('session-card-counter');
    if (counterDisplay) {
      counterDisplay.textContent = `${this.session.currentIndex + 1} / ${this.session.queue.length}`;
    }

    this.updateComboVisuals();
  }

  renderCardFront(card, format) {
    const modTag = document.getElementById('card-module-tag');
    const badgeFormat = document.getElementById('card-badge-format');
    const questionText = document.getElementById('card-question-text');
    const interactionZone = document.getElementById('card-interaction-zone');

    const mod = MODULES.find(m => m.id === card.moduleId);

    if (modTag) modTag.textContent = mod ? mod.title : `Jour ${card.ficheId}`;
    if (badgeFormat) badgeFormat.textContent = format === 'mcq' ? "QCM (Nouvelle Notion)" : "Réponse écrite";
    if (questionText) questionText.textContent = card.question;

    if (!interactionZone) return;
    interactionZone.innerHTML = '';

    if (format === 'mcq') {
      const mcqData = this.srsEngine.generateMCQ(card);
      const grid = document.createElement('div');
      grid.className = 'mcq-options-grid';

      mcqData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'mcq-option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          this.handleMCQChoice(btn, opt, card);
        });
        grid.appendChild(btn);
      });

      interactionZone.appendChild(grid);
    } else {
      const form = document.createElement('form');
      form.className = 'written-form';
      form.innerHTML = `
        <input type="text" class="written-input" id="written-input-field" placeholder="Tapez le terme IA exact..." autocomplete="off" />
        <button type="submit" class="written-submit-btn">Valider</button>
      `;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('written-input-field');
        if (input) this.handleWrittenSubmit(input.value.trim(), card);
      });

      interactionZone.appendChild(form);
      setTimeout(() => document.getElementById('written-input-field')?.focus(), 100);
    }
  }

  renderCardBack(card) {
    const termDisplay = document.getElementById('card-term-display');
    const defBox = document.getElementById('card-definition-box');
    const exBox = document.getElementById('card-example-box');
    const diffContainer = document.getElementById('card-diff-container');

    if (termDisplay) termDisplay.textContent = card.term;
    if (defBox) defBox.textContent = card.definition;
    if (exBox) exBox.textContent = `💡 Exemple vulgarisé : ${card.example}`;
    if (diffContainer) diffContainer.innerHTML = '';
  }

  handleMCQChoice(btn, chosen, card) {
    const isCorrect = chosen === card.term;
    document.querySelectorAll('.mcq-option-btn').forEach(b => b.disabled = true);

    if (isCorrect) {
      btn.classList.add('selected-correct');
    } else {
      btn.classList.add('selected-wrong');
      document.querySelectorAll('.mcq-option-btn').forEach(b => {
        if (b.textContent === card.term) b.classList.add('selected-correct');
      });
    }

    setTimeout(() => this.flipCard(), 400);
  }

  handleWrittenSubmit(inputVal, card) {
    const result = this.srsEngine.evaluateWrittenAnswer(inputVal, card);
    const diffContainer = document.getElementById('card-diff-container');

    if (diffContainer && result.diffHighlight) {
      let html = `<div style="margin-bottom:4px; font-weight:600;">Comparaison avec le terme IA exact :</div>`;
      result.diffHighlight.forEach(w => {
        html += `<span class="diff-word ${w.matched ? 'matched' : 'diff'}">${w.text}</span> `;
      });
      diffContainer.innerHTML = html;
    }

    this.flipCard();
  }

  flipCard() {
    if (this.session.isFlipped) return;
    this.session.isFlipped = true;

    document.getElementById('flashcard-wrapper')?.classList.add('is-flipped');
    const controlsBar = document.getElementById('review-controls-bar');
    const flipBtn = document.getElementById('btn-show-answer');
    if (controlsBar) controlsBar.style.display = 'grid';
    if (flipBtn) flipBtn.style.display = 'none';

    this.updateSRSButtonsIntervals(this.session.currentCard.id);
  }

  updateSRSButtonsIntervals(cardId) {
    const state = this.srsEngine.initCardState(cardId);
    const encoreEl = document.getElementById('srs-interval-encore');
    const diffEl = document.getElementById('srs-interval-difficile');
    const corrEl = document.getElementById('srs-interval-correct');
    const facEl = document.getElementById('srs-interval-facile');

    if (state.learningStep < 2 || state.relearning) {
      if (encoreEl) encoreEl.textContent = "1 min";
      if (diffEl) diffEl.textContent = "5 min";
      if (corrEl) corrEl.textContent = state.learningStep === 0 ? "10 min" : "1 j";
      if (facEl) facEl.textContent = "4 j";
    } else {
      if (encoreEl) encoreEl.textContent = "10 min";
      if (diffEl) diffEl.textContent = `${Math.max(1, Math.round(state.interval * 1.2))} j`;
      const corrDays = Math.max(1, Math.round(state.interval * state.easeFactor));
      if (corrEl) corrEl.textContent = `${corrDays} j`;
      const facDays = Math.max(1, Math.round(state.interval * state.easeFactor * 1.3));
      if (facEl) facEl.textContent = `${facDays} j`;
    }
  }

  handleRating(rating) {
    if (!this.session.isFlipped || !this.session.currentCard) return;

    const card = this.session.currentCard;
    const cardWrapper = document.getElementById('flashcard-wrapper');
    const isSuccess = rating >= 2;

    this.session.sessionCardsCount += 1;
    this.markTodayWorked();

    const { state } = this.srsEngine.rateCard(card.id, rating);

    if (isSuccess) {
      this.soundFx?.playCorrect();
      this.session.sessionCorrectCount += 1;
      this.session.combo += 1;
      if (this.session.combo > this.session.maxSessionCombo) {
        this.session.maxSessionCombo = this.session.combo;
      }
      this.addExperience(10);

      if (state.interval >= 1 && !this.session.sessionNewAcquired.includes(card.term)) {
        this.session.sessionNewAcquired.push(card.term);
      }
      cardWrapper?.classList.add('exit-correct');
    } else {
      this.soundFx?.playWrong();
      this.session.combo = 0;
      this.session.queue.push(card);
      cardWrapper?.classList.add('shake-wrong');
    }

    this.updateComboVisuals();
    this.renderDailyRing();
    this.saveState();

    setTimeout(() => {
      this.session.currentIndex += 1;
      this.presentNextCard();
    }, 450);
  }

  finishSession() {
    this.switchView('summary');

    const totalSeen = this.session.sessionCardsCount;
    const successRate = totalSeen > 0 ? Math.round((this.session.sessionCorrectCount / totalSeen) * 100) : 100;
    const points = this.session.sessionXpGained;
    const maxCombo = this.session.maxSessionCombo;

    this.animateRollingCounter(document.getElementById('sum-cards-seen'), totalSeen, 800);
    this.animateRollingCounter(document.getElementById('sum-success-rate'), successRate, 1000, "%");
    this.animateRollingCounter(document.getElementById('sum-points-gained'), points, 1200);
    this.animateRollingCounter(document.getElementById('sum-longest-combo'), maxCombo, 800);

    const acquiredList = document.getElementById('sum-new-acquired-pills');
    if (acquiredList) {
      acquiredList.innerHTML = '';
      if (this.session.sessionNewAcquired.length === 0) {
        acquiredList.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted)">Aucune nouvelle notion consolidée dans cette session.</span>`;
      } else {
        this.session.sessionNewAcquired.forEach(term => {
          const pill = document.createElement('span');
          pill.className = 'new-pill';
          pill.textContent = term;
          acquiredList.appendChild(pill);
        });
      }
    }

    this.renderCollectionGrid();
  }

  animateRollingCounter(element, targetVal, duration = 1000, suffix = "") {
    if (!element) return;
    const startTime = performance.now();
    const step = (curTime) => {
      const elapsed = curTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(targetVal * easeOut);
      element.textContent = `${current}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
      else element.textContent = `${targetVal}${suffix}`;
    };
    requestAnimationFrame(step);
  }

  // ==========================================================================
  // MODE SPRINT (60 SECONDES)
  // ==========================================================================

  startSprint() {
    this.sprint = {
      active: true,
      timer: 60,
      intervalId: null,
      score: 0,
      currentCard: null
    };

    this.switchView('sprint');
    this.updateSprintHUD();

    this.sprint.intervalId = setInterval(() => {
      this.sprint.timer -= 1;
      this.updateSprintHUD();

      if (this.sprint.timer <= 5 && this.sprint.timer > 0) {
        this.soundFx?.playSprintTick();
      }
      if (this.sprint.timer <= 0) {
        this.finishSprint();
      }
    }, 1000);

    this.nextSprintQuestion();
  }

  nextSprintQuestion() {
    if (!this.sprint.active) return;
    const card = FLASHCARDS[Math.floor(Math.random() * FLASHCARDS.length)];
    this.sprint.currentCard = card;

    const qEl = document.getElementById('sprint-question-text');
    const optGrid = document.getElementById('sprint-options-grid');
    if (qEl) qEl.textContent = card.question;
    if (!optGrid) return;
    optGrid.innerHTML = '';

    const mcq = this.srsEngine.generateMCQ(card);
    mcq.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'mcq-option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if (!this.sprint.active) return;
        if (opt === card.term) {
          btn.classList.add('selected-correct');
          this.soundFx?.playCorrect();
          this.sprint.score += 100;
          this.addExperience(15);
        } else {
          btn.classList.add('selected-wrong');
          this.soundFx?.playWrong();
        }
        this.updateSprintHUD();
        setTimeout(() => this.nextSprintQuestion(), 250);
      });
      optGrid.appendChild(btn);
    });
  }

  updateSprintHUD() {
    const timerEl = document.getElementById('sprint-timer-val');
    const scoreEl = document.getElementById('sprint-score-val');
    const highEl = document.getElementById('sprint-high-score');

    if (timerEl) {
      timerEl.textContent = `${this.sprint.timer}s`;
      timerEl.classList.toggle('urgent', this.sprint.timer <= 10);
    }
    if (scoreEl) scoreEl.textContent = this.sprint.score;
    if (highEl) highEl.textContent = this.state.sprintHighScore;
  }

  finishSprint() {
    this.sprint.active = false;
    clearInterval(this.sprint.intervalId);
    if (this.sprint.score > this.state.sprintHighScore) {
      this.state.sprintHighScore = this.sprint.score;
      this.saveState();
    }
    alert(`⏱️ Sprint IA terminé !\nScore : ${this.sprint.score} pts.\nRecord : ${this.state.sprintHighScore} pts.`);
    this.switchView('collection');
  }

  // ==========================================================================
  // LES 15 FICHES DE COURS
  // ==========================================================================

  renderFichesCourseView() {
    const container = document.getElementById('fiches-accordion-container');
    if (!container) return;
    container.innerHTML = '';

    FICHES.forEach(fiche => {
      const item = document.createElement('div');
      item.className = 'fiche-card-item';
      item.id = `fiche-item-${fiche.id}`;

      item.innerHTML = `
        <button class="fiche-header-btn">
          <div class="fiche-header-title">
            <span class="fiche-num-badge">J${fiche.day}</span>
            <div>
              <strong>Jour ${fiche.day} : ${fiche.title}</strong>
              <div style="font-size:0.75rem; color:var(--text-muted)">Module ${fiche.moduleId} • ${fiche.notionCle}</div>
            </div>
          </div>
          <span style="font-size:1.1rem; color:var(--text-muted)">▾</span>
        </button>
        <div class="fiche-content-body">
          <div class="fiche-block-section">
            <div class="fiche-block-title">📖 Résumé vulgarisé</div>
            <div class="fiche-block-text">${fiche.summary}</div>
          </div>
          <div class="fiche-block-section">
            <div class="fiche-block-title">💡 Image du quotidien</div>
            <div class="fiche-block-text">${fiche.dailyExample}</div>
          </div>
          <div class="fiche-block-section" style="background:rgba(56,189,248,0.08); padding:10px; border-radius:6px;">
            <div class="fiche-block-title" style="color:var(--accent-cyan);">🎯 L'essentiel à retenir</div>
            <div class="fiche-block-text" style="color:#FFF;">${fiche.takeaway}</div>
          </div>
        </div>
      `;

      item.querySelector('.fiche-header-btn').addEventListener('click', () => {
        item.classList.toggle('open');
      });

      container.appendChild(item);
    });
  }

  openFicheModal(ficheId) {
    this.switchView('fiches');
    const target = document.getElementById(`fiche-item-${ficheId}`);
    if (target) {
      target.classList.add('open');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // ==========================================================================
  // NAVIGATION & ÉVÉNEMENTS
  // ==========================================================================

  switchView(viewName) {
    if (this.sprint.active && viewName !== 'sprint') {
      clearInterval(this.sprint.intervalId);
      this.sprint.active = false;
    }

    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));

    document.getElementById(`view-${viewName}`)?.classList.add('active');
    document.getElementById(`tab-${viewName}`)?.classList.add('active');

    if (viewName === 'playground') {
      setTimeout(() => {
        this.playground?.renderNeuralCanvas();
        this.playground?.renderEmbeddingCanvas();
      }, 50);
    } else if (viewName === 'collection') {
      this.renderCollectionGrid();
      this.renderDailyRing();
      this.renderCalendar30Days();
    }
  }

  updateHeaderStats() {
    const xpEl = document.getElementById('header-xp-val');
    const levelEl = document.getElementById('header-level-val');

    if (xpEl) xpEl.textContent = this.state.xp;
    if (levelEl) levelEl.textContent = `Niv. ${this.state.level}`;
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      const activeSection = document.querySelector('.view-section.active');
      if (!activeSection) return;
      if (document.getElementById('settings-modal')?.classList.contains('open')) return;

      if (activeSection.id === 'view-session') {
        const inputField = document.getElementById('written-input-field');
        const isTyping = document.activeElement === inputField;

        if (e.code === 'Space' && !isTyping) {
          e.preventDefault();
          if (!this.session.isFlipped) this.flipCard();
          return;
        }

        if (this.session.isFlipped && !isTyping) {
          if (e.key === '1') { e.preventDefault(); this.handleRating(1); }
          else if (e.key === '2') { e.preventDefault(); this.handleRating(2); }
          else if (e.key === '3') { e.preventDefault(); this.handleRating(3); }
          else if (e.key === '4') { e.preventDefault(); this.handleRating(4); }
        }
      }
    });
  }

  setupEventListeners() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchView(tab.getAttribute('data-view'));
      });
    });

    document.getElementById('btn-start-revision')?.addEventListener('click', () => this.startRevisionSession());
    document.getElementById('btn-start-sprint')?.addEventListener('click', () => this.startSprint());

    document.getElementById('btn-show-answer')?.addEventListener('click', () => this.flipCard());
    document.getElementById('btn-srs-encore')?.addEventListener('click', () => this.handleRating(1));
    document.getElementById('btn-srs-difficile')?.addEventListener('click', () => this.handleRating(2));
    document.getElementById('btn-srs-correct')?.addEventListener('click', () => this.handleRating(3));
    document.getElementById('btn-srs-facile')?.addEventListener('click', () => this.handleRating(4));

    document.getElementById('btn-summary-home')?.addEventListener('click', () => this.switchView('collection'));

    const soundBtn = document.getElementById('btn-toggle-sound');
    soundBtn?.addEventListener('click', () => {
      const muted = this.soundFx?.toggleMute();
      soundBtn.textContent = muted ? '🔇' : '🔊';
    });

    document.getElementById('btn-open-settings')?.addEventListener('click', () => {
      document.getElementById('settings-modal')?.classList.add('open');
    });
    document.getElementById('btn-close-settings')?.addEventListener('click', () => {
      document.getElementById('settings-modal')?.classList.remove('open');
    });

    // Événements Atelier Interactif
    document.getElementById('token-input-field')?.addEventListener('input', (e) => {
      if (this.playground) {
        this.playground.currentPhrase = e.target.value;
        this.playground.renderTokenSimulatorUI();
      }
    });

    document.getElementById('token-temp-slider')?.addEventListener('input', (e) => {
      if (this.playground) {
        this.playground.temperature = parseFloat(e.target.value);
        this.playground.renderTokenSimulatorUI();
      }
    });

    document.getElementById('btn-pulse-neuron')?.addEventListener('click', () => {
      if (this.playground) {
        // Aléatorise les valeurs d'activation pour simuler un traitement d'image
        this.playground.neuralLayers[0].activeValues = [Math.random(), Math.random(), Math.random()];
        this.playground.neuralLayers[1].activeValues = [Math.random(), Math.random(), Math.random(), Math.random()];
        const isCat = Math.random() > 0.5;
        this.playground.neuralLayers[2].activeValues = isCat ? [0.92, 0.08] : [0.15, 0.85];
        this.soundFx?.playCorrect();
        this.playground.renderNeuralCanvas();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new IAAnkiApp();
});
