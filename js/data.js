// ============================================
// 遊戲數據：情境卡、隱藏事件、結局類型
// ============================================

const GAME_DATA = {
    stages: [
        {
            age: 22,
            label: '職場新鮮人',
            emoji: '🎓',
            cards: [
                {
                    title: '第一份糧到手！',
                    description: '你啱啱大學畢業，搵到第一份全職工作，月薪 $16,000。出糧日，你見到部新出嘅旗艦手機，售價 $8,999。你嘅舊手機仲用得，但已經用咗三年。你會？',
                    emoji: '📱',
                    options: [
                        { text: '即刻買！辛苦返工要獎勵自己', label: 'A', effects: { savings: -8999, investment: 0, debt: 0, happiness: 20 }, tip: '衝動消費係理財大敵！延遲滿足可以幫你慳好多。' },
                        { text: '等出咗花紅先買，而家繼續用舊機', label: 'B', effects: { savings: 0, investment: 0, debt: 0, happiness: 5 }, tip: '延遲滿足係理財高手嘅共同特質！' },
                        { text: '唔買新機，將啲錢存入高息戶口', label: 'C', effects: { savings: 2000, investment: 0, debt: 0, happiness: -5 }, tip: '儲蓄習慣由細做起，複利會幫你滾大舊錢！' }
                    ]
                },
                {
                    title: '信用卡陷阱',
                    description: '銀行寄咗張信用卡畀你，迎新優惠送 $500 現金回贈，簽帳仲有 5% 回贈。朋友話「唔用咪嘥曬?」。你會？',
                    emoji: '💳',
                    options: [
                        { text: '即刻申請，反正有回贈抵返', label: 'A', effects: { savings: 0, investment: 0, debt: 5000, happiness: 10 }, tip: '信用卡唔係免費錢！利息可以高達 30%+。' },
                        { text: '申請但設定自動全數還款', label: 'B', effects: { savings: -500, investment: 0, debt: 0, happiness: 5 }, tip: '自律用卡可以儲信用評分，但一定要全數還款！' },
                        { text: '唔申請，用現金同八達通就夠', label: 'C', effects: { savings: 0, investment: 0, debt: 0, happiness: -5 }, tip: '保守理財冇問題，但有時建立信貸紀錄都好重要。' }
                    ]
                },
                {
                    title: '強積金選擇',
                    description: '公司幫你供強積金，HR 問你要唔要額外做自願性供款，每月多供 $500。你嘅強積金戶口而家得基本供款。',
                    emoji: '🏦',
                    options: [
                        { text: '唔好搞咁多，基本供款夠啦', label: 'A', effects: { savings: 0, investment: -100, debt: 0, happiness: 0 }, tip: '強積金係長線投資，早啲開始供款複利效果更大！' },
                        { text: '每月加供 $500，當儲錢', label: 'B', effects: { savings: -500, investment: 600, debt: 0, happiness: 0 }, tip: '自願供款有稅務扣除，仲可以享受複利增長！' },
                        { text: '研究吓基金方案先決定', label: 'C', effects: { savings: 0, investment: 200, debt: 0, happiness: 5 }, tip: '了解自己嘅風險承受能力再投資，係明智之舉！' }
                    ]
                }
            ]
        },
        {
            age: 25,
            label: '事業探索期',
            emoji: '💼',
            cards: [
                {
                    title: '進修定儲錢？',
                    description: '你返咗三年工，覺得升職有啲停滯。有個進修課程可以幫你考專業資格，學費 $30,000，但讀完有機會加薪 20%。你儲咗 $50,000。',
                    emoji: '📚',
                    options: [
                        { text: '即刻報名！投資自己最值得', label: 'A', effects: { savings: -30000, investment: 0, debt: 0, happiness: 15 }, tip: '投資自己嘅回報可以好高，但要確保課程質素！' },
                        { text: '再儲多啲錢先，遲啲先讀', label: 'B', effects: { savings: 0, investment: 0, debt: 0, happiness: -5 }, tip: '有時機會唔等人，但要平衡風險。' },
                        { text: '問公司有冇進修津貼先', label: 'C', effects: { savings: -10000, investment: 0, debt: 0, happiness: 10 }, tip: '好多公司有培訓津貼，識得善用資源就係理財智慧！' }
                    ]
                },
                {
                    title: '朋友夾份投資',
                    description: '你嘅好朋友話有個「穩賺」嘅加密貨幣項目，話自己已經賺咗一倍，邀請你一齊夾 $20,000 入場。你會？',
                    emoji: '🪙',
                    options: [
                        { text: '朋友唔會呃我，跟！', label: 'A', effects: { savings: -20000, investment: 0, debt: 0, happiness: 10 }, tip: '「穩賺」嘅投資通常都係騙局！高回報一定伴隨高風險。' },
                        { text: '做吓研究先，唔好急', label: 'B', effects: { savings: 0, investment: 500, debt: 0, happiness: 5 }, tip: '盡職調查係投資者嘅基本功夫！' },
                        { text: '唔參與，但將原本預留嘅錢放入低風險基金', label: 'C', effects: { savings: 0, investment: 100, debt: 0, happiness: 0 }, tip: '拒絕高風險投資之餘，仍然可以穩健增值！' }
                    ]
                },
                {
                    title: '搬出去住？',
                    description: '你仲同家人住，每月可以慳到 $8,000。但你好想有自己嘅空間，搬出去租樓每月要 $9,000，仲要俾水電煤。',
                    emoji: '🏠',
                    options: [
                        { text: '搬出去！自由無價', label: 'A', effects: { savings: -9000, investment: 0, debt: 0, happiness: 25 }, tip: '自由有代價，要計清楚自己嘅負擔能力。' },
                        { text: '繼續同屋企住，努力儲首期', label: 'B', effects: { savings: 5000, investment: 0, debt: 0, happiness: -10 }, tip: '延遲享受可以幫你更快達到置業目標！' },
                        { text: '同朋友夾租，慳啲又開心', label: 'C', effects: { savings: -4500, investment: 0, debt: 0, happiness: 15 }, tip: '平衡生活質素同儲蓄，係成熟嘅理財態度。' }
                    ]
                }
            ]
        },
        {
            age: 30,
            label: '三十而立',
            emoji: '🎯',
            cards: [
                {
                    title: '置業抉擇',
                    description: '你同伴侶考慮緊買樓上車。一個新界細單位要 $500 萬，首期要 $100 萬。你哋兩個夾埋儲咗 $80 萬。銀行話可以借九成按揭。',
                    emoji: '🏡',
                    options: [
                        { text: '借盡九成，即刻上車', label: 'A', effects: { savings: -800000, investment: 0, debt: 4200000, happiness: 20 }, tip: '高成數按揭月供好重，要預留 buffer 應付加息！' },
                        { text: '再儲多兩年，儲夠首期先買', label: 'B', effects: { savings: 100000, investment: 10000, debt: 0, happiness: -5 }, tip: '有足夠首期可以減少利息支出，長線慳好多！' },
                        { text: '唔買樓，繼續租樓投資其他嘢', label: 'C', effects: { savings: 0, investment: 50000, debt: 0, happiness: 0 }, tip: '置業唔一定係唯一選擇，資產配置先係重點。' }
                    ]
                },
                {
                    title: '保險配置',
                    description: '你開始諗要唔要買保險。有經紀推薦一份「儲蓄人壽保險」，月供 $2,000，話有儲蓄成分又有保障。但你已經有公司醫療保險。',
                    emoji: '🛡️',
                    options: [
                        { text: '買！有保障安心啲', label: 'A', effects: { savings: -2000, investment: 800, debt: 0, happiness: 5 }, tip: '保險要睇條款，儲蓄保險回報可能低過自己投資。' },
                        { text: '只買定期壽險，平好多', label: 'B', effects: { savings: -500, investment: 0, debt: 0, happiness: 3 }, tip: '定期壽險保費平，保障高，係好選擇。' },
                        { text: '暫時唔買，公司保險夠用', label: 'C', effects: { savings: 0, investment: 0, debt: 0, happiness: -3 }, tip: '要定期檢視保障需要，唔好等到有事先補救。' }
                    ]
                },
                {
                    title: '副業機會',
                    description: '朋友邀請你一齊開網店，每人要投資 $15,000 入貨。你有正職，但夜晚同週末可以幫手。預計半年可以回本。',
                    emoji: '🛒',
                    options: [
                        { text: '試吓！多條收入來源', label: 'A', effects: { savings: -15000, investment: 20000, debt: 0, happiness: 15 }, tip: '創業有風險，要預咗最壞情況輸晒本金。' },
                        { text: '唔搞咁多，專注正職', label: 'B', effects: { savings: 0, investment: 0, debt: 0, happiness: -5 }, tip: '專注發展事業都係一種投資。' },
                        { text: '先做市場調查，遲啲先決定', label: 'C', effects: { savings: 0, investment: 2000, debt: 0, happiness: 5 }, tip: '做好功課先投資，減少盲目跟風。' }
                    ]
                }
            ]
        },
        {
            age: 35,
            label: '家庭責任期',
            emoji: '👨‍👩‍👧',
            cards: [
                {
                    title: '子女教育基金',
                    description: '你嘅小朋友就嚟讀小學。有家長群組推薦一個「教育基金計劃」，月供 $3,000，供到 18 歲。你會？',
                    emoji: '👶',
                    options: [
                        { text: '即刻供！為小朋友將來', label: 'A', effects: { savings: -3000, investment: 2500, debt: 0, happiness: 10 }, tip: '教育基金有好有壞，要比較收費同回報。' },
                        { text: '用指數基金代替，自己管理', label: 'B', effects: { savings: -3000, investment: 3200, debt: 0, happiness: 5 }, tip: '低成本指數基金長線回報往往跑贏教育基金！' },
                        { text: '暫時唔供，等小朋友大啲先算', label: 'C', effects: { savings: 0, investment: 0, debt: 0, happiness: -5 }, tip: '教育開支會愈來愈大，及早規劃好重要。' }
                    ]
                },
                {
                    title: '換車誘惑',
                    description: '你見到同事換咗部新車，心郁郁想換埋一份。你而家部車仲行得，但新車月供要 $6,000，供五年。',
                    emoji: '🚗',
                    options: [
                        { text: '換！人生苦短，享受吓', label: 'A', effects: { savings: -6000, investment: 0, debt: 300000, happiness: 20 }, tip: '汽車係貶值資產，每月供款會綁死你嘅現金流。' },
                        { text: '繼續揸舊車，將錢儲起', label: 'B', effects: { savings: 4000, investment: 0, debt: 0, happiness: -5 }, tip: '車只係代步工具，慳到嘅錢可以用喺更重要嘅地方。' },
                        { text: '買部二手車，慳一半', label: 'C', effects: { savings: -3000, investment: 0, debt: 100000, happiness: 10 }, tip: '折衷方案可以平衡想要同需要。' }
                    ]
                },
                {
                    title: '父母醫療開支',
                    description: '你嘅父母年紀漸大，其中一位需要做一個小手術，醫療開支約 $50,000。你嘅兄弟姐妹話大家一齊分擔。',
                    emoji: '❤️',
                    options: [
                        { text: '即刻攞錢出嚟，家人最重要', label: 'A', effects: { savings: -50000, investment: 0, debt: 0, happiness: 15 }, tip: '應急基金就係為咗呢啲情況而設！' },
                        { text: '問吓保險賠唔賠到先', label: 'B', effects: { savings: -20000, investment: 0, debt: 0, happiness: 5 }, tip: '了解保險保障範圍，可能幫你慳好多。' },
                        { text: '同家人商量分期支付', label: 'C', effects: { savings: -10000, investment: 0, debt: 40000, happiness: 0 }, tip: '家庭溝通好重要，一齊面對難關。' }
                    ]
                }
            ]
        },
        {
            age: 40,
            label: '中年反思期',
            emoji: '🔮',
            cards: [
                {
                    title: '退休規劃',
                    description: '你開始諗退休生活。有人話 40 歲先開始儲退休金太遲，有人話有心唔怕遲。你嘅退休儲備仲好少。',
                    emoji: '🌅',
                    options: [
                        { text: '加大退休供款，每月儲多 $5,000', label: 'A', effects: { savings: -5000, investment: 6000, debt: 0, happiness: 0 }, tip: '40 歲開始都仲有 20+ 年複利，好過唔開始！' },
                        { text: '投資高風險產品博一博', label: 'B', effects: { savings: -10000, investment: 5000, debt: 0, happiness: -10 }, tip: '臨近退休唔應該博太高風險，要平衡增長同保本。' },
                        { text: '尋求專業理財意見', label: 'C', effects: { savings: -2000, investment: 3000, debt: 0, happiness: 10 }, tip: '專業意見可以幫你少走彎路，值得投資。' }
                    ]
                },
                {
                    title: '被動收入',
                    description: '你有機會投資一個收租車位，價格 $80 萬，每月可收租 $3,500。需要按揭貸款。',
                    emoji: '🏗️',
                    options: [
                        { text: '買！有穩定現金流', label: 'A', effects: { savings: -200000, investment: 800000, debt: 600000, happiness: 10 }, tip: '收租物業要考慮管理成本同空置風險。' },
                        { text: '比較吓其他投資先', label: 'B', effects: { savings: 0, investment: 10000, debt: 0, happiness: 5 }, tip: '投資前一定要貨比三家，了解回報率。' },
                        { text: '唔買，流動性太低', label: 'C', effects: { savings: 0, investment: 5000, debt: 0, happiness: -3 }, tip: '物業流動性低，要確保自己唔會急需用錢。' }
                    ]
                },
                {
                    title: '財務自由倒數',
                    description: '你計過自己嘅被動收入同開支，距離財務自由仲有一段距離。你願意犧牲邊啲生活質素嚟加速？',
                    emoji: '⏳',
                    options: [
                        { text: '大幅削減開支，儲蓄率加到 50%', label: 'A', effects: { savings: 15000, investment: 10000, debt: 0, happiness: -20 }, tip: '極簡生活可以加速財務自由，但要平衡快樂。' },
                        { text: '保持現狀，順其自然', label: 'B', effects: { savings: 2000, investment: 2000, debt: 0, happiness: 5 }, tip: '冇計劃嘅財務自由通常好難達成。' },
                        { text: '尋找增加收入嘅方法', label: 'C', effects: { savings: 5000, investment: 8000, debt: 0, happiness: 0 }, tip: '開源同節流一樣重要，提升收入先係王道！' }
                    ]
                }
            ]
        }
    ]
};

