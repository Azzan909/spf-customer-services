(function(){
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const grid=$("#projectsGrid"), planGrid=$("#operationalPlanGrid"), committeesGrid=$("#committeesGrid"), modal=$("#projectModal"), updateModal=$("#updateModal");
  const STORAGE_KEY="spf-exhibition-manual-edits-v1";
  const PLAN_STORAGE_KEY="spf-operational-plan-delivery-v1";
  const editorToolbar=$("#editorToolbar"), editButton=$("#editContent"), saveNotice=$("#saveNotice");
  const defaultValues=new Map();
  let savedEdits=readSavedEdits(), workingEdits={...savedEdits}, planDelivery=readPlanDelivery(), editing=false, currentProjectId="";

  function readSavedEdits(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}")||{}}catch(_){return {}}
  }
  function readPlanDelivery(){
    try{return JSON.parse(localStorage.getItem(PLAN_STORAGE_KEY)||"{}")||{}}catch(_){return {}}
  }
  function savePlanDelivery(){localStorage.setItem(PLAN_STORAGE_KEY,JSON.stringify(planDelivery))}
  function projectValue(project,field){
    const key=`project.${project.id}.${field}`;
    return Object.prototype.hasOwnProperty.call(workingEdits,key)?workingEdits[key]:project[field];
  }
  function planValue(item,field){
    const key=`plan.${item.id}.${field}`;
    return Object.prototype.hasOwnProperty.call(workingEdits,key)?workingEdits[key]:item[field];
  }
  function planListValue(item,field,index){
    const key=`plan.${item.id}.${field}.${index}`;
    return Object.prototype.hasOwnProperty.call(workingEdits,key)?workingEdits[key]:item[field][index];
  }
  function stablePath(el){
    if(el.dataset.editKey)return el.dataset.editKey;
    const parts=[]; let node=el;
    while(node&&node!==document.body){
      if(node.id){parts.unshift(`#${node.id}`);break}
      const parent=node.parentElement;if(!parent)break;
      const siblings=[...parent.children].filter(x=>x.tagName===node.tagName);
      parts.unshift(`${node.tagName.toLowerCase()}:${siblings.indexOf(node)+1}`);
      node=parent;
    }
    return parts.join(">");
  }
  function editableLeaves(root=document){
    return $$("h1,h2,h3,p,li,th,td,time,span,strong,b,small,em",root).filter(el=>
      !el.querySelector("h1,h2,h3,p,li,th,td,time,span,strong,b,small,em") &&
      !el.closest(".editor-toolbar,.top-navigation,button,.document-editor,.modal-close") &&
      !el.classList.contains("project-id") && (el.dataset.editKey||el.textContent.trim())
    );
  }
  function prepareEditable(root=document){
    editableLeaves(root).forEach(el=>{
      const key=stablePath(el);el.dataset.editKey=key;
      if(!defaultValues.has(key))defaultValues.set(key,el.textContent);
      if(Object.prototype.hasOwnProperty.call(workingEdits,key))el.textContent=workingEdits[key];
      if(editing){el.contentEditable="true";el.spellcheck=true;el.setAttribute("role","textbox");el.setAttribute("aria-label","حقل قابل للتحرير")}
    });
  }
  function applyValues(values){
    $$("[data-edit-key]").forEach(el=>{
      const key=el.dataset.editKey;
      if(Object.prototype.hasOwnProperty.call(values,key))el.textContent=values[key];
      else if(defaultValues.has(key))el.textContent=defaultValues.get(key);
    });
  }
  function setEditing(active){
    editing=active;document.body.classList.toggle("editing",active);
    editorToolbar.classList.toggle("open",active);editorToolbar.setAttribute("aria-hidden",String(!active));
    editButton.textContent=active?"جارٍ التحرير…":"تحرير المحتوى";editButton.disabled=active;
    prepareEditable();
    if(!active)$$('[contenteditable="true"]').forEach(el=>{el.removeAttribute("contenteditable");el.removeAttribute("role");el.removeAttribute("aria-label")});
  }
  function toast(message){
    saveNotice.textContent=message;saveNotice.classList.add("show");
    clearTimeout(toast.timer);toast.timer=setTimeout(()=>saveNotice.classList.remove("show"),2600);
  }
  function collectEdits(){
    const values={...workingEdits};
    $$("[data-edit-key]").forEach(el=>values[el.dataset.editKey]=el.textContent.trim());
    return values;
  }
  function safeDocumentUrl(value){
    try{const url=new URL(value,location.href);return ["http:","https:"].includes(url.protocol)?url.href:""}catch(_){return ""}
  }
  function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char])}

  const PLAN_MONTHS={"يناير":0,"فبراير":1,"مارس":2,"أبريل":3,"ابريل":3,"مايو":4,"يونيو":5,"يوليو":6,"أغسطس":7,"اغسطس":7,"سبتمبر":8,"أكتوبر":9,"اكتوبر":9,"نوفمبر":10,"ديسمبر":11};
  function thresholdForResult(item,field,index){
    const key=`plan.${item.id}.${field}.${index}`;
    if(Object.prototype.hasOwnProperty.call(workingEdits,key))return workingEdits[key];
    if(Array.isArray(item.resultTargets)&&item.resultTargets[index]&&item.resultTargets[index][field]!=null)return item.resultTargets[index][field];
    const raw=String(planValue(item,field)||"").trim(),parts=raw.split(/\s*\/\s*/).filter(Boolean);
    return parts.length===item.results.length?parts[index]:raw;
  }
  function parsePlanDate(value){
    const text=String(value||"").trim(),iso=text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if(iso)return new Date(Number(iso[1]),Number(iso[2])-1,Number(iso[3]));
    const match=text.match(/(\d{1,2})\s+(يناير|فبراير|مارس|أبريل|ابريل|مايو|يونيو|يوليو|أغسطس|اغسطس|سبتمبر|أكتوبر|اكتوبر|نوفمبر|ديسمبر)/);
    return match?new Date(2026,PLAN_MONTHS[match[2]],Number(match[1])):null;
  }
  function finalThresholdDate(item,field){return parsePlanDate(thresholdForResult(item,field,item.results.length-1))}
  function planEvaluation(item){
    const state=planDelivery[item.id]||{},actual=parsePlanDate(state.date);
    const expected=finalThresholdDate(item,"expected")||parsePlanDate(planValue(item,"deadline"));
    const above=finalThresholdDate(item,"above");
    if(state.delivered==="yes"){
      if(!actual)return {code:"needs-date",label:"أدخل تاريخ التسليم"};
      if(above&&actual<=above)return {code:"above",label:"يفوق التوقعات"};
      if(expected&&actual<=expected)return {code:"expected",label:"يحقق التوقعات"};
      return {code:"below",label:"دون التوقعات"};
    }
    if(state.delivered==="no"){
      if(expected&&new Date()>expected)return {code:"late",label:"متأخرة"};
      return {code:"progress",label:"قيد التنفيذ"};
    }
    return {code:"pending",label:"بانتظار التحديث"};
  }
  function renderPlanHero(){
    const items=window.SPF_OPERATIONAL_PLAN,total=items.length;
    const delivered=items.filter(item=>{const state=planDelivery[item.id]||{};return state.delivered==="yes"&&!!state.date}).length;
    const evaluations=items.map(planEvaluation);
    const onTime=evaluations.filter(result=>["expected","above"].includes(result.code)).length;
    const late=evaluations.filter(result=>["below","late"].includes(result.code)).length;
    $("#planCompletionRate").textContent=`${total?Math.round(delivered/total*100):0}%`;
    $("#planOnTimeCount").textContent=onTime;
    $("#planLateCount").textContent=late;
    $("#planTotalCount").textContent=total;
  }
  function resultScheduleRows(item){
    return item.results.map((value,index)=>`<div class="plan-result-row">
      <div class="plan-result-name"><span>النتيجة ${index+1}</span><b data-edit-key="plan.${item.id}.results.${index}">${planListValue(item,"results",index)}</b></div>
      <div class="plan-result-level below"><span>دون التوقعات</span><strong data-edit-key="plan.${item.id}.below.${index}">${escapeHtml(thresholdForResult(item,"below",index))}</strong></div>
      <div class="plan-result-level expected"><span>يحقق التوقعات</span><strong data-edit-key="plan.${item.id}.expected.${index}">${escapeHtml(thresholdForResult(item,"expected",index))}</strong></div>
      <div class="plan-result-level above"><span>يفوق التوقعات</span><strong data-edit-key="plan.${item.id}.above.${index}">${escapeHtml(thresholdForResult(item,"above",index))}</strong></div>
    </div>`).join("");
  }
  function renderProjects(filter="inventory"){
    const items=window.SPF_PROJECTS.filter(p=>filter==="all"||p.status===filter);
    grid.innerHTML=items.map(p=>`<article class="project-card" data-project-id="${p.id}">
      <div class="project-head"><span class="project-id">${p.id}</span><span class="badge ${p.status}" data-edit-key="project.${p.id}.statusLabel">${projectValue(p,"statusLabel")}</span></div>
      <h3 data-edit-key="project.${p.id}.title">${projectValue(p,"title")}</h3><p data-edit-key="project.${p.id}.description">${projectValue(p,"description")}</p>
      <button type="button" data-project="${p.id}">قراءة المزيد ←</button>
    </article>`).join("");
    prepareEditable(grid);
  }
  renderProjects("inventory");

  function renderOperationalPlan(filter="core"){
    const items=window.SPF_OPERATIONAL_PLAN.filter(item=>filter==="all"||item.group===filter);
    renderPlanHero();
    planGrid.innerHTML=items.map(item=>{const state=planDelivery[item.id]||{},evaluation=planEvaluation(item);return `<article class="plan-card ${item.group}">
      <div class="plan-card-head"><span>${item.id.replace("O","")}</span><b data-edit-key="plan.${item.id}.category">${planValue(item,"category")}</b></div>
      <h3 data-edit-key="plan.${item.id}.title">${planValue(item,"title")}</h3>
      <div class="plan-leadership">
        <div><span>رئيس المبادرة</span><b data-edit-key="plan.${item.id}.owner">${planValue(item,"owner")}</b></div>
        <div><span>نائب المبادرة</span><b data-edit-key="plan.${item.id}.deputy">${planValue(item,"deputy")}</b></div>
      </div>
      <div class="plan-delivery-box">
        <label><span>هل تم تسليم المبادرة؟</span><select data-plan-delivered="${item.id}"><option value="" ${!state.delivered?"selected":""}>غير محدد</option><option value="yes" ${state.delivered==="yes"?"selected":""}>تم التسليم</option><option value="no" ${state.delivered==="no"?"selected":""}>لم يتم التسليم</option></select></label>
        <label><span>تاريخ التسليم الفعلي</span><input type="date" data-plan-date="${item.id}" value="${escapeHtml(state.date||"")}" ${state.delivered!=="yes"?"disabled":""}></label>
        <div class="plan-calculated-result ${evaluation.code}"><span>نتيجة المبادرة</span><strong>${evaluation.label}</strong></div>
      </div>
      <details class="plan-details" ${item.group==="core"?"open":""}>
        <summary>عرض مواعيد النتائج والأنشطة</summary>
        <div class="plan-result-schedule"><div class="plan-result-head"><b>النتيجة المستهدفة</b><span>دون التوقعات</span><span>يحقق</span><span>يفوق</span></div>${resultScheduleRows(item)}</div>
        ${item.activities.length?`<div class="plan-detail-group"><b>الأنشطة</b><ul>${item.activities.map((value,index)=>`<li data-edit-key="plan.${item.id}.activities.${index}">${planListValue(item,"activities",index)}</li>`).join("")}</ul></div>`:""}
      </details>
      <time data-edit-key="plan.${item.id}.deadline">${planValue(item,"deadline")}</time>
    </article>`}).join("");
    prepareEditable(planGrid);
  }
  renderOperationalPlan("core");

  planGrid.addEventListener("change",e=>{
    const delivered=e.target.closest("[data-plan-delivered]"),date=e.target.closest("[data-plan-date]");
    const id=delivered?.dataset.planDelivered||date?.dataset.planDate;if(!id)return;
    const state=planDelivery[id]||{};
    if(delivered){state.delivered=delivered.value;if(delivered.value!=="yes")state.date=""}
    if(date)state.date=date.value;
    planDelivery[id]=state;savePlanDelivery();
    renderOperationalPlan($(".plan-controls button.active")?.dataset.planFilter||"core");
  });

  function committeeData(){
    try{const stored=JSON.parse(localStorage.getItem("spf-committees-data-v1")||"null");return Array.isArray(stored)&&stored.length?stored:window.SPF_COMMITTEES}catch(_){return window.SPF_COMMITTEES}
  }
  function renderCommittees(filter="all"){
    if(!committeesGrid)return;
    const items=committeeData().filter(item=>filter==="all"||item.status===filter);
    committeesGrid.innerHTML=items.map((item,index)=>`<article class="committee-card">
      <div class="committee-logo"><img src="assets/spf-logo.png" alt="شعار صندوق الحماية الاجتماعية"></div>
      <span class="committee-status ${item.status==="نشطة"?"active":"completed"}">${escapeHtml(item.status)}</span>
      <h3>${escapeHtml(item.name)}</h3>
      <div class="committee-meta"><div><span>صفة العضوية</span><b>${escapeHtml(item.role)}</b></div><div><span>ممثل المديرية</span><b>${escapeHtml(item.member)}</b></div></div>
    </article>`).join("");
    prepareEditable(committeesGrid);
  }
  renderCommittees();

  grid.addEventListener("click",e=>{
    const btn=e.target.closest("[data-project]");if(!btn)return;
    const p=window.SPF_PROJECTS.find(x=>x.id===btn.dataset.project);if(!p)return;
    currentProjectId=p.id;
    $("#modalStatus").dataset.editKey=`project.${p.id}.statusLabel`;$("#modalStatus").textContent=projectValue(p,"statusLabel");
    $("#modalTitle").dataset.editKey=`project.${p.id}.title`;$("#modalTitle").textContent=projectValue(p,"title");
    $("#modalDescription").dataset.editKey=`project.${p.id}.description`;$("#modalDescription").textContent=projectValue(p,"description");
    $("#modalDetails").innerHTML=`<div><span>المالك</span><b data-edit-key="project.${p.id}.owner">${projectValue(p,"owner")}</b></div><div><span>الأفق الزمني</span><b data-edit-key="project.${p.id}.horizon">${projectValue(p,"horizon")}</b></div><div><span>الأثر المتوقع</span><b data-edit-key="project.${p.id}.impact">${projectValue(p,"impact")}</b></div>`;
    const doc=$("#modalDocument"),documentValue=projectValue(p,"document"),documentUrl=safeDocumentUrl(documentValue);$("#documentUrlField").value=documentValue;
    if(documentUrl){doc.href=documentUrl;doc.classList.remove("disabled");doc.removeAttribute("aria-disabled");$("#documentNote").textContent="فتح الوثيقة المعتمدة للمشروع."}
    else{doc.href="#";doc.classList.add("disabled");doc.setAttribute("aria-disabled","true");$("#documentNote").textContent="يربط الزر بالملف الأصلي فور إضافته إلى سجل المشروع."}
    prepareEditable(modal);modal.classList.add("open");modal.setAttribute("aria-hidden","false");
  });

  $$(".project-tabs button").forEach(btn=>btn.addEventListener("click",()=>{$$(".project-tabs button").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderProjects(btn.dataset.filter)}));
  $$(".plan-controls button").forEach(btn=>btn.addEventListener("click",()=>{$$(".plan-controls button").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderOperationalPlan(btn.dataset.planFilter)}));
  $$(".committee-controls button").forEach(btn=>btn.addEventListener("click",()=>{$$(".committee-controls button").forEach(x=>x.classList.remove("active"));btn.classList.add("active");renderCommittees(btn.dataset.committeeFilter)}));
  $$("[data-close]").forEach(x=>x.addEventListener("click",()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}));
  $("#updateGuide").addEventListener("click",()=>{updateModal.classList.add("open");updateModal.setAttribute("aria-hidden","false")});
  $$("[data-close-update]").forEach(x=>x.addEventListener("click",()=>{updateModal.classList.remove("open");updateModal.setAttribute("aria-hidden","true")}));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")$$(".modal.open").forEach(m=>{m.classList.remove("open");m.setAttribute("aria-hidden","true")})});
  document.addEventListener("input",e=>{const el=e.target.closest("[data-edit-key]");if(editing&&el)workingEdits[el.dataset.editKey]=el.textContent});
  document.addEventListener("keydown",e=>{const el=e.target.closest('[contenteditable="true"]');if(el&&e.key==="Enter"&&!["P","LI","TD"].includes(el.tagName)){e.preventDefault();el.blur()}});
  $("#documentUrlField").addEventListener("input",e=>{
    if(!editing||!currentProjectId)return;
    const value=e.target.value.trim(),safeValue=safeDocumentUrl(value),doc=$("#modalDocument");workingEdits[`project.${currentProjectId}.document`]=value;
    doc.href=safeValue||"#";doc.classList.toggle("disabled",!safeValue);safeValue?doc.removeAttribute("aria-disabled"):doc.setAttribute("aria-disabled","true");
  });

  editButton.addEventListener("click",()=>{workingEdits={...savedEdits};setEditing(true);toast("يمكنك الآن تعديل النصوص والأرقام مباشرة")});
  $("#saveEdits").addEventListener("click",()=>{
    savedEdits=collectEdits();workingEdits={...savedEdits};localStorage.setItem(STORAGE_KEY,JSON.stringify(savedEdits));setEditing(false);renderProjects($(".project-tabs button.active")?.dataset.filter||"inventory");renderOperationalPlan($(".plan-controls button.active")?.dataset.planFilter||"core");toast("تم حفظ التعديلات على هذا المتصفح");
  });
  $("#cancelEdits").addEventListener("click",()=>{workingEdits={...savedEdits};applyValues(savedEdits);setEditing(false);renderProjects($(".project-tabs button.active")?.dataset.filter||"inventory");renderOperationalPlan($(".plan-controls button.active")?.dataset.planFilter||"core");toast("تم إلغاء التعديلات غير المحفوظة")});
  $("#resetEdits").addEventListener("click",()=>{
    if(!confirm("هل تريد استعادة جميع محتويات النسخة الأصلية؟"))return;
    localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(PLAN_STORAGE_KEY);savedEdits={};workingEdits={};planDelivery={};applyValues({});setEditing(false);renderProjects("all");renderOperationalPlan("all");toast("تمت استعادة النسخة الأصلية");
  });
  $("#exportEdits").addEventListener("click",()=>{
    const payload={type:"spf-dashboard-edits",version:2,exportedAt:new Date().toISOString(),edits:collectEdits(),planDelivery};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=`spf-dashboard-edits-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);toast("تم تصدير نسخة التعديلات");
  });
  $("#importEdits").addEventListener("change",async e=>{
    const file=e.target.files[0];if(!file)return;
    try{const payload=JSON.parse(await file.text());if(payload.type!=="spf-dashboard-edits"||!payload.edits)throw new Error();workingEdits={...payload.edits};savedEdits={...payload.edits};planDelivery=payload.planDelivery||{};localStorage.setItem(STORAGE_KEY,JSON.stringify(savedEdits));savePlanDelivery();renderProjects("all");renderOperationalPlan("all");applyValues(savedEdits);setEditing(false);toast("تم استيراد التعديلات وحفظها")}catch(_){toast("تعذر قراءة ملف التعديلات")}
    e.target.value="";
  });
  $("#importWorkbook")?.addEventListener("change",async e=>{
    const file=e.target.files[0],status=$("#excelImportStatus");if(!file)return;
    status.textContent="جارٍ قراءة ملف Excel والتحقق من البيانات…";status.className="excel-import-status working";
    try{
      const result=await window.SPFExcelImporter.importFile(file);
      status.textContent=`تم تطبيق ${result.updated} قيمة وتحديث ${result.committees} لجنة أو فريق. ستُعاد تهيئة العرض الآن.`;status.className="excel-import-status success";
      setTimeout(()=>location.reload(),900);
    }catch(error){status.textContent=error.message||"تعذر قراءة الملف. استخدم قالب المنصة دون تغيير أسماء الأوراق والأعمدة.";status.className="excel-import-status error"}
    e.target.value="";
  });

  const sections=$$("section[id]"),navLinks=$$(".top-navigation a");
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+entry.target.id))}),{rootMargin:"-25% 0px -65% 0px"});
  // Chapter navigation is managed by exhibition.js in this independent edition.
  prepareEditable();applyValues(savedEdits);

  // ── Work Tracker Module ──────────────────────────────────────────────────
  const TRACKER_STORAGE_KEY="spf-work-tracker-v2";
  const DEFAULT_TRACKER_DEPTS=[
    {id:"contact",     name:"مركز الاتصال",                 done:102, total:107},
    {id:"coord",       name:"التنسيق والمتابعة",             done:7,   total:7},
    {id:"crm",         name:"إدارة علاقات المتعاملين",      done:35,  total:42},
    {id:"service-dev", name:"إدارة وتطوير الخدمات",         done:72,  total:123},
    {id:"branches",    name:"شؤون الدوائر والمنافذ",        done:36,  total:75},
  ];

  function readTrackerData(){
    try{const d=JSON.parse(localStorage.getItem(TRACKER_STORAGE_KEY)||"null");return Array.isArray(d)&&d.length?d:DEFAULT_TRACKER_DEPTS.map(x=>({...x}))}catch(_){return DEFAULT_TRACKER_DEPTS.map(x=>({...x}))}
  }
  function saveTrackerData(depts){localStorage.setItem(TRACKER_STORAGE_KEY,JSON.stringify(depts))}

  function renderTrackerBoard(){
    const depts=readTrackerData();
    const totalDone=depts.reduce((s,d)=>s+d.done,0);
    const totalItems=depts.reduce((s,d)=>s+d.total,0);
    const rate=totalItems?Math.round(totalDone/totalItems*100):0;
    const inProgress=totalItems-totalDone;

    const setTxt=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
    const setWidth=(id,w)=>{const el=document.getElementById(id);if(el)el.style.width=w};

    setTxt("trackerRate",rate+"%");
    setTxt("trackerRateSummary",totalDone+" من أصل "+totalItems+" بندًا");
    setTxt("trackerTotalCount",totalItems);
    setTxt("trackerCountSummary",depts.length+" أقسام تشغيلية");
    setTxt("trackerDoneCount",totalDone);
    setTxt("trackerProgressCount",inProgress);
    setWidth("trackerRateBar",rate+"%");

    setTxt("boardRate",rate+"%");
    setWidth("boardRateBar",rate+"%");
    setTxt("boardDone",totalDone+" منجزًا");
    setTxt("boardProgress",inProgress+" قيد الإجراء");

    depts.forEach(dept=>{
      const deptRate=dept.total?Math.round(dept.done/dept.total*100):0;
      const trackerRow=document.querySelector(`[data-tracker-dept="${dept.id}"]`);
      if(trackerRow){
        const ratioEl=trackerRow.querySelector(".tracker-dept-ratio");
        if(ratioEl)ratioEl.textContent=dept.done+" / "+dept.total;
        const bar=trackerRow.querySelector("i > em");
        if(bar)bar.style.width=deptRate+"%";
        const sm=trackerRow.querySelector("small");
        if(sm)sm.textContent=deptRate+"% من البنود منجزة";
      }
      const boardArticle=document.querySelector(`[data-board-dept="${dept.id}"]`);
      if(boardArticle){
        const strong=boardArticle.querySelector("strong");
        if(strong)strong.textContent=deptRate+"%";
      }
    });

    const boardDeptCountEl=document.getElementById("boardDeptCount");
    if(boardDeptCountEl){const s=boardDeptCountEl.querySelector("strong");if(s)s.textContent=depts.length}
    const boardTotalItemsEl=document.getElementById("boardTotalItems");
    if(boardTotalItemsEl){const s=boardTotalItemsEl.querySelector("strong");if(s)s.textContent=totalItems}
  }

  function openTrackerModal(){
    const modal=document.getElementById("trackerUpdateModal");if(!modal)return;
    const depts=readTrackerData();
    const grid=document.getElementById("trackerEditGrid");
    if(grid){
      grid.innerHTML=depts.map(dept=>`
        <div class="tracker-dept-row" data-dept-id="${dept.id}">
          <span class="tracker-dept-name">${dept.name}</span>
          <label class="tracker-field-label">منجز<input type="number" min="0" class="tracker-input tracker-done-input" data-dept="${dept.id}" value="${dept.done}"></label>
          <label class="tracker-field-label">إجمالي<input type="number" min="0" class="tracker-input tracker-total-input" data-dept="${dept.id}" value="${dept.total}"></label>
        </div>`).join("");
      updateTrackerFooter(depts);
      grid.querySelectorAll(".tracker-input").forEach(input=>input.addEventListener("input",()=>{
        const current=getCurrentEditDepts();updateTrackerFooter(current);
      }));
    }
    modal.classList.add("open");modal.setAttribute("aria-hidden","false");
  }

  function getCurrentEditDepts(){
    const grid=document.getElementById("trackerEditGrid");if(!grid)return readTrackerData();
    return readTrackerData().map(dept=>{
      const doneEl=grid.querySelector(`.tracker-done-input[data-dept="${dept.id}"]`);
      const totalEl=grid.querySelector(`.tracker-total-input[data-dept="${dept.id}"]`);
      return {...dept,done:doneEl?Math.max(0,parseInt(doneEl.value)||0):dept.done,total:totalEl?Math.max(0,parseInt(totalEl.value)||0):dept.total};
    });
  }

  function updateTrackerFooter(depts){
    const footer=document.getElementById("trackerEditFooter");if(!footer)return;
    const done=depts.reduce((s,d)=>s+d.done,0);
    const total=depts.reduce((s,d)=>s+d.total,0);
    const rate=total?Math.round(done/total*100):0;
    footer.textContent=`الإجمالي: ${done} منجز من ${total} — نسبة الإنجاز: ${rate}%`;
  }

  (function(){
    const rateEl=document.getElementById("trackerRate");
    if(!rateEl)return;
    const block=rateEl.closest(".section-block");
    if(!block)return;
    const heading=block.querySelector(".section-heading");
    if(!heading)return;
    const btn=document.createElement("button");
    btn.className="btn secondary";
    btn.id="trackerUpdateButton";
    btn.textContent="تحديث البيانات";
    heading.appendChild(btn);
    btn.addEventListener("click",openTrackerModal);
  })();

  const saveTrackerBtn=document.getElementById("saveTrackerEdits");
  if(saveTrackerBtn)saveTrackerBtn.addEventListener("click",()=>{
    const depts=getCurrentEditDepts();
    saveTrackerData(depts);renderTrackerBoard();
    const modal=document.getElementById("trackerUpdateModal");
    if(modal){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
    toast("تم حفظ بيانات متابعة الأعمال");
  });

  document.querySelectorAll("[data-close-tracker]").forEach(x=>x.addEventListener("click",()=>{
    const modal=document.getElementById("trackerUpdateModal");
    if(modal){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
  }));

  renderTrackerBoard();
})();
