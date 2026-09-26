(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const content = selector => $(selector)?.textContent.trim() || '';
  const number = value => {
    const arabic = '٠١٢٣٤٥٦٧٨٩';
    const normalized = String(value).replace(/[٠-٩]/g, ch => arabic.indexOf(ch)).replace(/,/g, '');
    const match = normalized.match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : null;
  };
  const questions = [
    ['من نحن ومن نخدم؟', ['directorate', 'coverage', 'channels'], 'الهيكل والموظفون والتغطية ونطاق الخدمات'],
    ['كيف تبدو تجربة المتعامل؟', ['methodology', 'tajawob', 'performance'], 'الرضا وصوت المتعامل والشكاوى والمقترحات'],
    ['كيف تعمل قنواتنا؟', ['channels', 'performance', 'coverage'], 'المنافذ ومركز الاتصال والقنوات الرقمية والميدانية'],
    ['هل ننفذ التزاماتنا؟', ['operational-plan', 'work-tracker', 'performance'], 'الخطة والموقف التنفيذي وكفاءة الاستجابة'],
    ['ما الذي قد يعطلنا؟', ['risk-register', 'work-tracker'], 'المخاطر والتعثر والأعمال التي تتطلب متابعة'],
    ['ماذا نطور للمستقبل؟', ['projects', 'achievements', 'committees'], 'المشاريع والمبادرات والتحسين والابتكار']
  ];
  const nav = $('#executiveQuestionNav');
  const button = $('#executiveViewToggle');
  const cards = $('#commandQuestionCards');
  const kpis = $('#commandKpis');
  const attention = $('#commandAttention');
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function route(id) {
    const link = [...document.querySelectorAll('.top-navigation a')].find(item => item.hash === '#' + id);
    if (link) link.click();
  }
  function questionMarkup([title, ids, description], index) {
    return `<article class="command-question"><span>0${index + 1}</span><h3>${escape(title)}</h3><p>${escape(description)}</p><div>${ids.map(id => {
      const label = document.querySelector(`.top-navigation a[href="#${id}"]`)?.textContent || id;
      return `<a href="#${id}" data-exec-route>${escape(label)}</a>`;
    }).join('')}</div></article>`;
  }
  cards.innerHTML = questions.map(questionMarkup).join('');
  nav.innerHTML = questions.map(([title, ids], index) => `<button type="button" data-exec-question="${index}" aria-label="${escape(title)}">${escape(title)}</button>`).join('');
  nav.addEventListener('click', event => {
    const choice = event.target.closest('[data-exec-question]');
    if (choice) route(questions[Number(choice.dataset.execQuestion)][1][0]);
  });
  document.addEventListener('click', event => {
    const anchor = event.target.closest('[data-exec-route]');
    if (anchor) { event.preventDefault(); route(anchor.hash.slice(1)); }
  });
  function setMode(enabled) {
    document.body.classList.toggle('executive-view', enabled);
    nav.hidden = !enabled;
    button.setAttribute('aria-pressed', String(enabled));
    button.textContent = enabled ? 'إغلاق العرض التنفيذي' : 'العرض التنفيذي';
    if (enabled) route('overview');
  }
  button.addEventListener('click', () => setMode(!document.body.classList.contains('executive-view')));
  function tile({value, label, target, previous, href, note, demo = false, unverified = false}) {
    const currentNumber = number(value), targetNumber = number(target);
    const state = demo || unverified || currentNumber === null || targetNumber === null ? 'neutral' : currentNumber >= targetNumber ? 'good' : currentNumber >= targetNumber * .9 ? 'warning' : 'alert';
    let comparison = 'لا تتوفر مقارنة سابقة';
    if (previous !== undefined && previous !== null && currentNumber !== null) {
      const delta = Math.round((currentNumber - previous) * 10) / 10;
      comparison = `${delta > 0 ? '↑ +' : delta < 0 ? '↓ ' : '↔ '}${delta} نقطة عن الفترة السابقة`;
    }
    return `<a class="command-tile ${state}${demo ? ' demo' : ''}" href="#${href}" data-exec-route><strong>${escape(value || '—')}</strong><span>${escape(label)}</span><small>${target ? `المستهدف ${escape(target)}` : (demo ? 'قيمة تجريبية غير معتمدة' : 'دون مستهدف معتمد في المصدر')}</small><em>${escape(note || comparison)}</em></a>`;
  }
  function render() {
    const main = content('#performance .primary-kpi-score strong');
    const history = [...document.querySelectorAll('#performance .primary-kpi-trend b')].map(el => number(el.textContent));
    const plan = content('#planCompletionRate');
    const planTarget = content('.board-plan-total strong').match(/\d+%/)?.[0] || '';
    const total = content('#performance .workload-total strong');
    const digital = content('#performance .channel-share strong');
    const physical = content('#performance .physical-share strong');
    const call = content('#performance .operational-priority-grid article:first-child strong');
    const callTarget = content('#performance .operational-priority-grid article:first-child .target-achievement b');
    const tajawob = content('#performance .operational-priority-grid article:nth-child(2) strong');
    const tajawobTarget = content('#performance .operational-priority-grid article:nth-child(2) .target-achievement b');
    const satisfaction = content('#performance .contact-satisfaction-metric strong');
    const risks = document.querySelectorAll('#risk-register .risk-card .risk-chip.active').length;
    const projectIds = ['I19', 'I28', 'I34'];
    const projects = (window.SPF_PROJECTS || []).filter(item => projectIds.includes(item.id));
    const inventoryCount = (window.SPF_PROJECTS || []).filter(item => item.status === 'inventory').length;
    const inventoryTab = $('.project-tabs [data-filter="inventory"]');
    const inventoryLabel = `المشاريع والمبادرات · ${inventoryCount}`;
    if (inventoryTab && inventoryTab.textContent !== inventoryLabel) inventoryTab.textContent = inventoryLabel;
    const items = [
      {value:main,label:'التواصل ورضا المستفيدين',previous:history[0],href:'performance'},
      {value:plan,label:'إنجاز الخطة التشغيلية',target:planTarget,href:'operational-plan',unverified:number(plan) === 0, note:number(plan) === 0 ? 'بانتظار إدخال حالات التسليم للتحقق من الإنجاز' : undefined},
      {value:total,label:'الأعمال عبر القنوات الرقمية وغير الرقمية',href:'performance',note:`رقمي ${digital || '—'} · غير رقمي ${physical || '—'}`},
      {value:call,label:'كفاءة استجابة مركز الاتصال',target:callTarget,href:'performance'},
      {value:tajawob,label:'الاستجابة لطلبات تجاوب',target:tajawobTarget,href:'performance'},
      {value:satisfaction,label:'الرضا عن مركز الاتصال',href:'performance'},
      {value:String(risks),label:'المخاطر النشطة',href:'risk-register',note:'راجع الإجراءات التصحيحية في سجل المخاطر'},
      {value:'45%',label:'الصرف من الموازنة المخصصة',href:'operational-plan',demo:true,note:'قيمة تجريبية بانتظار النسبة المعتمدة'},
      {value:String(projects.length),label:'المشاريع محل المتابعة',href:'projects',note:projects.map(item => item.title).join(' · ')}
    ];
    kpis.innerHTML = items.map(tile).join('');
    const late = number(content('#planLateCount')) || 0;
    const pending = number(content('#trackerProgressCount')) || 0;
    const planAlert = number(plan) === 0 && late === 0 ? 'حالات تسليم الخطة بانتظار التحديث' : `${late} مبادرة متأخرة وفق تحديث الخطة`;
    attention.innerHTML = `<strong>يحتاج إلى انتباه الإدارة</strong><div><a href="#work-tracker" data-exec-route>${pending.toLocaleString('en-US')} عملًا قيد الإجراء</a><a href="#operational-plan" data-exec-route>${planAlert}</a><a href="#risk-register" data-exec-route>${risks} مخاطر نشطة</a></div>`;
  }
  const sources = ['#performance', '#operational-plan', '#work-tracker', '#risk-register', '#projects'];
  let queued = false;
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(() => {queued = false; render();}); } };
  sources.forEach(selector => {const node = $(selector); if (node) new MutationObserver(schedule).observe(node, {subtree:true, childList:true, characterData:true});});
  window.addEventListener('storage', schedule);
  render();
})();
