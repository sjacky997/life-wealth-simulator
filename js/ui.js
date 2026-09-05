// ============================================
// UI 更新與渲染：DOM 操作、儀表板、情境卡、反饋、時間跳躍、結局
// 版本：2.0（修正 hasNegative + 停止音效）
// ============================================

// DOM 元素引用
const $ = (id) => document.getElementById(id);

const elements = {
    btnStart: $('btn-start'),
    btnRestart: $('btn-restart'),
    btnWorkshop: $('btn-workshop'),
    stageAge: $('stage-age'),
    progressDots: $('progress-dots'),
    valSavings: $('val-savings'),
    valInvestment: $('val-investment'),
    valDebt: $('val-debt'),
    valHappiness: $('val-happiness'),
    scenarioNumber: $('scenario-number'),
    scenarioEmoji: $('scenario-emoji'),
    scenarioTitle: $('scenario-title'),
    scenarioDescription: $('scenario-description'),
    optionsContainer: $('options-container'),
    hiddenEventContainer: $('hidden-event-container'),
    timeJumpOverlay: $('time-jump-overlay'),
    timeJumpAge: $('time-jump-age'),
    timeJumpLines: $('time-jump-lines'),
    feedbackOverlay: $('feedback-overlay'),
    feedbackTitle: $('feedback-title'),
    feedbackChanges: $('feedback-changes'),
    feedbackTip: $('feedback-tip'),
    btnFeedbackContinue: $('btn-feedback-continue'),
    endingPersona: $('ending-persona'),
    endingDescription: $('ending-description'),
    endingStats: $('ending-stats'),
    sharePersona: $('share-persona'),
    shareStats: $('share-stats'),
    hookPersona: $('hook-persona'),
    introTimeline: $('intro-timeline')
};

const screens = {
    intro: $('screen-intro'),
    game: $('screen-game'),
    ending: $('screen-ending')
};

// ============================================
// 畫面切換
// ============================================
function showScreen(screenId) {
    Object.keys(screens).forEach(key => {
        screens[key].classList.toggle('active', key === screenId);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// 數字動畫
// ============================================
function animateNumber(element, from, to, duration = 600, isMoney = true) {
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = from + (to - from) * eased;

        if (isMoney) {
            element.textContent = formatMoneyShort(Math.round(current));
        } else {
            element.textContent = Math.round(current);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (isMoney) {
                element.textContent = formatMoneyShort(to);
            } else {
                element.textContent = Math.round(to);
            }
        }
    }
    requestAnimationFrame(update);
}

// ============================================
// 更新儀表板
// ============================================
function updateDashboard(animated = false) {
    const s = state;
    if (animated) {
        animateNumber(elements.valSavings, parseFloat(elements.valSavings.textContent.replace(/[^0-9.-]/g, '')) || 0, s.savings);
        animateNumber(elements.valInvestment, parseFloat(elements.valInvestment.textContent.replace(/[^0-9.-]/g, '')) || 0, s.investment);
        animateNumber(elements.valDebt, parseFloat(elements.valDebt.textContent.replace(/[^0-9.-]/g, '')) || 0, s.debt);
        animateNumber(elements.valHappiness, parseFloat(elements.valHappiness.textContent.replace(/[^0-9.-]/g, '')) || 0, s.happiness, 600, false);
    } else {
        elements.valSavings.textContent = formatMoneyShort(s.savings);
        elements.valInvestment.textContent = formatMoneyShort(s.investment);
        elements.valDebt.textContent = formatMoneyShort(s.debt);
        elements.valHappiness.textContent = Math.round(s.happiness);
    }

    ['stat-savings', 'stat-investment', 'stat-debt', 'stat-happiness'].forEach(id => {
        const el = $(id);
        el.classList.remove('flash');
        void el.offsetWidth;
        el.classList.add('flash');
    });
}

// ============================================
// 更新進度點
// ============================================
function updateProgressDots() {
    const dots = elements.progressDots.querySelectorAll('.p-dot');
    dots.forEach((dot, i) => {
        dot.classList.remove('done', 'current');
        if (i < state.currentStage) {
            dot.classList.add('done');
        } else if (i === state.currentStage) {
            dot.classList.add('current');
        }
    });
}

function updateStageBadge() {
    const stage = getCurrentStageData();
    elements.stageAge.textContent = stage.age + '歲 ' + stage.label;
}

// ============================================
// 渲染情境卡
// ============================================
function renderScenario() {
    const stage = getCurrentStageData();
    const card = getCurrentCardData();
    const totalInStage = stage.cards.length;

    elements.scenarioNumber.textContent =
        `情境 ${state.currentCard + 1}/${totalInStage} ｜ 階段 ${state.currentStage + 1}/5`;
    elements.scenarioEmoji.textContent = card.emoji;
    elements.scenarioTitle.textContent = card.title;
    elements.scenarioDescription.textContent = card.description;

    elements.optionsContainer.innerHTML = '';
    card.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-label', '選項 ' + opt.label);
        btn.innerHTML = `
            <span class="option-label">${opt.label}</span>
            <span class="option-text">${opt.text}</span>
        `;
        btn.addEventListener('click', () => handleChoice(idx));
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleChoice(idx);
        });
        elements.optionsContainer.appendChild(btn);
    });

    updateProgressDots();
    updateStageBadge();
}

