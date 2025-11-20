
class SoundService {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      // Cross-browser compatibility
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }
    return this.audioContext;
  }

  private async ensureContext() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx;
  }

  async playCorrect() {
    try {
      const ctx = await this.ensureContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      const now = ctx.currentTime;
      
      // High ping (C5 -> C6)
      osc.frequency.setValueAtTime(523.25, now); 
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.1); 
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  }

  async playIncorrect() {
    try {
      const ctx = await this.ensureContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      
      // Low buzz
      osc.frequency.setValueAtTime(150, now); 
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  }

  async playWin() {
    try {
      const ctx = await this.ensureContext();
      const now = ctx.currentTime;
      const volume = 0.1;

      // Major arpeggio (C E G C)
      const notes = [523.25, 659.25, 783.99, 1046.50]; 
      
      notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = 'triangle';
          osc.frequency.value = freq;
          
          const startTime = now + (i * 0.1);
          gain.gain.setValueAtTime(volume, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
          
          osc.start(startTime);
          osc.stop(startTime + 0.4);
      });
    } catch (e) {
      console.error("Audio play failed", e);
    }
  }

  async playLoss() {
    try {
      const ctx = await this.ensureContext();
      const now = ctx.currentTime;
      const volume = 0.1;

      // Descending sequence
      const notes = [440, 415.30, 392, 349.23]; 
      
      notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = 'square'; // harsher sound
          osc.frequency.value = freq;
          
          const startTime = now + (i * 0.2);
          gain.gain.setValueAtTime(volume * 0.5, startTime);
          gain.gain.linearRampToValueAtTime(0.001, startTime + 0.4);
          
          osc.start(startTime);
          osc.stop(startTime + 0.4);
      });
    } catch (e) {
      console.error("Audio play failed", e);
    }
  }
}

export const soundService = new SoundService();
