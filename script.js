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
        return '';
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
