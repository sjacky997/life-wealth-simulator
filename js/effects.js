// ============================================
// 特效管理：粒子背景等視覺效果
// ============================================

function createParticles() {
    const container = $('particles-bg');
    if (!container) return;
    const count = window.innerWidth < 480 ? 15 : 30;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.setProperty('--duration', (10 + Math.random() * 20) + 's');
        particle.style.setProperty('--delay', (Math.random() * 15) + 's');
        particle.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
        particle.style.setProperty('--max-opacity', (0.2 + Math.random() * 0.3).toFixed(2));
        container.appendChild(particle);
    }
}

// ============================================
// 背景音樂管理
// ============================================

let bgm = null;
let isMusicPlaying = false;

function initBackgroundMusic() {
    bgm = new Audio('assets/audio/bgm.mp3');
    bgm.loop = true;
    bgm.volume = 0.4; // 音量 40%，避免太吵
    bgm.preload = 'auto';
    
    // 嘗試自動播放（部分瀏覽器可能阻止）
    bgm.play().then(() => {
        isMusicPlaying = true;
        updateMusicButton();
    }).catch(() => {
        // 自動播放被阻止，等待用戶首次交互
        isMusicPlaying = false;
        updateMusicButton();
        
        // 監聽首次用戶交互後嘗試播放
        const startMusicOnInteraction = () => {
            bgm.play().then(() => {
                isMusicPlaying = true;
                updateMusicButton();
            }).catch(() => {});
            // 移除監聽器
            document.removeEventListener('click', startMusicOnInteraction);
            document.removeEventListener('touchstart', startMusicOnInteraction);
        };
        document.addEventListener('click', startMusicOnInteraction);
        document.addEventListener('touchstart', startMusicOnInteraction);
    });
}

function toggleMusic() {
    if (!bgm) return;
    
    if (isMusicPlaying) {
        bgm.pause();
        isMusicPlaying = false;
    } else {
        bgm.play().then(() => {
            isMusicPlaying = true;
        }).catch(() => {});
    }
    updateMusicButton();
}

function updateMusicButton() {
    const btn = document.getElementById('music-toggle');
    const icon = document.getElementById('music-icon');
    if (!btn || !icon) return;
    
    if (isMusicPlaying) {
        btn.classList.add('playing');
        icon.textContent = '🎵';
    } else {
        btn.classList.remove('playing');
        icon.textContent = '🔇';
    }
}