// ============================================
// 遊戲核心邏輯：狀態管理、數值計算、選擇處理
// ============================================

const state = {
    currentStage: 0,
    currentCard: 0,
    savings: 20000,
    investment: 0,
    debt: 0,
    happiness: 70,
    choices: [],
    triggeredEvents: [],
    isAnimating: false,
    totalCards: 0
};

// 計算總情境卡數
state.totalCards = GAME_DATA.stages.reduce((sum, s) => sum + s.cards.length, 0);

// ============================================
// 工具函數
// ============================================
function formatMoney(amount) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-$' : '$';
    return sign + abs.toLocaleString('zh-HK');
}

function formatMoneyShort(amount) {
    const abs = Math.abs(amount);
    if (abs >= 1000000) {
        return (amount < 0 ? '-$' : '$') + (abs / 1000000).toFixed(1) + 'M';
    } else if (abs >= 1000) {
        return (amount < 0 ? '-$' : '$') + (abs / 1000).toFixed(0) + 'K';
    }
    return formatMoney(amount);
}

function getCurrentStageData() {
    return GAME_DATA.stages[state.currentStage];
}

function getCurrentCardData() {
    return getCurrentStageData().cards[state.currentCard];
}

// ============================================
// 處理選擇
// ============================================
function handleChoice(optionIndex) {
    if (state.isAnimating) return;
    state.isAnimating = true;

    const card = getCurrentCardData();
    const option = card.options[optionIndex];

    // 播放選擇音效
    AudioManager.playSelect();

    // 記錄選擇
    state.choices.push({
        stage: state.currentStage,
        card: state.currentCard,
        option: optionIndex,
        title: card.title,
        choiceText: option.text
    });

    // 應用效果
    const effects = option.effects;
    state.savings += effects.savings || 0;
    state.investment += effects.investment || 0;
    state.debt += effects.debt || 0;
    state.happiness += effects.happiness || 0;

    // 限制數值範圍
    state.savings = Math.max(state.savings, -100000);
    state.investment = Math.max(state.investment, 0);
    state.debt = Math.max(state.debt, 0);
    state.happiness = Math.max(0, Math.min(100, state.happiness));

    // 顯示反饋（在 ui.js 中定義）
    showFeedback(option, effects);

    // 檢查隱藏事件（在 ui.js 中定義）
    checkHiddenEvent();
}