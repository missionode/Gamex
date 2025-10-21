/**
 * Aura Animations for Gamex
 * Canvas-based visual effects
 */

class AuraAnimations {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.currentAuraType = 'ambient';

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Resize canvas to fill window
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * Start ambient aura animation
     */
    startAmbientAura() {
        this.currentAuraType = 'ambient';
        this.particles = [];

        // Create ambient particles
        for (let i = 0; i < 50; i++) {
            this.particles.push(this.createParticle('ambient'));
        }

        this.animate();
    }

    /**
     * Set aura type
     */
    setAuraType(type) {
        this.currentAuraType = type;
        this.particles = [];

        const particleCount = type === 'ambient' ? 50 : type === 'waiting' ? 30 : 60;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle(type));
        }
    }

    /**
     * Create particle based on type
     */
    createParticle(type) {
        const particle = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.1,
            hue: 0,
            pulsePhase: Math.random() * Math.PI * 2
        };

        // Set color based on type
        switch (type) {
            case 'love':
                particle.hue = 350; // Red
                particle.size = Math.random() * 4 + 2;
                break;
            case 'friendship':
                particle.hue = 50; // Yellow
                particle.size = Math.random() * 3 + 1.5;
                break;
            case 'sex':
                particle.hue = 300; // Magenta
                particle.size = Math.random() * 4 + 2;
                break;
            case 'waiting':
                particle.hue = 200; // Cyan
                particle.size = Math.random() * 2 + 1;
                particle.speedX *= 0.5;
                particle.speedY *= 0.5;
                break;
            case 'replay':
                particle.hue = 350; // Red (emotional heat)
                particle.opacity = Math.random() * 0.7 + 0.2;
                break;
            default: // ambient
                particle.hue = Math.random() * 360;
                break;
        }

        return particle;
    }

    /**
     * Animate particles
     */
    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Pulse effect
            particle.pulsePhase += 0.05;
            const pulse = Math.sin(particle.pulsePhase) * 0.3 + 0.7;

            // Draw particle with glow
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );

            gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 60%, ${particle.opacity * pulse})`);
            gradient.addColorStop(0.5, `hsla(${particle.hue}, 100%, 50%, ${particle.opacity * pulse * 0.5})`);
            gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 40%, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Play emotion animation
     */
    playEmotionAnimation(emotion) {
        // Create burst of particles from center
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            const speed = Math.random() * 3 + 2;

            const particle = {
                x: centerX,
                y: centerY,
                size: Math.random() * 5 + 3,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                opacity: 0.8,
                hue: emotion === 'love' ? 350 : emotion === 'friendship' ? 50 : 300,
                pulsePhase: 0,
                lifetime: 60, // frames
                age: 0
            };

            this.particles.push(particle);
        }

        // Animate emotion-specific effect
        switch (emotion) {
            case 'love':
                this.animateLoveEffect(centerX, centerY);
                break;
            case 'friendship':
                this.animateFriendshipEffect(centerX, centerY);
                break;
            case 'sex':
                this.animateSexEffect(centerX, centerY);
                break;
        }

        // Remove temporary particles after animation
        setTimeout(() => {
            this.particles = this.particles.filter(p => !p.lifetime || p.age < p.lifetime);
        }, 2000);
    }

    /**
     * Love effect: Soft red glow expanding outward with slow heartbeat pulse
     */
    animateLoveEffect(x, y) {
        let radius = 0;
        const maxRadius = Math.max(this.canvas.width, this.canvas.height);
        const duration = 1500;
        const startTime = Date.now();

        const drawLoveGlow = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            radius = progress * maxRadius * 0.5;
            const opacity = (1 - progress) * 0.3;

            // Heartbeat pulse
            const pulse = Math.sin(elapsed * 0.005) * 0.2 + 0.8;

            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * pulse);
            gradient.addColorStop(0, `rgba(255, 23, 68, ${opacity * 0.5})`);
            gradient.addColorStop(1, `rgba(255, 23, 68, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            if (progress < 1) {
                requestAnimationFrame(drawLoveGlow);
            }
        };

        drawLoveGlow();
    }

    /**
     * Friendship effect: Warm yellow aura radiating evenly in circular waves
     */
    animateFriendshipEffect(x, y) {
        const waves = [];
        const waveCount = 5;

        for (let i = 0; i < waveCount; i++) {
            setTimeout(() => {
                waves.push({
                    radius: 0,
                    opacity: 1,
                    maxRadius: Math.max(this.canvas.width, this.canvas.height),
                    startTime: Date.now()
                });
            }, i * 200);
        }

        const drawFriendshipWaves = () => {
            waves.forEach((wave, index) => {
                const elapsed = Date.now() - wave.startTime;
                const progress = Math.min(elapsed / 1000, 1);

                wave.radius = progress * wave.maxRadius * 0.6;
                wave.opacity = (1 - progress) * 0.4;

                this.ctx.strokeStyle = `rgba(255, 215, 64, ${wave.opacity})`;
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(x, y, wave.radius, 0, Math.PI * 2);
                this.ctx.stroke();
            });

            if (waves.length > 0 && waves[waves.length - 1].opacity > 0) {
                requestAnimationFrame(drawFriendshipWaves);
            }
        };

        drawFriendshipWaves();
    }

    /**
     * Sex effect: Vibrant magenta pulse with spark-like flickers
     */
    animateSexEffect(x, y) {
        const sparks = [];

        // Create sparks
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 3;

            sparks.push({
                x: x,
                y: y,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                size: Math.random() * 3 + 1,
                opacity: 1,
                startTime: Date.now()
            });
        }

        const drawSexSparks = () => {
            sparks.forEach(spark => {
                const elapsed = Date.now() - spark.startTime;
                const progress = Math.min(elapsed / 800, 1);

                spark.x += spark.speedX;
                spark.y += spark.speedY;
                spark.opacity = 1 - progress;

                // Draw spark
                const gradient = this.ctx.createRadialGradient(
                    spark.x, spark.y, 0,
                    spark.x, spark.y, spark.size * 2
                );

                gradient.addColorStop(0, `rgba(213, 0, 249, ${spark.opacity})`);
                gradient.addColorStop(1, `rgba(213, 0, 249, 0)`);

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(spark.x, spark.y, spark.size * 2, 0, Math.PI * 2);
                this.ctx.fill();
            });

            if (sparks[0].opacity > 0) {
                requestAnimationFrame(drawSexSparks);
            }
        };

        drawSexSparks();
    }

    /**
     * Bingo animation: Converging aura colors merging into white flash
     */
    playBingoAnimation() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const duration = 2000;
        const startTime = Date.now();

        const drawBingo = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Clear canvas
            this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            if (progress < 0.7) {
                // Phase 1: Swirling colors
                const radius = (1 - progress / 0.7) * Math.max(this.canvas.width, this.canvas.height) * 0.8;

                // Draw three colored spirals
                [350, 50, 300].forEach((hue, index) => {
                    const angle = (progress * Math.PI * 4) + (index * Math.PI * 2 / 3);

                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;

                    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 0.5);
                    gradient.addColorStop(0, `hsla(${hue}, 100%, 60%, ${0.6 * (1 - progress / 0.7)})`);
                    gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);

                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                });
            } else {
                // Phase 2: White flash
                const flashProgress = (progress - 0.7) / 0.3;
                const opacity = flashProgress < 0.5 ?
                    flashProgress * 2 : // Fade in
                    (1 - flashProgress) * 2; // Fade out

                this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

                // Gradient overlay
                const gradient = this.ctx.createRadialGradient(
                    centerX, centerY, 0,
                    centerX, centerY, Math.max(this.canvas.width, this.canvas.height) * 0.7
                );

                gradient.addColorStop(0, `rgba(255, 23, 68, ${opacity * 0.3})`);
                gradient.addColorStop(0.5, `rgba(255, 215, 64, ${opacity * 0.3})`);
                gradient.addColorStop(1, `rgba(213, 0, 249, ${opacity * 0.3})`);

                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }

            if (progress < 1) {
                requestAnimationFrame(drawBingo);
            } else {
                // Resume ambient after bingo
                this.startAmbientAura();
            }
        };

        drawBingo();
    }

    /**
     * Stop animation
     */
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Cleanup
     */
    destroy() {
        this.stop();
        window.removeEventListener('resize', this.resizeCanvas);
    }
}