// ============================================
// 隱藏事件
// ============================================
const HIDDEN_EVENTS = [
    {
        id: 'windfall',
        triggerStage: 2,
        triggerCard: 1,
        emoji: '🍀',
        text: '🎉 隱藏事件：你中咗一個小型抽獎，贏得 $8,000 獎金！',
        effects: { savings: 8000, investment: 0, debt: 0, happiness: 15 }
    },
    {
        id: 'emergency',
        triggerStage: 3,
        triggerCard: 2,
        emoji: '⚠️',
        text: '🚨 隱藏事件：你嘅電腦突然壞咗，急需 $6,000 換新機！',
        effects: { savings: -6000, investment: 0, debt: 0, happiness: -10 }
    },
    {
        id: 'bonus',
        triggerStage: 4,
        triggerCard: 0,
        emoji: '💎',
        text: '🌟 隱藏事件：公司業績好，你收到 $12,000 年終獎金！',
        effects: { savings: 12000, investment: 0, debt: 0, happiness: 10 }
    }
];

// ============================================
// 結局類型
// ============================================
const ENDINGS = [
    { id: 'free', name: '財務自由達人', icon: '🏆', description: '你成功平衡儲蓄、投資同生活，向財務自由邁進一大步！', check: (s) => s.savings + s.investment > 300000 && s.debt < 100000 },
    { id: 'balanced', name: '穩健理財者', icon: '⚖️', description: '你嘅理財觀念幾好，繼續保持就可以達到目標。', check: (s) => s.savings + s.investment > 100000 && s.debt < 200000 },
    { id: 'moonlight', name: '月光冒險家', icon: '🌙', description: '你享受當下，但有時會忽略長遠規劃。係時候諗吓將來！', check: (s) => s.savings < 50000 && s.debt < 100000 && s.happiness > 70 },
    { id: 'debt', name: '債務挑戰者', icon: '⚡', description: '你嘅債務有啲高，需要制定還款計劃扭轉局面。', check: (s) => s.debt > 200000 },
    { id: 'saver', name: '謹慎儲蓄兔', icon: '🐰', description: '你好識儲錢，但有時太保守會錯過增值機會。', check: (s) => s.savings > 200000 && s.investment < 50000 }
];