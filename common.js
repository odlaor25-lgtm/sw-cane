common.js
/* ===================== CANE MATRIX – COMMON SCRIPT ===================== */

/* --- Global state --- */
let currentLang = 'th'; // Default language

/* --- Matrix Digital Rain --- */
function initMatrix() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return; // guard
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}".split("");
  const fontSize = 10;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = new Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
      const text = matrix[Math.floor(Math.random() * matrix.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  setInterval(draw, 35);

  window.addEventListener('resize', () => {
    resize();
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(1);
  });
}

/* --- Page Transition Overlay --- */
function showPageTransition(text, callback) {
  const transition = document.getElementById('pageTransition');
  const transitionText = document.getElementById('transitionText');
  if (!transition || !transitionText) { if (callback) callback(); return; }

  transitionText.textContent = text || '';
  transition.classList.add('active');

  setTimeout(() => {
    try { if (typeof callback === 'function') callback(); } catch (e) { console.error(e); }
    setTimeout(() => transition.classList.remove('active'), 500);
  }, 1000);
}

/* --- Typewriter Effect (for nav) --- */
function typewriterEffect(element, text, speed = 80) {
  return new Promise((resolve) => {
    if (!element) return resolve();
    element.innerHTML = '';
    element.classList.add('typing');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        const char = document.createElement('span');
        char.className = 'nav-tab-char';
        char.textContent = text[i];
        char.style.animationDelay = '0s';
        element.appendChild(char);
        i++;
      } else {
        clearInterval(timer);
        element.classList.remove('typing');
        resolve();
      }
    }, speed);
  });
}

