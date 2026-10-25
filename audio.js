/**
 * GESTIONNAIRE AUDIO SYNTHÉTIQUE (WEB AUDIO API)
 * 
 * Génère tous les sons en temps réel via l'API Web Audio du navigateur.
 * Aucun fichier audio externe requis.
 * Sons prévus :
 * - Bonne réponse : note montante claire et satisfaisante
 * - Erreur : son mat et discret (non punitif)
 * - Passage de niveau : arpège ascendant triomphant
 * - Tic de compte à rebours : clic discret pour les dernières secondes de sprint
 */

class SoundEffects {
  constructor() {
    this.audioCtx = null;
    this.isMuted = localStorage.getItem('ECONO_AUDIO_MUTED') === 'true';
  }

  // Initialisation à la première interaction utilisateur (politique autoplay des navigateurs)
  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('ECONO_AUDIO_MUTED', this.isMuted ? 'true' : 'false');
    return this.isMuted;
  }

  // Son de bonne réponse : carillon bicolore ascendant (Do5 -> Mi5)
  playCorrect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const playNote = (freq, start, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    };

    playNote(523.25, now, 0.18); // Do5 (C5)
    playNote(659.25, now + 0.09, 0.28); // Mi5 (E5)
  }

  // Son d'erreur : son mat, feutré et court (non agressif)
  playWrong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.17);
  }

  // Passage de niveau : arpège ascendant Do5-Mi5-Sol5-Do6
  playLevelUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.001, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.22, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.42);
    });
  }

  // Clic discret pour compte à rebours
  playSprintTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

// Instance globale
window.soundFx = new SoundEffects();
