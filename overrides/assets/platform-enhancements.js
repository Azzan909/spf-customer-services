(function(){
  "use strict";
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const fmt=n=>new Intl.NumberFormat("en-US").format(Number(n)||0);

  function insertNavLink(beforeHref, href, label){
    const nav=$(".top-navigation"); if(!nav || nav.querySelector(`a[href="${href}"]`)) return;
    const before=nav.querySelector(`a[href="${beforeHref}"]`);
    const a=document.createElement("a"); a.href=href; a.textContent=label;
    before?nav.insertBefore(a,before):nav.appendChild(a);
  }

  function addCommunitySection(){
    if($("#community-line")) return;
    const anchor=$("#operational-plan")||$("#work-tracker")||$("#performance");
    if(!anchor) return;
    const section=document.createElement("section");
    section.className="section-block community-line-section";
    section.id="community-line";
    section.innerHTML=`
      <div class="section-heading">
        <div><span class="section-kicker">خط التواصل المجتمعي</span><h2>الأنشطة والفعاليات المجتمعية بالأرقام والتفاصيل</h2></div>
        <span class="section-note">يناير–أغسطس 2026 · سجل تفاعلي قابل للتحديث</span>
      </div>
      <div class="community-kpis">
        <article><span>إجمالي الأنشطة والفعاليات</span><strong>313</strong><small>أنشطة إعلامية وفعاليات مجتمعية</small></article>
        <article><span>الجمهور المستهدف</span><strong>17,093</strong><small>مشاركًا ومستفيدًا</small></article>
        <article><span>الشركاء</span><strong>+255</strong><small>جهة وشريكًا في التنفيذ والوصول</small></article>
        <article><span>النطاق الجغرافي</span><strong>11</strong><small>محافظة عبر دوائر الحماية الاجتماعية</small></article>
      </div>
      <div class="community-dashboard">
        <article class="community-summary-card">
          <div class="community-card-head"><div><span>خط التنفيذ</span><h3>من التخطيط إلى قياس الأثر</h3></div><b>2026</b></div>
          <div class="community-flow">
            <div><i>1</i><b>خطة التواصل</b><small>تقويم موحد للأنشطة والمناسبات</small></div>
            <div><i>2</i><b>تنفيذ بالمحافظات</b><small>ورش، لقاءات، حملات ومبادرات</small></div>
            <div><i>3</i><b>قياس المشاركة</b><small>الجمهور، الشركاء ونطاق الوصول</small></div>
            <div><i>4</i><b>توثيق الأثر</b><small>تقرير دوري وربط بالخطة التشغيلية</small></div>
          </div>
        </article>
        <article class="community-detail-card">
          <div class="community-card-head"><div><span>تفاصيل موثقة</span><h3>نماذج من الأنشطة والفعاليات</h3></div><b>Q1–Q2</b></div>
          <div class="community-month-filter" role="tablist">
            <button class="active" data-community-month="all">الكل</button>
            <button data-community-month="يناير">يناير</button><button data-community-month="فبراير">فبراير</button>
            <button data-community-month="مارس">مارس</button><button data-community-month="أبريل">أبريل</button>
            <button data-community-month="مايو">مايو</button><button data-community-month="يونيو">يونيو</button>
          </div>
          <div class="community-events">
            ${[
              ["يناير","4 يناير","جلسة تصوير محتوى إعلامي للأطفال","الوسطى – الدقم"],
              ["يناير","14 يناير","ورشة تعريفية لمكاتب أصحاب السمو حول منافع الحماية الاجتماعية","الظاهرة"],
              ["يناير","17 يناير","فعالية «جرب جنوب الباطنة»","جنوب الباطنة"],
              ["فبراير","2 فبراير","قافلة عُمان","مسندم"],
              ["فبراير","4 فبراير","افتتاح فعاليات شتاء الوسطى – الدقم","الوسطى"],
              ["فبراير","12 فبراير","المشاركة في المؤتمر الدولي التاسع للتشريعات القانونية في عصر التحول الرقمي","البريمي"],
              ["مارس","3 مارس","اليوم العالمي للسمع","متعدد المحافظات"],
              ["مارس","11 مارس","المشاركة في فعالية وادي بني خالد: رؤية متكاملة وتنمية مستدامة","شمال الشرقية"],
              ["مارس","28 مارس","ساعة الأرض","متعدد المحافظات"],
              ["مارس","30 مارس","ورشة حول التأمين والإجازات المرضية وغير الاعتيادية","مسندم"],
              ["أبريل","2 أبريل","اليوم العالمي للتوحد في مركز الوفاء لتأهيل ذوي الإعاقة","الظاهرة – عبري"],
              ["أبريل","13 أبريل","مبادرة مجتمعية للتعريف بالقانون والخدمات والرد على الاستفسارات","شمال الشرقية"],
              ["أبريل","28 أبريل","اليوم العالمي للسلامة المهنية «بيئة عمل آمنة»","ظفار"],
              ["مايو","3 مايو","اليوم العالمي للعمال","متعدد المحافظات"],
              ["مايو","10 مايو","حوار حول المرونة النفسية في الأنظمة والقوانين مع مؤسسات القطاع العام","شمال الشرقية"],
              ["مايو","11 مايو","جلسات حوارية مع الأطفال والأيتام بحضور وفد من اليونيسف","جنوب الباطنة"],
              ["مايو","17 مايو","مبادرة «عُمان نحو مجتمع معلوماتي» تزامنًا مع اليوم العالمي للاتصالات","متعدد المحافظات"],
              ["يونيو","3 يونيو","زيارة فريق مجتمعي من كبار السن والتعريف بالمنافع وخدمات المنظومة","متعدد المحافظات"],
              ["يونيو","23 يونيو","مبادرة توعوية بالتعاون مع جهة تعليمية في المجتمع المحلي","متعدد المحافظات"],
              ["يونيو","25 يونيو","لقاء تعريفي بتسهيلات سداد الاشتراكات المتأخرة للقطاع الخاص","البريمي"]
            ].map(e=>`<div class="community-event" data-month="${e[0]}"><time>${e[1]}</time><div><b>${e[2]}</b><small>${e[3]}</small></div></div>`).join("")}
          </div>
          <p class="community-source-note">يعرض السجل أعلاه نماذج موثقة من تقريري الربع الأول والثاني؛ وتبقى مؤشرات يناير–أغسطس هي المؤشرات التجميعية المعتمدة للتاب.</p>
        </article>
      </div>`;
    anchor.parentNode.insertBefore(section,anchor);
    $$(".community-month-filter button",section).forEach(btn=>btn.addEventListener("click",()=>{
      $$(".community-month-filter button",section).forEach(x=>x.classList.toggle("active",x===btn));
      const m=btn.dataset.communityMonth;
      $$(".community-event",section).forEach(ev=>ev.hidden=m!=="all"&&ev.dataset.month!==m);
    }));
  }

  function addMediaSection(){
    if($("#media-center")) return;
    const anchor=$("#community-line")||$("#operational-plan");
    if(!anchor) return;
    const section=document.createElement("section");
    section.className="section-block media-center-section";
    section.id="media-center";
    section.innerHTML=`
      <div class="section-heading">
        <div><span class="section-kicker">المركز الإعلامي</span><h2>النشرات والتقارير الدورية للمديرية</h2></div>
        <span class="section-note">مكتبة مرجعية موحدة للإدارة العليا</span>
      </div>
      <div class="media-kpis">
        <article><span>التقارير الربع سنوية المتاحة</span><strong>2</strong><small>الربع الأول والثاني 2026</small></article>
        <article><span>دورية التحديث</span><strong>ربع سنوي</strong><small>مع قابلية إضافة نشرات شهرية ودورية</small></article>
        <article><span>آخر فترة موثقة</span><strong>يونيو 2026</strong><small>وفق التقارير المرفقة الحالية</small></article>
      </div>
      <div class="media-library">
        <article class="media-report-card">
          <div class="media-report-badge">Q1</div>
          <div><span>يناير–مارس 2026</span><h3>التقرير الربع سنوي — الربع الأول</h3>
          <p>يتضمن الملخص التنفيذي، مؤشرات الأداء، الخطة التشغيلية، التواصل المجتمعي، حجم الأعمال وأداء المحافظات.</p>
          <div class="media-tags"><span>30 صفحة</span><span>تواصل مجتمعي</span><span>أداء المحافظات</span></div></div>
          <button type="button" class="media-summary-toggle">عرض ملخص التقرير</button>
          <div class="media-report-summary" hidden><b>أبرز المؤشرات</b><ul><li>158 نشاطًا وفعالية مجتمعية.</li><li>10,619 من الجمهور المستهدف.</li><li>135,841 إجمالي حجم الأعمال المنجزة بالمحافظات.</li><li>37,752 مكالمة مستلمة بمركز الاتصال.</li></ul></div>
        </article>
        <article class="media-report-card">
          <div class="media-report-badge">Q2</div>
          <div><span>أبريل–يونيو 2026</span><h3>التقرير الربع سنوي — الربع الثاني</h3>
          <p>يوثق مؤشرات الأداء مقارنة بالربع الأول، الخطة التشغيلية، المشاركة في الفرق واللجان، التواصل المجتمعي وأداء كل محافظة.</p>
          <div class="media-tags"><span>41 صفحة</span><span>مقارنة ربعية</span><span>أداء تفصيلي</span></div></div>
          <button type="button" class="media-summary-toggle">عرض ملخص التقرير</button>
          <div class="media-report-summary" hidden><b>أبرز المؤشرات</b><ul><li>161 نشاطًا وفعالية مجتمعية.</li><li>6,474 من الجمهور المستهدف خلال الربع الثاني.</li><li>146,807 إجمالي حجم الأعمال المنجزة بالمحافظات.</li><li>42,596 مكالمة مستلمة بمركز الاتصال.</li><li>إجمالي موظفي المديرية: 236 موظفًا.</li></ul></div>
        </article>
      </div>
      <div class="media-coming"><b>الإضافات القادمة</b><span>النشرات الشهرية · التقارير الدورية · التقارير الربع سنوية اللاحقة</span><small>تُضاف كبطاقات مرجعية موحدة بنفس الهيكل لتبقى المنصة المصدر الرئيسي للمديرية.</small></div>`;
    anchor.parentNode.insertBefore(section,anchor.nextSibling);
    $$(".media-summary-toggle",section).forEach(btn=>btn.addEventListener("click",()=>{
      const box=btn.parentElement.querySelector(".media-report-summary");
      box.hidden=!box.hidden; btn.textContent=box.hidden?"عرض ملخص التقرير":"إخفاء الملخص";
    }));
  }

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
      $("article",inspector).forEach(card=>{
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

  function boot(){
    insertNavLink("#operational-plan","#community-line","خط التواصل المجتمعي");
    insertNavLink("#operational-plan","#media-center","المركز الإعلامي");
    addCommunitySection(); addMediaSection();
    enhanceGovernorateInspector(); addGovernoratePerformanceFilter(); correctDirectorateEmployeeCount();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>setTimeout(boot,0)); else setTimeout(boot,0);
})();