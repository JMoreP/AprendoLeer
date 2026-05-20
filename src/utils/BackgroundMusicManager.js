/**
 * BackgroundMusicManager
 * A robust singleton to ensure only ONE instance of the background music exists.
 * This prevents duplicate audio and provides explicit play/pause controls.
 */
class BackgroundMusicManager {
  constructor() {
    this.audio = null;
    this.src = '/bg-music.mp3';
    this.isInitialized = false;
  }

  // Initialize the audio instance ONLY once
  init() {
    if (this.isInitialized) return;
    
    this.audio = new Audio(this.src);
    this.audio.loop = true;
    this.audio.volume = 0.4;
    
    // We attach it to window just for debugging/HMR visibility
    if (typeof window !== 'undefined') {
      window.__MASTER_BG_MUSIC__ = this.audio;
    }
    
    this.isInitialized = true;
    console.log("BackgroundMusicManager: Initialized");
  }

  async play() {
    if (!this.audio) this.init();
    
    try {
      if (this.audio.paused) {
        await this.audio.play();
        console.log("BackgroundMusicManager: Playing");
      }
    } catch (err) {
      // Ignored: browser probably blocked autoplay
    }
  }

  pause() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      console.log("BackgroundMusicManager: Paused");
    }
  }

  isPaused() {
    return this.audio ? this.audio.paused : true;
  }

  // A hard stop just in case
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }
}

// Export a single instance
const manager = new BackgroundMusicManager();
export default manager;
