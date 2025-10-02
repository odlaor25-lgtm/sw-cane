// ===== CANE MATRIX (Apps Script) =====
// Author: P’Yai for George & Bernny
// Backend for index.html. Uses Script Properties for keys.

/** CONFIG **/
const CONFIG = {
  SHEET_ID: 'PUT_YOUR_SHEET_ID_HERE',   // <-- ใส่ Spreadsheet ID ที่จะเก็บ log
  SHEET_NAME: 'DATA',                   // ชื่อชีตสำหรับเก็บข้อมูล
};

/** Utilities **/
function _props() { return PropertiesService.getScriptProperties(); }
function _get(key) { return _props().getProperty(key) || ''; }
function _has(key){ return !!_get(key); }
function _json(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/** Entry (serve UI) **/
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('CANE MATRIX')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Entry (API for external fetch if needed) */
function doPost(e){
  try{
    const req = JSON.parse(e.postData.contents || '{}');
    const {action, payload} = req;
    if(action === 'getAllMarketData') return _json(getAllMarketData());
    if(action === 'analyze')          return _json(analyzeMarketConditions(payload));
    if(action === 'addLog')           return _json(addDataToSheet(payload));
    return _json({ok:false, error:'Unknown action'});
  }catch(err){
    return _json({ok:false, error:String(err)});
  }
}

/** Check keys presence for UI badges */
function getKeyStatus(){
  return {
    BOT_CLIENT_ID: _has('BOT_CLIENT_ID'),
    ALPHAVANTAGE_API_KEY: _has('ALPHAVANTAGE_API_KEY'),
    FRED_API_KEY: _has('FRED_API_KEY'),
  };
}

/** Fetch helpers **/
function fetchJson_(url, opt){
  const res = UrlFetchApp.fetch(url, Object.assign({muteHttpExceptions:true}, opt||{}));
  const code = res.getResponseCode();
  const body = res.getContentText();
  if(code>=200 && code<300){
    try { return JSON.parse(body); } catch(e){ return body; }
  }
  throw new Error('HTTP '+code+' : '+body.slice(0,200));
}

/** AlphaVantage examples
 *  - FX_DAILY USD/THB (เป็น proxy ภาวะค่าเงินบาท)
 */
function getUsdThbFromAlphaVantage(){
  const key = _get('ALPHAVANTAGE_API_KEY');
  if(!key) return {ok:false, reason:'Missing ALPHAVANTAGE_API_KEY'};
  const url = 'https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=USD&to_symbol=THB&apikey='+encodeURIComponent(key);
  const j = fetchJson_(url);
  const series = j['Time Series FX (Daily)'] || {};
  const dates = Object.keys(series).sort().reverse();
  const latest = dates[0];
  const prev   = dates[1];
  const lastClose = latest ? Number(series[latest]['4. close']) : null;
  const prevClose = prev   ? Number(series[prev]['4. close'])   : null;
  const change = (lastClose && prevClose) ? ((lastClose - prevClose)/prevClose*100) : null;
  return { ok:true, pair:'USDTHB', lastDate:latest, lastClose, changePct: change };
}

/** FRED example
 *  Dollar Index (DTWEXBGS) หรือปรับ series_id อื่นได้
 */
function getFredSeries(seriesId){
  const key = _get('FRED_API_KEY');
  if(!key) return {ok:false, reason:'Missing FRED_API_KEY'};
  const url = 'https://api.stlouisfed.org/fred/series/observations?series_id='+encodeURIComponent(seriesId)+'&api_key='+encodeURIComponent(key)+'&file_type=json';
  const j = fetchJson_(url);
  const obs = (j && j.observations) ? j.observations : [];
  const last = obs.length ? obs[obs.length-1] : null;
  return {
    ok:true,
    seriesId,
    lastDate: last ? last.date : null,
    lastValue: last ? Number(last.value) : null,
    total: obs.length
  };
}

/** BOT example (placeholder — endpoint แตกต่างตามชุดข้อมูลที่ใช้)
 *  เราจะคืนเพียงสถานะว่า key มีจริง ใช้งานผ่าน UrlFetch ได้
 */
function pingBOT(){
  const cid = _get('BOT_CLIENT_ID');
  return { ok: !!cid, clientIdPresent: !!cid };
}

/** Aggregate API for UI */
function getAllMarketData(){
  const out = { ok:true, keys:getKeyStatus(), data:{} };
  try { out.data.usdthb = getUsdThbFromAlphaVantage(); } catch(e){ out.data.usdthb = {ok:false, error:String(e)}; }
  try { out.data.dollarIndex = getFredSeries('DTWEXBGS'); } catch(e){ out.data.dollarIndex = {ok:false, error:String(e)}; }
  try { out.data.bot = pingBOT(); } catch(e){ out.data.bot = {ok:false, error:String(e)}; }
  // Slots for cane model (values can be computed on client or here)
  out.data.modelDefaults = { basePrice:1250, bullPrice:1450, bearPrice:1050 };
  return out;
}

/** Simple analyzer for cane price (base/bull/bear) */
function analyzeMarketConditions(input){
  const fao = Number((input && input.fao) || 116.9);
  const ice = Number((input && input.ice) || 22.45);
  const policy = Number((input && input.policy) || 150);
  const vol = Number((input && input.volatility) || 2.1);
  const faoFactor = (fao - 100) * 15;
  const iceFactor = (ice - 20) * 25;
  const baseCalculated = 1000 + faoFactor + iceFactor + policy;
  const base = Math.max(800, Math.round(baseCalculated));
  const bull = Math.round(baseCalculated * (1 + (vol/100) + 0.15));
  const bear = Math.round(baseCalculated * (1 - (vol/100) - 0.12));
  const summary = (
    'FAO '+fao.toFixed(1)+', ICE '+ice.toFixed(2)+', Policy '+policy+
    ' → Base '+base+' / Bull '+bull+' / Bear '+bear
  );
  return { ok:true, base, bull, bear, summary };
}

/** Append log to Google Sheet */
function addDataToSheet(row){
  try{
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    const sh = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.insertSheet(CONFIG.SHEET_NAME);
    if(sh.getLastRow() === 0){
      sh.appendRow(['Timestamp','Type','Date','Value','Note']);
    }
    const now = new Date();
    sh.appendRow([now, row && row.type, row && row.date, row && row.value, row && row.note]);
    return {ok:true};
  }catch(e){
    return {ok:false, error:String(e)};
  }
}
