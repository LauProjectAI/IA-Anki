/**
 * ATELIER INTERACTIF D'APPRENTISSAGE DE L'IA (AI PLAYGROUND)
 * 
 * Permet d'expérimenter de façon concrète et visuelle les mécanismes fondamentaux :
 * 1. Simulateur de Prédiction de Token (LLM & Température)
 * 2. Visualiseur interactif de Réseau de Neurones (Propagation & Poids)
 * 3. Carte géométrique des Embeddings 2D (Similarité sémantique)
 */

class AIPlayground {
  constructor() {
    this.initTokenSimulator();
    this.initNeuralVisualizer();
    this.initEmbeddingMap();
  }

  // ==========================================================================
  // 1. SIMULATEUR DE PRÉDICTION DE TOKEN (LLM)
  // ==========================================================================

  initTokenSimulator() {
    // Dictionnaire de prédictions probabilistes pour des phrases typiques
    this.tokenCorpus = {
      "le ciel est": [
        { token: "bleu", prob: 0.62 },
        { token: "couvert", prob: 0.18 },
        { token: "gris", prob: 0.12 },
        { token: "sombre", prob: 0.08 }
      ],
      "l'intelligence artificielle permet de": [
        { token: "gagner", prob: 0.44 },
        { token: "créer", prob: 0.28 },
        { token: "résoudre", prob: 0.18 },
        { token: "comprendre", prob: 0.10 }
      ],
      "pour apprendre à programmer il faut": [
        { token: "pratiquer", prob: 0.55 },
        { token: "comprendre", prob: 0.22 },
        { token: "être", prob: 0.13 },
        { token: "lire", prob: 0.10 }
      ],
      "la capitale de la france est": [
        { token: "Paris", prob: 0.94 },
        { token: "une", prob: 0.03 },
        { token: "située", prob: 0.02 },
        { token: "la", prob: 0.01 }
      ]
    };

    this.currentPhrase = "Le ciel est";
    this.temperature = 0.7;
  }

  getPredictions(phrase) {
    const clean = phrase.toLowerCase().trim();
    // Recherche de correspondance exacte ou approchée
    for (const [key, candidates] of Object.entries(this.tokenCorpus)) {
      if (clean.endsWith(key) || clean === key) {
        return this.applyTemperature(candidates, this.temperature);
      }
    }

    // Prédiction générique intelligente si la phrase n'est pas dans le dictionnaire fixe
    return this.applyTemperature([
      { token: "très", prob: 0.40 },
      { token: "un", prob: 0.25 },
      { token: "facilement", prob: 0.20 },
      { token: "souvent", prob: 0.15 }
    ], this.temperature);
  }

  applyTemperature(candidates, temp) {
    // Softmax avec température : T basse = prévisible / T haute = créatif/dispersé
    const scaled = candidates.map(c => ({
      token: c.token,
      score: Math.exp(Math.log(c.prob + 0.001) / Math.max(0.1, temp))
    }));

    const sum = scaled.reduce((acc, curr) => acc + curr.score, 0);
    return scaled.map(s => ({
      token: s.token,
      prob: Math.round((s.score / sum) * 100)
    })).sort((a, b) => b.prob - a.prob);
  }

