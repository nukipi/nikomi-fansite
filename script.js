// Modal Logic (Age Verification)
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('age-modal');
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const errorMsg = document.getElementById('modal-error');

    const AGE_VERIFIED_KEY = 'ageVerifiedUntil';
    const now = Date.now();
    const verifiedUntil = Number(localStorage.getItem(AGE_VERIFIED_KEY));

    if (verifiedUntil && verifiedUntil > now) {
        modal.classList.add('hidden');
    } else {
        document.body.style.overflow = 'hidden';
    }

    btnYes.addEventListener('click', () => {
        const oneDay = 24 * 60 * 60 * 1000;
        localStorage.setItem(AGE_VERIFIED_KEY, String(Date.now() + oneDay));
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    });

    btnNo.addEventListener('click', () => {
        errorMsg.style.display = 'block';

        setTimeout(() => {
            window.location.href = 'https://www.google.com/';
        }, 1000);
    });

    // Tab Navigation Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const target = document.getElementById(targetId);
            target.classList.add('active');
        });
    });


    // Event Delegation for Info Buttons
    document.querySelectorAll('.info-btn').forEach(button => {
        button.addEventListener('click', () => {
            toggleInfoPanel(button.dataset.panel);
        });
    });

    // Render Activity Log
    renderActivityLog();
});

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.hero-content, .tabs-nav');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
});

// Link Info Panel Logic (Accordion style)
const linkData = {
    'withny': {
        title: 'Withny',
        text: `えっちなAvtuberさんが集まる場所。

にこみ殿が主にえっちな配信をする場所でござる。
見逃した時はci-enのアーカイブへ！
月1000円ぽっきり、入らない理由が無い。`,
        url: 'https://www.withny.fun/channels/RyuzenNikomi',
        color: '#FF5FA2'
    },
    'youtube': {
        title: 'YouTube',
        text: `にこみ殿の通常配信の場所でござる。
弾き語りや雑談、ゲーム配信等様々
心地よいASMRもあるでござる。
お茶目でかわいいにこみ殿が見られるでござる。
えっちな配信とは違った楽しさがあるでござる。`,
        url: 'https://www.youtube.com/@RyuzenNikomi',
        color: '#FF0000'
    },
    'twitch': {
        title: 'Twitch',
        text: `実はTwitchもある。にこみ殿のレア配信枠でござる。`,
        url: 'https://www.twitch.tv/ryuzennikomi',
        color: '#9146FF'
    },
    'twitcasting': {
        title: 'ツイキャス',
        text: `にこみ殿の通常配信の場所でござる。
主に突発的に配信されるのはココ。
オフなにこみ殿を聞けるでござる。
まったりおしゃべりできる場所。`,
        url: 'https://twitcasting.tv/ryuzennikomi',
        color: '#2E64FE'
    },
    'cien': {
        title: 'Ci-en',
        text: `withnyで行われたえっちな配信のアーカイブを見られるサイトでござる。
月1000円ポッキリ、本当に1000円でいいのか？と思う
入り得なので迷っていたら入ってみよう。`,
        url: 'https://ci-en.dlsite.com/creator/13066',
        color: '#F39C12'
    }
};

let currentPanelId = null;

function toggleInfoPanel(id) {
    const panel = document.getElementById('streaming-info-panel');
    const data = linkData[id];
    
    // If clicking the same button that is currently open, close it.
    if (currentPanelId === id) {
        panel.classList.remove('open');
        currentPanelId = null;
        return;
    }
    
    // Update content
    document.getElementById('info-panel-title').textContent = data.title;
    document.getElementById('info-panel-title').style.color = data.color;
    document.getElementById('info-panel-text').textContent = data.text;
    document.getElementById('info-panel-link').href = data.url;
    document.getElementById('info-panel-link').style.background = data.color;
    
    // Open panel
    panel.classList.add('open');
    currentPanelId = id;
}

// Activity Log Data is now loaded from activity-data.js

