const sampleData = [
  {platform:'小红书',content:'晨跑场景实测',contentType:'场景体验',creatorType:'垂类腰部',spend:21000,impressions:168000,views:142000,engagements:18500,clicks:6900,conversions:410},
  {platform:'小红书',content:'开放式耳机横评',contentType:'产品测评',creatorType:'垂类头部',spend:32000,impressions:246000,views:201000,engagements:21400,clicks:7200,conversions:365},
  {platform:'小红书',content:'通勤穿搭种草',contentType:'生活方式',creatorType:'泛人群腰部',spend:16000,impressions:139000,views:98000,engagements:9800,clicks:3600,conversions:135},
  {platform:'小红书',content:'7天佩戴日记',contentType:'场景体验',creatorType:'垂类腰部',spend:15000,impressions:122000,views:105000,engagements:14300,clicks:5100,conversions:326},
  {platform:'抖音',content:'AI耳机开箱挑战',contentType:'挑战玩法',creatorType:'泛人群头部',spend:47000,impressions:865000,views:710000,engagements:33200,clicks:7900,conversions:190},
  {platform:'抖音',content:'跑步防掉实测',contentType:'场景体验',creatorType:'运动垂类',spend:31000,impressions:492000,views:410000,engagements:24800,clicks:8700,conversions:318},
  {platform:'抖音',content:'一分钟参数速览',contentType:'参数介绍',creatorType:'科技腰部',spend:25000,impressions:415000,views:355000,engagements:14200,clicks:3800,conversions:112},
  {platform:'抖音',content:'地铁降噪对比',contentType:'产品测评',creatorType:'科技头部',spend:34000,impressions:538000,views:449000,engagements:22100,clicks:6100,conversions:210},
  {platform:'微博',content:'新品发布主话题',contentType:'品牌事件',creatorType:'品牌自有',spend:28000,impressions:745000,views:620000,engagements:17300,clicks:4200,conversions:102},
  {platform:'微博',content:'运动达人体验团',contentType:'场景体验',creatorType:'运动垂类',spend:17000,impressions:328000,views:275000,engagements:9200,clicks:3100,conversions:118},
  {platform:'微信',content:'产品技术深度稿',contentType:'参数介绍',creatorType:'科技媒体',spend:14000,impressions:126000,views:96000,engagements:5100,clicks:4300,conversions:268},
  {platform:'微信',content:'真实用户故事',contentType:'用户故事',creatorType:'品牌自有',spend:9000,impressions:78000,views:61000,engagements:3800,clicks:2700,conversions:201}
];
const sampleOrderValue={小红书:459,抖音:429,微博:399,微信:499};
sampleData.forEach(row=>{row.revenue=row.conversions*(sampleOrderValue[row.platform]||429)});

const sampleBrief = {
  projectName:'HaloClip AI运动耳夹耳机上市战役',projectTag:'HaloClip新品上市',objective:['awareness','conversion'],budget:300000,duration:21,
  audience:'一二线城市18—30岁人群；关注跑步、通勤、穿搭与智能硬件，重视舒适感和轻量体验',
  brief:'新品采用开放式耳夹设计，核心卖点为全天候无感佩戴、运动防掉与AI场景音效。市场已有多个开放式耳机品牌，任务是在新品上市期建立差异化认知，并兼顾电商转化。'
};

let rows=[];
let currentFile={name:'示例数据',type:'模拟数据'};
let currentAnalysis=null;
const $=s=>document.querySelector(s);
const fmt=n=>new Intl.NumberFormat('zh-CN').format(Math.round(n||0));
const pct=n=>`${(n*100).toFixed(n*100>=10?1:2)}%`;
const money=n=>`¥${fmt(n)}`;
const moneyDecimal=n=>`¥${Number(n||0).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const safe=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2000)}

function loadSample(){
  Object.entries(sampleBrief).forEach(([k,v])=>{if(k==='objective')return;const el=$(`#${k}`);if(el)el.value=v});
  document.querySelectorAll('input[name="objective"]').forEach(input=>{input.checked=sampleBrief.objective.includes(input.value)});
  rows=sampleData.map(x=>({...x}));currentFile={name:'HaloClip_跨平台传播数据',type:'模拟数据'};renderPreview();toast('完整示例已载入');
}
$('#loadSample').addEventListener('click',loadSample);
$('#sampleDataButton').addEventListener('click',()=>{rows=sampleData.map(x=>({...x}));currentFile={name:'跨平台传播示例数据',type:'模拟数据'};renderPreview();toast('已载入12条示例数据')});

function renderPreview(){
  if(!rows.length){$('#dataPreview').innerHTML='<div class="empty-state"><span>0</span><p>尚未导入数据</p></div>';return}
  const channels=new Set(rows.map(r=>r.platform).filter(Boolean)).size;
  const spend=rows.reduce((n,r)=>n+(Number(r.spend)||0),0);
  const audit=auditData(rows);
  const topFive=[...rows].sort((a,b)=>(Number(b.impressions)||0)-(Number(a.impressions)||0)).slice(0,5);
  $('#dataPreview').innerHTML=`
    <div class="file-meta"><b>${safe(currentFile.name)}</b><span>${safe(currentFile.type)} · 解析完成</span></div>
    <div class="audit-title"><b>数据审核</b><span>自动检查完整性与逻辑关系</span></div>
    <div class="audit-grid">
      <div class="audit-item"><i>✓</i><div><span>识别记录</span><strong>${rows.length} 条</strong></div></div>
      <div class="audit-item ${audit.missingRows?'warn':''}"><i>${audit.missingRows?'!':'✓'}</i><div><span>缺失值</span><strong>${audit.missingRows?`${audit.missingCells}项 / ${audit.missingRows}条`:'无'}</strong></div></div>
      <div class="audit-item ${audit.anomalyRows?'warn':''}"><i>${audit.anomalyRows?'!':'✓'}</i><div><span>异常值</span><strong>${audit.anomalyRows?`${audit.anomalyRows} 条`:'无'}</strong></div></div>
    </div>
    <div class="overview-title"><b>数据概览</b><span>按已识别记录计算</span></div>
    <div class="preview-summary"><div><span>总发布条数</span><strong>${rows.length}</strong></div><div><span>发布平台</span><strong>${channels}</strong></div><div><span>已消耗总预算</span><strong>${money(spend)}</strong></div></div>
    <div class="top-five">
      <div class="top-five-header"><span>平台</span><span>内容名称 / 标签</span><span>曝光量</span></div>
      ${topFive.map(r=>`<div class="top-five-row"><span>${safe(r.platform||'未填写')}</span><b title="${safe(r.content||'未填写')}">${safe(r.content||'未填写')}</b><em>${fmt(r.impressions)}</em></div>`).join('')}
    </div>`;
}