/* --- i18n dictionary --- */
const translations = {
  th: {
    headerTitle: 'ระบบแมทริกซ์ราคาอ้อย',
    headerSubtitle: 'ระบบติดตามราคาดิจิทัล • วิเคราะห์เครือข่ายประสาท',
    tabDashboard: '📊 แกนแมทริกซ์',
    tabNews: '📡 สตรีมข้อมูล',
    faoTitle: 'ดัชนีน้ำตาล FAO',
    faoDate: 'อัพเดทล่าสุด: 2025-03-31',
    faoExplain: 'ตัวชี้วัดราคาน้ำตาลโลกจากเครือข่ายประสาท FAO ค่าสูงแสดงราคาน้ำตาลโลกแพง',
    iceTitle: 'ฟิวเจอร์ส ICE NO.11',
    iceUnit: 'เซนต์/ปอนด์ (เฉลี่ย 30 วัน)',
    iceExplain: 'ราคาน้ำตาลดิบในตลาดล่วงหน้านิวยอร์ก อ้างอิงสำคัญในการคำนวณแมทริกซ์อ้อยไทย',
    baseTitle: 'ราคาอ้อยขั้นต้น',
    baseUnit: 'บาท/ตัน',
    baseExplain: 'ราคาอ้อยขั้นต้นที่คำนวณด้วยอัลกอริทึม AI ยังไม่รวมค่าชดเชย CCS และโบนัส',
    bullTitle: 'การคาดการณ์สูงสุด',
    bullUnit: 'บาท/ตัน',
    bullExplain: 'การคาดการณ์ราคาสูงสุดหากตลาดน้ำตาลโลกพุ่งสูง รวมค่าชดเชยทั้งหมด',
    btnFAO: 'ซิงค์เครือข่าย FAO',
    btnNews: 'สแกนแมทริกซ์ข่าว',
    btnUpdate: 'อัพเดท AI โมเดล',
    btnExport: 'ส่งออกสตรีมข้อมูล',
    calcTitle: '🧮 เครื่องคำนวณควอนตัม',
    calcFAOLabel: 'ดัชนีเครือข่าย FAO',
    calcICELabel: 'ฟิวเจอร์ส ICE (เซนต์/ปอนด์)',
    calcPolicyLabel: 'แมทริกซ์นโยบาย (บาท/ตัน)',
    calcVolatilityLabel: 'ดัชนีความผันผวน (%)',
    liveBaseTitle: 'การคำนวณขั้นต้น',
    liveBullTitle: 'สถานการณ์ Bull',
    liveBearTitle: 'สถานการณ์ Bear',
    liveRangeTitle: 'ช่วงราคา',
    btnApply: '✅ ใช้การคำนวณควอนตัม',
    inputTitle: '📊 การฉีดข้อมูล',
    inputDateLabel: 'ตราวันที่',
    inputTypeLabel: 'ประเภทข้อมูล',
    inputValueLabel: 'ค่า/ราคา',
    inputNoteLabel: 'เมตาดาต้า',
    btnAdd: '➕ ฉีดข้อมูล',
    faoTableTitle: '📈 ข้อมูลเครือข่ายประสาท FAO',
    policyTableTitle: '📋 แมทริกซ์นโยบายและข้อมูลราคา',
    newsTitle: '📡 สตรีมข้อมูลล่าสุด',
    thDate: 'วันที่',
    thIndex: 'ดัชนี',
    thChange: 'เดลต้า',
    thPolicyDate: 'วันที่',
    thPolicy: 'นโยบาย',
    thDetail: 'รายละเอียด',
    thValue: 'ค่า (บาท/ตัน)',
    optionFAO: 'ดัชนีเครือข่าย FAO',
    optionICE: 'ฟิวเจอร์ส ICE',
    optionPolicy: 'แมทริกซ์นโยบาย',
    optionOCSB: 'สตรีมข้อมูล OCSB',
    news1Title: 'ราคาอ้อยขั้นต้นฤดูกาล 2024/25: 1,250 บาท/ตัน',
    news1Content: 'การวิเคราะห์เครือข่ายประสาทของคณะกรรมการอ้อยและน้ำตาลทรายยืนยันราคาอ้อยขั้นต้นสำหรับฤดูกาล 2024/25 ที่ 1,250 บาทต่อตัน พร้อมแมทริกซ์ค่าชดเชยความหวาน CCS...',
    news2Title: 'ดัชนีน้ำตาล FAO เดือนมีนาคม: เพิ่มขึ้น +2.1%',
    news2Content: 'เครือข่ายประสาทขององค์การอาหารและเกษตรรายงานดัชนีราคาน้ำตาลโลกสำหรับเดือนมีนาคม 2025 ที่ 116.9 จุด เพิ่มขึ้นจากการวิเคราะห์เดือนก่อน...',
    newsSourcesTitle: '🏢 แมทริกซ์แหล่งข้อมูล',
    sourceOCSB: 'เครือข่ายประสาท OCSB',
    sourceOCSBDesc: 'สตรีมข้อมูลราคาอ้อยและนโยบายอย่างเป็นทางการ',
    sourceSugar: 'แมทริกซ์โรงงานน้ำตาล',
    sourceSugarDesc: 'ข้อมูลราคารับซื้ออ้อยจากเครือข่ายโรงงาน',
    sourceMOAC: 'AI กระทรวงเกษตร',
    sourceMOACDesc: 'การวิเคราะห์เครือข่ายประสาทนโยบายและสนับสนุนเกษตรกร',
    sourceFarmer: 'ฮับเครือข่ายเกษตรกร',
    sourceFarmerDesc: 'ข่าวสารและข้อมูลสำหรับแมทริกซ์เกษตรกร',
    statusOCSB: 'ออนไลน์',
    statusSugar: 'ออนไลน์',
    statusMOAC: 'ออนไลน์',
    statusFarmer: 'ออนไลน์',
    officialNewsTitle: '📢 สตรีมข้อมูลอย่างเป็นทางการ',
    btnRefresh: '🔄 รีเฟรชแมทริกซ์',
    loadingText: 'กำลังสแกนเครือข่ายประสาท...'
  },
  en: {
    headerTitle: 'CANE MATRIX SYSTEM',
    headerSubtitle: 'DIGITAL PRICE MONITORING • NEURAL NETWORK ANALYSIS',
    tabDashboard: '📊 MATRIX CORE',
    tabNews: '📡 DATA STREAM',
    faoTitle: 'FAO SUGAR INDEX',
    faoDate: 'LAST UPDATE: 2025-03-31',
    faoExplain: 'Global sugar price indicator from FAO neural network. Higher values indicate expensive global sugar prices.',
    iceTitle: 'ICE NO.11 FUTURES',
    iceUnit: 'CENTS/LB (30-DAY AVG)',
    iceExplain: 'Raw sugar price in NY futures market. Key reference affecting Thai cane matrix calculations.',
    baseTitle: 'BASE CANE PRICE',
    baseUnit: 'THB/TON',
    baseExplain: 'Base cane price calculated by AI algorithm, excluding CCS compensation and bonuses.',
    bullTitle: 'MAXIMUM PROJECTION',
    bullUnit: 'THB/TON',
    bullExplain: 'Maximum price projection if global sugar market surges, including all compensations.',
    btnFAO: 'SYNC FAO NEURAL NET',
    btnNews: 'SCAN NEWS MATRIX',
    btnUpdate: 'UPDATE AI MODEL',
    btnExport: 'EXPORT DATA STREAM',
    calcTitle: '🧮 QUANTUM PRICE CALCULATOR',
    calcFAOLabel: 'FAO NEURAL INDEX',
    calcICELabel: 'ICE FUTURES (CENTS/LB)',
    calcPolicyLabel: 'POLICY MATRIX (THB/TON)',
    calcVolatilityLabel: 'VOLATILITY INDEX (%)',
    liveBaseTitle: 'BASE CALC',
    liveBullTitle: 'BULL SCENARIO',
    liveBearTitle: 'BEAR SCENARIO',
    liveRangeTitle: 'PRICE RANGE',
    btnApply: '✅ APPLY QUANTUM CALC',
    inputTitle: '📊 DATA INJECTION',
    inputDateLabel: 'DATE STAMP',
    inputTypeLabel: 'DATA TYPE',
    inputValueLabel: 'VALUE/PRICE',
    inputNoteLabel: 'METADATA',
    btnAdd: '➕ INJECT DATA',
    faoTableTitle: '📈 FAO NEURAL NETWORK DATA',
    policyTableTitle: '📋 POLICY MATRIX & PRICE DATA',
    newsTitle: '📡 LATEST DATA STREAM',
    thDate: 'DATE',
    thIndex: 'INDEX',
    thChange: 'DELTA',
    thPolicyDate: 'DATE',
    thPolicy: 'POLICY',
    thDetail: 'DETAILS',
    thValue: 'VALUE (THB/TON)',
    optionFAO: 'FAO NEURAL INDEX',
    optionICE: 'ICE FUTURES',
    optionPolicy: 'POLICY MATRIX',
    optionOCSB: 'OCSB DATA STREAM',
    news1Title: 'BASE CANE PRICE 2024/25 SEASON: 1,250 THB/TON',
    news1Content: 'Cane and Sugar Committee neural network analysis confirms base cane price for 2024/25 season at 1,250 THB per ton with CCS sweetness compensation matrix...',
    news2Title: 'FAO SUGAR INDEX MARCH: +2.1% INCREASE',
    news2Content: 'Food and Agriculture Organization neural network reports global sugar price index for March 2025 at 116.9 points, increased from previous month analysis...',
    newsSourcesTitle: '🏢 DATA SOURCE MATRIX',
    sourceOCSB: 'OCSB NEURAL NETWORK',
    sourceOCSBDesc: 'Official cane price and policy data stream',
    sourceSugar: 'SUGAR MILLS MATRIX',
    sourceSugarDesc: 'Cane purchase price data from mill network',
    sourceMOAC: 'AGRICULTURE MINISTRY AI',
    sourceMOACDesc: 'Policy and farmer support neural analysis',
    sourceFarmer: 'FARMER NETWORK HUB',
    sourceFarmerDesc: 'News and information for farmer matrix',
    statusOCSB: 'ONLINE',
    statusSugar: 'ONLINE',
    statusMOAC: 'ONLINE',
    statusFarmer: 'ONLINE',
    officialNewsTitle: '📢 OFFICIAL DATA STREAM',
    btnRefresh: '🔄 REFRESH MATRIX',
    loadingText: 'SCANNING NEURAL NETWORKS...'
  }
};

