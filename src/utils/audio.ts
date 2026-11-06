// Offline Web Audio API Synthesizer for Focus Ambience
class AmbientAudioEngine {
  private audioCtx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private currentMode: 'rain' | 'whitenoise' | 'library' | 'none' = 'none';

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public play(mode: 'rain' | 'whitenoise' | 'library' | 'none') {
    this.stop();
    if (mode === 'none') {
      this.currentMode = 'none';
      return;
    }

    try {
      this.initContext();
      if (!this.audioCtx) return;

      const bufferSize = this.audioCtx.sampleRate * 2;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate soft pink/brown filtered noise
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const noiseSource = this.audioCtx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filter based on ambient style
      const filter = this.audioCtx.createBiquadFilter();
      if (mode === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 650; // soft rain muffled feel
      } else if (mode === 'whitenoise') {
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 0.8;
      } else {
        // library low hum
        filter.type = 'lowpass';
        filter.frequency.value = 350;
      }

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.08, this.audioCtx.currentTime + 0.8);

      noiseSource.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      noiseSource.start();
      this.noiseNode = noiseSource;
      this.currentMode = mode;
    } catch {
      // Audio autoplay policy or unavailable
    }
  }

  public stop() {
    if (this.gainNode && this.audioCtx) {
      try {
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.audioCtx.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);
        setTimeout(() => {
          if (this.noiseNode) {
            try {
              (this.noiseNode as AudioBufferSourceNode).stop();
              this.noiseNode.disconnect();
            } catch {
              // ignore
            }
            this.noiseNode = null;
          }
        }, 320);
      } catch {
        // ignore
      }
    }
    this.currentMode = 'none';
  }

  public getMode() {
    return this.currentMode;
  }
}

export const ambientAudio = new AmbientAudioEngine();