const headerMap={
  '平台':'platform','发布平台':'platform','渠道':'platform','发布渠道':'platform','platform':'platform','channel':'platform',
  '内容':'content','内容名称':'content','内容标题':'content','内容标签':'content','标题':'content','标签':'content','content':'content','title':'content',
  '内容类型':'contentType','contenttype':'contentType','content_type':'contentType','类型':'contentType',
  '达人类型':'creatorType','创作者类型':'creatorType','账号类型':'creatorType','creatortype':'creatorType','creator_type':'creatorType',
  '花费':'spend','消耗':'spend','预算消耗':'spend','投放消耗':'spend','spend':'spend','cost':'spend',
  '曝光':'impressions','曝光量':'impressions','展示量':'impressions','阅读量':'impressions','浏览量':'impressions','impressions':'impressions',
  '观看':'views','观看量':'views','播放':'views','播放量':'views','视频播放量':'views','views':'views','view':'views',
  '互动':'engagements','互动量':'engagements','点赞评论收藏':'engagements','engagements':'engagements','engagement':'engagements',
  '点击':'clicks','点击量':'clicks','clicks':'clicks','click':'clicks',
  '转化':'conversions','转化量':'conversions','订单量':'conversions','conversions':'conversions','orders':'conversions',
  '转化价值':'revenue','销售额':'revenue','成交金额':'revenue','收入':'revenue','revenue':'revenue','conversionvalue':'revenue'
};
const numericKeys=['spend','impressions','views','engagements','clicks','conversions','revenue'];
const requiredKeys=['platform','content','contentType','creatorType','spend','impressions','engagements','clicks','conversions'];
const allKeys=[...requiredKeys,'views','revenue'];
const canonicalHeader=value=>{const v=String(value??'').trim();return headerMap[v]||headerMap[v.toLowerCase()]||headerMap[v.replace(/[\s：:()（）]/g,'')]||''};
const splitCSVLine=line=>{const out=[];let cur='',q=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'&&line[i+1]==='"'){cur+='"';i++}else if(c==='"')q=!q;else if(c===','&&!q){out.push(cur.trim());cur=''}else cur+=c}out.push(cur.trim());return out};
function splitSmart(line){if(line.includes('\t'))return line.split('\t').map(v=>v.trim());if(line.includes(','))return splitCSVLine(line);if(line.includes('|'))return line.split('|').map(v=>v.trim()).filter(Boolean);return line.trim().split(/\s{2,}/).map(v=>v.trim())}
function matrixToRows(matrix){
  const clean=matrix.map(row=>row.map(v=>String(v??'').trim())).filter(row=>row.some(Boolean));
  if(clean.length<2)return[];
  let headerIndex=-1,headers=[];
  clean.forEach((row,i)=>{const mapped=row.map(canonicalHeader),score=mapped.filter(Boolean).length;if(score>headers.filter(Boolean).length&&score>=2){headerIndex=i;headers=mapped}});
  if(headerIndex<0)return[];
  return clean.slice(headerIndex+1).map(values=>{
    const record={},missing=[];
    headers.forEach((key,i)=>{if(!key)return;const value=values[i]??'';record[key]=value;if(value==='')missing.push(key)});
    allKeys.forEach(key=>{if(!(key in record)){record[key]='';if(requiredKeys.includes(key))missing.push(key)}});
    numericKeys.forEach(key=>{const raw=String(record[key]??'').replace(/[,¥￥%\s]/g,'');record[key]=raw===''?0:Number(raw)||0});
    record._missing=[...new Set(missing)];return record;
  }).filter(r=>r.platform||r.content||numericKeys.some(k=>r[k]!==0));
}
function parseDelimitedText(text){const lines=String(text).replace(/^\uFEFF/,'').split(/\r?\n/).map(l=>l.trim()).filter(Boolean);return matrixToRows(lines.map(splitSmart))}
function auditData(list){
  let missingCells=0,missingRows=0,anomalyRows=0;
  list.forEach(r=>{
    const missing=(r._missing||requiredKeys.filter(k=>r[k]===''||r[k]===null||r[k]===undefined));
    if(missing.length){missingRows++;missingCells+=missing.length}
    const invalid=numericKeys.some(k=>Number(r[k])<0)||Number(r.clicks)>Number(r.impressions)||Number(r.engagements)>Number(r.impressions)||Number(r.conversions)>Number(r.clicks);
    if(invalid)anomalyRows++;
  });
  return{missingCells,missingRows,anomalyRows};
}
async function inflateRaw(bytes){const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));return new Uint8Array(await new Response(stream).arrayBuffer())}
async function unzipEntries(file){
  const buffer=await file.arrayBuffer(),view=new DataView(buffer);let eocd=-1;
  for(let i=view.byteLength-22;i>=Math.max(0,view.byteLength-65557);i--){if(view.getUint32(i,true)===0x06054b50){eocd=i;break}}
  if(eocd<0)throw new Error('无法读取压缩文档');
  const count=view.getUint16(eocd+10,true),decoder=new TextDecoder('utf-8'),entries=new Map();let offset=view.getUint32(eocd+16,true);
  for(let i=0;i<count;i++){
    if(view.getUint32(offset,true)!==0x02014b50)break;
    const method=view.getUint16(offset+10,true),size=view.getUint32(offset+20,true),nameLen=view.getUint16(offset+28,true),extraLen=view.getUint16(offset+30,true),commentLen=view.getUint16(offset+32,true),local=view.getUint32(offset+42,true);
    const name=decoder.decode(new Uint8Array(buffer,offset+46,nameLen)),localName=view.getUint16(local+26,true),localExtra=view.getUint16(local+28,true),start=local+30+localName+localExtra;
    const compressed=new Uint8Array(buffer,start,size);let data;if(method===0)data=compressed;else if(method===8)data=await inflateRaw(compressed);else{offset+=46+nameLen+extraLen+commentLen;continue}
    entries.set(name,data);offset+=46+nameLen+extraLen+commentLen;
  }
  return entries;
}
const xmlText=(entries,path)=>{const data=entries.get(path);if(!data)throw new Error(`文件缺少 ${path}`);return new TextDecoder('utf-8').decode(data)};
function colIndex(ref){const letters=(String(ref).match(/[A-Z]+/i)||['A'])[0].toUpperCase();let n=0;for(const c of letters)n=n*26+c.charCodeAt(0)-64;return n-1}
async function parseXlsx(file){
  const entries=await unzipEntries(file),parser=new DOMParser(),shared=[];
  if(entries.has('xl/sharedStrings.xml')){const doc=parser.parseFromString(xmlText(entries,'xl/sharedStrings.xml'),'application/xml');[...doc.getElementsByTagNameNS('*','si')].forEach(si=>shared.push([...si.getElementsByTagNameNS('*','t')].map(t=>t.textContent).join('')))}
  const sheetPath=[...entries.keys()].find(k=>/^xl\/worksheets\/sheet\d+\.xml$/.test(k));if(!sheetPath)throw new Error('未找到工作表');
  const sheet=parser.parseFromString(xmlText(entries,sheetPath),'application/xml'),matrix=[];
  [...sheet.getElementsByTagNameNS('*','row')].forEach(row=>{const values=[];[...row.getElementsByTagNameNS('*','c')].forEach(cell=>{const idx=colIndex(cell.getAttribute('r')),type=cell.getAttribute('t'),v=cell.getElementsByTagNameNS('*','v')[0]?.textContent??'',inline=[...cell.getElementsByTagNameNS('*','t')].map(t=>t.textContent).join('');values[idx]=type==='s'?shared[Number(v)]??'':inline||v});matrix.push(values)});
  return matrixToRows(matrix);
}
async function parseDocx(file){
  const entries=await unzipEntries(file),parser=new DOMParser(),doc=parser.parseFromString(xmlText(entries,'word/document.xml'),'application/xml'),tables=[...doc.getElementsByTagNameNS('*','tbl')],matrix=[];
  tables.forEach(table=>[...table.getElementsByTagNameNS('*','tr')].forEach(row=>matrix.push([...row.getElementsByTagNameNS('*','tc')].map(cell=>[...cell.getElementsByTagNameNS('*','t')].map(t=>t.textContent).join('')))));
  if(matrix.length)return matrixToRows(matrix);
  const text=[...doc.getElementsByTagNameNS('*','p')].map(p=>[...p.getElementsByTagNameNS('*','t')].map(t=>t.textContent).join('')).join('\n');return parseDelimitedText(text);
}
async function parseLegacyDoc(file){const buffer=await file.arrayBuffer(),bytes=new Uint8Array(buffer),latin=new TextDecoder('latin1').decode(bytes).replace(/[^\x20-\x7E\u4e00-\u9fff\r\n\t]+/g,' '),utf16=new TextDecoder('utf-16le').decode(bytes).replace(/[^\x20-\x7E\u4e00-\u9fff\r\n\t]+/g,' ');return parseDelimitedText(latin.length>utf16.length?latin:utf16)}
async function parsePdf(file){
  const pdfjs=await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@5.6.205/build/pdf.min.mjs');pdfjs.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs';
  const pdf=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise,lines=[];
  for(let p=1;p<=pdf.numPages;p++){const page=await pdf.getPage(p),content=await page.getTextContent(),groups=new Map();content.items.forEach(item=>{const y=Math.round((item.transform?.[5]||0)/3)*3;(groups.get(y)||groups.set(y,[]).get(y)).push({x:item.transform?.[4]||0,text:item.str})});[...groups.entries()].sort((a,b)=>b[0]-a[0]).forEach(([,items])=>lines.push(items.sort((a,b)=>a.x-b.x).map(i=>i.text).join('\t')))}
  return parseDelimitedText(lines.join('\n'));
}
let tesseractLoader;
function loadTesseract(){if(window.Tesseract)return Promise.resolve();if(tesseractLoader)return tesseractLoader;tesseractLoader=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/tesseract.min.js';script.onload=resolve;script.onerror=()=>reject(new Error('OCR组件加载失败'));document.head.appendChild(script)});return tesseractLoader}
async function parseImage(file){await loadTesseract();const result=await window.Tesseract.recognize(file,'chi_sim+eng',{logger:m=>{if(m.status==='recognizing text')$('#uploadStatus').textContent=`正在OCR识别 ${Math.round((m.progress||0)*100)}%`}});return parseDelimitedText(result.data.text)}
function showProcessing(file,message='正在识别文件结构与字段'){currentFile={name:file.name,type:'处理中'};$('#uploadStatus').textContent=message;$('#dataPreview').innerHTML=`<div class="processing-state"><i></i><div><b>${safe(file.name)}</b><span>${message}</span></div></div>`}
function showFileError(file,error){rows=[];$('#uploadStatus').textContent='识别失败，请检查文件内容';$('#dataPreview').innerHTML=`<div class="empty-state"><span>!</span><p>${safe(error.message||'未识别到结构化数据')}</p></div>`;toast('文件已上传，但未识别到可用的数据表')}
async function readFile(file){
  if(!file)return;if(file.size>25*1024*1024){toast('文件请控制在25MB以内');return}
  const ext=(file.name.split('.').pop()||'').toLowerCase();showProcessing(file,ext.match(/png|jpe?g|webp|bmp/)?'正在加载OCR组件':'正在识别文件结构与字段');
  try{
    let parsed=[];
    if(ext==='csv')parsed=parseDelimitedText(await file.text());
    else if(ext==='xlsx')parsed=await parseXlsx(file);
    else if(ext==='docx')parsed=await parseDocx(file);
    else if(ext==='doc')parsed=await parseLegacyDoc(file);
    else if(ext==='pdf')parsed=await parsePdf(file);
    else if(['png','jpg','jpeg','webp','bmp'].includes(ext)||file.type.startsWith('image/'))parsed=await parseImage(file);
    else throw new Error('暂不支持该文件格式');
    if(!parsed.length)throw new Error(ext==='doc'?'未识别到表格；请将旧版DOC另存为DOCX后重试':'未找到包含平台、内容或数据指标的表格');
    rows=parsed;currentFile={name:file.name,type:ext.toUpperCase()};$('#uploadStatus').textContent=`已识别 ${rows.length} 条记录`;renderPreview();toast(`已识别${rows.length}条数据`);
  }catch(error){showFileError(file,error)}
}
$('#csvInput').addEventListener('change',e=>readFile(e.target.files[0]));
['dragenter','dragover'].forEach(ev=>$('#dropZone').addEventListener(ev,e=>{e.preventDefault();e.currentTarget.style.borderColor='#19c88d'}));
['dragleave','drop'].forEach(ev=>$('#dropZone').addEventListener(ev,e=>{e.preventDefault();e.currentTarget.style.borderColor=''}));
$('#dropZone').addEventListener('drop',e=>readFile(e.dataTransfer.files[0]));
$('#downloadTemplate').addEventListener('click',()=>{const csv='平台,内容,内容类型,达人类型,花费,曝光,观看,互动,点击,转化,转化价值\n小红书,示例内容,场景体验,垂类腰部,10000,100000,80000,8000,3200,180,72000';const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='SignalFlow数据模板.csv';a.click();URL.revokeObjectURL(a.href)});

function getBrief(){return{projectName:$('#projectName').value.trim()||'未命名营销项目',projectTag:$('#projectTag').value.trim(),objective:[...document.querySelectorAll('input[name="objective"]:checked')].map(input=>input.value),budget:Number($('#budget').value)||0,duration:Number($('#duration').value)||0,audience:$('#audience').value.trim(),brief:$('#brief').value.trim()}}
function sum(arr,key){return arr.reduce((a,r)=>a+(Number(r[key])||0),0)}
function aggregate(list){const spend=sum(list,'spend'),impressions=sum(list,'impressions'),views=sum(list,'views'),engagements=sum(list,'engagements'),clicks=sum(list,'clicks'),conversions=sum(list,'conversions'),revenue=sum(list,'revenue');return{spend,impressions,views,engagements,clicks,conversions,revenue,er:impressions?engagements/impressions:0,ctr:impressions?clicks/impressions:0,cvr:clicks?conversions/clicks:0,vtr:impressions?views/impressions:0,cpm:impressions?spend/impressions*1000:0,cpc:clicks?spend/clicks:0,cpv:views?spend/views:0,cpa:conversions?spend/conversions:0,cpe:engagements?spend/engagements:0,roas:spend?revenue/spend:0}}
function groupBy(key){const g={};rows.forEach(r=>{const k=r[key]||'未分类';(g[k]??=[]).push(r)});return Object.entries(g).map(([name,list])=>({name,...aggregate(list),count:list.length}))}
function norm(v,min,max,invert=false){const n=max===min?.72:(v-min)/(max-min);return invert?1-n:n}
function scoreGroups(groups){const keys=['er','ctr','cvr','cpm','cpa'],range={};keys.forEach(k=>range[k]=[Math.min(...groups.map(g=>g[k])),Math.max(...groups.map(g=>g[k]))]);return groups.map(g=>{const base=100*(.23*norm(g.er,...range.er)+.22*norm(g.ctr,...range.ctr)+.25*norm(g.cvr,...range.cvr)+.12*norm(g.cpm,...range.cpm,true)+.18*norm(g.cpa,...range.cpa,true));const evidenceWeight=.72+.28*Math.min(1,g.count/2);return{...g,score:Math.round(base*evidenceWeight)}}).sort((a,b)=>b.score-a.score)}
function objectiveName(values){const labels={awareness:'提升品牌声量',engagement:'提升用户互动',traffic:'促进站外引流',conversion:'驱动销售转化'};return values.map(v=>labels[v]).filter(Boolean).join('、')}

const creativeCaseLibrary=[
  {title:'Apple「Shot on iPhone」',mechanism:'让真实用户作品持续成为产品能力的传播证据。',objectives:['awareness','conversion'],keywords:/影像|相机|手机|拍摄|产品|新品|科技/i},
  {title:'GoPro Awards',mechanism:'用征集、荣誉与持续展示机制沉淀UGC内容资产。',objectives:['engagement','awareness'],keywords:/运动|户外|旅行|社群|用户|穿戴|耳机/i},
  {title:'Spotify Wrapped',mechanism:'把用户数据转化为个性化、可分享的内容体验。',objectives:['engagement','awareness'],keywords:/数据|年轻|音乐|内容|会员|个性/i},
  {title:'Burger King「Whopper Detour」',mechanism:'用位置与限时利益，把品牌讨论转化为App访问。',objectives:['traffic','conversion'],keywords:/到店|门店|餐饮|引流|app|小程序|优惠/i},
  {title:'LEGO Ideas',mechanism:'让用户提案、投票与共创成为产品传播的一部分。',objectives:['engagement'],keywords:/共创|社区|粉丝|年轻|创意/i},
  {title:'Dove「Real Beauty」',mechanism:'以真实人物与公共议题建立情感认同和品牌立场。',objectives:['awareness'],keywords:/女性|美妆|真实|价值|公益|态度/i}
];
function assessCreativeBrief(brief){
  const text=`${brief.projectName} ${brief.projectTag} ${brief.audience} ${brief.brief}`;
  const checks=[
    ['项目名称',brief.projectName&&brief.projectName!=='未命名营销项目'],
    ['核心目标',brief.objective.length>0],
    ['目标人群',brief.audience.length>=8],
    ['传播背景',brief.brief.length>=24],
    ['传播动作',/(上市|发布|投放|内容|活动|达人|媒体|直播|短视频|话题|渠道|引流|共创|测评)/i.test(text)],
    ['预算与周期',brief.budget>0&&brief.duration>0]
  ];
  const identified=checks.filter(([,ready])=>ready).length,missing=checks.filter(([,ready])=>!ready).map(([label])=>label);
  return{identified,missing,limited:identified<5||brief.brief.length<36};
}
function selectCreativeCases(brief,count){
  const text=`${brief.projectName} ${brief.projectTag} ${brief.audience} ${brief.brief}`;
  return creativeCaseLibrary.map((item,index)=>({...item,score:(item.objectives.some(goal=>brief.objective.includes(goal))?3:0)+(item.keywords.test(text)?4:0)-index*.01})).sort((a,b)=>b.score-a.score).slice(0,count);
}
function creativeDirectionFor(goal,context){
  const {tag,best,bestContent}=context;
  const templates={
    awareness:['品牌记忆','把卖点变成一个能被复述的母题',`围绕「${tag}」建立统一场景、符号或一句话记忆点，先用${bestContent.name}内容在${best.name}测试辨识度。`],
    engagement:['用户共创','把受众从观看者变成内容参与者',`设计低门槛的场景征集、挑战或投票，让用户回答“什么时候最需要${tag}”，验证真实需求。`],
    traffic:['线索引流','让内容留下一个必须点击的下一步',`在${best.name}用高表现内容结构设置悬念或工具型利益点，并用统一链接追踪到站点击与后续行为。`],
    conversion:['产品实证','把传播主张改写成可验证的实验',`围绕核心卖点设计前后对比、极限场景或连续体验，以${bestContent.name}结构同时呈现证据与行动入口。`]
  };
  return templates[goal]||templates.awareness;
}
function renderCreativeStarter(brief,best,bestContent){
  const assessment=assessCreativeBrief(brief),caseCount=assessment.limited?2:1,cases=selectCreativeCases(brief,caseCount),tag=brief.projectTag||brief.projectName;
  const goals=[...brief.objective];if(goals.length<2)goals.push(goals[0]==='conversion'?'engagement':'conversion');
  const directions=[...new Set(goals)].slice(0,2).map(goal=>creativeDirectionFor(goal,{tag,best,bestContent}));
  const basis=assessment.limited?'案例机制 × 已知目标 × 数据线索':'传播目标 × Brief线索 × 高表现数据';
  const status=assessment.limited?`Brief信息有限，以下内容仅作探索假设${assessment.missing.length?`；建议补充${assessment.missing.slice(0,3).join('、')}`:''}。`:`Brief信息较完整；已结合「${best.name} × ${bestContent.name}」的高表现信号生成。`;
  $('#creativeRoutes').innerHTML=`
    <div class="creative-basis ${assessment.limited?'limited':''}"><div><span>生成依据</span><strong>${basis}</strong></div><em>已识别 ${assessment.identified}/6 项关键信息</em></div>
    <p class="creative-caution"><b>${assessment.limited?'先启发，后判断':'基于证据生成'}</b>${safe(status)}</p>
    <div class="creative-block-label"><span>CASE REFERENCES</span><b>可借鉴案例机制</b></div>
    <div class="creative-cases">${cases.map(item=>`<div class="creative-case"><strong>${safe(item.title)}</strong><p>${safe(item.mechanism)}</p></div>`).join('')}</div>
    <div class="creative-block-label"><span>HYPOTHESES</span><b>待验证创意方向</b></div>
    ${directions.map((item,index)=>`<div class="creative-route"><span>方向 0${index+1} · ${safe(item[0])}</span><strong>${safe(item[1])}</strong><p>${safe(item[2])}</p></div>`).join('')}
    <small class="creative-disclaimer">案例仅用于提炼可迁移机制；方向需结合产品事实、品牌边界与小样本测试后再决策。</small>`;
}

const metricDefinitions={
  cpc:{label:'CPC',name:'单次点击成本',formula:'广告总花费 ÷ 点击次数',format:moneyDecimal,available:t=>t.clicks>0,missing:'缺少点击量'},
  cpm:{label:'CPM',name:'千次曝光成本',formula:'（广告费用 ÷ 展示次数）× 1000',format:moneyDecimal,available:t=>t.impressions>0,missing:'缺少曝光量'},
  cpv:{label:'CPV',name:'单次观看成本',formula:'总广告成本 ÷ 总观看次数',format:moneyDecimal,available:t=>t.views>0,missing:'缺少观看量'},
  cpa:{label:'CPA',name:'单次转化成本',formula:'广告总花费 ÷ 转化次数',format:moneyDecimal,available:t=>t.conversions>0,missing:'缺少转化量'},
  cpe:{label:'CPE',name:'单次互动成本',formula:'广告总花费 ÷ 互动次数',format:moneyDecimal,available:t=>t.engagements>0,missing:'缺少互动量'},
  cvr:{label:'CVR',name:'转化率',formula:'（转化次数 ÷ 点击量）× 100%',format:pct,available:t=>t.clicks>0,missing:'缺少点击量'},
  er:{label:'ER',name:'互动率',formula:'（互动量 ÷ 曝光量）× 100%',format:pct,available:t=>t.impressions>0,missing:'缺少曝光量'},
  ctr:{label:'CTR',name:'点击率',formula:'（点击量 ÷ 曝光量）× 100%',format:pct,available:t=>t.impressions>0,missing:'缺少曝光量'},
  vtr:{label:'VTR',name:'观看率',formula:'（观看量 ÷ 曝光量）× 100%',format:pct,available:t=>t.impressions>0&&t.views>0,missing:'缺少观看量'},
  roas:{label:'ROAS',name:'广告支出回报率',formula:'转化价值（销售额）÷ 广告总花费',format:v=>`${v.toFixed(2)}×`,available:t=>t.spend>0&&t.revenue>0,missing:'缺少转化价值'}
};
function renderMetricWorkspace(total){
  $('#coreMetricGrid').innerHTML=`<div class="core-metric"><span>总曝光</span><strong>${fmt(total.impressions)}</strong><small>${new Set(rows.map(r=>r.platform).filter(Boolean)).size} 个发布平台</small></div><div class="core-metric"><span>总互动量</span><strong>${fmt(total.engagements)}</strong><small>互动率 ${pct(total.er)}</small></div>`;
  renderSelectedMetrics(total);
}
function renderSelectedMetrics(total){
  const selected=[...document.querySelectorAll('#metricOptions input:checked')].map(input=>input.value);
  $('#metricGrid').innerHTML=selected.length?selected.map(key=>{const def=metricDefinitions[key],available=def.available(total);return `<div class="metric"><span>${def.name} · ${def.label} <i class="formula-tag" tabindex="0" data-formula="${safe(def.formula)}">ⓘ</i></span><strong class="${available?'':'metric-missing'}">${available?def.format(total[key]):'—'}</strong><small>${available?def.formula:def.missing}</small></div>`}).join(''):'<div class="metric-empty">尚未选择效率指标</div>';
}

const chartColors=['#19c88d','#0b6474','#f0a44a','#6f7bd9','#ef7f73','#8a6fc0','#48a9a6','#b3b944'];
const vizMetricLabels={impressions:'曝光量',engagements:'互动量',views:'观看量',clicks:'点击量',conversions:'转化量',spend:'广告花费',revenue:'转化价值',cpc:'CPC',cpm:'CPM',cpv:'CPV',cpa:'CPA',cpe:'CPE',cvr:'转化率',er:'互动率',ctr:'点击率',vtr:'观看率',roas:'ROAS'};
const ratioMetrics=new Set(['cvr','er','ctr','vtr']);
const totalMoneyMetrics=new Set(['spend','revenue']);
const unitCostMetrics=new Set(['cpc','cpm','cpv','cpa','cpe']);
function vizValue(group,key){return Number(group[key])||0}
function vizFormat(value,key){if(ratioMetrics.has(key))return pct(value);if(key==='roas')return `${value.toFixed(2)}×`;if(unitCostMetrics.has(key))return moneyDecimal(value);if(totalMoneyMetrics.has(key))return money(value);return fmt(value)}
function compactNumber(value,key){if(ratioMetrics.has(key))return `${(value*100).toFixed(1)}%`;if(key==='roas')return `${value.toFixed(1)}×`;if(unitCostMetrics.has(key))return `¥${value.toFixed(2)}`;const abs=Math.abs(value);if(totalMoneyMetrics.has(key))return abs>=10000?`¥${(value/10000).toFixed(1)}万`:`¥${Math.round(value)}`;return abs>=10000?`${(value/10000).toFixed(1)}万`:fmt(value)}
function drawChart(labels,values,type,key){
  const canvas=$('#dataChart'),stage=canvas.parentElement,width=Math.max(320,Math.round(stage.clientWidth)),height=300,dpr=Math.min(window.devicePixelRatio||1,2),ctx=canvas.getContext('2d');canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;ctx.scale(dpr,dpr);ctx.clearRect(0,0,width,height);ctx.font='11px "DM Sans","Noto Sans SC",sans-serif';ctx.fillStyle='#6d7f86';
  const max=Math.max(...values,0),sumValue=values.reduce((a,b)=>a+b,0);if(!labels.length||max===0){ctx.textAlign='center';ctx.fillText('当前指标暂无可视化数据',width/2,height/2);return}
  if(type==='pie'){
    const cx=width<600?width/2:width*.34,cy=height/2,r=Math.min(105,width*.25),inner=r*.52;let start=-Math.PI/2;
    values.forEach((value,i)=>{const angle=value/sumValue*Math.PI*2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,start+angle);ctx.closePath();ctx.fillStyle=chartColors[i%chartColors.length];ctx.fill();start+=angle});ctx.beginPath();ctx.arc(cx,cy,inner,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.textAlign='center';ctx.fillStyle='#0b202a';ctx.font='600 17px "DM Sans","Noto Sans SC",sans-serif';ctx.fillText(vizMetricLabels[key],cx,cy-2);ctx.font='10px "DM Sans","Noto Sans SC",sans-serif';ctx.fillStyle='#809198';ctx.fillText(`${labels.length} 个分组`,cx,cy+16);return;
  }
  const left=58,right=20,top=24,bottom=58,chartW=width-left-right,chartH=height-top-bottom;
  ctx.strokeStyle='#e5ece9';ctx.lineWidth=1;ctx.textAlign='right';ctx.font='9px "DM Sans","Noto Sans SC",sans-serif';for(let i=0;i<=4;i++){const y=top+chartH*i/4,value=max*(1-i/4);ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(width-right,y);ctx.stroke();ctx.fillStyle='#87989e';ctx.fillText(compactNumber(value,key),left-8,y+3)}
  const slot=chartW/labels.length;
  if(type==='bar'){values.forEach((value,i)=>{const barW=Math.min(48,slot*.58),h=value/max*chartH,x=left+slot*i+(slot-barW)/2,y=top+chartH-h;ctx.fillStyle=chartColors[i%chartColors.length];ctx.fillRect(x,y,barW,h);ctx.textAlign='center';ctx.fillStyle='#486069';ctx.font='9px "DM Sans","Noto Sans SC",sans-serif';ctx.fillText(compactNumber(value,key),x+barW/2,Math.max(top+9,y-6))})}
  else{ctx.strokeStyle='#19a878';ctx.lineWidth=3;ctx.beginPath();values.forEach((value,i)=>{const x=left+slot*(i+.5),y=top+chartH-value/max*chartH;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();values.forEach((value,i)=>{const x=left+slot*(i+.5),y=top+chartH-value/max*chartH;ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fillStyle=chartColors[i%chartColors.length];ctx.fill();ctx.textAlign='center';ctx.fillStyle='#486069';ctx.font='9px "DM Sans","Noto Sans SC",sans-serif';ctx.fillText(compactNumber(value,key),x,Math.max(top+9,y-10))})}
  ctx.textAlign='center';ctx.fillStyle='#6e8188';ctx.font='9px "DM Sans","Noto Sans SC",sans-serif';labels.forEach((label,i)=>ctx.fillText(label.length>8?`${label.slice(0,7)}…`:label,left+slot*(i+.5),height-27));
}
function renderVisualization(){
  if(!currentAnalysis)return;const dimension=$('#vizDimension').value,key=$('#vizMetric').value,type=$('#vizType').value,groups=groupBy(dimension).sort((a,b)=>vizValue(b,key)-vizValue(a,key)),labels=groups.map(g=>g.name),values=groups.map(g=>vizValue(g,key));drawChart(labels,values,type,key);$('#chartLegend').innerHTML=groups.map((g,i)=>`<div><i style="background:${chartColors[i%chartColors.length]}"></i><span>${safe(g.name)}</span><b>${vizFormat(vizValue(g,key),key)}</b></div>`).join('');
}

const comboDimensionLabels={platform:'平台',contentType:'内容类型',creatorType:'达人类型'};
const scoreProfiles={
  balanced:{label:'综合均衡',metrics:[['er',.20,false],['ctr',.20,false],['cvr',.25,false],['roas',.20,false],['cpa',.15,true]]},
  awareness:{label:'品牌声量',metrics:[['impressions',.30,false],['er',.20,false],['vtr',.15,false],['ctr',.10,false],['cpm',.25,true]]},
  engagement:{label:'用户互动',metrics:[['engagements',.25,false],['er',.30,false],['clicks',.15,false],['ctr',.15,false],['cpe',.15,true]]},
  traffic:{label:'站外引流',metrics:[['clicks',.25,false],['ctr',.30,false],['cpc',.25,true],['cvr',.20,false]]},
  conversion:{label:'销售转化',metrics:[['conversions',.20,false],['cvr',.25,false],['roas',.25,false],['ctr',.10,false],['cpa',.20,true]]}
};
const scoreMetricOrder=['impressions','engagements','views','clicks','conversions','revenue','er','ctr','vtr','cvr','cpc','cpm','cpv','cpe','cpa','roas'];
const lowerIsBetterDefaults=new Set(['cpc','cpm','cpv','cpe','cpa']);
let customScoreMetrics=scoreProfiles.balanced.metrics.map(metric=>[...metric]);
let draftScoreMetrics=customScoreMetrics.map(metric=>[...metric]);
function selectedScoreProfile(){return $('#scoreProfile').value==='custom'?{label:'自定义规则',metrics:customScoreMetrics}:scoreProfiles[$('#scoreProfile').value]}
function combinationGroups(primary,secondary){
  const grouped=new Map();rows.forEach(row=>{const a=row[primary]||'未分类',b=row[secondary]||'未分类',key=`${a} × ${b}`;if(!grouped.has(key))grouped.set(key,{name:key,primary:a,secondary:b,list:[]});grouped.get(key).list.push(row)});return [...grouped.values()].map(group=>({...group,...aggregate(group.list),count:group.list.length}));
}
function scoreCombinationGroups(groups,profile){
  const ranges={};profile.metrics.forEach(([key])=>{const values=groups.map(g=>Number(g[key])||0);ranges[key]=[Math.min(...values),Math.max(...values)]});
  const active=profile.metrics.filter(([key])=>ranges[key][1]!==ranges[key][0]),activeWeight=active.reduce((sum,[,weight])=>sum+weight,0);
  return groups.map(group=>{let weighted=0;active.forEach(([key,weight,invert])=>{const [min,max]=ranges[key];let value=((Number(group[key])||0)-min)/(max-min);if(invert)value=1-value;weighted+=value*weight});const relative=activeWeight?weighted/activeWeight:.5,confidence=.86+.14*Math.min(1,group.count/3);return{...group,score:Math.round(relative*100*confidence),confidence}}).sort((a,b)=>b.score-a.score);
}
function profileFormula(profile){return profile.metrics.map(([key,weight,invert])=>`${vizMetricLabels[key]}${Math.round(weight*100)}%${invert?'（成本越低越优）':''}`).join(' + ')}
function renderCombinationAnalysis(){
  if(!currentAnalysis)return;const [primary,secondary]=$('#comboDimensions').value.split('|'),profile=selectedScoreProfile(),groups=scoreCombinationGroups(combinationGroups(primary,secondary),profile),best=groups[0];
  if(!best){$('#comboSummary').innerHTML='<span>暂无可用于组合分析的数据</span>';$('#comboRanking').innerHTML='';$('#comboHeatmap').innerHTML='';return}
  $('#comboSummary').innerHTML=`<div class="combo-crown"><span>当前最优组合</span><strong>${safe(best.name)}</strong><small>${profile.label} · ${best.count} 条记录</small></div><div class="combo-score"><span>综合得分</span><strong>${best.score}</strong><small>/ 100 相对分</small></div><div class="combo-proof"><div><span>互动率</span><b>${pct(best.er)}</b></div><div><span>点击率</span><b>${pct(best.ctr)}</b></div><div><span>转化率</span><b>${pct(best.cvr)}</b></div><div><span>ROAS</span><b>${best.revenue?`${best.roas.toFixed(2)}×`:'—'}</b></div></div>`;
  $('#comboRanking').innerHTML=groups.slice(0,8).map((group,index)=>`<div class="rank-row"><span>${String(index+1).padStart(2,'0')}</span><div><div class="rank-name"><b title="${safe(group.name)}">${safe(group.name)}</b><em>${group.count}条</em></div><div class="rank-track"><i style="width:${Math.max(4,group.score)}%"></i></div></div><strong>${group.score}</strong></div>`).join('');
  const rowNames=[...new Set(groups.map(g=>g.primary))],columnNames=[...new Set(groups.map(g=>g.secondary))],lookup=new Map(groups.map(g=>[`${g.primary}\u0000${g.secondary}`,g]));
  $('#comboHeatmap').innerHTML=`<thead><tr><th>${comboDimensionLabels[primary]} ↓ / ${comboDimensionLabels[secondary]} →</th>${columnNames.map(name=>`<th title="${safe(name)}">${safe(name)}</th>`).join('')}</tr></thead><tbody>${rowNames.map(rowName=>`<tr><th title="${safe(rowName)}">${safe(rowName)}</th>${columnNames.map(columnName=>{const item=lookup.get(`${rowName}\u0000${columnName}`);if(!item)return'<td class="no-data">—</td>';const alpha=(.10+item.score/100*.72).toFixed(2),color=item.score>=68?'#fff':'#12333d';return `<td style="background:rgba(25,200,141,${alpha});color:${color}" title="${safe(item.name)}：${item.score}分，${item.count}条记录"><b>${item.score}</b><small>${item.count}条</small></td>`}).join('')}</tr>`).join('')}</tbody>`;
  $('#comboMethod').innerHTML=`<b>评分方法</b><span>${profileFormula(profile)}</span><small>各指标先在当前组合中归一化，再加权求和并进行样本置信度修正。综合得分是相对分，不代表行业绝对水平。</small>`;
}
function scoreMetricOptions(selected){return scoreMetricOrder.map(key=>`<option value="${key}" ${key===selected?'selected':''}>${vizMetricLabels[key]}</option>`).join('')}
function renderScoreRuleDialog(){
  const profile=selectedScoreProfile();$('#currentRuleName').textContent=profile.label;$('#currentRuleFormula').textContent=profileFormula(profile);
  $('#customRuleRows').innerHTML=draftScoreMetrics.map(([key,weight,invert],index)=>`<div class="custom-rule-row" data-index="${index}"><select class="rule-metric" aria-label="评分指标">${scoreMetricOptions(key)}</select><div class="rule-weight"><input class="rule-weight-input" type="number" min="0" max="100" step="1" value="${Math.round(weight*10000)/100}" aria-label="指标权重"/><span>%</span></div><select class="rule-direction" aria-label="计分方向"><option value="up" ${invert?'':'selected'}>越高越好</option><option value="down" ${invert?'selected':''}>越低越好</option></select><button class="remove-rule" type="button" aria-label="删除该指标">×</button></div>`).join('');validateCustomRule();
}
function collectDraftRule(){draftScoreMetrics=[...document.querySelectorAll('.custom-rule-row')].map(row=>[row.querySelector('.rule-metric').value,Math.max(0,Number(row.querySelector('.rule-weight-input').value)||0)/100,row.querySelector('.rule-direction').value==='down'])}
function validateCustomRule(){
  const total=draftScoreMetrics.reduce((sum,[,weight])=>sum+weight,0),keys=draftScoreMetrics.map(([key])=>key),hasDuplicate=new Set(keys).size!==keys.length,valid=draftScoreMetrics.length>0&&Math.abs(total-1)<.0001&&!hasDuplicate;
  $('#customWeightTotal').textContent=`${(total*100).toFixed(Number.isInteger(total*100)?0:1)}%`;$('#customWeightTotal').classList.toggle('invalid',!valid);$('#customRuleHint').textContent=hasDuplicate?'同一指标不能重复':Math.abs(total-1)>=.0001?'权重合计需等于100%':'权重设置有效';$('#customRuleHint').classList.toggle('invalid',!valid);$('#applyCustomRule').disabled=!valid;return valid;
}
function openScoreRuleDialog(){draftScoreMetrics=customScoreMetrics.map(metric=>[...metric]);renderScoreRuleDialog();$('#scoreRuleDialog').showModal()}
$('#scoreRuleButton').addEventListener('click',openScoreRuleDialog);
$('#closeScoreRule').addEventListener('click',()=>$('#scoreRuleDialog').close());
$('#scoreRuleDialog').addEventListener('click',event=>{if(event.target===$('#scoreRuleDialog'))$('#scoreRuleDialog').close()});
$('#customRuleRows').addEventListener('input',()=>{collectDraftRule();validateCustomRule()});
$('#customRuleRows').addEventListener('change',()=>{collectDraftRule();validateCustomRule()});
$('#customRuleRows').addEventListener('click',event=>{const button=event.target.closest('.remove-rule');if(!button)return;collectDraftRule();draftScoreMetrics.splice(Number(button.closest('.custom-rule-row').dataset.index),1);renderScoreRuleDialog()});
$('#addRuleMetric').addEventListener('click',()=>{collectDraftRule();const used=new Set(draftScoreMetrics.map(([key])=>key)),key=scoreMetricOrder.find(metric=>!used.has(metric));if(!key){toast('可用指标已全部添加');return}draftScoreMetrics.push([key,0,lowerIsBetterDefaults.has(key)]);renderScoreRuleDialog()});
$('#resetCustomRule').addEventListener('click',()=>{draftScoreMetrics=scoreProfiles.balanced.metrics.map(metric=>[...metric]);renderScoreRuleDialog()});
$('#copyPresetRule').addEventListener('click',()=>{const key=$('#scoreProfile').value==='custom'?'balanced':$('#scoreProfile').value;draftScoreMetrics=scoreProfiles[key].metrics.map(metric=>[...metric]);renderScoreRuleDialog()});
$('#applyCustomRule').addEventListener('click',()=>{collectDraftRule();if(!validateCustomRule())return;customScoreMetrics=draftScoreMetrics.map(metric=>[...metric]);$('#scoreProfile').value='custom';$('#scoreRuleDialog').close();renderCombinationAnalysis();toast('已应用自定义评分规则')});
$('#metricOptions').addEventListener('change',()=>{if(currentAnalysis)renderSelectedMetrics(currentAnalysis.total)});
['vizDimension','vizMetric','vizType'].forEach(id=>$(`#${id}`).addEventListener('change',renderVisualization));
$('#comboDimensions').addEventListener('change',renderCombinationAnalysis);
$('#scoreProfile').addEventListener('change',()=>{renderCombinationAnalysis();if($('#scoreProfile').value==='custom')openScoreRuleDialog()});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(renderVisualization,120)});

function analyze(){
  const brief=getBrief();if(!brief.objective.length){toast('请至少选择一个核心目标');return}if(!rows.length){toast('请先上传数据文件或载入示例数据');return}
  const button=$('#analyzeButton');button.disabled=true;button.innerHTML='正在诊断 <b>···</b>';
  setTimeout(()=>{const total=aggregate(rows),channels=scoreGroups(groupBy('platform')),content=scoreGroups(groupBy('contentType')),creators=scoreGroups(groupBy('creatorType'));currentAnalysis={brief,total,channels,content,creators};$('#results').classList.remove('hidden');renderResults(brief,total,channels,content,creators);button.disabled=false;button.innerHTML='生成AI诊断 <b>✦</b>';$('#results').scrollIntoView({behavior:'smooth',block:'start'})},650)
}
$('#analyzeButton').addEventListener('click',analyze);

function renderResults(brief,total,channels,content,creators){
  const best=channels[0],bestContent=content[0],bestCreator=creators[0],weakest=channels[channels.length-1];
  const budgetUse=brief.budget?total.spend/brief.budget:1,reachShare=best.impressions/total.impressions;
  let score=Math.round(60+Math.min(total.er*180,13)+Math.min(total.ctr*240,12)+Math.min(total.cvr*80,11)-Math.abs(1-budgetUse)*12);score=Math.max(50,Math.min(94,score));
  $('#resultTitle').textContent=brief.projectName;$('#resultMeta').textContent=`${brief.projectTag?`项目标签：${brief.projectTag} · `:''}目标：${objectiveName(brief.objective)} · ${rows.length}条记录 · ${channels.length}个平台`;
  $('#overallScore').textContent=score;$('#scoreRing').style.setProperty('--score',score);
  $('#verdict').textContent=score>=82?'增长信号清晰，可以扩大验证':score>=70?'结构健康，但仍有增量空间':'基础有效，需要优先修复效率短板';
  $('#verdictText').textContent=`已使用${pct(budgetUse)}预算。${best.name}综合效率领先，${bestContent.name}是最值得复用的内容结构。`;
  $('#topOpportunity').textContent=`放大「${bestContent.name} × ${best.name}」`;$('#topEvidence').textContent=`${best.name}效率${best.score}；${bestContent.name}互动率${pct(bestContent.er)}`;
  renderMetricWorkspace(total);
  renderVisualization();
  renderCombinationAnalysis();
  $('#channelBars').innerHTML=channels.map((c,i)=>`<div class="channel-row"><span>${safe(c.name)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(8,c.score)}%;opacity:${1-i*.12}"></div></div><b>${c.score}</b></div>`).join('');
  const highReach=[...channels].sort((a,b)=>b.impressions-a.impressions)[0];
  const insights=[
    [`${best.name}贡献最高质量流量`,`${best.name}效率${best.score}，点击率${pct(best.ctr)}、转化率${pct(best.cvr)}，贡献${pct(reachShare)}总曝光。`],
    [`「${bestContent.name}」最接近行动`,`${bestContent.name}互动率${pct(bestContent.er)}，建议提炼开头、场景与证据结构。`],
    [`${highReach.name}存在点击断点`,`${fmt(highReach.impressions)}次曝光对应${pct(highReach.ctr)}点击率，应优先优化前三秒与利益点。`],
    [`${bestCreator.name}更适合承担转化`,`${bestCreator.name}转化率${pct(bestCreator.cvr)}、CPA${money(bestCreator.cpa)}。`]
  ];
  $('#insightList').innerHTML=insights.map((x,i)=>`<div class="insight"><span>0${i+1}</span><div><strong>${safe(x[0])}</strong><p>${safe(x[1])}</p></div></div>`).join('');
  const move=Math.max(8,Math.min(18,Math.round((best.score-weakest.score)/3)));
  const strategies=[
    ['预算','动态迁移',`将${move}%测试预算从${weakest.name}迁移至${best.name}，保留控制组观察7天增量。`,'↗'],
    ['内容','复制高表现结构',`围绕“${bestContent.name}”拆解开头钩子、核心证据与行动指令。`,'✦'],
    ['人群','按场景重新切分',`将目标人群拆为运动、通勤与穿搭三类任务场景，分别匹配内容证据。`,'◎'],
    ['实验','验证关键假设',`A/B测试“痛点直给”与“真实体验”两套开头，对比CTR与CPA。`,'A/B']
  ];
  $('#strategyGrid').innerHTML=strategies.map(x=>`<div class="strategy-item"><span>${x[0]}</span><h5>${safe(x[1])}</h5><p>${safe(x[2])}</p><b>${x[3]}</b></div>`).join('');
  renderCreativeStarter(brief,best,bestContent);
  const translations=[['客户：想要“更年轻”','创意：用真实生活场景定义年轻'],['客户：既要声量也要转化',`媒介：${highReach.name}负责触达，${best.name}承接决策`],['客户：证明AI带来增量','技术：统一UTM与内容标签，建立归因看板'],['客户：需要快速试错','项目：7天一轮测试，设置继续/停止阈值']];
  $('#translationList').innerHTML=translations.map(x=>`<div class="translation"><span>${safe(x[0])}</span><i>→</i><strong>${safe(x[1])}</strong></div>`).join('');
}

$('#restartButton').addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'});setTimeout(()=>$('#projectName').focus(),400)});
renderPreview();