/* --- Language toggle --- */
function toggleLanguage() {
  currentLang = currentLang === 'th' ? 'en' : 'th';
  updateLanguage();
}

function updateLanguage() {
  const t = translations[currentLang];
  Object.keys(t).forEach(key => {
    const el = document.getElementById(key);
    if (!el) return;
    if (key === 'tabDashboard' || key === 'tabNews') {
      const textEl = el.querySelector('.nav-tab-text');
      if (textEl) textEl.textContent = t[key];
    } else {
      el.textContent = t[key];
    }
  });
  const toggle = document.getElementById('langToggle');
  if (toggle) toggle.textContent = currentLang === 'th' ? 'English' : 'ไทย';

  const activeTab = document.querySelector('.nav-tab.active');
  if (activeTab) {
    const activeText = activeTab.querySelector('.nav-tab-text');
    if (activeText) setTimeout(() => typewriterEffect(activeText, activeText.textContent, 60), 300);
  }
}

/* --- In-memory sample data (for UI updates, actual data from Code.gs) --- */
let dashboardData = {
  fao: [
    { date: '2025-03-31', value: 116.9, change: 2.1 },
    { date: '2025-02-28', value: 114.5, change: -1.3 },
    { date: '2025-01-31', value: 116.0, change: 0.8 }
  ],
  policy: [
    { date: '2025-01-15', policy: 'BASE PRICE', detail: 'Base cane price season 2024/25', value: 1250 },
    { date: '2025-01-10', policy: 'CCS COMPENSATION', detail: 'Sweetness compensation 10 CCS+', value: 150 }
  ],
  model: {
    faoLast: 116.9,
    ice30dAvg: 22.45,
    policySupport: 150,
    basePrice: 1250,
    bullPrice: 1450,
    bearPrice: 1050
  }
};

