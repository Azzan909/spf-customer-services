(function(){
  "use strict";
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const fmt=n=>new Intl.NumberFormat("en-US").format(Number(n)||0);

  // Community and media-center chapters are injected server-side by patch_index.py.
  // Keeping their chapter markup out of this runtime enhancement script prevents
  // duplicate/bleeding sections and lets exhibition.js own tab visibility.

  function enhanceGovernorateInspector(){
    const inspector=$("#governorateInspector"); if(!inspector) return;
    const titleCards=$$("article",inspector);
    titleCards.forEach(card=>{
      const span=$("span",card); if(!span)return;
      if(span.textContent.trim()==="القوى العاملة") span.textContent="الكوادر البشرية";
      if(span.textContent.includes("الحصة من موظفي المحافظات")) span.textContent="نسبة الموظفين من إجمالي موظفي المديرية";
    });
    const staff=$("#governorateStaff"),share=$("#governorateShare"),total=$("#governorateTotalWork");
    const shareSmall=share?.parentElement?.querySelector("small");
    if(shareSmall) shareSmall.textContent="من إجمالي 236 موظفًا في المديرية";
    const oldAverage=[...inspector.querySelectorAll("small")].find(x=>x.textContent.includes("المتوسط:"));
    if(oldAverage) oldAverage.textContent="تُحسب النسبة من إجمالي موظفي المديرية: 236";
    let extra=$("#governorateProductivity",inspector);
    if(!extra && total){
      extra=document.createElement("div"); extra.id="governorateProductivity"; extra.className="governorate-productivity";
      extra.innerHTML=`<article><span>متوسط الأعمال لكل موظف</span><b id="govWorkPerEmployee">—</b><small>يناير–أغسطس</small></article><article><span>المعدل اليومي لكل موظف</span><b id="govDailyPerEmployee">—</b><small>متوسط تقريبي على أساس 173 يومًا من الأحد–الخميس</small></article>`;
      total.closest("div")?.parentElement?.appendChild(extra);
    }
    let population=$("#governoratePopulation",inspector);
    if(!population){
      population=document.createElement("div"); population.id="governoratePopulation"; population.className="governorate-population";
      population.innerHTML=`<div class="population-head"><span>التركيبة السكانية للمحافظة</span><small>بانتظار تقرير السكان المخصص للمحافظات</small></div><div class="population-grid"><article><span>المواطنون</span><b>—</b></article><article><span>العاملون</span><b>—</b></article><article><span>غيرهم من السكان</span><b>—</b></article><article><span>إجمالي السكان</span><b>—</b></article></div>`;
      inspector.appendChild(population);
    }
    const update=()=>{
      Array.from(inspector.querySelectorAll("article")).forEach(card=>{
        const label=$("span",card); if(!label)return;
        if(label.textContent.trim()==="القوى العاملة") label.textContent="الكوادر البشرية";
        if(label.textContent.includes("الحصة من موظفي المحافظات")) label.textContent="نسبة الموظفين من إجمالي موظفي المديرية";
      });
      const currentShareSmall=share?.parentElement?.querySelector("small"); if(currentShareSmall) currentShareSmall.textContent="من إجمالي 236 موظفًا في المديرية";
      const s=Number(String(staff?.textContent||"").replace(/[^0-9.]/g,""))||0;
      const w=Number(String(total?.textContent||"").replace(/[^0-9.]/g,""))||0;
      if(share && s) share.textContent=(s/236*100).toFixed(1)+"%";
      const per=$("#govWorkPerEmployee"),daily=$("#govDailyPerEmployee");
      if(per) per.textContent=s?fmt(Math.round(w/s)):"—";
      if(daily) daily.textContent=s?(w/s/173).toFixed(1):"—";
    };
    update();
    new MutationObserver(update).observe(inspector,{subtree:true,childList:true,characterData:true});
  }

  const governorateQ2={
    "مسقط":{visitors:19014,appointments:"58%",field:751,proactive:38,self:1348,community:0,whatsapp:1747},
    "ظفار":{visitors:5968,appointments:"88%",field:2537,proactive:142,self:827,community:14,whatsapp:1747},
    "مسندم":{visitors:2189,appointments:"69%",field:228,proactive:39,self:681,community:4,whatsapp:33},
    "البريمي":{visitors:5800,appointments:"84%",field:1285,proactive:14,self:1393,community:9,whatsapp:76},
    "الداخلية":{visitors:3951,appointments:"100%",field:731,proactive:137,self:1393,community:8,whatsapp:350},
    "شمال الباطنة":{visitors:9051,appointments:"87%",field:2277,proactive:17,self:1007,community:14,whatsapp:479},
    "جنوب الباطنة":{visitors:7739,appointments:"60%",field:3452,proactive:112,self:1198,community:30,whatsapp:1686},
    "جنوب الشرقية":{visitors:3403,appointments:"100%",field:600,proactive:227,self:376,community:9,whatsapp:663},
    "شمال الشرقية":{visitors:3988,appointments:"59%",field:610,proactive:4,self:265,community:36,whatsapp:686},
    "الظاهرة":{visitors:3693,appointments:"84%",field:696,proactive:425,self:1057,community:13,whatsapp:238},
    "الوسطى":{visitors:890,appointments:"84%",field:440,proactive:84,self:170,community:18,whatsapp:1373}
  };

  function addGovernoratePerformanceFilter(){
    const host=$(".branches-workload"); if(!host || $("#governoratePerformanceFilter",host)) return;
    const names=Object.keys(governorateQ2);
    const panel=document.createElement("div"); panel.id="governoratePerformanceFilter"; panel.className="governorate-performance-filter";
    panel.innerHTML=`<div class="gov-filter-head"><div><span>استعراض حسب المحافظة</span><h4>اختر محافظة لتحديث البطاقة</h4></div><select aria-label="اختيار المحافظة">${names.map(n=>`<option value="${n}">${n}</option>`).join("")}</select></div><div class="gov-performance-card"></div><small class="gov-performance-source">الفترة: الربع الثاني 2026 · القيم مستخرجة من التقرير الربع سنوي للمديرية.</small>`;
    const metrics=$(".workload-metrics",host); metrics?.before(panel);
    const card=$(".gov-performance-card",panel),select=$("select",panel);
    const render=()=>{const d=governorateQ2[select.value]; card.innerHTML=`
      <div class="gov-card-title"><b>${select.value}</b><span>دائرة الحماية الاجتماعية</span></div>
      <article><span>المراجعون</span><strong>${fmt(d.visitors)}</strong></article>
      <article><span>نسبة حجز المواعيد</span><strong>${d.appointments}</strong></article>
      <article><span>خدمات ميدانية</span><strong>${fmt(d.field)}</strong></article>
      <article><span>خدمات استباقية</span><strong>${fmt(d.proactive)}</strong></article>
      <article><span>خدمات ذاتية</span><strong>${fmt(d.self)}</strong></article>
      <article><span>تواصل مجتمعي</span><strong>${fmt(d.community)}</strong></article>
      <article><span>واتساب</span><strong>${fmt(d.whatsapp)}</strong></article>`;};
    select.addEventListener("change",render); render();
  }

  function correctDirectorateEmployeeCount(){
    const coverage=$("#coverage"); if(!coverage) return;
    $$("article",coverage).forEach(card=>{
      const s=$("span",card),strong=$("strong",card),small=$("small",card);
      if(s && /إجمالي موظفي/.test(s.textContent)){
        s.textContent="إجمالي موظفي المديرية"; if(strong)strong.textContent="236";
        if(small)small.textContent="يشمل جميع موظفي المديرية بالمركز ودوائر المحافظات";
      }
    });
  }

  function installReliableChapterRouter(){
    const nav=document.querySelector(".top-navigation");
    const main=document.querySelector("main");
    if(!nav||!main)return;
    const links=Array.from(nav.querySelectorAll('a[href^="#"]'));
    const chapters=Array.from(main.querySelectorAll(":scope > section[id]"));
    if(!links.length||!chapters.length)return;

    const show=(hash,replaceHistory=false)=>{
      let id=(hash||"#overview").replace(/^#/,"");
      let target=document.getElementById(id);
      if(!target || !chapters.includes(target)){
        id="overview"; target=document.getElementById(id)||chapters[0];
      }
      chapters.forEach(section=>{
        const active=section===target;
        section.hidden=!active;
        section.style.display=active?"":"none";
        section.setAttribute("aria-hidden",active?"false":"true");
      });
      links.forEach(link=>{
        const active=link.getAttribute("href")==="#"+id;
        link.classList.toggle("active",active);
        link.setAttribute("aria-current",active?"page":"false");
      });
      if(replaceHistory && location.hash!=="#"+id) history.replaceState(null,"","#"+id);
      window.scrollTo({top:0,behavior:"auto"});
    };

    links.forEach(link=>link.addEventListener("click",event=>{
      const href=link.getAttribute("href");
      if(!href||!href.startsWith("#"))return;
      event.preventDefault();
      if(location.hash===href) show(href,false);
      else history.pushState(null,"",href),show(href,false);
    }));
    window.addEventListener("hashchange",()=>show(location.hash,true));
    window.addEventListener("popstate",()=>show(location.hash,true));
    show(location.hash||"#overview",true);
  }

  function boot(){
    enhanceGovernorateInspector(); addGovernoratePerformanceFilter(); correctDirectorateEmployeeCount();
    installReliableChapterRouter();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>setTimeout(boot,0)); else setTimeout(boot,0);
})();