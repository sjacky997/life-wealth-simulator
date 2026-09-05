// ============================================
// 主程式：初始化、事件綁定
// ============================================

function bindEvents() {
    // 開始遊戲按鈕
    elements.btnStart.addEventListener('click', () => {
        AudioManager.startBGM();
        resetGame();
        showScreen('game');
    });
    elements.btnStart.addEventListener('touchend', (e) => {
        e.preventDefault();
        AudioManager.startBGM();
        resetGame();
        showScreen('game');
    });

    // 重新開始按鈕
    elements.btnRestart.addEventListener('click', () => {
        AudioManager.resumeBGM();
        resetGame();
    });
    elements.btnRestart.addEventListener('touchend', (e) => {
        e.preventDefault();
        AudioManager.resumeBGM();
        resetGame();
    });

    // 反饋繼續按鈕
    elements.btnFeedbackContinue.addEventListener('click', () => {
        advanceGame();
    });
    elements.btnFeedbackContinue.addEventListener('touchend', (e) => {
        e.preventDefault();
        advanceGame();
    });

    // 靜音按鈕
    const btnMute = document.getElementById('btn-mute');
    if (btnMute) {
        btnMute.addEventListener('click', () => {
            const isMuted = AudioManager.toggleMute();
            btnMute.textContent = isMuted ? '🔇 音效：關' : '🔊 音效：開';
        });
    }

    // 鍵盤快捷鍵
    document.addEventListener('keydown', (e) => {
        if (e.key === '1' && screens.game.classList.contains('active')) {
            const btns = elements.optionsContainer.querySelectorAll('.option-btn');
            if (btns.length > 0) btns[0].click();
        } else if (e.key === '2' && screens.game.classList.contains('active')) {
            const btns = elements.optionsContainer.querySelectorAll('.option-btn');
            if (btns.length > 1) btns[1].click();
        } else if (e.key === '3' && screens.game.classList.contains('active')) {
            const btns = elements.optionsContainer.querySelectorAll('.option-btn');
            if (btns.length > 2) btns[2].click();
        } else if (e.key === 'Enter' && elements.feedbackOverlay.style.display === 'flex') {
            elements.btnFeedbackContinue.click();
        }
    });
}

// 首次互動時啟動背景音樂（處理移動端自動播放限制）
function handleFirstInteraction() {
    AudioManager.startBGM();
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
}

// 監聽首次互動
document.addEventListener('click', handleFirstInteraction);
document.addEventListener('touchstart', handleFirstInteraction);

function init() {
    // 初始化音訊系統
    AudioManager.init();
    AudioManager.restoreVolumes();
    createParticles();
    bindEvents();

    // 初始化儀表板
    updateDashboard(false);

    // 初始化進度點
    elements.progressDots.innerHTML = '';
    for (let i = 0; i < GAME_DATA.stages.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'p-dot';
        elements.progressDots.appendChild(dot);
    }
    updateProgressDots();

    // 初始化開場時間線
    const timelineDots = elements.introTimeline.querySelectorAll('.timeline-dot');
    timelineDots.forEach((dot) => {
        dot.addEventListener('mouseenter', () => {
            timelineDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
        dot.addEventListener('click', () => {
            timelineDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });

    // 自動輪播開場時間線
    let timelineIdx = 0;
    setInterval(() => {
        timelineDots.forEach(d => d.classList.remove('active'));
        timelineIdx = (timelineIdx + 1) % timelineDots.length;
        timelineDots[timelineIdx].classList.add('active');
    }, 2000);

    console.log('🚀 人生財開始｜時間跳躍理財模擬器 已載入');
    console.log('📊 總情境卡數：' + state.totalCards);
    console.log('🎯 開始你嘅理財之旅吧！');
}

// 啟動
document.addEventListener('DOMContentLoaded', init);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
}