  renderTokenSimulatorUI() {
    const inputEl = document.getElementById('token-input-field');
    const tempSlider = document.getElementById('token-temp-slider');
    const tempVal = document.getElementById('token-temp-value');
    const candidatesContainer = document.getElementById('token-candidates-list');

    if (!inputEl || !candidatesContainer) return;

    inputEl.value = this.currentPhrase;
    if (tempVal) tempVal.textContent = this.temperature.toFixed(1);

    const predictions = this.getPredictions(this.currentPhrase);
    candidatesContainer.innerHTML = '';

    predictions.forEach(p => {
      const row = document.createElement('div');
      row.className = 'token-candidate-row';
      row.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
          <span>Token : <strong>« ${p.token} »</strong></span>
          <span class="tabular-num" style="color:var(--accent-amber); font-weight:700;">${p.prob} %</span>
        </div>
        <div style="width:100%; height:8px; background:var(--bg-slate-input); border-radius:999px; overflow:hidden;">
          <div style="width:${p.prob}%; height:100%; background:var(--accent-amber); border-radius:999px;"></div>
        </div>
      `;

      row.addEventListener('click', () => {
        this.currentPhrase += " " + p.token;
        inputEl.value = this.currentPhrase;
        this.renderTokenSimulatorUI();
      });

      candidatesContainer.appendChild(row);
    });
  }

  // ==========================================================================
  // 2. VISUALISEUR DE RÉSEAU DE NEURONES (CANVAS)
  // ==========================================================================

  initNeuralVisualizer() {
    this.neuralLayers = [
      { name: "Entrées (Features)", nodes: ["Forme", "Texture", "Couleur"], activeValues: [0.9, 0.4, 0.8] },
      { name: "Couche Cachée", nodes: ["Bords", "Motifs", "Parties", "Contraste"], activeValues: [0.7, 0.85, 0.3, 0.6] },
      { name: "Sorties (Prédiction)", nodes: ["Chat 🐱", "Chien 🐶"], activeValues: [0.88, 0.12] }
    ];
    this.animationStep = 0;
  }

  renderNeuralCanvas() {
    const canvas = document.getElementById('neural-net-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 450;
    const h = rect.height || 260;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const layerCoords = [];

    // Coordonnées de chaque neurone
    const numLayers = this.neuralLayers.length;
    for (let l = 0; l < numLayers; l++) {
      const layer = this.neuralLayers[l];
      const x = 60 + (l / (numLayers - 1)) * (w - 120);
      const coords = [];

      for (let n = 0; n < layer.nodes.length; n++) {
        const y = 45 + (n + 0.5) * ((h - 70) / layer.nodes.length);
        coords.push({ x, y, label: layer.nodes[n], value: layer.activeValues[n] });
      }
      layerCoords.push(coords);
    }

    // Tracé des connexions (Synapses pondérées)
    for (let l = 0; l < layerCoords.length - 1; l++) {
      const currentCoords = layerCoords[l];
      const nextCoords = layerCoords[l + 1];

      for (const c1 of currentCoords) {
        for (const c2 of nextCoords) {
          ctx.beginPath();
          ctx.moveTo(c1.x, c1.y);
          ctx.lineTo(c2.x, c2.y);
          const intensity = Math.min(1, Math.max(0.1, (c1.value + c2.value) / 2));
          ctx.strokeStyle = `rgba(255, 182, 39, ${intensity * 0.4})`;
          ctx.lineWidth = intensity * 2.5;
          ctx.stroke();
        }
      }
    }

    // Tracé des nœuds (Neurones)
    for (let l = 0; l < layerCoords.length; l++) {
      for (const node of layerCoords[l]) {
        // Cercle du neurone
        ctx.beginPath();
        ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = "#161B22";
        ctx.fill();

        ctx.strokeStyle = node.value > 0.5 ? "#FFB627" : "#30363D";
        ctx.lineWidth = node.value > 0.5 ? 2.5 : 1;
        ctx.stroke();

        // Remplissage d'activation
        ctx.beginPath();
        ctx.arc(node.x, node.y, 11 * node.value, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 182, 39, ${node.value * 0.8})`;
        ctx.fill();

        // Texte / Libellé
        ctx.fillStyle = "#F0F6FC";
        ctx.font = "10px Inter";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y - 18);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.font = "9px Space Grotesk";
        ctx.fillText(`${Math.round(node.value * 100)}%`, node.x, node.y + 26);
      }
    }
  }

  // ==========================================================================
  // 3. CARTE GÉOMÉTRIQUE DES EMBEDDINGS 2D (ESPACE SÉMANTIQUE)
  // ==========================================================================

  initEmbeddingMap() {
    this.embeddingPoints = [
      // Cluster Animaux (Vert)
      { word: "Chien", x: 70, y: 75, category: "Animaux", color: "#34D399" },
      { word: "Loup", x: 90, y: 65, category: "Animaux", color: "#34D399" },
      { word: "Chat", x: 80, y: 100, category: "Animaux", color: "#34D399" },
      { word: "Lion", x: 105, y: 95, category: "Animaux", color: "#34D399" },

      // Cluster Véhicules (Bleu)
      { word: "Voiture", x: 260, y: 60, category: "Véhicules", color: "#60A5FA" },
      { word: "Vélo", x: 240, y: 80, category: "Véhicules", color: "#60A5FA" },
      { word: "Train", x: 285, y: 85, category: "Véhicules", color: "#60A5FA" },
      { word: "Avion", x: 300, y: 50, category: "Véhicules", color: "#60A5FA" },

      // Cluster Fruits (Ambre)
      { word: "Pomme", x: 100, y: 190, category: "Fruits", color: "#FFB627" },
      { word: "Banane", x: 80, y: 210, category: "Fruits", color: "#FFB627" },
      { word: "Fraise", x: 120, y: 205, category: "Fruits", color: "#FFB627" },
      { word: "Orange", x: 110, y: 230, category: "Fruits", color: "#FFB627" },

      // Cluster Technologie (Violet)
      { word: "Ordinateur", x: 260, y: 190, category: "Technologie", color: "#A78BFA" },
      { word: "Algorithme", x: 285, y: 215, category: "Technologie", color: "#A78BFA" },
      { word: "Robot", x: 240, y: 220, category: "Technologie", color: "#A78BFA" },
      { word: "Processeur", x: 290, y: 180, category: "Technologie", color: "#A78BFA" }
    ];

    this.selectedWord1 = "Chien";
    this.selectedWord2 = "Loup";
  }

  renderEmbeddingCanvas() {
    const canvas = document.getElementById('embedding-space-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 380;
    const h = rect.height || 260;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    // Grille d'arrière-plan vectorielle
    ctx.strokeStyle = "#161B22";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const p1 = this.embeddingPoints.find(p => p.word === this.selectedWord1);
    const p2 = this.embeddingPoints.find(p => p.word === this.selectedWord2);

    // Ligne de distance sémantique entre les deux mots sélectionnés
    if (p1 && p2) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = "rgba(255, 182, 39, 0.6)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Dessin des points de mots
    this.embeddingPoints.forEach(p => {
      const isSelected = p.word === this.selectedWord1 || p.word === this.selectedWord2;

      ctx.beginPath();
      ctx.arc(p.x, p.y, isSelected ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = isSelected ? "#FFFFFF" : "#8B949E";
      ctx.font = isSelected ? "bold 11px Inter" : "10px Inter";
      ctx.textAlign = "center";
      ctx.fillText(p.word, p.x, p.y - 10);
    });

    // Mise à jour du calcul de distance
    this.updateEmbeddingDistanceUI();
  }

  updateEmbeddingDistanceUI() {
    const distEl = document.getElementById('embedding-similarity-val');
    const descEl = document.getElementById('embedding-similarity-desc');
    if (!distEl || !descEl) return;

    const p1 = this.embeddingPoints.find(p => p.word === this.selectedWord1);
    const p2 = this.embeddingPoints.find(p => p.word === this.selectedWord2);

    if (p1 && p2) {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const similarity = Math.max(5, Math.round(100 - (dist / 300) * 100));

      distEl.textContent = `${similarity} %`;
      distEl.style.color = similarity > 70 ? "var(--state-success)" : (similarity > 40 ? "var(--accent-amber)" : "var(--state-danger)");
      descEl.textContent = `Proximité sémantique entre « ${p1.word} » et « ${p2.word} » dans l'espace vectoriel.`;
    }
  }
}

window.aiPlayground = new AIPlayground();