// ============================================
// 顯示反饋
// ============================================
function showFeedback(option, effects) {
    elements.feedbackTitle.textContent = '📊 你嘅選擇';
    elements.feedbackChanges.innerHTML = '';
    elements.feedbackTip.textContent = option.tip || '';

    // 判斷是否有負面效果
    const hasNegative = (effects.savings || 0) < 0 || 
                        (effects.debt || 0) > 0 || 
                        (effects.happiness || 0) < 0;

    if (hasNegative && typeof AudioManager !== 'undefined') {
        AudioManager.playWarning();
    }

    const changes = [
        { label: '💰 儲蓄', value: effects.savings || 0 },
        { label: '📈 投資', value: effects.investment || 0 },
        { label: '💳 債務', value: effects.debt || 0 },
        { label: '😊 快樂', value: effects.happiness || 0 }
    ];

    changes.forEach(change => {
        if (change.value === 0) return;
        const div = document.createElement('div');
        div.className = 'change-item';
        if (change.value > 0) {
            div.classList.add('positive');
            div.textContent = `${change.label}: +${change.value.toLocaleString()}`;
        } else {
            div.classList.add('negative');
            div.textContent = `${change.label}: ${change.value.toLocaleString()}`;
        }
        elements.feedbackChanges.appendChild(div);
    });

    if (elements.feedbackChanges.children.length === 0) {
        const div = document.createElement('div');
        div.className = 'change-item neutral';
        div.textContent = '冇明顯變化';
        elements.feedbackChanges.appendChild(div);
    }

    elements.feedbackOverlay.style.display = 'flex';
}

// ============================================
// 檢查隱藏事件
// ============================================
function checkHiddenEvent() {
    const event = HIDDEN_EVENTS.find(e =>
        e.triggerStage === state.currentStage &&
        e.triggerCard === state.currentCard &&
        !state.triggeredEvents.includes(e.id)
    );

    if (event) {
        state.triggeredEvents.push(event.id);
        state.savings += event.effects.savings || 0;
        state.investment += event.effects.investment || 0;
        state.debt += event.effects.debt || 0;
        state.happiness += event.effects.happiness || 0;
        state.happiness = Math.max(0, Math.min(100, state.happiness));

        const banner = document.createElement('div');
        banner.className = 'hidden-event-banner';
        banner.innerHTML = `
            <span class="event-icon">${event.emoji}</span>
            <span class="event-text">${event.text}</span>
        `;
        elements.hiddenEventContainer.innerHTML = '';
        elements.hiddenEventContainer.appendChild(banner);

        setTimeout(() => {
            if (elements.hiddenEventContainer.contains(banner)) {
                banner.style.transition = 'opacity 0.5s ease';
                banner.style.opacity = '0';
                setTimeout(() => {
                    if (elements.hiddenEventContainer.contains(banner)) {
                        elements.hiddenEventContainer.removeChild(banner);
                    }
                }, 500);
            }
        }, 3000);
    }
}

