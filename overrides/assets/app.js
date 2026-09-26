(function(){
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const grid=$("#projectsGrid"), planGrid=$("#operationalPlanGrid"), committeesGrid=$("#committeesGrid"), modal=$("#projectModal"), updateModal=$("#updateModal");
  const STORAGE_KEY="spf-exhibition-manual-edits-v1";
  const PLAN_STORAGE_KEY="spf-operational-plan-delivery-v1";
  const AUTH_PROXY="https://customer-compass-github-auth.spf2040.chatgpt.site";
  const GITHUB_OWNER="Azzan909",GITHUB_REPO="spf-customer-services",GLOBAL_EDITS_PATH="overrides/assets/dashboard-edits.json";
  const editorToolbar=$("#editorToolbar"), editButton=$("#editContent"), saveNotice=$("#saveNotice");
  editButton.disabled=true;
  const defaultValues=new Map();
  let savedEdits={}, workingEdits={}, planDelivery={}, editing=false, currentProjectId="",editAccessToken="";

  function savePlanDelivery(){localStorage.setItem(PLAN_STORAGE_KEY,JSON.stringify(planDelivery))}
  function sanitizeGlobalEdits(edits){
    // These values come from the task register or a calculated governorate total.
    // Labels and figures in the other sections are authored content and must load for everyone.
    return Object.fromEntries(Object.entries(edits||{}).filter(([key])=>
      !isCalculatedKey(key)
    ));
  }
  function isCalculatedKey(key){
    return key==="#governorateTotalWork" ||
      ["#trackerRate","#trackerRateSummary","#trackerTotalCount","#trackerCountSummary","#trackerDoneCount","#trackerProgressCount","#boardRate","#boardDone","#boardProgress","#boardTotalItems>strong:1"].includes(key) ||
      key.startsWith("#boardModePanel>main:1>section:5>") ||
      /^#work-tracker>div:3>article:\d+>(?:div:1>b:1|small:1)$/.test(key);
  }
  async function loadGlobalEdits(){
    try{
      const response=await fetch(`assets/dashboard-edits.json?v=${Date.now()}`,{cache:"no-store"});
      if(!response.ok)throw new Error();
      const payload=await response.json();savedEdits=sanitizeGlobalEdits(payload.edits);workingEdits={...savedEdits};planDelivery=payload.planDelivery||{};applyValues(savedEdits);
      renderProjects($(".project-tabs button.active")?.dataset.filter||"inventory");renderOperationalPlan($(".plan-controls button.active")?.dataset.planFilter||"core");
      editButton.disabled=false;
    }catch(_){savedEdits={};workingEdits={};planDelivery={};applyValues({});editButton.disabled=true;toast("تعذر تحميل التعديلات المركزية؛ لن تتاح الكتابة حتى إعادة فتح الصفحة بعد التحقق من الاتصال.")}
  }
  function oauthPanel(code,url){
    let panel=$("#githubOauthPanel");if(panel)panel.remove();panel=document.createElement("div");panel.id="githubOauthPanel";panel.className="github-oauth-panel";
    panel.innerHTML=`<div><span>دخول المنسقة</span><h3>أدخل الرمز في GitHub</h3><strong>${escapeHtml(code)}</strong><p>تبقى جلسة التحرير حتى إغلاق الصفحة.</p><a href="${escapeHtml(url)}" target="_blank" rel="noopener">فتح GitHub وإدخال الرمز</a><small>بانتظار الموافقة…</small></div>`;document.body.appendChild(panel);return panel;
  }
  async function verifyDashboardToken(token){
    const headers={Authorization:`Bearer ${token}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"};
    const userResponse=await fetch("https://api.github.com/user",{headers});if(!userResponse.ok)throw new Error("رمز GitHub غير صالح أو انتهت صلاحيته");
    const user=await userResponse.json();
    const permissionResponse=await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`,{headers});
    if(!permissionResponse.ok)throw new Error("تعذر التحقق من صلاحية حساب المنسقة");
    const repository=await permissionResponse.json();
    if(!repository.permissions?.push)throw new Error(`الحساب ${user.login||"الحالي"} يحتاج صلاحية كتابة على مستودع المنصة`);
    const repoResponse=await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GLOBAL_EDITS_PATH}?ref=main`,{headers});
    if(repoResponse.status===403)throw new Error("الرمز يحتاج صلاحية Contents: Read and write للمستودع spf-customer-services");
    if(!repoResponse.ok)throw new Error("تعذر الوصول إلى ملف تحديث المنصة بهذا الرمز");
    return token;
  }
  function loginChoicePanel(){
    return new Promise((resolve,reject)=>{
      let panel=$("#githubLoginChoice");if(panel)panel.remove();panel=document.createElement("div");panel.id="githubLoginChoice";panel.className="github-oauth-panel owner-login-choice";
      panel.innerHTML=`<div><button class="owner-login-close" type="button" aria-label="إغلاق">×</button><span>دخول المنسقة</span><h3>اختر طريقة الدخول</h3><p>داخل شبكة العمل استخدم رمز وصول مؤقت؛ يبقى في الذاكرة لهذه الجلسة فقط ولا يُحفظ في المنصة أو المتصفح.</p><label><small>رمز الوصول المؤقت</small><input type="password" autocomplete="off" placeholder="github_pat_… أو ghp_…"></label><button class="owner-token-submit" type="button">تحقق وابدأ التحرير</button><small class="owner-login-error" role="status"></small><a class="owner-token-help" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">إنشاء رمز: استخدمي حسابك المضاف متعاونًا في المستودع، واختاري صلاحية Contents: Read and write</a><i>أو</i><button class="owner-oauth-start" type="button">الدخول عبر GitHub خارج شبكة العمل</button></div>`;
      document.body.appendChild(panel);const input=$("input",panel),error=$(".owner-login-error",panel),submit=$(".owner-token-submit",panel);
      $(".owner-login-close",panel).onclick=()=>{panel.remove();reject(new Error("تم إلغاء تسجيل الدخول"))};
      $(".owner-oauth-start",panel).onclick=()=>{panel.remove();resolve({mode:"oauth"})};
      submit.onclick=async()=>{const token=input.value.trim();if(!token){error.textContent="أدخل رمز الوصول المؤقت";return}submit.disabled=true;submit.textContent="جارٍ التحقق…";try{await verifyDashboardToken(token);panel.remove();resolve({mode:"token",token})}catch(err){error.textContent=err.message;submit.disabled=false;submit.textContent="تحقق وابدأ التحرير"}};
    });
  }
  async function githubDeviceLogin(){
    const start=await fetch(`${AUTH_PROXY}/device/code`,{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});if(!start.ok)throw new Error("تعذر بدء تسجيل GitHub");
    const flow=await start.json();const panel=oauthPanel(flow.user_code,flow.verification_uri);
    const started=Date.now(),interval=Math.max(5,Number(flow.interval)||5)*1000;
    try{
      while(Date.now()-started<(Number(flow.expires_in)||900)*1000){
        await new Promise(resolve=>setTimeout(resolve,interval));
        const response=await fetch(`${AUTH_PROXY}/oauth/access-token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({device_code:flow.device_code})});const result=await response.json();
        if(result.access_token){
          return verifyDashboardToken(result.access_token);
        }
        if(result.error&&!["authorization_pending","slow_down"].includes(result.error))throw new Error("لم تكتمل موافقة GitHub");
      }
      throw new Error("انتهت مهلة تسجيل الدخول");
    }finally{panel.remove()}
  }
  async function authorizeGithub(){
    const choice=await loginChoicePanel();
    return choice.mode==="token"?choice.token:githubDeviceLogin();
  }
  function encodeBase64(value){const bytes=new TextEncoder().encode(value);let binary="";bytes.forEach(byte=>binary+=String.fromCharCode(byte));return btoa(binary)}
  async function publishGlobalEdits(token,edits){
    const endpoint=`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GLOBAL_EDITS_PATH}`,headers={Authorization:`Bearer ${token}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"};
    const current=await fetch(`${endpoint}?ref=main`,{headers});if(!current.ok)throw new Error("تعذر قراءة ملف التحديث المركزي");const metadata=await current.json();
    const payload={version:3,updatedAt:new Date().toISOString(),edits,planDelivery};
    const saved=await fetch(endpoint,{method:"PUT",headers:{...headers,"Content-Type":"application/json"},body:JSON.stringify({message:"Publish dashboard content updates",content:encodeBase64(JSON.stringify(payload,null,2)+"\n"),sha:metadata.sha,branch:"main"})});
    if(!saved.ok)throw new Error("تعذر نشر التحديث إلى GitHub");
  }
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
      !el.classList.contains("project-id") && !isCalculatedKey(stablePath(el)) && (el.dataset.editKey||el.textContent.trim())
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
    return sanitizeGlobalEdits(values);
  }
  // The displayed total is the six categories performed by governorate staff.
  // Appointments and QR evaluations remain visible as context, outside this sum.
  const GOVERNORATE_WORK_IDS=["govTransactions","govWhatsapp","govProactive","govCommunity","govField","govSelfService"];
  function governorateCount(value){
    const digits=String(value||"").replace(/[٠-٩]/g,d=>String(d.charCodeAt(0)-0x660)).replace(/[۰-۹]/g,d=>String(d.charCodeAt(0)-0x6f0));
    const number=Number(digits.replace(/[\s,،٬]/g,""));
    return Number.isFinite(number)?number:0;
  }
  function updateGovernorateWorkTotal(){
    const total=document.getElementById("governorateTotalWork");
    const metrics=GOVERNORATE_WORK_IDS.map(id=>document.getElementById(id));
    if(!total||metrics.some(el=>!el))return;
    const value=new Intl.NumberFormat("en-US").format(metrics.reduce((sum,el)=>sum+governorateCount(el.textContent),0));
    if(total.textContent.trim()!==value)total.textContent=value;
  }
  const governorateInspector=document.getElementById("governorateInspector");
  if(governorateInspector){
    new MutationObserver(updateGovernorateWorkTotal).observe(governorateInspector,{childList:true,characterData:true,subtree:true});
    updateGovernorateWorkTotal();
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

  editButton.addEventListener("click",async()=>{editButton.disabled=true;editButton.textContent="جارٍ التحقق…";try{if(!editAccessToken)editAccessToken=await authorizeGithub();workingEdits={...savedEdits};setEditing(true);toast("يمكنك التحرير الآن")}catch(error){editAccessToken="";editButton.disabled=false;editButton.textContent="تحرير المحتوى";toast(error.message||"تعذر تسجيل الدخول")}});
  $("#saveEdits").addEventListener("click",async()=>{
    if(!editAccessToken){toast("انتهت جلسة GitHub؛ ابدأ التحرير من جديد");return}
    const nextEdits=collectEdits();toast("جارٍ نشر التحديث للجميع…");
    try{await publishGlobalEdits(editAccessToken,nextEdits);savedEdits=nextEdits;workingEdits={...savedEdits};localStorage.setItem(STORAGE_KEY,JSON.stringify(savedEdits));setEditing(false);renderProjects($(".project-tabs button.active")?.dataset.filter||"inventory");renderOperationalPlan($(".plan-controls button.active")?.dataset.planFilter||"core");toast("تم النشر؛ سيظهر التحديث للجميع خلال دقائق")}catch(error){toast(error.message||"تعذر نشر التحديث")}
  });
  $("#cancelEdits").addEventListener("click",()=>{workingEdits={...savedEdits};applyValues(savedEdits);setEditing(false);renderProjects($(".project-tabs button.active")?.dataset.filter||"inventory");renderOperationalPlan($(".plan-controls button.active")?.dataset.planFilter||"core");toast("تم إلغاء التعديلات")});
  $("#resetEdits").addEventListener("click",()=>{
    if(!confirm("هل تريد استعادة جميع محتويات النسخة الأصلية؟"))return;
    localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(PLAN_STORAGE_KEY);savedEdits={};workingEdits={};planDelivery={};applyValues({});setEditing(false);renderProjects("all");renderOperationalPlan("all");toast("عُرضت النسخة الأصلية محليًا؛ انقر تحرير المحتوى ثم حفظ لنشرها للجميع");
  });
  $("#exportEdits").addEventListener("click",()=>{
    const payload={type:"spf-dashboard-edits",version:2,exportedAt:new Date().toISOString(),edits:collectEdits(),planDelivery};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=`spf-dashboard-edits-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);toast("تم تصدير نسخة التعديلات");
  });
  $("#importEdits").addEventListener("change",async e=>{
    const file=e.target.files[0];if(!file)return;
    try{const payload=JSON.parse(await file.text());if(payload.type!=="spf-dashboard-edits"||!payload.edits)throw new Error();workingEdits=sanitizeGlobalEdits(payload.edits);savedEdits={...workingEdits};planDelivery=payload.planDelivery||{};localStorage.setItem(STORAGE_KEY,JSON.stringify(savedEdits));savePlanDelivery();renderProjects("all");renderOperationalPlan("all");applyValues(savedEdits);setEditing(false);toast("تم استيرادها على هذا الجهاز فقط؛ استخدم تحرير المحتوى ثم حفظ لنشرها للجميع")}catch(_){toast("تعذر قراءة ملف التعديلات")}
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
  prepareEditable();loadGlobalEdits();

  // ── Work Tracker Module ──────────────────────────────────────────────────
  const TRACKER_SUMMARY_KEY="spf-work-tracker-summary-v3";
  const DEFAULT_TRACKER_DEPTS=[
    {id:"contact",     name:"مركز الاتصال",                 done:102, total:107},
    {id:"coord",       name:"التنسيق والمتابعة",             done:7,   total:7},
    {id:"crm",         name:"إدارة علاقات المتعاملين",      done:35,  total:42},
    {id:"service-dev", name:"إدارة وتطوير الخدمات",         done:72,  total:123},
    {id:"branches",    name:"شؤون الدوائر والمنافذ",        done:36,  total:75},
  ];

  function defaultTrackerSummary(){
    const depts=DEFAULT_TRACKER_DEPTS.map(x=>({...x}));
    const done=depts.reduce((s,d)=>s+d.done,0),total=depts.reduce((s,d)=>s+d.total,0);
    return {depts,done,total,late:0,progress:total-done,rate:total?Math.round(done/total*100):0};
  }
  function readTrackerSummary(){
    try{const saved=JSON.parse(localStorage.getItem(TRACKER_SUMMARY_KEY)||"null");return saved&&Array.isArray(saved.depts)?saved:defaultTrackerSummary()}catch(_){return defaultTrackerSummary()}
  }

  function trackerSummaryFromTasks(tasks){
    const names={'مركز الاتصال':'contact','إدارة علاقات المتعاملين':'crm','إدارة وتطوير الخدمات':'service-dev','شؤون الدوائر والمنافذ':'branches','التنسيق والمتابعة':'coord'};
    const grouped={};
    tasks.forEach(task=>{
      const name=task.dept||'غير محدد';
      const group=grouped[name]||(grouped[name]={id:names[name]||`dept-${Object.keys(grouped).length+1}`,name,done:0,total:0});
      group.total++;
      if(task.status==='منجز')group.done++;
    });
    const total=tasks.length;
    const done=tasks.filter(task=>task.status==='منجز').length;
    const late=tasks.filter(task=>task.status==='متأخر').length;
    const progress=tasks.filter(task=>task.status==='قيد الإجراء').length;
    return {depts:Object.values(grouped),total,done,late,progress,rate:total?Math.round(done/total*100):0};
  }

  async function refreshTrackerSummary(){
    try{
      const response=await fetch(`assets/tasks-data.json?v=${Date.now()}`,{cache:'no-store'});
      if(!response.ok)throw new Error('tracker data unavailable');
      const document=await response.json();
      if(!Array.isArray(document.tasks))throw new Error('invalid tracker data');
      const summary=trackerSummaryFromTasks(document.tasks);
      try{localStorage.setItem(TRACKER_SUMMARY_KEY,JSON.stringify(summary))}catch(_){/* private mode */}
      renderTrackerBoard(summary);
    }catch(_){renderTrackerBoard(readTrackerSummary())}
  }

  function renderTrackerBoard(summary=readTrackerSummary()){
    const depts=summary.depts||[];
    const totalDone=Number(summary.done)||0;
    const totalItems=Number(summary.total)||0;
    const rate=totalItems?Math.round(totalDone/totalItems*100):0;
    const inProgress=Number.isFinite(Number(summary.progress))?Number(summary.progress):Math.max(0,totalItems-totalDone-(Number(summary.late)||0));

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
    const boardTitle=document.querySelector('[data-board-title="متابعة الأعمال"] .board-slide-heading h2');
    if(boardTitle)boardTitle.textContent=`لوحة واحدة لمتابعة ${totalItems} بندًا تشغيليًا`;
  }

  window.addEventListener("message",event=>{
    if(event.origin!==window.location.origin||event.data?.type!=="spf-work-tracker-summary")return;
    const summary=event.data.summary;if(!summary||!Array.isArray(summary.depts))return;
    try{localStorage.setItem(TRACKER_SUMMARY_KEY,JSON.stringify(summary))}catch(_){/* private mode */}
    renderTrackerBoard(summary);
  });

  window.addEventListener("storage",event=>{
    if(event.key!==TRACKER_SUMMARY_KEY||!event.newValue)return;
    try{const summary=JSON.parse(event.newValue);if(Array.isArray(summary.depts))renderTrackerBoard(summary)}catch(_){/* ignore invalid data */}
  });
  window.addEventListener("focus",refreshTrackerSummary);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)refreshTrackerSummary()});

  renderTrackerBoard();
  refreshTrackerSummary();
})();