function renderActivityLog() {
    const container = document.getElementById('activity-log');
    if (!container) return;

    // Sort by date descending
    const sortedData = [...activityData].sort((a, b) => {
        return new Date(b.date.split(' ')[0]) - new Date(a.date.split(' ')[0]);
    });

    // Group by year and month
    const grouped = {};
    sortedData.forEach(item => {
        const datePart = item.date.split(' ')[0];
        const [year, month] = datePart.split('/');
        if (!grouped[year]) grouped[year] = {};
        if (!grouped[year][month]) grouped[year][month] = [];
        grouped[year][month].push(item);
    });

    // Generate HTML
    let html = '';
    const years = Object.keys(grouped).sort((a, b) => b - a);
    
    years.forEach(year => {
        html += `<h3 class="activity-year">${year}年</h3>`;
        const months = Object.keys(grouped[year]).sort((a, b) => b - a);
        
        months.forEach((month, index) => {
            const isLatest = (year === years[0] && index === 0);
            const openClass = isLatest ? 'open' : '';
            
            html += `
                <div class="activity-month-group ${openClass}">
                    <button class="activity-month-toggle">${month}月</button>
                    <div class="activity-month-content">
            `;
            
            grouped[year][month].forEach(item => {
                const datePart = item.date.split(' ')[0];
                const placeClass = getPlaceClass(item.place);
                const linkHtml = getLinkHtml(item.url);
                
                html += `
                    <div class="activity-card">
                        <div class="activity-meta">
                            <span class="activity-date">${datePart}</span>
                            <span class="activity-place ${placeClass}">${item.place}</span>
                        </div>
                        <div class="activity-memo">${item.memo}</div>
                        ${linkHtml}
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
    });

    container.innerHTML = html;

    // Add toggle event listeners
    const toggles = container.querySelectorAll('.activity-month-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const group = toggle.parentElement;
            group.classList.toggle('open');
            
            // Adjust max-height for animation
            const content = group.querySelector('.activity-month-content');
            if (group.classList.contains('open')) {
                content.style.maxHeight = content.scrollHeight + 'px';
                // After transition, set to none to prevent cutting off
                content.addEventListener('transitionend', function handler() {
                    if (group.classList.contains('open')) {
                        content.style.maxHeight = 'none';
                    }
                    content.removeEventListener('transitionend', handler);
                });
            } else {
                // To animate closing from 'none', we must first set it to scrollHeight
                if (content.style.maxHeight === 'none') {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    // Force reflow
                    content.offsetHeight;
                }
                content.style.maxHeight = '0';
            }
        });
    });
    
    // Set initial max-height for the open one (no animation needed on load)
    const openContent = container.querySelector('.activity-month-group.open .activity-month-content');
    if (openContent) {
        openContent.style.maxHeight = 'none';
    }
}

function getPlaceClass(place) {
    const p = place.toLowerCase();
    if (p.includes('withny')) return 'place-withny';
    if (p.includes('youtube')) return 'place-youtube';
    if (p.includes('ツイキャス') || p.includes('twitcasting')) return 'place-twitcasting';
    if (p.includes('twitch')) return 'place-twitch';
    if (p.includes('xlive')) return 'place-xlive';
    return 'place-other';
}

function getLinkHtml(url) {
    if (!url || url.trim() === '') {
        return '<span class="activity-link-missing">リンク未確認</span>';
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return `
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="activity-link">
                Xで見る
            </a>
        `;
    }
    return '<span class="activity-link-warning">リンク形式確認</span>';
}

// -------------------------------------
// Easter Egg: Daily Shot (今日の一枚)
// -------------------------------------
const dailyImages = [
    "images/daily/スクショ/2024y12m25d_220329599.jpg",
    "images/daily/スクショ/2024y12m25d_220340053.jpg",
    "images/daily/スクショ/2024y12m25d_220423086.jpg",
    "images/daily/スクショ/2024y12m25d_220826021.jpg",
    "images/daily/スクショ/2024y12m25d_220827611.jpg",
    "images/daily/スクショ/2024y12m25d_220833535.jpg",
    "images/daily/スクショ/2024y12m25d_220835291.jpg",
    "images/daily/スクショ/2024y12m25d_220836940.jpg",
    "images/daily/スクショ/2024y12m25d_221015381.jpg",
    "images/daily/スクショ/2024y12m25d_221306151.jpg",
    "images/daily/スクショ/2024y12m25d_221313171.jpg",
    "images/daily/スクショ/2024y12m25d_222248415.jpg",
    "images/daily/スクショ/2024y12m25d_222250154.jpg",
    "images/daily/スクショ/2024y12m25d_222251316.jpg",
    "images/daily/スクショ/2024y12m25d_222351553.jpg",
    "images/daily/スクショ/2024y12m25d_222352886.jpg",
    "images/daily/スクショ/2024y12m25d_222357251.jpg",
    "images/daily/スクショ/2024y12m25d_222359622.jpg",
    "images/daily/スクショ/2024y12m25d_222400161.jpg",
    "images/daily/スクショ/2024y12m25d_223014961.jpg",
    "images/daily/スクショ/2024y12m25d_223015674.jpg",
    "images/daily/スクショ/2024y12m25d_223350725.jpg",
    "images/daily/スクショ/2024y12m25d_223354794.jpg",
    "images/daily/スクショ/2024y12m25d_223705101.jpg",
    "images/daily/スクショ/2024y12m25d_223707358.jpg",
    "images/daily/スクショ/2024y12m25d_223710712.jpg",
    "images/daily/スクショ/2024y12m25d_223713530.jpg",
    "images/daily/スクショ/2024y12m25d_223718833.jpg",
    "images/daily/スクショ/2024y12m25d_223742994.jpg",
    "images/daily/スクショ/2024y12m25d_223926538.jpg",
    "images/daily/スクショ/2024y12m25d_224544608.jpg",
    "images/daily/スクショ/2024y12m25d_224545545.jpg",
    "images/daily/スクショ/2024y12m25d_224547593.jpg",
    "images/daily/スクショ/2024y12m25d_224548913.jpg",
    "images/daily/スクショ/2024y12m25d_224549887.jpg",
    "images/daily/スクショ/2024y12m25d_224619080.jpg",
    "images/daily/スクショ/2024y12m25d_224621711.jpg",
    "images/daily/スクショ/2024y12m25d_224628828.jpg",
    "images/daily/スクショ/2024y12m25d_224743913.jpg",
    "images/daily/スクショ/2024y12m25d_224918302.jpg",
    "images/daily/スクショ/2024y12m25d_224919503.jpg",
    "images/daily/スクショ/2024y12m25d_224921049.jpg",
    "images/daily/スクショ/2024y12m25d_225013167.jpg",
    "images/daily/スクショ/2024y12m25d_225016204.jpg",
    "images/daily/スクショ/2024y12m25d_225318136.jpg",
    "images/daily/スクショ/2024y12m25d_225318878.jpg",
    "images/daily/スクショ/2024y12m25d_225320535.jpg",
    "images/daily/スクショ/2024y12m25d_225328276.jpg",
    "images/daily/スクショ/2024y12m25d_225500046.jpg",
    "images/daily/スクショ/2024y12m25d_225501728.jpg",
    "images/daily/スクショ/2024y12m25d_225502808.jpg",
    "images/daily/スクショ/2024y12m25d_225504586.jpg",
    "images/daily/スクショ/2024y12m25d_225508104.jpg",
    "images/daily/スクショ/2024y12m25d_225510368.jpg",
    "images/daily/スクショ/2024y12m25d_225511704.jpg",
    "images/daily/スクショ/2024y12m25d_225516496.jpg",
    "images/daily/スクショ/2024y12m25d_225538008.jpg",
    "images/daily/スクショ/2024y12m25d_225646943.jpg",
    "images/daily/スクショ/2024y12m25d_225806390.jpg",
    "images/daily/スクショ/2024y12m25d_225807568.jpg",
    "images/daily/スクショ/2024y12m25d_225809337.jpg",
    "images/daily/スクショ/2024y12m25d_225826206.jpg",
    "images/daily/スクショ/2024y12m25d_225827496.jpg",
    "images/daily/スクショ/2024y12m25d_230011868.jpg",
    "images/daily/スクショ/2024y12m25d_230026809.jpg",
    "images/daily/スクショ/2024y12m25d_230027627.jpg",
    "images/daily/スクショ/2024y12m25d_230036648.jpg",
    "images/daily/スクショ/2024y12m25d_230038951.jpg",
    "images/daily/スクショ/2024y12m25d_230042124.jpg",
    "images/daily/スクショ/2024y12m25d_230321586.jpg",
    "images/daily/スクショ/2024y12m25d_232108186.jpg",
    "images/daily/スクショ/2024y12m25d_232112184.jpg",
    "images/daily/スクショ/2024y12m25d_232113113.jpg",
    "images/daily/スクショ/2024y12m25d_232237355.jpg",
    "images/daily/スクショ/2024y12m25d_232251343.jpg",
    "images/daily/スクショ/2024y12m25d_232251508.jpg",
    "images/daily/スクショ/2024y12m25d_232251605.jpg",
    "images/daily/スクショ/2024y12m25d_232309351.jpg",
    "images/daily/スクショ/2024y12m25d_232309906.jpg",
    "images/daily/スクショ/2024y12m25d_232310716.jpg",
    "images/daily/スクショ/2024y12m25d_232325814.jpg",
    "images/daily/スクショ/2024y12m25d_232328723.jpg",
    "images/daily/スクショ/2024y12m25d_232332108.jpg",
    "images/daily/スクショ/2024y12m25d_232353354.jpg",
    "images/daily/スクショ/2024y12m25d_232354952.jpg",
    "images/daily/スクショ/2024y12m25d_232358349.jpg",
    "images/daily/スクショ/2024y12m25d_232821875.jpg",
    "images/daily/スクショ/2024y12m25d_232822715.jpg",
    "images/daily/スクショ/2024y12m25d_232840010.jpg",
    "images/daily/スクショ/2024y12m25d_232841473.jpg",
    "images/daily/スクショ/2024y12m25d_232905939.jpg",
    "images/daily/スクショ/2024y12m25d_232907536.jpg",
    "images/daily/スクショ/2024y12m25d_233522912.jpg",
    "images/daily/スクショ/2024y12m25d_233530767.jpg",
    "images/daily/スクショ/2024y12m25d_233755818.jpg",
    "images/daily/スクショ/2024y12m25d_233757251.jpg",
    "images/daily/スクショ/2024y12m25d_233802053.jpg",
    "images/daily/スクショ/2024y12m25d_233807721.jpg",
    "images/daily/スクショ/2024y12m25d_233810776.jpg",
    "images/daily/スクショ/2024y12m25d_233816879.jpg",
    "images/daily/スクショ/2024y12m25d_233940369.jpg",
    "images/daily/スクショ/2024y12m25d_234817166.jpg",
    "images/daily/スクショ/2024y12m25d_234829406.jpg",
    "images/daily/スクショ/2024y12m25d_234831093.jpg",
    "images/daily/スクショ/2024y12m25d_234834574.jpg",
    "images/daily/スクショ/2024y12m25d_235338841.jpg",
    "images/daily/スクショ/2024y12m25d_235340543.jpg",
    "images/daily/スクショ/2024y12m25d_235349658.jpg",
    "images/daily/スクショ/2024y12m25d_235717507.jpg",
    "images/daily/スクショ/2024y12m25d_235718737.jpg",
    "images/daily/スクショ/2024y12m25d_235750681.jpg",
    "images/daily/スクショ/2024y12m25d_235753366.jpg",
    "images/daily/スクショ/2024y12m25d_235757460.jpg",
    "images/daily/スクショ/2024y12m25d_235800160.jpg",
    "images/daily/スクショ/2024y12m25d_235949993.jpg",
    "images/daily/スクショ/2024y12m25d_235950938.jpg",
    "images/daily/スクショ/2024y12m26d_000041504.jpg",
    "images/daily/スクショ/2024y12m26d_000237089.jpg",
    "images/daily/スクショ/2024y12m26d_000239773.jpg",
    "images/daily/スクショ/2024y12m26d_000353609.jpg",
    "images/daily/スクショ/2024y12m26d_000414208.jpg",
    "images/daily/スクショ/2024y12m26d_000414906.jpg",
    "images/daily/スクショ/2024y12m26d_000932656.jpg",
    "images/daily/スクショ/2024y12m26d_001027610.jpg",
    "images/daily/スクショ/2024y12m26d_001029658.jpg",
    "images/daily/スクショ/2024y12m26d_001037730.jpg",
    "images/daily/スクショ/2024y12m26d_001051755.jpg",
    "images/daily/スクショ/2024y12m26d_001157979.jpg",
    "images/daily/スクショ/2024y12m26d_001158713.jpg",
    "images/daily/スクショ/2024y12m26d_001530458.jpg",
    "images/daily/スクショ/2024y12m26d_001559619.jpg",
    "images/daily/スクショ/2024y12m26d_001621507.jpg",
    "images/daily/スクショ/2024y12m26d_001811254.jpg",
    "images/daily/スクショ/2024y12m26d_001812836.jpg",
    "images/daily/スクショ/2024y12m26d_001814494.jpg",
    "images/daily/スクショ/2024y12m26d_001912087.jpg",
    "images/daily/スクショ/2024y12m26d_002003974.jpg",
    "images/daily/スクショ/2024y12m26d_002115937.jpg",
    "images/daily/スクショ/2024y12m26d_002125717.jpg",
    "images/daily/スクショ/2024y12m26d_002126783.jpg",
    "images/daily/スクショ/2024y12m26d_002128522.jpg",
    "images/daily/スクショ/2024y12m26d_002136391.jpg",
    "images/daily/スクショ/2024y12m26d_002144887.jpg",
    "images/daily/スクショ/2024y12m26d_002220115.jpg",
    "images/daily/スクショ/2024y12m26d_002220685.jpg",
    "images/daily/スクショ/2024y12m26d_002227121.jpg",
    "images/daily/スクショ/2024y12m26d_002229940.jpg",
    "images/daily/スクショ/2024y12m26d_002232200.jpg",
    "images/daily/スクショ/2024y12m26d_002238433.jpg",
    "images/daily/スクショ/2024y12m26d_002325390.jpg",
    "images/daily/スクショ/2024y12m26d_002325952.jpg",
    "images/daily/スクショ/2024y12m26d_002327009.jpg",
    "images/daily/スクショ/2024y12m26d_002328810.jpg",
    "images/daily/スクショ/2024y12m26d_002455320.jpg",
    "images/daily/スクショ/2024y12m26d_002502179.jpg",
    "images/daily/スクショ/2024y12m26d_002505696.jpg",
    "images/daily/スクショ/2024y12m26d_002513957.jpg",
    "images/daily/スクショ/2024y12m26d_002515768.jpg",
    "images/daily/スクショ/2024y12m26d_002517636.jpg",
    "images/daily/スクショ/2024y12m26d_002521821.jpg",
    "images/daily/スクショ/2024y12m26d_002526629.jpg",
    "images/daily/スクショ/2024y12m26d_002536777.jpg",
    "images/daily/スクショ/2024y12m26d_002553068.jpg",
    "images/daily/スクショ/2024y12m26d_002703291.jpg",
    "images/daily/スクショ/2024y12m26d_002705518.jpg",
    "images/daily/スクショ/2024y12m26d_002741054.jpg",
    "images/daily/スクショ/2024y12m26d_002752506.jpg",
    "images/daily/スクショ/2024y12m26d_002758372.jpg",
    "images/daily/スクショ/2024y12m26d_003420804.jpg",
    "images/daily/スクショ/2024y12m26d_003423212.jpg",
    "images/daily/スクショ/2024y12m26d_003425221.jpg",
    "images/daily/スクショ/2024y12m26d_004329576.jpg",
    "images/daily/スクショ/2024y12m26d_004411478.jpg",
    "images/daily/スクショ/2024y12m26d_004506889.jpg",
    "images/daily/スクショ/2024y12m26d_004539320.jpg",
    "images/daily/スクショ/2024y12m26d_004547030.jpg",
    "images/daily/スクショ/2024y12m26d_005832938.jpg",
    "images/daily/スクショ/2024y12m26d_005902722.jpg",
    "images/daily/スクショ/2024y12m27d_021609881.jpg",
    "images/daily/スクショ/2024y12m27d_021611179.jpg",
    "images/daily/スクショ/2024y12m27d_021612018.jpg",
    "images/daily/スクショ/2024y12m27d_021617594.jpg",
    "images/daily/スクショ/2024y12m27d_021619891.jpg",
    "images/daily/スクショ/2024y12m27d_021621635.jpg",
    "images/daily/スクショ/2024y12m27d_021622307.jpg",
    "images/daily/スクショ/2024y12m27d_021624390.jpg",
    "images/daily/スクショ/2024y12m27d_021627096.jpg",
    "images/daily/スクショ/2024y12m27d_021630316.jpg",
    "images/daily/スクショ/2024y12m27d_021632068.jpg",
    "images/daily/スクショ/2024y12m27d_021633784.jpg",
    "images/daily/スクショ/2024y12m27d_021635911.jpg",
    "images/daily/スクショ/2024y12m27d_021644913.jpg",
    "images/daily/スクショ/2024y12m27d_021652697.jpg",
    "images/daily/スクショ/2024y12m27d_021702069.jpg",
    "images/daily/スクショ/2024y12m27d_021702973.jpg",
    "images/daily/スクショ/2024y12m27d_021703741.jpg",
    "images/daily/スクショ/2024y12m27d_021711405.jpg",
    "images/daily/スクショ/2024y12m27d_021712219.jpg",
    "images/daily/スクショ/2024y12m27d_021712992.jpg",
    "images/daily/スクショ/2024y12m27d_021714795.jpg",
    "images/daily/スクショ/2024y12m27d_021803791.jpg",
    "images/daily/スクショ/2024y12m27d_021815402.jpg",
    "images/daily/スクショ/2024y12m27d_021816444.jpg",
    "images/daily/スクショ/2024y12m27d_021817802.jpg",
    "images/daily/スクショ/2024y12m27d_021818677.jpg",
    "images/daily/スクショ/2024y12m27d_021820534.jpg",
    "images/daily/スクショ/2024y12m27d_021824953.jpg",
    "images/daily/スクショ/2024y12m27d_021827196.jpg",
    "images/daily/スクショ/2024y12m27d_021830071.jpg",
    "images/daily/スクショ/2024y12m27d_021849324.jpg",
    "images/daily/スクショ/2024y12m27d_021855727.jpg",
    "images/daily/スクショ/2024y12m27d_021857641.jpg",
    "images/daily/スクショ/2024y12m27d_021901446.jpg",
    "images/daily/スクショ/2024y12m27d_021903069.jpg",
    "images/daily/スクショ/2024y12m27d_021905461.jpg",
    "images/daily/スクショ/2024y12m27d_021909143.jpg",
    "images/daily/スクショ/2024y12m27d_021923187.jpg",
    "images/daily/スクショ/2024y12m27d_021932960.jpg",
    "images/daily/スクショ/2024y12m27d_021933793.jpg",
    "images/daily/スクショ/2024y12m27d_021949790.jpg",
    "images/daily/スクショ/2024y12m27d_021952526.jpg",
    "images/daily/スクショ/2024y12m27d_022027429.jpg",
    "images/daily/スクショ/2024y12m27d_022029242.jpg",
    "images/daily/スクショ/2024y12m27d_022043585.jpg",
    "images/daily/スクショ/2024y12m27d_022051171.jpg",
    "images/daily/スクショ/2024y12m27d_022053698.jpg",
    "images/daily/スクショ/2024y12m27d_022055836.jpg",
    "images/daily/スクショ/2024y12m27d_022057165.jpg",
    "images/daily/スクショ/2024y12m27d_022100337.jpg",
    "images/daily/スクショ/2024y12m27d_022111234.jpg",
    "images/daily/スクショ/2024y12m27d_022112213.jpg",
    "images/daily/スクショ/2024y12m27d_022113072.jpg",
    "images/daily/スクショ/2024y12m27d_022114461.jpg",
    "images/daily/スクショ/2024y12m27d_022236897.jpg",
    "images/daily/スクショ/2024y12m27d_022244539.jpg",
    "images/daily/スクショ/2024y12m27d_022248900.jpg",
    "images/daily/スクショ/2024y12m27d_022250328.jpg",
    "images/daily/スクショ/2024y12m27d_022251433.jpg",
    "images/daily/スクショ/2024y12m27d_022310089.jpg",
    "images/daily/スクショ/2024y12m27d_022311953.jpg",
    "images/daily/スクショ/2024y12m27d_022325573.jpg",
    "images/daily/スクショ/2024y12m27d_022327212.jpg",
    "images/daily/スクショ/2024y12m27d_022328590.jpg",
    "images/daily/スクショ/2024y12m27d_022335970.jpg",
    "images/daily/スクショ/2024y12m27d_022337922.jpg",
    "images/daily/スクショ/2024y12m27d_022340190.jpg",
    "images/daily/スクショ/2024y12m27d_022341240.jpg",
    "images/daily/スクショ/2024y12m27d_022343553.jpg",
    "images/daily/スクショ/2024y12m27d_022348119.jpg",
    "images/daily/スクショ/2024y12m27d_022349332.jpg",
    "images/daily/スクショ/2024y12m27d_022359928.jpg",
    "images/daily/スクショ/2024y12m27d_022401052.jpg",
    "images/daily/スクショ/2024y12m27d_022401911.jpg",
    "images/daily/スクショ/2024y12m27d_022407641.jpg",
    "images/daily/スクショ/2024y12m27d_022420134.jpg",
    "images/daily/スクショ/2024y12m27d_022432883.jpg",
    "images/daily/スクショ/2024y12m27d_022434477.jpg",
    "images/daily/スクショ/2024y12m27d_022437306.jpg",
    "images/daily/スクショ/2024y12m27d_022439523.jpg",
    "images/daily/スクショ/2024y12m27d_022440377.jpg",
    "images/daily/スクショ/2024y12m27d_022446551.jpg",
    "images/daily/スクショ/2024y12m27d_022527704.jpg",
    "images/daily/スクショ/2024y12m27d_022531790.jpg",
    "images/daily/スクショ/2024y12m27d_022549037.jpg",
    "images/daily/スクショ/2024y12m27d_022549771.jpg",
    "images/daily/スクショ/2024y12m27d_022556476.jpg",
    "images/daily/スクショ/2024y12m27d_022600918.jpg",
    "images/daily/スクショ/2024y12m27d_022609076.jpg",
    "images/daily/スクショ/2024y12m27d_022611098.jpg",
    "images/daily/スクショ/2024y12m27d_022616686.jpg",
    "images/daily/スクショ/2024y12m27d_022621231.jpg",
    "images/daily/スクショ/2024y12m27d_022623275.jpg",
    "images/daily/スクショ/2024y12m27d_022627384.jpg",
    "images/daily/スクショ/2024y12m27d_022640234.jpg",
    "images/daily/スクショ/2024y12m27d_022641592.jpg",
    "images/daily/スクショ/2024y12m27d_022651232.jpg",
    "images/daily/スクショ/2024y12m27d_022655961.jpg",
    "images/daily/スクショ/2024y12m27d_022724409.jpg",
    "images/daily/スクショ/2024y12m27d_022738748.jpg",
    "images/daily/スクショ/2024y12m27d_022741928.jpg",
    "images/daily/スクショ/2024y12m27d_022744921.jpg",
    "images/daily/スクショ/2024y12m27d_022747073.jpg",
    "images/daily/スクショ/2024y12m27d_022748471.jpg",
    "images/daily/スクショ/2024y12m27d_022750159.jpg",
    "images/daily/スクショ/2024y12m27d_022751532.jpg",
    "images/daily/スクショ/2024y12m27d_022752372.jpg",
    "images/daily/スクショ/2024y12m27d_022753565.jpg",
    "images/daily/スクショ/2024y12m27d_022754774.jpg",
    "images/daily/スクショ/2024y12m27d_022757016.jpg",
    "images/daily/スクショ/2024y12m27d_022758555.jpg",
    "images/daily/スクショ/2024y12m27d_022802071.jpg",
    "images/daily/スクショ/2024y12m27d_022803620.jpg",
    "images/daily/スクショ/2024y12m27d_022809947.jpg",
    "images/daily/スクショ/2024y12m27d_022815887.jpg",
    "images/daily/スクショ/2024y12m27d_022816670.jpg",
    "images/daily/スクショ/2024y12m27d_022818109.jpg",
    "images/daily/スクショ/2024y12m27d_022819673.jpg",
    "images/daily/スクショ/2024y12m27d_022828626.jpg",
    "images/daily/スクショ/2024y12m27d_022830984.jpg",
    "images/daily/スクショ/2024y12m27d_022833197.jpg",
    "images/daily/スクショ/2024y12m27d_022835304.jpg",
    "images/daily/スクショ/2024y12m27d_022837986.jpg",
    "images/daily/スクショ/2024y12m27d_022849635.jpg",
    "images/daily/スクショ/2024y12m27d_022857302.jpg",
    "images/daily/スクショ/2024y12m27d_022859503.jpg",
    "images/daily/スクショ/2024y12m27d_022900673.jpg",
    "images/daily/スクショ/2024y12m27d_022903265.jpg",
    "images/daily/スクショ/2024y12m27d_022904628.jpg",
    "images/daily/スクショ/2024y12m27d_022910852.jpg",
    "images/daily/スクショ/2024y12m27d_022913794.jpg",
    "images/daily/スクショ/2024y12m27d_022915113.jpg",
    "images/daily/スクショ/2024y12m27d_022915996.jpg",
    "images/daily/スクショ/2024y12m27d_022920101.jpg",
    "images/daily/スクショ/2024y12m27d_022925487.jpg",
    "images/daily/スクショ/2024y12m27d_022944149.jpg",
    "images/daily/スクショ/2024y12m27d_022945058.jpg",
    "images/daily/スクショ/2024y12m27d_022952936.jpg",
    "images/daily/スクショ/2024y12m27d_022953629.jpg",
    "images/daily/スクショ/2024y12m27d_022955927.jpg",
    "images/daily/スクショ/2024y12m27d_022956641.jpg",
    "images/daily/スクショ/2024y12m27d_023006291.jpg",
    "images/daily/スクショ/2024y12m27d_023007351.jpg",
    "images/daily/スクショ/2024y12m27d_023013685.jpg",
    "images/daily/スクショ/2024y12m27d_023018414.jpg",
    "images/daily/スクショ/2024y12m27d_023019453.jpg",
    "images/daily/スクショ/2024y12m27d_023019948.jpg",
    "images/daily/スクショ/2024y12m27d_023020382.jpg",
    "images/daily/スクショ/2024y12m27d_023029354.jpg",
    "images/daily/スクショ/2024y12m27d_023030821.jpg",
    "images/daily/スクショ/2024y12m27d_023037390.jpg",
    "images/daily/スクショ/2024y12m27d_023102284.jpg",
    "images/daily/スクショ/2024y12m27d_023102944.jpg",
    "images/daily/スクショ/2024y12m27d_023111405.jpg",
    "images/daily/スクショ/2024y12m27d_023113628.jpg",
    "images/daily/スクショ/2024y12m27d_023114612.jpg",
    "images/daily/スクショ/2024y12m27d_023116221.jpg",
    "images/daily/スクショ/2024y12m27d_023118509.jpg",
    "images/daily/スクショ/2024y12m27d_023121157.jpg",
    "images/daily/スクショ/2024y12m27d_023122825.jpg",
    "images/daily/スクショ/2024y12m27d_023127251.jpg",
    "images/daily/スクショ/2024y12m27d_023128243.jpg",
    "images/daily/スクショ/2024y12m27d_023134208.jpg",
    "images/daily/スクショ/2024y12m27d_023136801.jpg",
    "images/daily/スクショ/2024y12m27d_023137709.jpg",
    "images/daily/スクショ/2024y12m27d_023145041.jpg",
    "images/daily/スクショ/2024y12m27d_023146599.jpg",
    "images/daily/スクショ/2024y12m27d_023147134.jpg",
    "images/daily/スクショ/2024y12m27d_023147948.jpg",
    "images/daily/スクショ/2024y12m27d_023149231.jpg",
    "images/daily/スクショ/2024y12m27d_023150320.jpg",
    "images/daily/スクショ/2024y12m27d_023153612.jpg",
    "images/daily/スクショ/2024y12m27d_023205230.jpg",
    "images/daily/スクショ/2024y12m27d_023214176.jpg",
    "images/daily/スクショ/2024y12m27d_023214820.jpg",
    "images/daily/スクショ/2024y12m27d_023222107.jpg",
    "images/daily/スクショ/2024y12m27d_023223306.jpg",
    "images/daily/スクショ/2024y12m27d_023224524.jpg",
    "images/daily/スクショ/2024y12m27d_023227512.jpg",
    "images/daily/スクショ/2024y12m27d_023236038.jpg",
    "images/daily/スクショ/2024y12m27d_023245145.jpg",
    "images/daily/スクショ/2024y12m27d_023248051.jpg",
    "images/daily/スクショ/2024y12m27d_023249895.jpg",
    "images/daily/スクショ/2024y12m27d_023304830.jpg",
    "images/daily/スクショ/2024y12m27d_023306390.jpg",
    "images/daily/スクショ/2024y12m27d_023307639.jpg",
    "images/daily/スクショ/2024y12m27d_023319467.jpg",
    "images/daily/スクショ/2024y12m27d_023320220.jpg",
    "images/daily/スクショ/2024y12m27d_023325326.jpg",
    "images/daily/スクショ/2024y12m27d_023326610.jpg",
    "images/daily/スクショ/2024y12m27d_023336035.jpg",
    "images/daily/スクショ/2024y12m27d_023336581.jpg",
    "images/daily/スクショ/2024y12m27d_023337964.jpg",
    "images/daily/スクショ/2024y12m27d_023340941.jpg",
    "images/daily/スクショ/2024y12m27d_023343165.jpg",
    "images/daily/スクショ/2024y12m27d_023347045.jpg",
    "images/daily/スクショ/2024y12m27d_023347804.jpg",
    "images/daily/スクショ/2024y12m27d_023425928.jpg",
    "images/daily/スクショ/2024y12m27d_023427192.jpg",
    "images/daily/スクショ/2024y12m27d_023438635.jpg",
    "images/daily/スクショ/2024y12m27d_023440269.jpg",
    "images/daily/スクショ/2024y12m27d_023443071.jpg",
    "images/daily/スクショ/2024y12m27d_023444685.jpg",
    "images/daily/スクショ/2024y12m27d_023451163.jpg",
    "images/daily/スクショ/2024y12m27d_023452342.jpg",
    "images/daily/スクショ/2024y12m27d_023453786.jpg",
    "images/daily/スクショ/2024y12m27d_023456840.jpg",
    "images/daily/スクショ/2024y12m27d_023500084.jpg",
    "images/daily/スクショ/2024y12m27d_023525234.jpg",
    "images/daily/スクショ/2024y12m27d_023525844.jpg",
    "images/daily/スクショ/2024y12m27d_023545701.jpg",
    "images/daily/スクショ/2024y12m27d_023556985.jpg",
    "images/daily/スクショ/2024y12m27d_023557726.jpg",
    "images/daily/スクショ/2024y12m27d_023602988.jpg",
    "images/daily/スクショ/2024y12m27d_023603873.jpg",
    "images/daily/スクショ/2024y12m27d_023607997.jpg",
    "images/daily/スクショ/2024y12m27d_023626551.jpg",
    "images/daily/スクショ/2024y12m27d_023636481.jpg",
    "images/daily/スクショ/2024y12m27d_023638490.jpg",
    "images/daily/スクショ/2024y12m27d_023640484.jpg",
    "images/daily/スクショ/2024y12m27d_023642341.jpg",
    "images/daily/スクショ/2024y12m27d_023643361.jpg",
    "images/daily/スクショ/2024y12m27d_023656202.jpg",
    "images/daily/スクショ/2024y12m27d_023701193.jpg",
    "images/daily/スクショ/2024y12m27d_023703441.jpg",
    "images/daily/スクショ/2024y12m27d_023708301.jpg",
    "images/daily/スクショ/2024y12m27d_023848132.jpg",
    "images/daily/スクショ/2024y12m27d_023849687.jpg",
    "images/daily/スクショ/2024y12m27d_023854140.jpg",
    "images/daily/スクショ/2024y12m27d_023855655.jpg",
    "images/daily/スクショ/2024y12m27d_023858474.jpg",
    "images/daily/スクショ/2024y12m27d_023900459.jpg",
    "images/daily/スクショ/2024y12m27d_023903002.jpg",
    "images/daily/スクショ/2024y12m27d_023904372.jpg",
    "images/daily/スクショ/2024y12m27d_023911200.jpg",
    "images/daily/スクショ/2024y12m27d_023912565.jpg",
    "images/daily/スクショ/2024y12m27d_023915933.jpg",
    "images/daily/スクショ/2024y12m27d_023916770.jpg",
    "images/daily/スクショ/2024y12m27d_023918778.jpg",
    "images/daily/スクショ/2024y12m27d_023920822.jpg",
    "images/daily/スクショ/2024y12m27d_023922798.jpg",
    "images/daily/スクショ/2024y12m27d_023924331.jpg",
    "images/daily/スクショ/2024y12m27d_023926271.jpg",
    "images/daily/スクショ/2024y12m27d_023927156.jpg",
    "images/daily/スクショ/2024y12m27d_023928900.jpg",
    "images/daily/スクショ/2024y12m27d_023935578.jpg",
    "images/daily/スクショ/2024y12m27d_023937151.jpg",
    "images/daily/スクショ/2024y12m27d_023942707.jpg",
    "images/daily/スクショ/2024y12m27d_023948626.jpg",
    "images/daily/スクショ/2024y12m27d_024014341.jpg",
    "images/daily/スクショ/2024y12m27d_024015906.jpg",
    "images/daily/スクショ/2024y12m27d_024016656.jpg",
    "images/daily/スクショ/2024y12m27d_024021274.jpg",
    "images/daily/スクショ/2024y12m27d_024022628.jpg",
    "images/daily/スクショ/2024y12m27d_024029873.jpg",
    "images/daily/スクショ/2024y12m27d_024043756.jpg",
    "images/daily/スクショ/2024y12m27d_024054264.jpg",
    "images/daily/スクショ/2024y12m27d_024055734.jpg",
    "images/daily/スクショ/2024y12m27d_024108126.jpg",
    "images/daily/スクショ/2024y12m27d_024204948.jpg",
    "images/daily/スクショ/2024y12m27d_024209935.jpg",
    "images/daily/スクショ/2024y12m27d_024253688.jpg",
    "images/daily/スクショ/2024y12m27d_024254671.jpg",
    "images/daily/スクショ/2024y12m27d_024257598.jpg",
    "images/daily/スクショ/2024y12m27d_024300531.jpg",
    "images/daily/スクショ/2024y12m27d_024308520.jpg",
    "images/daily/スクショ/2024y12m27d_024325148.jpg",
    "images/daily/スクショ/2024y12m27d_025622161.jpg",
    "images/daily/スクショ/2024y12m27d_025624714.jpg",
    "images/daily/スクショ/2024y12m27d_025652870.jpg",
    "images/daily/スクショ/2024y12m27d_025658598.jpg",
    "images/daily/スクショ/2024y12m27d_025702440.jpg",
    "images/daily/スクショ/2024y12m27d_025705327.jpg",
    "images/daily/スクショ/2024y12m27d_025707565.jpg",
    "images/daily/スクショ/2024y12m27d_025722233.jpg",
    "images/daily/スクショ/2024y12m27d_025724235.jpg",
    "images/daily/スクショ/2024y12m27d_025728867.jpg",
    "images/daily/スクショ/2024y12m27d_025732303.jpg",
    "images/daily/スクショ/2024y12m27d_025735275.jpg",
    "images/daily/スクショ/2024y12m27d_025913620.jpg",
    "images/daily/スクショ/2024y12m27d_025915300.jpg",
    "images/daily/スクショ/2024y12m27d_025925200.jpg",
    "images/daily/スクショ/2024y12m27d_025926614.jpg",
    "images/daily/スクショ/2024y12m27d_025927289.jpg",
    "images/daily/スクショ/2024y12m27d_025939068.jpg",
    "images/daily/スクショ/2024y12m27d_025943493.jpg",
    "images/daily/スクショ/2024y12m27d_025945872.jpg",
    "images/daily/スクショ/2024y12m27d_025947556.jpg",
    "images/daily/スクショ/2024y12m27d_030007993.jpg",
    "images/daily/スクショ/2024y12m27d_030009421.jpg",
    "images/daily/スクショ/2024y12m27d_030012658.jpg",
    "images/daily/スクショ/2024y12m27d_030014753.jpg",
    "images/daily/スクショ/2024y12m27d_030015686.jpg",
    "images/daily/スクショ/2024y12m27d_030016825.jpg",
    "images/daily/スクショ/2024y12m27d_030017514.jpg",
    "images/daily/スクショ/2024y12m27d_030018703.jpg",
    "images/daily/スクショ/2024y12m27d_030019638.jpg",
    "images/daily/スクショ/2024y12m27d_030021486.jpg",
    "images/daily/スクショ/2024y12m27d_030035414.jpg",
    "images/daily/スクショ/2024y12m27d_030036028.jpg",
    "images/daily/スクショ/2024y12m27d_030036307.jpg",
    "images/daily/スクショ/2024y12m27d_030037207.jpg",
    "images/daily/スクショ/2024y12m27d_030038571.jpg",
    "images/daily/スクショ/2024y12m27d_030040479.jpg",
    "images/daily/スクショ/2024y12m27d_030041888.jpg",
    "images/daily/スクショ/2024y12m27d_030042697.jpg",
    "images/daily/スクショ/2024y12m27d_030043750.jpg",
    "images/daily/スクショ/2024y12m27d_030045000.jpg",
    "images/daily/スクショ/2024y12m27d_030046218.jpg",
    "images/daily/スクショ/2025y01m01d_060735953.jpg",
    "images/daily/スクショ/2025y01m01d_060737625.jpg",
    "images/daily/スクショ/2025y01m01d_060759495.jpg",
    "images/daily/スクショ/2025y01m01d_061033856.jpg",
    "images/daily/スクショ/2025y01m01d_061102338.jpg",
    "images/daily/スクショ/2025y01m01d_062455173.jpg",
    "images/daily/スクショ/2025y01m01d_062526509.jpg",
    "images/daily/スクショ/2025y01m01d_062707483.jpg",
    "images/daily/スクショ/2025y01m01d_062710600.jpg",
    "images/daily/スクショ/2025y01m01d_062720546.jpg",
    "images/daily/スクショ/2025y01m01d_062743531.jpg",
    "images/daily/スクショ/2025y01m01d_062936359.jpg",
    "images/daily/スクショ/2025y01m01d_062937858.jpg",
    "images/daily/スクショ/2025y01m01d_062950286.jpg",
    "images/daily/スクショ/2025y01m01d_062952131.jpg",
    "images/daily/スクショ/2025y01m01d_063055886.jpg",
    "images/daily/スクショ/2025y01m01d_063057570.jpg",
    "images/daily/スクショ/2025y01m01d_063059092.jpg",
    "images/daily/スクショ/2025y01m01d_063103083.jpg",
    "images/daily/スクショ/2025y01m01d_063115503.jpg",
    "images/daily/スクショ/2025y01m01d_063116808.jpg",
    "images/daily/スクショ/2025y01m01d_063119988.jpg",
    "images/daily/スクショ/2025y01m01d_063128600.jpg",
    "images/daily/スクショ/2025y01m01d_063148713.jpg",
    "images/daily/スクショ/2025y01m01d_063150333.jpg",
    "images/daily/スクショ/2025y01m01d_063153994.jpg",
    "images/daily/スクショ/2025y01m01d_063158068.jpg",
    "images/daily/スクショ/2025y01m01d_063249382.jpg",
    "images/daily/スクショ/2025y01m01d_063250703.jpg",
    "images/daily/スクショ/2025y01m01d_063253035.jpg",
    "images/daily/スクショ/2025y01m01d_063258570.jpg",
    "images/daily/スクショ/2025y01m01d_063306445.jpg",
    "images/daily/スクショ/2025y01m01d_063339483.jpg",
    "images/daily/スクショ/2025y01m01d_063340015.jpg",
    "images/daily/スクショ/2025y01m01d_063351086.jpg",
    "images/daily/スクショ/2025y01m01d_063353141.jpg",
    "images/daily/スクショ/2025y01m01d_232805826.jpg",
    "images/daily/スクショ/2025y01m01d_232808127.jpg",
    "images/daily/スクショ/2025y01m01d_232828115.jpg",
    "images/daily/スクショ/2025y01m01d_232830590.jpg",
    "images/daily/スクショ/2025y01m01d_232834680.jpg",
    "images/daily/スクショ/2025y01m01d_232836215.jpg",
    "images/daily/スクショ/2025y01m01d_232838173.jpg",
    "images/daily/スクショ/2025y01m01d_233242251.jpg",
    "images/daily/スクショ/2025y01m01d_233325549.jpg",
    "images/daily/スクショ/2025y01m01d_233328017.jpg",
    "images/daily/スクショ/2025y01m01d_233331594.jpg",
    "images/daily/スクショ/2025y01m02d_014020022.jpg",
    "images/daily/スクショ/2025y01m02d_014030118.jpg",
    "images/daily/スクショ/2025y01m02d_014046751.jpg",
    "images/daily/スクショ/2025y01m02d_014048057.jpg",
    "images/daily/スクショ/2025y01m02d_014049181.jpg",
    "images/daily/スクショ/2025y01m02d_014051619.jpg",
    "images/daily/スクショ/2025y01m02d_014121454.jpg",
    "images/daily/スクショ/2025y01m02d_014152765.jpg",
    "images/daily/スクショ/2025y01m02d_014213372.jpg",
    "images/daily/スクショ/2025y01m02d_014232578.jpg",
    "images/daily/スクショ/2025y01m02d_014233793.jpg",
    "images/daily/スクショ/2025y01m02d_014252154.jpg",
    "images/daily/スクショ/2025y01m02d_014253954.jpg",
    "images/daily/スクショ/2025y01m02d_014259983.jpg",
    "images/daily/スクショ/2025y01m02d_014544659.jpg",
    "images/daily/スクショ/2025y01m02d_014545437.jpg",
    "images/daily/スクショ/2025y01m02d_014555780.jpg",
    "images/daily/スクショ/2025y01m02d_014620328.jpg",
    "images/daily/スクショ/2025y01m02d_014709161.jpg",
    "images/daily/スクショ/2025y01m02d_015657480.jpg",
    "images/daily/スクショ/2025y01m02d_015659700.jpg",
    "images/daily/スクショ/2025y01m02d_015721263.jpg",
    "images/daily/スクショ/2025y01m02d_015859809.jpg",
    "images/daily/スクショ/2025y01m02d_015902073.jpg",
    "images/daily/スクショ/2025y01m02d_020102849.jpg",
    "images/daily/スクショ/2025y01m02d_020142476.jpg",
    "images/daily/スクショ/2025y01m02d_020155335.jpg",
    "images/daily/スクショ/2025y01m02d_023643356.jpg",
    "images/daily/スクショ/2025y01m02d_023644240.jpg",
    "images/daily/スクショ/2025y01m02d_023829536.jpg",
    "images/daily/スクショ/2025y01m02d_023854062.jpg",
    "images/daily/スクショ/2025y01m02d_023920372.jpg",
    "images/daily/スクショ/2025y01m02d_023926935.jpg",
    "images/daily/スクショ/2025y01m02d_023930872.jpg",
    "images/daily/スクショ/2025y01m02d_024001555.jpg",
    "images/daily/スクショ/2025y01m03d_054557789.jpg",
    "images/daily/スクショ/2025y01m03d_054558966.jpg",
    "images/daily/スクショ/2025y01m03d_055740660.jpg",
    "images/daily/スクショ/2025y01m20d_024806296.jpg",
    "images/daily/スクショ/2025y01m20d_024807295.jpg",
    "images/daily/スクショ/2025y01m20d_024818723.jpg",
    "images/daily/スクショ/2025y01m20d_024820114.jpg",
    "images/daily/スクショ/2025y01m20d_024856126.jpg",
    "images/daily/スクショ/2025y01m20d_024856778.jpg",
    "images/daily/スクショ/2025y01m20d_024930388.jpg",
    "images/daily/スクショ/2025y01m20d_024931122.jpg",
    "images/daily/スクショ/2025y01m20d_024931841.jpg",
    "images/daily/スクショ/2025y01m20d_024932652.jpg",
    "images/daily/スクショ/2025y01m20d_024941146.jpg",
    "images/daily/スクショ/2025y01m20d_024942057.jpg",
    "images/daily/スクショ/2025y01m20d_025441251.jpg",
    "images/daily/スクショ/2025y01m20d_025726785.jpg",
    "images/daily/スクショ/2025y01m20d_025808291.jpg",
    "images/daily/スクショ/2025y01m20d_025809370.jpg",
    "images/daily/スクショ/2025y01m20d_025810541.jpg",
    "images/daily/スクショ/2025y03m30d_032732128.jpg",
    "images/daily/スクショ/2025y03m30d_032733442.jpg",
    "images/daily/スクショ/2025y03m30d_032845531.jpg",
    "images/daily/スクショ/2025y05m14d_023536871.jpg",
    "images/daily/スクショ/2025y05m14d_023901372.jpg",
    "images/daily/スクショ/2025y05m14d_023903149.jpg",
    "images/daily/スクショ/2025y08m06d_014640610.jpg",
    "images/daily/スクショ/2025y08m06d_014642588.jpg",
    "images/daily/スクショ/2025y08m06d_014649503.jpg",
    "images/daily/スクショ/2025y08m06d_014650313.jpg",
    "images/daily/スクショ/2025y08m06d_014651715.jpg",
    "images/daily/スクショ/2025y08m06d_014727701.jpg",
    "images/daily/スクショ/2025y08m06d_014731750.jpg",
    "images/daily/スクショ/2025y08m06d_014735935.jpg",
    "images/daily/スクショ/2025y08m06d_014759239.jpg",
    "images/daily/スクショ/2025y08m06d_014803738.jpg",
    "images/daily/スクショ/2025y08m06d_014837649.jpg",
    "images/daily/スクショ/2025y08m06d_014840446.jpg",
    "images/daily/スクショ/2025y08m06d_014844420.jpg",
    "images/daily/スクショ/2025y08m06d_014849320.jpg",
    "images/daily/スクショ/2025y08m06d_014906792.jpg",
    "images/daily/スクショ/2025y08m06d_014908022.jpg",
    "images/daily/スクショ/2025y08m06d_014908952.jpg",
    "images/daily/スクショ/2025y08m06d_014912544.jpg",
    "images/daily/スクショ/2025y08m06d_014924237.jpg",
    "images/daily/スクショ/2025y08m06d_014924965.jpg",
    "images/daily/スクショ/2025y08m06d_015048371.jpg",
    "images/daily/スクショ/2025y08m06d_015052245.jpg",
    "images/daily/スクショ/2025y08m06d_015054135.jpg",
    "images/daily/スクショ/2025y08m06d_015126085.jpg",
    "images/daily/スクショ/2025y08m06d_015130879.jpg",
    "images/daily/スクショ/2025y08m06d_015204045.jpg",
    "images/daily/スクショ/2025y08m06d_015209811.jpg",
    "images/daily/スクショ/2025y08m06d_015212158.jpg",
    "images/daily/スクショ/2025y08m06d_015216306.jpg",
    "images/daily/スクショ/2025y08m06d_015259438.jpg",
    "images/daily/スクショ/2025y08m06d_015301119.jpg",
    "images/daily/スクショ/2025y08m06d_015305184.jpg",
    "images/daily/スクショ/2025y08m06d_015326312.jpg",
    "images/daily/スクショ/2025y08m06d_015329898.jpg",
    "images/daily/スクショ/2025y08m06d_015428270.jpg",
    "images/daily/スクショ/2025y08m06d_015431712.jpg",
    "images/daily/スクショ/2025y08m06d_015433295.jpg",
    "images/daily/スクショ/2025y08m06d_015434383.jpg",
    "images/daily/スクショ/2025y08m06d_015448986.jpg",
    "images/daily/スクショ/2025y08m06d_015452505.jpg",
    "images/daily/スクショ/2025y08m06d_015526711.jpg",
    "images/daily/スクショ/2025y08m06d_015556292.jpg",
    "images/daily/スクショ/2025y08m06d_015601766.jpg",
    "images/daily/スクショ/2025y08m06d_015612064.jpg",
    "images/daily/スクショ/2025y08m06d_023004924.jpg",
    "images/daily/スクショ/2025y08m06d_023138420.jpg",
    "images/daily/スクショ/2025y08m06d_023139920.jpg",
    "images/daily/スクショ/2025y08m06d_023150123.jpg"
];

const dailyTrigger = document.getElementById("daily-shot-trigger");
const dailyModal = document.getElementById("daily-shot-modal");
const dailyImage = document.getElementById("daily-shot-image");
const dailyClose = document.getElementById("daily-shot-close");

function showDailyShot() {
    if (!dailyModal || !dailyImage || dailyImages.length === 0) return;

    // 現在の日付（ローカルタイム）を取得してシード値にする
    const now = new Date();
    const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    
    // 日付シードを使って擬似乱数を生成
    const hash = Math.sin(dateSeed) * 10000;
    const randomIndex = Math.floor(Math.abs(hash - Math.floor(hash)) * dailyImages.length);

    dailyImage.src = dailyImages[randomIndex];
    dailyModal.classList.remove("hidden");
}

function closeDailyShot() {
    if (!dailyModal) return;
    dailyModal.classList.add("hidden");
}

if (dailyTrigger) {
    dailyTrigger.style.cursor = "pointer";
    dailyTrigger.addEventListener("click", showDailyShot);
}

if (dailyClose) {
    dailyClose.addEventListener("click", closeDailyShot);
}

if (dailyModal) {
    dailyModal.addEventListener("click", (event) => {
        if (event.target === dailyModal) {
            closeDailyShot();
        }
    });
}