// ============================================
// 時間跳躍
// ============================================
function showTimeJump(nextStageIndex) {
    // 播放跳躍音效
    if (typeof AudioManager !== 'undefined') {
        AudioManager.playJump();
    }

    const nextStage = GAME_DATA.stages[nextStageIndex];
    elements.timeJumpAge.textContent = nextStage.age + '歲';
    elements.timeJumpLines.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const span = document.createElement('span');
        span.style.animationDelay = (i * 0.05) + 's';
        elements.timeJumpLines.appendChild(span);
    }
    elements.timeJumpOverlay.style.display = 'flex';

    setTimeout(() => {
        elements.timeJumpOverlay.style.display = 'none';
        state.currentStage = nextStageIndex;
        state.currentCard = 0;
        elements.hiddenEventContainer.innerHTML = '';
        renderScenario();
        state.isAnimating = false;
    }, 1800);
}

// ============================================
// 進入下一張卡或下一階段
// ============================================
function advanceGame() {
    // 停止所有音效，避免警示音延續到下一畫面
    if (typeof AudioManager !== 'undefined') {
        AudioManager.stopAllSFX();
    }

    elements.feedbackOverlay.style.display = 'none';
    updateDashboard(true);

    const stage = getCurrentStageData();
    if (state.currentCard + 1 < stage.cards.length) {
        state.currentCard++;
        renderScenario();
        state.isAnimating = false;
    } else if (state.currentStage + 1 < GAME_DATA.stages.length) {
        showTimeJump(state.currentStage + 1);
    } else {
        state.isAnimating = false;
        showEnding();
    }
}

// ============================================
// 結局畫面
// ============================================
function showEnding() {
    const s = state;
    let ending = ENDINGS.find(e => e.check(s));
    if (!ending) {
        ending = ENDINGS[1];
    }

    elements.endingPersona.textContent = ending.icon + ' ' + ending.name;
    elements.endingDescription.textContent = ending.description;
    elements.sharePersona.textContent = ending.icon + ' ' + ending.name;
    elements.hookPersona.textContent = '「' + ending.name + '」';

    elements.endingStats.innerHTML = '';
    const stats = [
        { label: '💰 儲蓄', value: formatMoneyShort(s.savings), cls: 'savings' },
        { label: '📈 投資', value: formatMoneyShort(s.investment), cls: 'investment' },
        { label: '💳 債務', value: formatMoneyShort(s.debt), cls: 'debt' },
        { label: '😊 快樂', value: Math.round(s.happiness), cls: 'happiness' }
    ];

    stats.forEach(stat => {
        const box = document.createElement('div');
        box.className = 'ending-stat-box';
        box.innerHTML = `
            <span class="label">${stat.label}</span>
            <span class="value ${stat.cls}">${stat.value}</span>
        `;
        elements.endingStats.appendChild(box);
    });

    elements.shareStats.innerHTML = '';
    stats.forEach(stat => {
        const tag = document.createElement('span');
        tag.className = 'share-stat-tag';
        tag.textContent = `${stat.label} ${stat.value}`;
        elements.shareStats.appendChild(tag);
    });

    showScreen('ending');
}

// ============================================
// 重置遊戲
// ============================================
function resetGame() {
    state.currentStage = 0;
    state.currentCard = 0;
    state.savings = 20000;
    state.investment = 0;
    state.debt = 0;
    state.happiness = 70;
    state.choices = [];
    state.triggeredEvents = [];
    state.isAnimating = false;
    elements.hiddenEventContainer.innerHTML = '';
    elements.feedbackOverlay.style.display = 'none';
    elements.timeJumpOverlay.style.display = 'none';

    updateDashboard(false);
    renderScenario();
    showScreen('game');
}