// ============================================
// 音訊管理模組：背景音樂、音效控制（含 Ducking + 獨立音量 + 停止音效）
// 版本：3.0（加入 stopAllSFX）
// ============================================

const AudioManager = {
    // 音訊元素引用
    bgm: null,
    sfxSelect: null,
    sfxWarning: null,
    sfxJump: null,

    // 音量設定
    bgmVolume: 0.2,             // 背景音樂音量
    bgmDuckedVolume: 0.05,      // 背景音樂被壓低時的音量
    sfxSelectVolume: 0.6,       // 選擇確認音音量
    sfxWarningVolume: 0.8,      // 警示音音量
    sfxJumpVolume: 1.0,         // 時間跳躍音效音量

    isMuted: false,
    bgmStarted: false,
    duckTimeout: null,

    // ============================================
    // 初始化
    // ============================================
    init() {
        try {
            this.bgm = document.getElementById('bgm');
            this.sfxSelect = document.getElementById('sfx-select');
            this.sfxWarning = document.getElementById('sfx-warning');
            this.sfxJump = document.getElementById('sfx-jump');
        } catch (e) {
            console.warn('無法獲取音訊元素：', e);
        }

        this._applyVolumes();

        if (typeof Storage !== 'undefined') {
            try {
                const savedMute = Storage.load('audio-muted');
                if (savedMute !== null) {
                    this.isMuted = savedMute;
                }
            } catch (e) {
                console.warn('讀取靜音設定失敗：', e);
            }
        }
        this.applyMuteState();
        this.restoreVolumes();

        console.log('🔊 音訊系統初始化完成');
    },

    // ============================================
    // 內部：套用音量設定
    // ============================================
    _applyVolumes() {
        if (this.bgm) this.bgm.volume = this.bgmVolume;
        if (this.sfxSelect) this.sfxSelect.volume = this.sfxSelectVolume;
        if (this.sfxWarning) this.sfxWarning.volume = this.sfxWarningVolume;
        if (this.sfxJump) this.sfxJump.volume = this.sfxJumpVolume;
    },

    // ============================================
    // 背景音樂控制
    // ============================================
    startBGM() {
        if (this.bgm && !this.bgmStarted) {
            this.bgm.play().then(() => {
                this.bgmStarted = true;
            }).catch(err => {
                console.warn('背景音樂無法自動播放（等待用戶互動）');
            });
        }
    },

    stopBGM() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
            this.bgmStarted = false;
        }
    },

    pauseBGM() {
        if (this.bgm) {
            this.bgm.pause();
        }
    },

    resumeBGM() {
        if (this.bgm && this.bgmStarted) {
            this.bgm.play().catch(err => {
                console.warn('背景音樂恢復失敗');
            });
        }
    },

    // ============================================
    // 音效控制（含 Ducking）
    // ============================================
    playSelect() {
        this._playSFX(this.sfxSelect, 0);
    },

    playWarning() {
        this._playSFX(this.sfxWarning, 1);
    },

    playJump() {
        this._playSFX(this.sfxJump, 2);
    },

    // 停止所有音效（選擇、警告、跳躍）
    stopAllSFX() {
        [this.sfxSelect, this.sfxWarning, this.sfxJump].forEach(sfx => {
            if (sfx && !sfx.paused) {
                sfx.pause();
                sfx.currentTime = 0;
            }
        });
    },

    // 內部方法：播放音效並可能觸發 ducking
    _playSFX(audioElement, duckLevel = 0) {
        if (audioElement && !this.isMuted) {
            if (duckLevel > 0) {
                this._duckBGM(duckLevel);
            }

            audioElement.currentTime = 0;
            audioElement.play().catch(err => {
                console.warn('音效播放失敗：', err);
            });

            if (duckLevel > 0) {
                const duration = (audioElement.duration && !isNaN(audioElement.duration)) ? audioElement.duration : 1.5;
                this._scheduleBGMRestore(duration * 1000);
            }
        }
    },

    // 降低背景音樂音量（Ducking）
    _duckBGM(level) {
        if (!this.bgm) return;

        if (this.duckTimeout) {
            clearTimeout(this.duckTimeout);
            this.duckTimeout = null;
        }

        let targetVolume = this.bgmVolume;
        if (level === 1) {
            targetVolume = Math.min(this.bgmVolume, this.bgmDuckedVolume * 2);
        } else if (level === 2) {
            targetVolume = this.bgmDuckedVolume;
        }
        this.bgm.volume = targetVolume;
    },

    // 排程恢復背景音樂音量
    _scheduleBGMRestore(delay) {
        if (this.duckTimeout) {
            clearTimeout(this.duckTimeout);
        }
        this.duckTimeout = setTimeout(() => {
            if (this.bgm) {
                this.bgm.volume = this.bgmVolume;
            }
            this.duckTimeout = null;
        }, delay);
    },

    // ============================================
    // 靜音控制
    // ============================================
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.applyMuteState();
        if (typeof Storage !== 'undefined') {
            try {
                Storage.save('audio-muted', this.isMuted);
            } catch (e) {
                console.warn('保存靜音設定失敗：', e);
            }
        }
        return this.isMuted;
    },

    applyMuteState() {
        if (this.bgm) this.bgm.muted = this.isMuted;
        if (this.sfxSelect) this.sfxSelect.muted = this.isMuted;
        if (this.sfxWarning) this.sfxWarning.muted = this.isMuted;
        if (this.sfxJump) this.sfxJump.muted = this.isMuted;
    },

    // ============================================
    // 音量調整（獨立設定）
    // ============================================
    setBGMVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgm) this.bgm.volume = this.bgmVolume;
        this._saveVolume('bgm-volume', this.bgmVolume);
    },

    setSelectVolume(volume) {
        this.sfxSelectVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxSelect) this.sfxSelect.volume = this.sfxSelectVolume;
        this._saveVolume('sfx-select-volume', this.sfxSelectVolume);
    },

    setWarningVolume(volume) {
        this.sfxWarningVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxWarning) this.sfxWarning.volume = this.sfxWarningVolume;
        this._saveVolume('sfx-warning-volume', this.sfxWarningVolume);
    },

    setJumpVolume(volume) {
        this.sfxJumpVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxJump) this.sfxJump.volume = this.sfxJumpVolume;
        this._saveVolume('sfx-jump-volume', this.sfxJumpVolume);
    },

    _saveVolume(key, value) {
        if (typeof Storage !== 'undefined') {
            try {
                Storage.save(key, value);
            } catch (e) {
                console.warn(`保存音量 ${key} 失敗：`, e);
            }
        }
    },

    restoreVolumes() {
        if (typeof Storage === 'undefined') return;

        try {
            const savedBGM = Storage.load('bgm-volume');
            const savedSelect = Storage.load('sfx-select-volume');
            const savedWarning = Storage.load('sfx-warning-volume');
            const savedJump = Storage.load('sfx-jump-volume');

            if (savedBGM !== null) this.bgmVolume = Math.max(0, Math.min(1, savedBGM));
            if (savedSelect !== null) this.sfxSelectVolume = Math.max(0, Math.min(1, savedSelect));
            if (savedWarning !== null) this.sfxWarningVolume = Math.max(0, Math.min(1, savedWarning));
            if (savedJump !== null) this.sfxJumpVolume = Math.max(0, Math.min(1, savedJump));

            this._applyVolumes();
        } catch (e) {
            console.warn('恢復音量設定失敗：', e);
        }
    }
};