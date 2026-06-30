(function () {
  "use strict";

  var STORAGE_KEY = "questVaultMapAppState";

  var ICONS = {
    main: '<path d="M9 18V6.5l10-2V16"/><circle cx="7" cy="18" r="2.3"/><circle cx="17" cy="16" r="2.3"/>',
    shield: '<path d="M12 3l7 3v5.5c0 5-3 8.2-7 9.5-4-1.3-7-4.5-7-9.5V6l7-3z"/>',
    tidy: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2 2M15.7 15.7l2 2M17.7 6.3l-2 2M8.3 15.7l-2 2"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/>',
    light: '<path d="M12 20s-7-4.4-7-10A4.6 4.6 0 0 1 12 6.5 4.6 4.6 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    vault: '<rect x="4.5" y="3" width="15" height="18" rx="2"/><path d="M4.5 9.5h15M4.5 15h15"/><circle cx="12" cy="18.3" r="1"/>',
    map: '<path d="M12 21s7-7.4 7-12.2A7 7 0 0 0 5 8.8C5 13.6 12 21 12 21z"/><circle cx="12" cy="8.8" r="2.2"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="M14.7 9.3l-1.6 4-4 1.6 1.6-4z"/>',
    flag: '<path d="M6 3v18"/><path d="M6 4h11l-3 3.5L17 11H6"/>',
    mountain: '<path d="M3 18.5l5.5-8.5 4 5 3-4 5.5 7.5H3z"/>',
    gift: '<rect x="4" y="8.5" width="16" height="11" rx="1.2"/><path d="M4 12.5h16M12 8.5v11"/><path d="M9 8.5c0-2 1.3-3 3-3s3 1 3 3"/>',
    record: '<path d="M5 7h14M5 12h14M5 17h9"/>',
    quest: '<rect x="5.5" y="4.5" width="13" height="16" rx="2"/><path d="M9.5 3.3h5v2.7h-5z"/><path d="M8.5 11h7M8.5 14.5h7"/>',
    edit: '<path d="M4 20l.9-3.6L16.2 5.1l2.7 2.7L7.6 19.1 4 20z"/><path d="M14.6 6.7l2.7 2.7"/>',
    hidden: '<circle cx="12" cy="12" r="8.5"/><path d="M6.5 6.5l11 11"/>',
    trash: '<path d="M5 7h14"/><path d="M9 7V5h6v2"/><path d="M7 7l1 13h8l1-13"/>',
    star: '<path d="M12 3.5l2.4 5.1 5.6.6-4.2 3.8 1.2 5.5L12 16l-5 2.5 1.2-5.5-4.2-3.8 5.6-.6z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    home: '<path d="M4 11.5L12 4l8 7.5"/><path d="M6 10.5V20h12v-9.5"/>',
    settings: '<path d="M19.4 13a7.4 7.4 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L14.9 3h-4l-.4 2.9a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1l.4 3h4l.4-3a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>'
  };

  function iconHtml(name, extraClass) {
    var inner = ICONS[name];
    if (!inner) return "";
    return '<span class="icon icon-' + name + (extraClass ? " " + extraClass : "") + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg></span>';
  }

  function mountStaticIcons() {
    document.querySelectorAll(".icon-slot").forEach(function (el) {
      var name = el.getAttribute("data-icon");
      var inner = ICONS[name];
      if (!inner) return;
      el.classList.add("icon", "icon-" + name);
      el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
    });
  }

  function vaultVisualHtml(pct) {
    pct = Math.max(0, Math.min(100, pct || 0));
    var litCount = Math.round(pct / 20);
    var fillH = 58 * (pct / 100);
    var fillY = 21 + (58 - fillH);
    var lights = "";
    for (var i = 0; i < 5; i++) {
      var ly = 23 + i * 11;
      lights += '<rect x="10.5" y="' + ly + '" width="5" height="6" rx="1.4" class="vault-led' + (i < litCount ? " lit" : "") + '"/>';
    }
    return (
      '<svg class="vault-visual" viewBox="0 0 100 100">' +
      '<defs>' +
      '<linearGradient id="vaultMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3c4868"/><stop offset="100%" stop-color="#101724"/></linearGradient>' +
      '<linearGradient id="vaultDoor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#28324c"/><stop offset="100%" stop-color="#131a2a"/></linearGradient>' +
      '<linearGradient id="vaultFill" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#d9b35f"/><stop offset="100%" stop-color="#f5dfa3"/></linearGradient>' +
      '</defs>' +
      '<rect x="4" y="3" width="92" height="94" rx="13" fill="url(#vaultMetal)" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>' +
      '<rect x="19" y="12" width="67" height="76" rx="9" fill="url(#vaultDoor)" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>' +
      '<rect x="29" y="19" width="8" height="62" rx="3" fill="rgba(0,0,0,0.38)"/>' +
      '<rect x="29" y="' + fillY.toFixed(1) + '" width="8" height="' + fillH.toFixed(1) + '" rx="3" fill="url(#vaultFill)" class="vault-fill-bar"/>' +
      '<circle cx="58" cy="50" r="15.5" fill="rgba(0,0,0,0.32)" stroke="#d9b35f" stroke-width="1.4"/>' +
      '<circle cx="58" cy="50" r="2.6" fill="#d9b35f"/>' +
      '<g stroke="#d9b35f" stroke-width="1.1" opacity="0.75">' +
      '<line x1="58" y1="36.5" x2="58" y2="40.5"/><line x1="58" y1="59.5" x2="58" y2="63.5"/>' +
      '<line x1="44.5" y1="50" x2="48.5" y2="50"/><line x1="67.5" y1="50" x2="71.5" y2="50"/>' +
      '</g>' +
      '<rect x="80" y="42" width="4" height="16" rx="2" fill="#d9b35f" opacity="0.85"/>' +
      lights +
      '</svg>'
    );
  }

  var SOUVENIR_VISUALS = {
    "ラベンダー": '<line x1="12" y1="21" x2="12" y2="8.5" stroke="#9fb0cc" stroke-width="1.4"/><g fill="#c7b3f2"><circle cx="12" cy="4.8" r="2"/><circle cx="9.4" cy="7" r="1.8"/><circle cx="14.6" cy="7" r="1.8"/><circle cx="7.8" cy="10" r="1.7"/><circle cx="16.2" cy="10" r="1.7"/><circle cx="12" cy="10.8" r="1.8"/></g>',
    "青森りんご": '<path d="M12 8.8c-4 0-6.3 3-6.3 6.5 0 3.5 2.6 6.3 6.3 6.3s6.3-2.8 6.3-6.3c0-3.5-2.3-6.5-6.3-6.5z" fill="#e2645a"/><path d="M12 8.8V6" stroke="#9c7248" stroke-width="1.3"/><path d="M12 6.6c2-1.7 4-.7 4-.7" fill="none" stroke="#7fc479" stroke-width="1.6" stroke-linecap="round"/>',
    "南部鉄器": '<path d="M6 16a6 5.2 0 0 1 12 0c0 2.9-2.7 4.7-6 4.7s-6-1.8-6-4.7z" fill="#aab6cc" stroke="#e7ecf5" stroke-width="0.7"/><path d="M8 12c1.4-1.8 5.6-1.8 8 0" fill="none" stroke="#e7ecf5" stroke-width="1.3"/><circle cx="12" cy="10.9" r="1.15" fill="#e7ecf5"/><rect x="10.5" y="20.4" width="3" height="1.6" rx="0.5" fill="#8a96ad"/>',
    "ずんだ餅": '<ellipse cx="12" cy="18.4" rx="7.4" ry="1.9" fill="#465269" opacity="0.85"/><circle cx="9.2" cy="15.4" r="3.1" fill="#cdeab8"/><circle cx="14.4" cy="15.9" r="3.1" fill="#cdeab8"/><circle cx="11.7" cy="13" r="3.1" fill="#e1f3d2"/>'
  };

  function souvenirVisualHtml(name, rarity, sizeClass) {
    var inner = SOUVENIR_VISUALS[name];
    var rareClass = rarity === "レア" ? "rare" : "common";
    if (!inner) {
      return '<div class="souvenir-badge ' + rareClass + (sizeClass ? " " + sizeClass : "") + '"></div>';
    }
    return (
      '<div class="souvenir-visual ' + rareClass + (sizeClass ? " " + sizeClass : "") + '">' +
      '<svg viewBox="0 0 24 24" fill="none">' + inner + '</svg>' +
      '</div>'
    );
  }

  var CATEGORY_ICON = {
    "本命": "main",
    "守り": "shield",
    "整え": "tidy",
    "お金": "coin",
    "超軽": "light"
  };

  var PREF_LIST = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"];

  function uid(prefix) {
    return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function createFreshState() {
    var now = nowIso();
    return {
      totalExp: 0,
      streak: {
        currentDays: 0,
        weekCompleted: [false, false, false, false, false, false, false],
        lastCompletedDate: ""
      },
      quests: [
        { id: uid("fs"), title: "8小節だけ作る", category: "本命", difficulty: "中", minutes: 20, exp: 150, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "10分だけ作業する", category: "本命", difficulty: "低", minutes: 10, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "1フレーズだけ書く", category: "本命", difficulty: "低", minutes: 5, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "支払い確認", category: "守り", difficulty: "中", minutes: 3, exp: 150, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "明日の予定を見る", category: "守り", difficulty: "低", minutes: 2, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "連絡を1つ返す", category: "守り", difficulty: "低", minutes: 3, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "机の上を3分整える", category: "整え", difficulty: "低", minutes: 3, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "洗濯を回す", category: "整え", difficulty: "低", minutes: 2, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "水を飲む", category: "整え", difficulty: "低", minutes: 1, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "10分だけ散歩する", category: "整え", difficulty: "低", minutes: 10, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "500円を金庫に移す", category: "お金", difficulty: "低", minutes: 2, exp: 50, moneyEffect: "deposit", amount: 500, usageCount: 0, hidden: false, inToday: false, order: 0, vaultId: "v1", createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "コンビニを見送る", category: "お金", difficulty: "低", minutes: 1, exp: 50, moneyEffect: "saved", amount: 380, usageCount: 0, hidden: false, inToday: false, order: 0, vaultId: "v1", createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "買う前に1日置く", category: "お金", difficulty: "中", minutes: 1, exp: 150, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "サブスクを1つ確認する", category: "お金", difficulty: "低", minutes: 5, exp: 50, moneyEffect: "saved", amount: 450, usageCount: 0, hidden: false, inToday: false, order: 0, vaultId: "v1", createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "アプリを開くだけ", category: "超軽", difficulty: "低", minutes: 1, exp: 30, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "メモを1行だけ書く", category: "超軽", difficulty: "低", minutes: 1, exp: 30, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "1分だけ片付ける", category: "超軽", difficulty: "低", minutes: 1, exp: 30, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: uid("fs"), title: "深呼吸する", category: "超軽", difficulty: "低", minutes: 1, exp: 30, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now }
      ],
      vaults: [
        {
          id: "v1",
          title: "外付けSSDの金庫",
          targetAmount: 80000,
          currentAmount: 0,
          savedAmountThisMonth: 0,
          depositedThisMonth: 0,
          savedDeltaPct: 0,
          depositedDeltaPct: 0,
          milestoneStepIndex: 0,
          milestones: [
            { label: "作成", amount: 0 },
            { label: "下見", amount: 20000 },
            { label: "候補決定", amount: 40000 },
            { label: "購入準備", amount: 60000 },
            { label: "購入可能", amount: 80000 }
          ],
          benefits: ["制作データを逃がせる", "容量不安が減る", "制作環境が軽くなる"]
        }
      ],
      mapProgress: {
        currentPrefecture: "北海道",
        prefectureProgress: 0,
        currentRegion: "北海道",
        regionCompleted: 0,
        regionTotal: 1,
        nextSpot: "ラベンダー畑",
        nextPrefecture: "青森県",
        expToNextSpot: 500,
        totalDistanceKm: 0,
        logs: [],
        souvenirs: []
      },
      history: [],
      weekStats: { exp: 0, questCount: 0, saved: 0, deposited: 0 }
    };
  }

  function createDemoState() {
    var now = nowIso();
    var yesterday = new Date(Date.now() - 23 * 3600 * 1000 - 40 * 60 * 1000).toISOString();
    var yesterdayEarlier = new Date(Date.now() - 25 * 3600 * 1000 - 10 * 60 * 1000).toISOString();
    var twoDaysAgo = new Date(Date.now() - 47 * 3600 * 1000 - 5 * 60 * 1000).toISOString();
    var twoDaysAgoEarlier = new Date(Date.now() - 49 * 3600 * 1000 - 20 * 60 * 1000).toISOString();
    return {
      totalExp: 13850,
      streak: {
        currentDays: 12,
        weekCompleted: [true, true, true, true, true, true, false],
        lastCompletedDate: ""
      },
      quests: [
        { id: "q1", title: "支払い確認", category: "守り", difficulty: "中", minutes: 3, exp: 150, moneyEffect: "none", amount: 0, usageCount: 1, hidden: false, inToday: true, order: 1, createdAt: now, updatedAt: now },
        { id: "q2", title: "机の上を3分整える", category: "整え", difficulty: "低", minutes: 3, exp: 50, moneyEffect: "none", amount: 0, usageCount: 1, hidden: false, inToday: true, order: 2, createdAt: now, updatedAt: now },
        { id: "q3", title: "8小節だけ作る", category: "本命", difficulty: "中", minutes: 20, exp: 150, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: true, order: 3, createdAt: now, updatedAt: now },
        { id: "q4", title: "500円を金庫に移す", category: "お金", difficulty: "低", minutes: 2, exp: 50, moneyEffect: "deposit", amount: 500, usageCount: 1, hidden: false, inToday: true, order: 4, vaultId: "v1", createdAt: now, updatedAt: now },
        { id: "q5", title: "コンビニを見送る", category: "お金", difficulty: "低", minutes: 1, exp: 50, moneyEffect: "saved", amount: 380, usageCount: 1, hidden: false, inToday: true, order: 5, vaultId: "v1", createdAt: now, updatedAt: now },

        { id: "q6", title: "サビの仮メロを置く", category: "本命", difficulty: "高", minutes: 20, exp: 300, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: "q7", title: "10分だけ作業する", category: "本命", difficulty: "低", minutes: 10, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: "q8", title: "1フレーズだけ書く", category: "本命", difficulty: "低", minutes: 5, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: "q9", title: "音源を1つだけ整理する", category: "本命", difficulty: "低", minutes: 10, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },

        { id: "q10", title: "サブスク確認", category: "守り", difficulty: "中", minutes: 5, exp: 150, moneyEffect: "saved", amount: 980, usageCount: 1, hidden: false, inToday: false, order: 0, vaultId: "v1", createdAt: now, updatedAt: now },
        { id: "q11", title: "明日の予定を見る", category: "守り", difficulty: "低", minutes: 2, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: "q12", title: "連絡を1つ返す", category: "守り", difficulty: "低", minutes: 3, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },

        { id: "q13", title: "洗濯を回す", category: "整え", difficulty: "低", minutes: 2, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: "q14", title: "ゴミをまとめる", category: "整え", difficulty: "低", minutes: 2, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: "q15", title: "水を飲む", category: "整え", difficulty: "低", minutes: 1, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: "q16", title: "10分だけ散歩する", category: "整え", difficulty: "低", minutes: 10, exp: 50, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },

        { id: "q17", title: "外食を見送る", category: "お金", difficulty: "低", minutes: 1, exp: 50, moneyEffect: "saved", amount: 600, usageCount: 0, hidden: false, inToday: false, order: 0, vaultId: "v1", createdAt: now, updatedAt: now },
        { id: "q18", title: "買う前に1日置く", category: "お金", difficulty: "中", minutes: 1, exp: 150, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: "q19", title: "サブスクを1つ確認する", category: "お金", difficulty: "低", minutes: 5, exp: 50, moneyEffect: "saved", amount: 450, usageCount: 0, hidden: false, inToday: false, order: 0, vaultId: "v1", createdAt: now, updatedAt: now },

        { id: "q20", title: "財布を見るだけ", category: "超軽", difficulty: "低", minutes: 2, exp: 30, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: "q21", title: "アプリを開くだけ", category: "超軽", difficulty: "低", minutes: 1, exp: 30, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: "q22", title: "メモを1行だけ書く", category: "超軽", difficulty: "低", minutes: 1, exp: 30, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: "q23", title: "1分だけ片付ける", category: "超軽", difficulty: "低", minutes: 1, exp: 30, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now },
        { id: "q24", title: "深呼吸する", category: "超軽", difficulty: "低", minutes: 1, exp: 30, moneyEffect: "none", amount: 0, usageCount: 0, hidden: false, inToday: false, order: 0, createdAt: now, updatedAt: now }
      ],
      vaults: [
        {
          id: "v1",
          title: "外付けSSDの金庫",
          targetAmount: 80000,
          currentAmount: 12000,
          savedAmountThisMonth: 1360,
          depositedThisMonth: 500,
          savedDeltaPct: 0,
          depositedDeltaPct: 0,
          milestoneStepIndex: 1,
          milestones: [
            { label: "作成", amount: 0 },
            { label: "下見", amount: 20000 },
            { label: "候補決定", amount: 40000 },
            { label: "購入準備", amount: 60000 },
            { label: "購入可能", amount: 80000 }
          ],
          benefits: ["制作データを逃がせる", "容量不安が減る", "制作環境が軽くなる"]
        }
      ],
      mapProgress: {
        currentPrefecture: "宮城県",
        prefectureProgress: 56,
        currentRegion: "東北",
        regionCompleted: 3,
        regionTotal: 6,
        nextSpot: "県境",
        nextPrefecture: "岩手県",
        expToNextSpot: 620,
        totalDistanceKm: 13.8,
        logs: [
          { label: "北海道 到着", type: "prefecture", date: "05/01 09:20" },
          { label: "ラベンダー畑 発見", type: "souvenir", date: "05/01 11:45" },
          { label: "青森県 到着", type: "prefecture", date: "05/02 10:10" },
          { label: "りんご園 発見", type: "souvenir", date: "05/02 14:32" },
          { label: "岩手県 到着", type: "prefecture", date: "05/03 09:05" },
          { label: "牧場 発見", type: "souvenir", date: "05/03 12:18" },
          { label: "宮城県 進行中", type: "current", date: "現在地" }
        ],
        souvenirs: [
          { name: "ラベンダー", rarity: "コモン" },
          { name: "青森りんご", rarity: "コモン" },
          { name: "南部鉄器", rarity: "レア" },
          { name: "ずんだ餅", rarity: "コモン" }
        ]
      },
      history: [
        { id: "h1", questId: "q1", title: "支払い確認", category: "守り", difficulty: "中", exp: 150, moneyEffect: "none", amount: 0, completedAt: now },
        { id: "h2", questId: "q4", title: "500円を金庫に移す", category: "お金", difficulty: "低", exp: 50, moneyEffect: "deposit", amount: 500, completedAt: yesterday },
        { id: "h3", questId: "q5", title: "コンビニを見送る", category: "お金", difficulty: "低", exp: 50, moneyEffect: "saved", amount: 380, completedAt: yesterdayEarlier },
        { id: "h4", questId: "q2", title: "机の上を3分整える", category: "整え", difficulty: "低", exp: 50, moneyEffect: "none", amount: 0, completedAt: twoDaysAgo },
        { id: "h5", questId: "q10", title: "サブスク確認", category: "守り", difficulty: "中", exp: 150, moneyEffect: "saved", amount: 980, completedAt: twoDaysAgoEarlier }
      ],
      weekStats: { exp: 450, questCount: 5, saved: 1360, deposited: 500 }
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createFreshState();
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.quests) return createFreshState();
      return parsed;
    } catch (e) {
      return createFreshState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  var state = loadState();

  function migrateQuestOrder() {
    var maxOrder = 0;
    state.quests.forEach(function (q) {
      if (typeof q.order === "number" && q.order > maxOrder) maxOrder = q.order;
    });
    state.quests.forEach(function (q) {
      if (q.inToday && (typeof q.order !== "number" || q.order <= 0)) {
        maxOrder += 1;
        q.order = maxOrder;
      }
      if (typeof q.order !== "number") q.order = 0;
    });
  }

  function cloneDefault(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function numberOr(value, fallback) {
    var n = typeof value === "number" ? value : parseInt(value, 10);
    return isNaN(n) ? fallback : n;
  }

  function historyTotals() {
    return state.history.reduce(function (totals, h) {
      var exp = numberOr(h.exp, 0);
      var amount = numberOr(h.amount, 0);
      totals.exp += exp;
      totals.questCount += 1;
      if (h.moneyEffect === "saved") totals.saved += amount;
      if (h.moneyEffect === "deposit") totals.deposited += amount;
      return totals;
    }, { exp: 0, questCount: 0, saved: 0, deposited: 0 });
  }

  function normalizeState() {
    var defaults = createDemoState();
    if (!Array.isArray(state.quests)) state.quests = [];
    state.quests = state.quests.filter(function (q) { return q && typeof q === "object"; });
    if (!Array.isArray(state.vaults) || state.vaults.length === 0) state.vaults = cloneDefault(defaults.vaults);
    if (!state.mapProgress) state.mapProgress = cloneDefault(defaults.mapProgress);
    if (!Array.isArray(state.history)) state.history = [];
    if (!state.streak) state.streak = cloneDefault(defaults.streak);
    if (!Array.isArray(state.streak.weekCompleted)) state.streak.weekCompleted = [false, false, false, false, false, false, false];
    if (typeof state.streak.currentDays !== "number") state.streak.currentDays = 0;
    if (typeof state.streak.lastCompletedDate !== "string") state.streak.lastCompletedDate = "";
    if (typeof state.totalExp !== "number") state.totalExp = 0;
    state.quests.forEach(function (q) {
      if (!q.id) q.id = uid("q");
      if (typeof q.title !== "string") q.title = "無題のクエスト";
      if (typeof q.category !== "string") q.category = "本命";
      if (typeof q.difficulty !== "string") q.difficulty = "低";
      q.minutes = numberOr(q.minutes, 3);
      q.exp = numberOr(q.exp, calculateExp(q.difficulty, q.category));
      if (["none", "deposit", "saved"].indexOf(q.moneyEffect) === -1) q.moneyEffect = "none";
      q.amount = q.moneyEffect === "none" ? 0 : numberOr(q.amount, 0);
      q.usageCount = numberOr(q.usageCount, 0);
      q.hidden = typeof q.hidden === "boolean" ? q.hidden : false;
      q.inToday = typeof q.inToday === "boolean" ? q.inToday : false;
      if (q.hidden) q.inToday = false;
      if (typeof q.order !== "number" && q.order !== undefined) q.order = numberOr(q.order, 0);
      if (typeof q.createdAt !== "string") q.createdAt = nowIso();
      if (typeof q.updatedAt !== "string") q.updatedAt = q.createdAt;
    });
    var totals = historyTotals();
    if (!state.weekStats || typeof state.weekStats !== "object") state.weekStats = {};
    state.weekStats.exp = numberOr(state.weekStats.exp, totals.exp);
    state.weekStats.questCount = numberOr(state.weekStats.questCount, totals.questCount);
    state.weekStats.saved = numberOr(state.weekStats.saved, totals.saved);
    state.weekStats.deposited = numberOr(state.weekStats.deposited, totals.deposited);
    Object.keys(defaults.mapProgress).forEach(function (key) {
      if (state.mapProgress[key] === undefined) state.mapProgress[key] = cloneDefault(defaults.mapProgress[key]);
    });
    if (!Array.isArray(state.mapProgress.logs)) state.mapProgress.logs = [];
    if (!Array.isArray(state.mapProgress.souvenirs)) state.mapProgress.souvenirs = [];
    state.vaults.forEach(function (v) {
      if (typeof v.title !== "string") v.title = defaults.vaults[0].title;
      if (typeof v.currentAmount !== "number") v.currentAmount = 0;
      if (typeof v.targetAmount !== "number") v.targetAmount = 1;
      if (typeof v.savedAmountThisMonth !== "number") v.savedAmountThisMonth = totals.saved;
      if (typeof v.depositedThisMonth !== "number") v.depositedThisMonth = totals.deposited;
      if (typeof v.savedDeltaPct !== "number") v.savedDeltaPct = 0;
      if (typeof v.depositedDeltaPct !== "number") v.depositedDeltaPct = 0;
      if (!Array.isArray(v.milestones)) v.milestones = cloneDefault(defaults.vaults[0].milestones);
      if (!Array.isArray(v.benefits)) v.benefits = [];
    });
    migrateQuestOrder();
  }

  normalizeState();

  function nextTodayOrder() {
    var max = 0;
    state.quests.forEach(function (q) {
      if (q.inToday && typeof q.order === "number" && q.order > max) max = q.order;
    });
    return max + 1;
  }

  function addQuestToToday(quest) {
    if (!quest.inToday) {
      quest.order = nextTodayOrder();
    }
    quest.inToday = true;
    quest.hidden = false;
  }

  function moveTodayQuest(id, direction) {
    var list = todayQuests();
    var idx = list.findIndex(function (q) { return q.id === id; });
    if (idx === -1) return;
    var swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= list.length) return;
    var a = list[idx];
    var b = list[swapIdx];
    var tmp = a.order;
    a.order = b.order;
    b.order = tmp;
    saveState();
    renderHome();
  }

  function calculateExp(difficulty, category) {
    if (category === "超軽") return 30;
    if (difficulty === "低") return 50;
    if (difficulty === "中") return 150;
    if (difficulty === "高") return 300;
    return 50;
  }

  function getVault(id) {
    for (var i = 0; i < state.vaults.length; i++) {
      if (state.vaults[i].id === id) return state.vaults[i];
    }
    return state.vaults[0];
  }

  function fmtMoney(n) {
    return Math.round(n).toLocaleString("ja-JP");
  }

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  /* ===================== NAVIGATION ===================== */

  var SCREENS = ["home", "shelf", "form", "complete", "map", "vault", "vault-detail", "vault-edit", "records", "settings"];
  var currentScreenName = "home";

  function showScreen(name) {
    currentScreenName = name;
    SCREENS.forEach(function (s) {
      var node = document.getElementById("screen-" + s);
      if (node) node.classList.toggle("hidden", s !== name);
    });
    document.querySelectorAll(".nav-btn").forEach(function (btn) {
      var target = btn.getAttribute("data-screen");
      var navMap = { home: "home", shelf: "shelf", map: "map", vault: "vault", records: "records" };
      var activeNav = navMap[name] || (name === "vault-detail" || name === "vault-edit" ? "vault" : name === "settings" ? "records" : null);
      btn.classList.toggle("active", target === activeNav);
    });
    window.scrollTo(0, 0);
    refreshScreen(name);
  }

  function refreshScreen(name) {
    if (name === "home") renderHome();
    if (name === "shelf") renderShelf();
    if (name === "map") renderMap();
    if (name === "vault") renderVaultTop();
    if (name === "vault-detail") renderVaultDetail(currentVaultId);
    if (name === "vault-edit") renderVaultEdit(currentVaultId);
    if (name === "records") renderRecords();
    if (name === "settings") renderSettings();
  }

  /* ===================== MAP SVG ===================== */

  function buildMapSvg(svgEl, width, height, big) {
    var pct = Math.max(0, Math.min(100, state.mapProgress.prefectureProgress));
    var pathD = big
      ? "M110 260 L100 220 L120 190 L105 150 L130 110 L115 70 L140 30"
      : "M80 190 L74 160 L86 135 L78 100 L92 70 L84 40 L98 14";
    var sw = big ? 3.4 : 2.6;
    var uid = (big ? "B" : "S") + Math.random().toString(36).slice(2, 6);

    svgEl.setAttribute("viewBox", "0 0 " + width + " " + height);
    svgEl.innerHTML =
      '<defs><linearGradient id="routeGrad' + uid + '" x1="0" y1="1" x2="0" y2="0">' +
      '<stop offset="0%" stop-color="#5fcf9d"/><stop offset="100%" stop-color="#c9ecdc"/>' +
      '</linearGradient></defs>' +
      '<path d="' + pathD + '" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="' + sw + '" stroke-linecap="round" stroke-dasharray="1 5"/>' +
      '<path class="map-route-traveled" d="' + pathD + '" fill="none" stroke="url(#routeGrad' + uid + ')" stroke-width="' + sw + '" stroke-linecap="round"/>' +
      '<circle class="map-route-start" cx="0" cy="0" r="' + (big ? 3 : 2.3) + '" fill="rgba(255,255,255,0.3)"/>' +
      '<g class="map-route-next"></g>' +
      '<circle class="map-route-current" r="' + (big ? 6 : 4.4) + '" fill="#bdf0d8" stroke="#dffaeb" stroke-width="1"/>';

    var traveled = svgEl.querySelector(".map-route-traveled");
    var total = traveled.getTotalLength();
    traveled.setAttribute("stroke-dasharray", total);
    traveled.setAttribute("stroke-dashoffset", total * (1 - pct / 100));

    var startPt = traveled.getPointAtLength(0);
    svgEl.querySelector(".map-route-start").setAttribute("cx", startPt.x);
    svgEl.querySelector(".map-route-start").setAttribute("cy", startPt.y);

    var curPt = traveled.getPointAtLength(total * (pct / 100));
    var currentDot = svgEl.querySelector(".map-route-current");
    currentDot.setAttribute("cx", curPt.x);
    currentDot.setAttribute("cy", curPt.y);

    var endPt = traveled.getPointAtLength(total);
    var flagSize = big ? 1 : 0.78;
    svgEl.querySelector(".map-route-next").innerHTML =
      '<g transform="translate(' + (endPt.x - 5 * flagSize) + ',' + (endPt.y - 13 * flagSize) + ') scale(' + flagSize + ')">' +
      '<line x1="5" y1="0" x2="5" y2="14" stroke="#d9b35f" stroke-width="1.4" opacity="0.85"/>' +
      '<path d="M5 1h9l-3.2 3 3.2 3H5z" fill="#d9b35f" opacity="0.92"/>' +
      '</g>';
  }

  /* ===================== HOME ===================== */

  function renderLanternRow(containerId, week) {
    var row = document.getElementById(containerId);
    row.innerHTML = "";
    week.forEach(function (lit) {
      var d = document.createElement("div");
      d.className = "lantern" + (lit ? " lit" : "");
      d.innerHTML = '<span class="lantern-bulb"></span><span class="lantern-pole"></span><span class="lantern-base"></span>';
      row.appendChild(d);
    });
  }

  function todayQuests() {
    return state.quests
      .filter(function (q) { return q.inToday && !q.hidden; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  }

  function questTagsHtml(q) {
    return (
      '<span class="tag-pill">' + q.category + '</span>' +
      '<span class="tag-diff diff-' + q.difficulty + '">' + q.difficulty + '</span>' +
      '<span class="tag-time">' + iconHtml("clock", "tag-clock") + q.minutes + '分</span>'
    );
  }

  function moneyHintHtml(q) {
    if (q.moneyEffect === "deposit") return '<span class="reward-money">金庫 +¥' + fmtMoney(q.amount) + '</span>';
    if (q.moneyEffect === "saved") return '<span class="reward-money">守った額 +¥' + fmtMoney(q.amount) + '</span>';
    return "";
  }

  function renderHome() {
    document.getElementById("home-totalExp").textContent = state.totalExp.toLocaleString("ja-JP");

    var list = document.getElementById("today-quest-list");
    list.innerHTML = "";
    var quests = todayQuests();
    quests.forEach(function (q, idx) {
      var li = document.createElement("li");
      li.innerHTML =
        '<div class="quest-item">' +
        '<button class="quest-item-main" data-quest-id="' + q.id + '">' +
        '<span class="quest-icon-wrap">' +
        '<span class="quest-icon cat-' + q.category + '">' + iconHtml(CATEGORY_ICON[q.category]) + '</span>' +
        '<span class="quest-rank">' + (idx + 1) + '</span>' +
        '</span>' +
        '<span class="quest-body">' +
        '<span class="quest-title">' + q.title + '</span>' +
        '<span class="quest-tags">' + questTagsHtml(q) + '</span>' +
        '</span>' +
        '<span class="quest-reward">' +
        '<span class="reward-exp">+' + q.exp + '<small>EXP</small></span>' +
        moneyHintHtml(q) +
        '</span>' +
        '</button>' +
        '<div class="quest-reorder">' +
        '<button class="reorder-btn" data-dir="up" data-id="' + q.id + '" aria-label="上へ"' + (idx === 0 ? " disabled" : "") + '>▲</button>' +
        '<button class="reorder-btn" data-dir="down" data-id="' + q.id + '" aria-label="下へ"' + (idx === quests.length - 1 ? " disabled" : "") + '>▼</button>' +
        '</div>' +
        '</div>';
      list.appendChild(li);
    });
    list.querySelectorAll(".quest-item-main").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openComplete(btn.getAttribute("data-quest-id"));
      });
    });
    list.querySelectorAll(".reorder-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        moveTodayQuest(btn.getAttribute("data-id"), btn.getAttribute("data-dir"));
      });
    });

    if (quests.length === 0) {
      var emptyLi = document.createElement("li");
      emptyLi.className = "quest-empty-state";
      emptyLi.innerHTML =
        '<p class="quest-empty-text">今日のクエストはまだありません</p>' +
        '<div class="quest-empty-btns">' +
        '<button class="ghost-btn quest-empty-go-shelf">クエスト棚</button>' +
        '<button class="ghost-btn quest-empty-go-add">＋ 追加</button>' +
        '</div>';
      list.appendChild(emptyLi);
      emptyLi.querySelector(".quest-empty-go-shelf").addEventListener("click", function () { showScreen("shelf"); });
      emptyLi.querySelector(".quest-empty-go-add").addEventListener("click", function () { openForm(null); });
    }
    document.getElementById("home-reorder-hint").classList.toggle("hidden", quests.length === 0);

    document.getElementById("home-streakDays").textContent = state.streak.currentDays;
    var weekCompletedCount = state.streak.weekCompleted.filter(Boolean).length;
    document.getElementById("home-weekCount").textContent = weekCompletedCount + "/" + state.streak.weekCompleted.length;
    renderLanternRow("lantern-row", state.streak.weekCompleted);

    var mp = state.mapProgress;
    document.getElementById("home-currentPref").textContent = mp.currentPrefecture;
    document.getElementById("home-prefPct").textContent = mp.prefectureProgress;
    document.getElementById("home-nextSpot").textContent = mp.nextSpot;
    document.getElementById("home-expToNext").textContent = mp.expToNextSpot;
    document.getElementById("home-nextPref").textContent = mp.nextPrefecture || "次";
    buildMapSvg(document.getElementById("home-map-svg"), 160, 200, false);

    var vault = state.vaults[0];
    var homePct = Math.min(100, (vault.currentAmount / vault.targetAmount) * 100);
    document.getElementById("home-vaultTitle").textContent = vault.title;
    document.getElementById("home-vault-visual").innerHTML = vaultVisualHtml(homePct);
    document.getElementById("home-vaultCurrent").textContent = "¥" + fmtMoney(vault.currentAmount);
    document.getElementById("home-vaultTarget").textContent = "¥" + fmtMoney(vault.targetAmount);
    document.getElementById("home-vaultBar").style.width = homePct + "%";
    document.getElementById("home-vaultRest").textContent = fmtMoney(Math.max(0, vault.targetAmount - vault.currentAmount));
    document.getElementById("home-savedMonth").textContent = fmtMoney(vault.savedAmountThisMonth);
  }

  /* ===================== SHELF ===================== */

  var shelfTab = "favorite";

  function renderShelf() {
    var visible = state.quests.filter(function (q) { return !q.hidden; });
    document.getElementById("shelf-count").textContent = state.quests.length;
    document.getElementById("shelf-hidden-hint").classList.toggle("hidden", shelfTab === "hidden");

    var list = document.getElementById("shelf-list");
    list.innerHTML = "";

    var items;
    if (shelfTab === "hidden") {
      items = state.quests.filter(function (q) { return q.hidden; });
    } else if (shelfTab === "history") {
      items = visible.slice().sort(function (a, b) { return new Date(b.updatedAt) - new Date(a.updatedAt); });
    } else {
      items = visible.slice().sort(function (a, b) { return b.usageCount - a.usageCount; });
    }

    if (items.length === 0) {
      list.innerHTML = '<p class="hidden-note">該当するクエストはありません</p>';
    }

    items.forEach(function (q) {
      var li = document.createElement("li");
      li.className = "shelf-item";
      var actionsHtml = q.hidden
        ? '<button class="shelf-action-btn add" data-act="restore" data-id="' + q.id + '">復元</button>' +
          '<button class="shelf-action-btn danger purge" data-act="purge" data-id="' + q.id + '">完全削除</button>'
        : '<button class="shelf-action-btn add" data-act="addtoday" data-id="' + q.id + '">＋ 今日に追加</button>' +
          '<button class="shelf-action-btn" data-act="edit" data-id="' + q.id + '">' + iconHtml("edit", "icon-inline") + ' 編集</button>' +
          '<button class="shelf-action-btn danger" data-act="hide" data-id="' + q.id + '">' + iconHtml("trash", "icon-inline") + ' 非表示</button>';

      li.innerHTML =
        '<div class="shelf-item-top">' +
        '<span class="quest-icon cat-' + q.category + '">' + iconHtml(CATEGORY_ICON[q.category]) + '</span>' +
        '<div class="shelf-item-meta">' +
        '<p class="shelf-item-name">' + q.title + '</p>' +
        '<div class="shelf-item-tags">' + questTagsHtml(q) + '<span class="usage-count">使用' + q.usageCount + '回</span></div>' +
        '</div>' +
        '</div>' +
        '<div class="shelf-item-actions">' + actionsHtml + '</div>';
      list.appendChild(li);
    });

    list.querySelectorAll("[data-act]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var act = btn.getAttribute("data-act");
        var id = btn.getAttribute("data-id");
        var quest = state.quests.find(function (q) { return q.id === id; });
        if (!quest) return;
        if (act === "addtoday") { addQuestToToday(quest); }
        if (act === "edit") { openForm(quest); return; }
        if (act === "hide") { quest.hidden = true; quest.inToday = false; }
        if (act === "restore") { quest.hidden = false; }
        if (act === "purge") {
          if (!confirm('「' + quest.title + '」を完全に削除しますか？この操作は元に戻せません。')) return;
          state.quests = state.quests.filter(function (q) { return q.id !== id; });
        }
        saveState();
        renderShelf();
      });
    });

    var recentRow = document.getElementById("shelf-recent-row");
    recentRow.innerHTML = "";
    var recent = visible.slice().sort(function (a, b) { return new Date(b.updatedAt) - new Date(a.updatedAt); }).slice(0, 3);
    recent.forEach(function (q) {
      var chip = document.createElement("span");
      chip.className = "recent-chip";
      chip.innerHTML = iconHtml(CATEGORY_ICON[q.category], "chip-icon") + " " + q.title + ' <button data-id="' + q.id + '">＋</button>';
      recentRow.appendChild(chip);
    });
    recentRow.querySelectorAll("button[data-id]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var quest = state.quests.find(function (q) { return q.id === btn.getAttribute("data-id"); });
        if (quest) { addQuestToToday(quest); saveState(); }
      });
    });
  }

  document.querySelectorAll("[data-shelf-tab]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      shelfTab = btn.getAttribute("data-shelf-tab");
      document.querySelectorAll("[data-shelf-tab]").forEach(function (b) { b.classList.toggle("active", b === btn); });
      renderShelf();
    });
  });

  document.getElementById("btn-manage-hidden").addEventListener("click", function () {
    shelfTab = "hidden";
    document.querySelectorAll("[data-shelf-tab]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-shelf-tab") === "hidden");
    });
    renderShelf();
  });

  document.getElementById("btn-new-quest").addEventListener("click", function () { openForm(null); });
  document.getElementById("btn-quick-shelf").addEventListener("click", function () { showScreen("shelf"); });
  document.getElementById("btn-quick-add").addEventListener("click", function () { openForm(null); });
  document.getElementById("btn-quick-review").addEventListener("click", function () { showScreen("records"); });
  document.getElementById("btn-edit-list").addEventListener("click", function () { showScreen("shelf"); });
  document.getElementById("home-vault-card").addEventListener("click", function () {
    currentVaultId = state.vaults[0].id;
    showScreen("vault-detail");
  });

  /* ===================== QUEST FORM ===================== */

  var editingQuestId = null;
  var formValues = { category: "本命", difficulty: "低", minutes: "3", moneyEffect: "none", destination: "today" };

  function setPillSelected(groupId, value) {
    var group = document.getElementById(groupId);
    group.querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("selected", b.getAttribute("data-value") === String(value));
    });
  }

  function updateRewardPreview() {
    var exp = calculateExp(formValues.difficulty, formValues.category);
    document.getElementById("f-reward-preview").textContent = "+" + exp;
    return exp;
  }

  ["f-category", "f-difficulty", "f-minutes", "f-moneyeffect", "f-destination"].forEach(function (groupId) {
    document.getElementById(groupId).querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var name = document.getElementById(groupId).getAttribute("data-name");
        formValues[name] = btn.getAttribute("data-value");
        setPillSelected(groupId, formValues[name]);
        updateRewardPreview();
        document.getElementById("f-amount-wrap").classList.toggle("hidden", formValues.moneyEffect === "none");
      });
    });
  });

  function openForm(quest) {
    editingQuestId = quest ? quest.id : null;
    document.getElementById("form-title").textContent = quest ? "クエストを編集" : "新しいクエスト";
    document.getElementById("f-delete").classList.toggle("hidden", !quest);
    document.getElementById("f-title").value = quest ? quest.title : "";
    formValues = {
      category: quest ? quest.category : "本命",
      difficulty: quest ? quest.difficulty : "低",
      minutes: quest ? String(quest.minutes) : "3",
      moneyEffect: quest ? quest.moneyEffect : "none",
      destination: quest ? (quest.inToday ? "today" : quest.hidden ? "hidden" : "shelf") : "today"
    };
    document.getElementById("f-amount").value = quest ? quest.amount || "" : "";
    setPillSelected("f-category", formValues.category);
    setPillSelected("f-difficulty", formValues.difficulty);
    setPillSelected("f-minutes", formValues.minutes);
    setPillSelected("f-moneyeffect", formValues.moneyEffect);
    setPillSelected("f-destination", formValues.destination);
    document.getElementById("f-amount-wrap").classList.toggle("hidden", formValues.moneyEffect === "none");
    updateRewardPreview();
    showScreen("form");
  }

  document.getElementById("quest-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var title = document.getElementById("f-title").value.trim();
    if (!title) return;
    var exp = calculateExp(formValues.difficulty, formValues.category);
    var amount = formValues.moneyEffect === "none" ? 0 : (parseInt(document.getElementById("f-amount").value, 10) || 0);
    var now = nowIso();

    var enteringToday = formValues.destination === "today";

    if (editingQuestId) {
      var q = state.quests.find(function (x) { return x.id === editingQuestId; });
      var wasInToday = q.inToday;
      q.title = title;
      q.category = formValues.category;
      q.difficulty = formValues.difficulty;
      q.minutes = parseInt(formValues.minutes, 10);
      q.exp = exp;
      q.moneyEffect = formValues.moneyEffect;
      q.amount = amount;
      q.inToday = enteringToday;
      q.hidden = formValues.destination === "hidden";
      q.updatedAt = now;
      if (enteringToday && !wasInToday) q.order = nextTodayOrder();
    } else {
      var newQuest = {
        id: uid("q"),
        title: title,
        category: formValues.category,
        difficulty: formValues.difficulty,
        minutes: parseInt(formValues.minutes, 10),
        exp: exp,
        moneyEffect: formValues.moneyEffect,
        amount: amount,
        usageCount: 0,
        hidden: formValues.destination === "hidden",
        inToday: enteringToday,
        order: 0,
        createdAt: now,
        updatedAt: now
      };
      state.quests.push(newQuest);
      if (enteringToday) newQuest.order = nextTodayOrder();
    }
    saveState();
    showScreen("home");
  });

  document.getElementById("f-cancel").addEventListener("click", function () { showScreen("shelf"); });
  document.getElementById("f-delete").addEventListener("click", function () {
    if (!editingQuestId) return;
    state.quests = state.quests.filter(function (q) { return q.id !== editingQuestId; });
    saveState();
    showScreen("shelf");
  });

  /* ===================== QUEST COMPLETE ===================== */

  function updateMapProgress(expGained) {
    var mp = state.mapProgress;
    var progressGain = Math.floor(expGained / 25);
    var before = mp.prefectureProgress;
    mp.prefectureProgress = Math.min(100, mp.prefectureProgress + progressGain);
    var reachedSpot = false;
    if (mp.prefectureProgress >= 100) {
      mp.prefectureProgress = 0;
      reachedSpot = true;
    }
    mp.totalDistanceKm = Math.round((state.totalExp / 1000) * 10) / 10;
    mp.expToNextSpot = Math.max(0, mp.expToNextSpot - expGained);
    return { before: before, after: mp.prefectureProgress, reachedSpot: reachedSpot };
  }

  function openComplete(questId) {
    var quest = state.quests.find(function (q) { return q.id === questId; });
    if (!quest) return;

    state.totalExp += quest.exp;
    quest.usageCount += 1;
    quest.updatedAt = nowIso();
    quest.inToday = false;

    state.history.unshift({
      id: uid("h"),
      questId: quest.id,
      title: quest.title,
      category: quest.category,
      difficulty: quest.difficulty,
      exp: quest.exp,
      moneyEffect: quest.moneyEffect,
      amount: quest.amount,
      completedAt: nowIso()
    });

    var vault = quest.vaultId ? getVault(quest.vaultId) : state.vaults[0];
    if (quest.moneyEffect === "deposit") {
      vault.currentAmount += quest.amount;
      vault.depositedThisMonth += quest.amount;
      state.weekStats.deposited += quest.amount;
    }
    if (quest.moneyEffect === "saved") {
      vault.savedAmountThisMonth += quest.amount;
      state.weekStats.saved += quest.amount;
    }

    var mapResult = updateMapProgress(quest.exp);

    state.streak.currentDays += 0;
    var todayIdx = new Date().getDay();
    state.streak.weekCompleted[(todayIdx + 6) % 7] = true;

    state.weekStats.exp += quest.exp;
    state.weekStats.questCount += 1;

    saveState();

    document.getElementById("c-questname").textContent = quest.title;
    document.getElementById("c-exp").textContent = quest.exp;
    document.getElementById("c-pref").textContent = state.mapProgress.currentPrefecture;
    document.getElementById("c-pct-before").textContent = mapResult.before;
    document.getElementById("c-pct-after").textContent = mapResult.after;
    document.getElementById("c-streak").textContent = state.streak.currentDays;

    var moneyCard = document.getElementById("c-money-card");
    var depositRow = document.getElementById("c-deposit-row");
    var savedRow = document.getElementById("c-saved-row");
    var anyMoney = quest.moneyEffect !== "none";
    moneyCard.classList.toggle("hidden", !anyMoney);
    depositRow.classList.toggle("hidden", quest.moneyEffect !== "deposit");
    savedRow.classList.toggle("hidden", quest.moneyEffect !== "saved");
    if (quest.moneyEffect === "deposit") document.getElementById("c-deposit-amount").textContent = fmtMoney(quest.amount);
    if (quest.moneyEffect === "saved") document.getElementById("c-saved-amount").textContent = fmtMoney(quest.amount);

    document.getElementById("c-nextSpot").textContent = state.mapProgress.nextSpot;
    document.getElementById("c-expToNext").textContent = state.mapProgress.expToNextSpot;
    buildMapSvg(document.getElementById("c-map-svg"), 160, 100, false);

    var spotCard = document.getElementById("c-spot-card");
    if (mapResult.reachedSpot) {
      var souvenir = { name: "ずんだ餅", rarity: "コモン" };
      spotCard.classList.remove("hidden");
      document.getElementById("c-spot-label").textContent = "ずんだ茶屋 を発見";
      document.getElementById("c-souvenir-icon").innerHTML = souvenirVisualHtml(souvenir.name, souvenir.rarity, "souvenir-icon-visual");
      document.getElementById("c-spot-card").classList.add("spot-reveal");
      document.getElementById("c-souvenir-name").textContent = souvenir.name;
      document.getElementById("c-souvenir-rarity").textContent = souvenir.rarity;
      state.mapProgress.souvenirs.push(souvenir);
      state.mapProgress.logs.push({ label: souvenir.name + " 発見", type: "souvenir", date: "今" });
      saveState();
    } else {
      spotCard.classList.add("hidden");
    }

    showScreen("complete");
  }

  document.getElementById("c-next-quest").addEventListener("click", function () { showScreen("home"); });
  document.getElementById("c-view-map").addEventListener("click", function () { showScreen("map"); });

  /* ===================== MAP SCREEN ===================== */

  function renderMap() {
    var mp = state.mapProgress;
    document.getElementById("map-totalExp").textContent = state.totalExp.toLocaleString("ja-JP");
    document.getElementById("map-distance").textContent = mp.totalDistanceKm;
    document.getElementById("map-currentPref").textContent = mp.currentPrefecture;
    document.getElementById("map-prefPct").textContent = mp.prefectureProgress;
    document.getElementById("map-prefBar").style.width = mp.prefectureProgress + "%";
    document.getElementById("map-nextSpot").textContent = mp.nextSpot;
    document.getElementById("map-expToNext").textContent = mp.expToNextSpot;
    document.getElementById("map-regionCompleted").textContent = mp.regionCompleted;
    document.getElementById("map-regionTotal").textContent = mp.regionTotal;
    buildMapSvg(document.getElementById("map-main-svg"), 220, 280, true);

    var logList = document.getElementById("map-log-list");
    logList.innerHTML = "";
    var logIcons = { prefecture: "flag", souvenir: "gift", current: "map" };
    mp.logs.forEach(function (log) {
      var li = document.createElement("li");
      li.className = "travel-log-item";
      li.innerHTML =
        '<span class="travel-log-icon' + (log.type === "current" ? " current" : "") + '">' + iconHtml(logIcons[log.type]) + '</span>' +
        '<span class="travel-log-text">' + log.label.replace(" 進行中", "") + (log.type === "current" ? '<span class="current-tag">現在地</span>' : "") + '</span>' +
        '<span class="travel-log-date">' + log.date + '</span>';
      logList.appendChild(li);
    });

    var souvenirGrid = document.getElementById("map-souvenir-grid");
    souvenirGrid.innerHTML = "";
    mp.souvenirs.forEach(function (s) {
      var cell = document.createElement("div");
      cell.className = "souvenir-cell";
      var isRare = s.rarity === "レア";
      var dots = (isRare ? [1, 2, 3] : [1]).map(function () { return "<i></i>"; }).join("");
      cell.innerHTML =
        '<div class="souvenir-cell-icon">' + souvenirVisualHtml(s.name, s.rarity, "souvenir-cell-visual") + '</div>' +
        '<p class="souvenir-cell-name">' + s.name + '</p>' +
        '<p class="souvenir-cell-rarity ' + (isRare ? "rare" : "common") + '">' + s.rarity + '<span class="rarity-dots">' + dots + '</span></p>';
      souvenirGrid.appendChild(cell);
    });
  }

  /* ===================== VAULT TOP ===================== */

  var currentVaultId = "v1";

  function relatedMoneyQuests(vaultId) {
    return state.quests
      .filter(function (q) { return q.moneyEffect !== "none" && (q.vaultId === vaultId || (!q.vaultId && vaultId === "v1")); })
      .sort(function (a, b) { return new Date(b.updatedAt) - new Date(a.updatedAt); });
  }

  function moneyQuestItemHtml(q) {
    var rewardLabel = q.moneyEffect === "deposit" ? "金庫 +¥" + fmtMoney(q.amount) : q.moneyEffect === "saved" ? "守った額 +¥" + fmtMoney(q.amount) : "";
    return (
      '<li class="money-quest-item">' +
      '<span class="money-quest-icon">' + iconHtml(CATEGORY_ICON[q.category]) + '</span>' +
      '<span class="money-quest-body">' +
      '<span class="money-quest-title">' + q.title + '</span>' +
      '<span class="money-quest-tags">' + questTagsHtml(q) + '</span>' +
      '</span>' +
      '<span class="money-quest-reward">' +
      '<span class="money-quest-exp">+' + q.exp + 'EXP</span>' +
      (rewardLabel ? '<span class="money-quest-amount">' + rewardLabel + '</span>' : "") +
      '</span>' +
      '</li>'
    );
  }

  function renderVaultTop() {
    var vault = state.vaults[0];
    currentVaultId = vault.id;
    var topPct = Math.min(100, (vault.currentAmount / vault.targetAmount) * 100);
    document.getElementById("vt-title").textContent = vault.title;
    document.getElementById("vt-vault-visual").innerHTML = vaultVisualHtml(topPct);
    document.getElementById("vt-current").textContent = "¥" + fmtMoney(vault.currentAmount);
    document.getElementById("vt-target").textContent = "¥" + fmtMoney(vault.targetAmount);
    document.getElementById("vt-bar").style.width = topPct + "%";
    document.getElementById("vt-rest").textContent = fmtMoney(Math.max(0, vault.targetAmount - vault.currentAmount));

    var nextMilestone = vault.milestones.find(function (m) { return m.amount > vault.currentAmount; });
    document.getElementById("vt-nextMilestone").textContent = nextMilestone ? fmtMoney(nextMilestone.amount - vault.currentAmount) : "0";

    var msRow = document.getElementById("vt-milestones");
    msRow.innerHTML = "";
    vault.milestones.forEach(function (m, i) {
      var done = vault.currentAmount >= m.amount && i > 0;
      var isCurrent = !done && m.amount > 0 && (i === 0 || vault.currentAmount >= vault.milestones[i - 1].amount);
      var dot = document.createElement("div");
      dot.className = "milestone-dot" + (done ? " done" : "") + (isCurrent ? " current" : "");
      dot.innerHTML = '<span class="milestone-circle">' + (done ? "✓" : i + 1) + '</span><span class="milestone-label">¥' + (m.amount >= 1000 ? Math.round(m.amount / 1000) + "k" : m.amount) + '</span>';
      msRow.appendChild(dot);
    });

    document.getElementById("vt-savedMonth").textContent = fmtMoney(vault.savedAmountThisMonth);
    document.getElementById("vt-depositedMonth").textContent = fmtMoney(vault.depositedThisMonth);
    document.getElementById("vt-savedDelta").textContent = "前月比 +" + vault.savedDeltaPct + "%";
    document.getElementById("vt-depositedDelta").textContent = "前月比 +" + vault.depositedDeltaPct + "%";

    var recentList = document.getElementById("vt-recent-list");
    recentList.innerHTML = "";
    relatedMoneyQuests(vault.id).slice(0, 3).forEach(function (q) {
      recentList.insertAdjacentHTML("beforeend", moneyQuestItemHtml(q));
    });
  }

  document.getElementById("vault-top-main").addEventListener("click", function () {
    currentVaultId = state.vaults[0].id;
    showScreen("vault-detail");
  });
  document.getElementById("vt-see-all").addEventListener("click", function () { showScreen("vault-detail"); });
  document.getElementById("vt-view-records").addEventListener("click", function () { showScreen("records"); });
  document.getElementById("vt-add-vault").addEventListener("click", function () {
    alert("金庫の追加はデモ版では未実装です。");
  });

  /* ===================== VAULT DETAIL ===================== */

  function renderVaultDetail(vaultId) {
    var vault = getVault(vaultId || currentVaultId);
    currentVaultId = vault.id;
    document.getElementById("vd-title").textContent = vault.title;

    var pct = Math.min(100, Math.round((vault.currentAmount / vault.targetAmount) * 100));
    document.getElementById("vd-pct").textContent = pct + "%";
    document.getElementById("vd-vault-visual").innerHTML = vaultVisualHtml(pct);
    var circumference = 2 * Math.PI * 52;
    var ring = document.getElementById("vd-ring");
    ring.setAttribute("stroke-dasharray", circumference);
    ring.setAttribute("stroke-dashoffset", circumference * (1 - pct / 100));

    document.getElementById("vd-current").textContent = "¥" + fmtMoney(vault.currentAmount);
    document.getElementById("vd-target").textContent = "¥" + fmtMoney(vault.targetAmount);
    document.getElementById("vd-rest").textContent = fmtMoney(Math.max(0, vault.targetAmount - vault.currentAmount));

    var stepsEl = document.getElementById("vd-steps");
    stepsEl.innerHTML = "";
    var currentStepIndex = 0;
    vault.milestones.forEach(function (m, i) {
      if (vault.currentAmount >= m.amount) currentStepIndex = i;
    });
    var nextStepIndex = Math.min(currentStepIndex + 1, vault.milestones.length - 1);
    vault.milestones.forEach(function (m, i) {
      var done = i <= currentStepIndex;
      var isCurrent = i === nextStepIndex && !done;
      var dot = document.createElement("div");
      dot.className = "step-dot" + (done ? " done" : "") + (isCurrent ? " current" : "");
      dot.innerHTML = '<span class="step-circle">' + (done ? "✓" : i + 1) + '</span><span class="step-label">' + m.label + '</span>';
      stepsEl.appendChild(dot);
    });
    var nextMilestone = vault.milestones[nextStepIndex];
    var remain = Math.max(0, nextMilestone.amount - vault.currentAmount);
    document.getElementById("vd-nextStepLabel").textContent =
      remain > 0 ? nextMilestone.label + "まであと ¥" + fmtMoney(remain) : nextMilestone.label + " 到達済み";

    document.getElementById("vd-deposited").textContent = fmtMoney(vault.depositedThisMonth);
    document.getElementById("vd-saved").textContent = fmtMoney(vault.savedAmountThisMonth);
    var relatedQuests = relatedMoneyQuests(vault.id);
    document.getElementById("vd-questCount").textContent = relatedQuests.length + "件";

    var listEl = document.getElementById("vd-quest-list");
    listEl.innerHTML = "";
    relatedQuests.forEach(function (q) { listEl.insertAdjacentHTML("beforeend", moneyQuestItemHtml(q)); });

    var benefitsEl = document.getElementById("vd-benefits");
    benefitsEl.innerHTML = "";
    vault.benefits.forEach(function (b) {
      benefitsEl.insertAdjacentHTML("beforeend", '<li><span class="benefit-icon"></span>' + b + '</li>');
    });
  }

  document.getElementById("vd-back").addEventListener("click", function () { showScreen("vault"); });
  document.getElementById("vd-edit-btn").addEventListener("click", function () {
    showScreen("vault-edit");
  });

  /* ===================== VAULT EDIT ===================== */

  function renderVaultEdit(vaultId) {
    var vault = getVault(vaultId || currentVaultId);
    document.getElementById("ve-title").value = vault.title;
    document.getElementById("ve-target").value = vault.targetAmount;
    document.getElementById("ve-current").value = vault.currentAmount;
    document.getElementById("ve-milestone-error").classList.add("hidden");

    var msList = document.getElementById("ve-milestones");
    msList.innerHTML = "";
    vault.milestones.forEach(function (m, i) {
      msList.insertAdjacentHTML(
        "beforeend",
        '<div class="milestone-edit-row">' +
          '<span class="milestone-edit-label">' + m.label + '</span>' +
          '<input type="number" class="milestone-edit-input" data-index="' + i + '" min="0" step="1" value="' + m.amount + '">' +
          '</div>'
      );
    });

    var benefits = vault.benefits || [];
    document.getElementById("ve-benefit-0").value = benefits[0] || "";
    document.getElementById("ve-benefit-1").value = benefits[1] || "";
    document.getElementById("ve-benefit-2").value = benefits[2] || "";
  }

  document.getElementById("ve-cancel").addEventListener("click", function () { showScreen("vault-detail"); });

  document.getElementById("vault-edit-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var vault = getVault(currentVaultId);
    var errorEl = document.getElementById("ve-milestone-error");
    errorEl.classList.add("hidden");

    var title = document.getElementById("ve-title").value.trim();
    if (!title) return;

    var target = parseInt(document.getElementById("ve-target").value, 10);
    if (isNaN(target) || target < 1) return;

    var current = parseInt(document.getElementById("ve-current").value, 10);
    if (isNaN(current) || current < 0) return;

    var milestoneInputs = document.querySelectorAll(".milestone-edit-input");
    var newMilestoneAmounts = [];
    for (var i = 0; i < milestoneInputs.length; i++) {
      var raw = milestoneInputs[i].value;
      var existing = vault.milestones[i].amount;
      var amount = raw === "" ? existing : parseInt(raw, 10);
      if (isNaN(amount) || amount < 0 || amount > target) {
        errorEl.classList.remove("hidden");
        return;
      }
      newMilestoneAmounts.push(amount);
    }

    vault.title = title;
    vault.targetAmount = target;
    vault.currentAmount = current;
    vault.milestones.forEach(function (m, i) { m.amount = newMilestoneAmounts[i]; });
    vault.benefits = [
      document.getElementById("ve-benefit-0").value.trim(),
      document.getElementById("ve-benefit-1").value.trim(),
      document.getElementById("ve-benefit-2").value.trim()
    ].filter(function (b) { return b.length > 0; });

    saveState();
    showScreen("vault-detail");
  });

  document.getElementById("vd-deposit-btn").addEventListener("click", function () { openRecordModal("deposit"); });
  document.getElementById("vd-saved-btn").addEventListener("click", function () { openRecordModal("saved"); });
  document.getElementById("btn-quick-deposit").addEventListener("click", function () { openRecordModal("deposit"); });
  document.getElementById("btn-quick-saved").addEventListener("click", function () { openRecordModal("saved"); });

  /* ===================== RECORD MODAL ===================== */

  var RECORD_EXP = 50;
  var recordModalType = null;
  var toastTimer = null;

  function recordVaultEntry(type, amount, label) {
    var vault = state.vaults[0];
    if (type === "deposit") {
      vault.currentAmount += amount;
      vault.depositedThisMonth += amount;
      state.weekStats.deposited += amount;
    } else {
      vault.savedAmountThisMonth += amount;
      state.weekStats.saved += amount;
    }

    state.totalExp += RECORD_EXP;
    state.weekStats.exp += RECORD_EXP;

    state.history.unshift({
      id: uid("h"),
      questId: null,
      title: label,
      category: "お金",
      difficulty: "低",
      exp: RECORD_EXP,
      moneyEffect: type,
      amount: amount,
      completedAt: nowIso()
    });

    var mapResult = updateMapProgress(RECORD_EXP);
    var todayIdx = new Date().getDay();
    state.streak.weekCompleted[(todayIdx + 6) % 7] = true;

    saveState();
    return { exp: RECORD_EXP, mapResult: mapResult, vault: vault };
  }

  function showToast(message) {
    var toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    window.requestAnimationFrame(function () { toast.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () { toast.classList.add("hidden"); }, 250);
    }, 2400);
  }

  function openRecordModal(type) {
    recordModalType = type;
    var contentField = document.getElementById("record-modal-content-field");
    var targetField = document.getElementById("record-modal-target-field");
    document.getElementById("record-modal-amount").value = "";
    document.getElementById("record-modal-content").value = "";
    document.getElementById("record-modal-memo").value = "";
    document.getElementById("record-modal-error").classList.add("hidden");

    if (type === "deposit") {
      document.getElementById("record-modal-title").textContent = "金庫に積む";
      contentField.classList.add("hidden");
      targetField.classList.remove("hidden");
      document.getElementById("record-modal-target-name").textContent = state.vaults[0].title;
    } else {
      document.getElementById("record-modal-title").textContent = "守った額を記録";
      contentField.classList.remove("hidden");
      targetField.classList.add("hidden");
    }

    document.getElementById("record-modal-overlay").classList.remove("hidden");
    document.getElementById("record-modal-amount").focus();
  }

  function closeRecordModal() {
    document.getElementById("record-modal-overlay").classList.add("hidden");
  }

  document.getElementById("record-modal-cancel").addEventListener("click", closeRecordModal);
  document.getElementById("record-modal-overlay").addEventListener("click", function (e) {
    if (e.target === e.currentTarget) closeRecordModal();
  });

  document.getElementById("record-modal-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var errorEl = document.getElementById("record-modal-error");
    errorEl.classList.add("hidden");

    var amountRaw = document.getElementById("record-modal-amount").value;
    var amount = parseInt(amountRaw, 10);
    if (amountRaw === "" || isNaN(amount) || amount <= 0) {
      errorEl.textContent = "金額は1以上の数値で入力してください";
      errorEl.classList.remove("hidden");
      return;
    }

    var type = recordModalType;
    var content = document.getElementById("record-modal-content").value.trim();
    var label = type === "deposit" ? "金庫に積む" : (content || "守った額を記録");

    var result = recordVaultEntry(type, amount, label);
    closeRecordModal();
    refreshScreen(currentScreenName);

    var toastMsg = type === "deposit"
      ? "金庫 +¥" + fmtMoney(amount) + " / +" + result.exp + "EXP"
      : "守った額 +¥" + fmtMoney(amount) + " / +" + result.exp + "EXP";
    showToast(toastMsg);
  });

  /* ===================== RECORDS ===================== */

  function renderRecords() {
    document.getElementById("rec-exp").textContent = state.weekStats.exp.toLocaleString("ja-JP");
    document.getElementById("rec-questCount").textContent = state.weekStats.questCount;
    document.getElementById("rec-saved").textContent = fmtMoney(state.weekStats.saved);
    document.getElementById("rec-deposited").textContent = fmtMoney(state.weekStats.deposited);

    var listEl = document.getElementById("rec-history-list");
    listEl.innerHTML = "";
    state.history.slice(0, 12).forEach(function (h) {
      var time = new Date(h.completedAt);
      var timeStr = isNaN(time.getTime()) ? "" : time.getHours() + ":" + String(time.getMinutes()).padStart(2, "0");
      listEl.insertAdjacentHTML(
        "beforeend",
        '<li class="history-item">' +
          '<span class="history-icon">' + iconHtml(CATEGORY_ICON[h.category] || "check") + '</span>' +
          '<span class="history-body">' +
          '<span class="history-title">' + h.title + '</span>' +
          '<span class="history-tags"><span class="tag-pill">' + h.category + '</span><span class="tag-pill diff-' + h.difficulty + '">' + h.difficulty + '</span><span class="history-time">' + timeStr + '</span></span>' +
          '</span>' +
          '<span class="history-exp">+' + h.exp + 'EXP</span>' +
          '</li>'
      );
    });

    document.getElementById("rec-streakDays").textContent = state.streak.currentDays;
    var weekCompletedCount = state.streak.weekCompleted.filter(Boolean).length;
    document.getElementById("rec-weekCount").textContent = weekCompletedCount + "/" + state.streak.weekCompleted.length;
    renderLanternRow("rec-lantern-row", state.streak.weekCompleted);
  }

  /* ===================== SETTINGS ===================== */

  var REQUIRED_STATE_FIELDS = ["totalExp", "quests", "vaults", "mapProgress", "history"];

  function renderSettings() {
    document.getElementById("settings-export-area").value = JSON.stringify(state, null, 2);
    document.getElementById("settings-import-area").value = "";
    document.getElementById("settings-import-error").classList.add("hidden");
    document.getElementById("settings-copy-note").classList.add("hidden");
  }

  function validateImportedState(data) {
    if (!data || typeof data !== "object") return "JSONの形式が正しくありません";
    for (var i = 0; i < REQUIRED_STATE_FIELDS.length; i++) {
      var field = REQUIRED_STATE_FIELDS[i];
      if (!(field in data)) return "必須項目「" + field + "」が見つかりません";
    }
    if (!Array.isArray(data.quests)) return "quests の形式が正しくありません";
    if (!Array.isArray(data.vaults)) return "vaults の形式が正しくありません";
    if (!Array.isArray(data.history)) return "history の形式が正しくありません";
    if (typeof data.totalExp !== "number") return "totalExp の形式が正しくありません";
    return null;
  }

  document.getElementById("btn-open-settings").addEventListener("click", function () { showScreen("settings"); });
  document.getElementById("settings-back").addEventListener("click", function () { showScreen("records"); });

  document.getElementById("settings-copy-btn").addEventListener("click", function () {
    var area = document.getElementById("settings-export-area");
    var note = document.getElementById("settings-copy-note");
    function showCopiedNote() {
      note.classList.remove("hidden");
      setTimeout(function () { note.classList.add("hidden"); }, 2000);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(area.value).then(showCopiedNote, function () {
        area.focus();
        area.select();
      });
    } else {
      area.focus();
      area.select();
      try {
        document.execCommand("copy");
        showCopiedNote();
      } catch (e) {
        /* manual copy fallback: text is already selected for the user */
      }
    }
  });

  document.getElementById("settings-import-btn").addEventListener("click", function () {
    var errorEl = document.getElementById("settings-import-error");
    errorEl.classList.add("hidden");
    var raw = document.getElementById("settings-import-area").value.trim();
    if (!raw) {
      errorEl.textContent = "JSONを貼り付けてください";
      errorEl.classList.remove("hidden");
      return;
    }

    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      errorEl.textContent = "JSONの読み込みに失敗しました";
      errorEl.classList.remove("hidden");
      return;
    }

    var validationError = validateImportedState(parsed);
    if (validationError) {
      errorEl.textContent = validationError;
      errorEl.classList.remove("hidden");
      return;
    }

    var backup = state;
    try {
      state = parsed;
      normalizeState();
      saveState();
    } catch (e) {
      state = backup;
      errorEl.textContent = "読み込みに失敗したため、元のデータを保持しました";
      errorEl.classList.remove("hidden");
      return;
    }
    showScreen("home");
  });

  document.getElementById("settings-fresh-btn").addEventListener("click", function () {
    if (!confirm("最初から始めます。現在のデータは失われます。よろしいですか？")) return;
    state = createFreshState();
    normalizeState();
    saveState();
    showToast("最初から始めました");
    showScreen("home");
  });

  document.getElementById("settings-demo-btn").addEventListener("click", function () {
    if (!confirm("デモデータに戻します。現在のデータは失われます。よろしいですか？")) return;
    state = createDemoState();
    normalizeState();
    saveState();
    showScreen("home");
  });

  document.getElementById("settings-wipe-btn").addEventListener("click", function () {
    if (!confirm("すべてのデータを削除します。この操作は元に戻せません。本当に削除しますか？")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = createFreshState();
    normalizeState();
    showScreen("home");
  });

  /* ===================== BOTTOM NAV ===================== */

  document.querySelectorAll(".nav-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showScreen(btn.getAttribute("data-screen"));
    });
  });

  /* ===================== INIT ===================== */

  mountStaticIcons();
  showScreen("home");

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {
        /* PWA registration is an enhancement only; app must work without it */
      });
    });
  }
})();
