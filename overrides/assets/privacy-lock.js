(function(){
  const STORAGE_KEY="spf-display-privacy-lock-v1";
  const modal=document.getElementById("privacyLockModal");
  const openButton=document.getElementById("privacyLockButton");
  const choices=document.getElementById("privacyTabChoices");
  const status=document.getElementById("privacyStatus");
  const pinInput=document.getElementById("privacyPin");
  const pinConfirm=document.getElementById("privacyPinConfirm");
  const unlocked=new Set();
  if(!modal||!openButton||!choices)return;

  const tabs=[...document.querySelectorAll(".top-navigation a[href^='#']")].map(link=>({
    id:link.getAttribute("href").slice(1),label:link.textContent.trim()
  })).filter(tab=>document.getElementById(tab.id));

  function readConfig(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"null")||{lockedIds:[],pinHash:""}}
    catch(_){return {lockedIds:[],pinHash:""}}
  }
  async function digest(value){
    const bytes=new TextEncoder().encode(value),hash=await crypto.subtle.digest("SHA-256",bytes);
    return [...new Uint8Array(hash)].map(byte=>byte.toString(16).padStart(2,"0")).join("");
  }
  function setStatus(message,type=""){
    status.textContent=message;status.className=`excel-import-status ${type}`.trim();
  }
  function renderChoices(){
    const config=readConfig();
    choices.innerHTML=tabs.map(tab=>`<label><input type="checkbox" value="${tab.id}" ${config.lockedIds.includes(tab.id)?"checked":""}><span>${tab.label}</span></label>`).join("");
  }
  function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
  function openModal(){renderChoices();pinInput.value="";pinConfirm.value="";setStatus("");modal.classList.add("open");modal.setAttribute("aria-hidden","false")}

  function lockOverlay(section,label){
    let overlay=section.querySelector(":scope > .privacy-lock-overlay");
    if(!overlay){
      overlay=document.createElement("div");overlay.className="privacy-lock-overlay";
      overlay.innerHTML=`<div><span>تبويب خاص</span><h3>${label}</h3><p>أدخل رمز العرض لإزالة التشويش خلال هذه الجلسة.</p><form><input type="password" inputmode="numeric" autocomplete="current-password" placeholder="رمز العرض" aria-label="رمز فتح التبويب"><button type="submit">فتح التبويب</button></form><small role="status"></small></div>`;
      section.appendChild(overlay);
      overlay.querySelector("form").addEventListener("submit",async event=>{
        event.preventDefault();
        const config=readConfig(),input=overlay.querySelector("input"),message=overlay.querySelector("small");
        if(await digest(input.value)===config.pinHash){unlocked.add(section.id);applyLocks();message.textContent=""}
        else{message.textContent="الرمز غير صحيح";input.select()}
      });
    }
    return overlay;
  }
  function applyLocks(){
    const config=readConfig();
    tabs.forEach(tab=>{
      const section=document.getElementById(tab.id),shouldLock=config.lockedIds.includes(tab.id)&&!unlocked.has(tab.id);
      section.classList.toggle("privacy-locked",shouldLock);
      const overlay=lockOverlay(section,tab.label);overlay.hidden=!shouldLock;
      const nav=document.querySelector(`.top-navigation a[href="#${tab.id}"]`);if(nav)nav.classList.toggle("nav-locked",shouldLock);
    });
    openButton.classList.toggle("active-lock",config.lockedIds.length>0);
    openButton.textContent=config.lockedIds.length?`قفل العرض · ${config.lockedIds.length}`:"قفل العرض";
  }

  openButton.addEventListener("click",openModal);
  modal.querySelectorAll("[data-close-privacy]").forEach(element=>element.addEventListener("click",closeModal));
  document.getElementById("savePrivacyLock").addEventListener("click",async()=>{
    const lockedIds=[...choices.querySelectorAll("input:checked")].map(input=>input.value);
    if(!lockedIds.length){localStorage.removeItem(STORAGE_KEY);unlocked.clear();applyLocks();closeModal();return}
    const pin=pinInput.value.trim();
    if(pin.length<4){setStatus("أدخل رمزًا من 4 أرقام أو أكثر.","error");return}
    if(pin!==pinConfirm.value.trim()){setStatus("رمزا العرض غير متطابقين.","error");return}
    localStorage.setItem(STORAGE_KEY,JSON.stringify({lockedIds,pinHash:await digest(pin)}));
    unlocked.clear();applyLocks();setStatus("تم حفظ قفل العرض.","success");setTimeout(closeModal,650);
  });
  document.getElementById("clearPrivacyLock").addEventListener("click",()=>{
    localStorage.removeItem(STORAGE_KEY);unlocked.clear();renderChoices();applyLocks();setStatus("تم إلغاء جميع الأقفال.","success");
  });
  applyLocks();
})();