/* --- Small helpers --- */
function showLoading(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = currentLang === 'th' ? 'กำลังสแกนเครือข่าย...' : 'SCANNING NETWORKS...';
  el.innerHTML = `<div class="loading"><span class="spinner"></span>${text}</div>`;
}

// Function to update metrics on the dashboard
function updateMetrics() {
  const model = dashboardData.model;
  document.getElementById('faoValue').textContent = model.faoLast.toFixed(1);
  document.getElementById('iceValue').textContent = model.ice30dAvg.toFixed(2);
  document.getElementById('basePrice').textContent = model.basePrice.toLocaleString();
  document.getElementById('bullPrice').textContent = model.bullPrice.toLocaleString();
}

// Function to update FAO table
function updateFAOTable() {
  const tbody = document.querySelector('#faoTable tbody');
  if (!tbody) return;
  tbody.innerHTML = dashboardData.fao.slice(0, 5).map(item => `
    <tr>
      <td>${item.date}</td>
      <td>${item.value.toFixed(1)}</td>
      <td style="color: ${item.change >= 0 ? '#00ff41' : '#ff0040'};">
        ${item.change >= 0 ? '+' : ''}${(item.change || 0).toFixed(1)}%
      </td>
    </tr>`).join('');
}

// Function to update Policy table
function updatePolicyTable() {
  const tbody = document.querySelector('#policyTable tbody');
  if (!tbody) return;
  tbody.innerHTML = dashboardData.policy.slice(0, 5).map(item => `
    <tr>
      <td>${item.date}</td>
      <td>${item.policy}</td>
      <td>${item.detail}</td>
      <td>${item.value.toLocaleString()}</td>
    </tr>`).join('');
}

// Initial calls when the page loads
document.addEventListener('DOMContentLoaded', () => {
  initMatrix();
  updateLanguage();
  updateMetrics();
  updateFAOTable();
  updatePolicyTable();
  initNavTypewriter(); // Initialize typewriter effect for navigation
});

// For the navigation typewriter effect
function initNavTypewriter() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    const textElement = tab.querySelector('.nav-tab-text');
    const originalText = textElement ? textElement.textContent : '';
    tab.addEventListener('mouseenter', () => {
      if (!textElement) return;
      if (!tab.classList.contains('active') && !tab.classList.contains('loading')) {
        typewriterEffect(textElement, originalText, 50);
      }
    });
    tab.addEventListener('mouseleave', () => {
      if (!textElement) return;
      if (!tab.classList.contains('active')) {
        textElement.innerHTML = originalText;
        textElement.classList.remove('typing');
      }
    });
  });
}
