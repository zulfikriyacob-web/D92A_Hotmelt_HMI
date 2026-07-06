/**** D92A HOTMELT USAGE — Apps Script backend (v2 with update) ****/
const SHEET_NAME = 'LOG';

// weights (gram) — kena sama dengan app
const WEIGHTS = { plan:48, b:300, c:200, d:200, e:60, f:58, g:200 };

const HEADERS = ['ID','Timestamp','Date','Operator','Shift','Changeover','ProdPlan',
  'b_InitialStart','c_AfterBodyFitting','d_AfterBreak','e_Idling','f_Replacement','g_PurgingOnly',
  'PlanG','TotalG','TotalKg'];

function getSheet(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if(!sh){
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.getRange(1,1,1,HEADERS.length).setFontWeight('bold')
      .setBackground('#11202E').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
  }
  return sh;
}

function doGet(e){
  if(e && e.parameter && e.parameter.action === 'list') return json(getRecords());
  return json({ ok:true, app:'D92A Hotmelt API', time:new Date() });
}

function doPost(e){
  try{
    const data = JSON.parse(e.postData.contents);
    if(data.action === 'update') return updateRecord(data);
    return createRecord(data);
  }catch(err){
    return json({ ok:false, error:String(err) });
  }
}

function computeTotals(data){
  const plan = num(data.plan);
  const b=num(data.b), c=num(data.c), d=num(data.d),
        ev=num(data.e), f=num(data.f), g=num(data.g);
  const planG = plan * WEIGHTS.plan;
  const totalG = planG + b*WEIGHTS.b + c*WEIGHTS.c + d*WEIGHTS.d +
                 ev*WEIGHTS.e + f*WEIGHTS.f + g*WEIGHTS.g;
  return { plan, b, c, d, e:ev, f, g, planG, totalG };
}

function createRecord(data){
  const sh = getSheet();
  const t = computeTotals(data);
  const id = 'D92A-' + Utilities.formatDate(new Date(),
               Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
  sh.appendRow([
    id, new Date(), data.date || '', data.op || '', data.shift || '', data.co || '',
    t.plan, t.b, t.c, t.d, t.e, t.f, t.g, t.planG, t.totalG, t.totalG/1000
  ]);
  return json({ ok:true, id:id, totalG:t.totalG, totalKg:t.totalG/1000 });
}

function updateRecord(data){
  if(!data.id) return json({ ok:false, error:'Missing ID' });
  const sh = getSheet();
  const values = sh.getDataRange().getValues();
  for(let i = 1; i < values.length; i++){
    if(values[i][0] === data.id){
      const t = computeTotals(data);
      // rows are 1-indexed; keep col 1 (ID) and col 2 (Timestamp) unchanged
      sh.getRange(i+1, 3, 1, 14).setValues([[
        data.date || '', data.op || '', data.shift || '', data.co || '',
        t.plan, t.b, t.c, t.d, t.e, t.f, t.g, t.planG, t.totalG, t.totalG/1000
      ]]);
      return json({ ok:true, id:data.id, totalG:t.totalG, totalKg:t.totalG/1000 });
    }
  }
  return json({ ok:false, error:'ID not found: ' + data.id });
}

function getRecords(){
  const sh = getSheet();
  const v = sh.getDataRange().getValues();
  if(v.length < 2) return [];
  const head = v.shift();
  return v.map(r => { const o={}; head.forEach((h,i)=>o[h]=r[i]); return o; });
}

function num(v){ const n = Number(v); return isNaN(n) ? 0 : n; }

function json(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
