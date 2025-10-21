/**
 * Audio Manager for Gamex
 * Uses Web Audio API to generate sound effects
 */

class GameAudio {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.isEnabled = true;

        this.initAudioContext();
    }

    /**
     * Initialize Audio Context
     */
    initAudioContext() {
        try {
            // Create audio context (handle vendor prefixes)
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();

            // Create master gain node for volume control
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3; // 30% volume
            this.masterGain.connect(this.audioContext.destination);
        } catch (error) {
            console.error('Web Audio API not supported:', error);
            this.isEnabled = false;
        }
    }

    /**
     * Resume audio context (needed for user interaction)
     */
    async resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    /**
     * Play sound effect based on type
     */
    async playSound(type) {
        if (!this.isEnabled) return;

        await this.resumeContext();

        switch (type) {
            case 'love':
                this.playLoveSound();
                break;
            case 'friendship':
                this.playFriendshipSound();
                break;
            case 'sex':
                this.playSexSound();
                break;
            case 'bingo':
                this.playBingoSound();
                break;
            case 'replay':
                this.playReplaySound();
                break;
            case 'chime':
                this.playChime();
                break;
            default:
                console.warn('Unknown sound type:', type);
        }
    }

    /**
     * Love Sound: Soft hum in low tone
     */
    playLoveSound() {
        const now = this.audioContext.currentTime;

        // Create oscillator
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now); // A3 note

        // Envelope
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.8);
    }

    /**
     * Friendship Sound: Warm chime
     */
    playFriendshipSound() {
        const now = this.audioContext.currentTime;

        // Create multiple oscillators for harmonic chime
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (major chord)

        frequencies.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            // Staggered envelope
            const delay = index * 0.05;
            gain.gain.setValueAtTime(0, now + delay);
            gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.6);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now + delay);
            osc.stop(now + delay + 0.6);
        });
    }

    /**
     * Sex Sound: Deep rhythmic beat
     */
    playSexSound() {
        const now = this.audioContext.currentTime;

        // Create bass pulse
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now); // A2 note

        // Pulsing envelope
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        gain.gain.setValueAtTime(0, now + 0.2);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.23);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    /**
     * Bingo Sound: Ascending melodic tone
     */
    playBingoSound() {
        const now = this.audioContext.currentTime;

        // Ascending scale: C5, E5, G5, C6
        const melody = [523.25, 659.25, 783.99, 1046.50];

        melody.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            const startTime = now + index * 0.15;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });

        // Add reverb-like effect with delayed echo
        setTimeout(() => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1046.50, this.audioContext.currentTime);

            gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start();
            osc.stop(this.audioContext.currentTime + 0.5);
        }, 200);
    }

    /**
     * Replay Sound: Low reverb fade
     */
    playReplaySound() {
        const now = this.audioContext.currentTime;

        // Descending tone with reverb
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.8); // Down to A3

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.8);
    }

    /**
     * Generic Chime: UI feedback
     */
    playChime() {
        const now = this.audioContext.currentTime;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now); // A5 note

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Play tap feedback
     */
    playTap() {
        if (!this.isEnabled) return;

        const now = this.audioContext.currentTime;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    /**
     * Set master volume
     */
    setVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, value));
        }
    }

    /**
     * Mute/unmute
     */
    setMuted(muted) {
        this.isEnabled = !muted;
        if (this.masterGain) {
            this.masterGain.gain.value = muted ? 0 : 0.3;
        }
    }

    /**
     * Get current volume
     */
    getVolume() {
        return this.masterGain ? this.masterGain.gain.value : 0;
    }

    /**
     * Check if audio is enabled
     */
    isAudioEnabled() {
        return this.isEnabled && this.audioContext !== null;
    }

    /**
     * Create ambient background tone (optional)
     */
    playAmbient() {
        if (!this.isEnabled) return;

        const now = this.audioContext.currentTime;

        // Very subtle ambient drone
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(110, now); // A2

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(165, now); // E3

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.02, now + 2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);

        osc1.start(now);
        osc2.start(now);

        // Return stop function
        return () => {
            const stopTime = this.audioContext.currentTime;
            gain.gain.linearRampToValueAtTime(0, stopTime + 1);
            osc1.stop(stopTime + 1);
            osc2.stop(stopTime + 1);
        };
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}
