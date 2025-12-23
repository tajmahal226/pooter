class FartApp {
    constructor() {
        this.fartButton = document.getElementById('fartButton');
        this.soundWaves = document.getElementById('soundWaves');
        this.cushionShape = document.querySelector('.cushion-shape');
        this.audioElements = [];
        this.currentAudio = null;
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        // Collect all audio elements
        for (let i = 1; i <= 5; i++) {
            const audio = document.getElementById(`fartSound${i}`);
            if (audio) {
                this.audioElements.push(audio);
                // Set volume to 70% to prevent distortion
                audio.volume = 0.7;
                // Reset audio when it ends
                audio.addEventListener('ended', () => {
                    this.onSoundEnd();
                });
            }
        }
        
        // Add event listeners
        this.fartButton.addEventListener('click', () => this.playFart());
        this.fartButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.playFart();
        });
        
        // Add visual feedback for button press
        this.fartButton.addEventListener('mousedown', () => this.buttonPress());
        this.fartButton.addEventListener('mouseup', () => this.buttonRelease());
        this.fartButton.addEventListener('touchstart', () => this.buttonPress());
        this.fartButton.addEventListener('touchend', () => this.buttonRelease());
        
        // Prevent context menu on long press
        this.fartButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        console.log('Fart App initialized with', this.audioElements.length, 'sound effects');
    }
    
    playFart() {
        // Prevent multiple sounds playing at once
        if (this.isPlaying) {
            return;
        }
        
        // Stop any currently playing audio
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
        }
        
        // Select random sound
        const randomIndex = Math.floor(Math.random() * this.audioElements.length);
        const selectedAudio = this.audioElements[randomIndex];
        
        try {
            // Play the sound
            selectedAudio.currentTime = 0;
            selectedAudio.play().then(() => {
                this.isPlaying = true;
                this.currentAudio = selectedAudio;
                this.showSoundWaves();
                this.addRippleEffect();
                console.log(`Playing fart sound ${randomIndex + 1}`);
            }).catch(error => {
                console.error('Error playing sound:', error);
                this.isPlaying = false;
            });
        } catch (error) {
            console.error('Error playing sound:', error);
            this.isPlaying = false;
        }
    }
    
    onSoundEnd() {
        this.isPlaying = false;
        this.currentAudio = null;
        this.hideSoundWaves();
        console.log('Fart sound ended');
    }
    
    showSoundWaves() {
        this.soundWaves.classList.add('active');
    }
    
    hideSoundWaves() {
        this.soundWaves.classList.remove('active');
    }
    
    buttonPress() {
        this.fartButton.classList.add('pressed');
        this.cushionShape.style.transform = 'scale(0.92)';
    }
    
    buttonRelease() {
        this.fartButton.classList.remove('pressed');
        this.cushionShape.style.transform = 'scale(1)';
    }
    
    addRippleEffect() {
        // Remove existing ripple
        this.cushionShape.classList.remove('ripple');
        
        // Force reflow to restart animation
        void this.cushionShape.offsetWidth;
        
        // Add ripple class
        this.cushionShape.classList.add('ripple');
        
        // Remove ripple class after animation
        setTimeout(() => {
            this.cushionShape.classList.remove('ripple');
        }, 600);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FartApp();
});

// Handle visibility change to stop sounds when app goes to background
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Stop all audio when app goes to background
        const audios = document.querySelectorAll('audio');
        audios.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }
});

// Prevent zoom on double tap for iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        // Recalculate layout after orientation change
        window.scrollTo(0, 1);
    }, 500);
});

console.log('Fart App script loaded successfully');