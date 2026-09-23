from pathlib import Path
import re
import sys


path = Path(sys.argv[1])
text = path.read_text(encoding="utf-8")


def replace_required(old, new):
    global text
    if old not in text:
        raise SystemExit(f"Expected dashboard fragment not found: {old[:80]}")
    text = text.replace(old, new, 1)


replace_required(
    '<meta name="description" content="منصة المديرية العامة لخدمات المتعاملين بصندوق الحماية الاجتماعية" />',
    '<meta name="description" content="بوصلة المتعامل — المنصة التنفيذية للمديرية العامة لخدمات المتعاملين بصندوق الحماية الاجتماعية" />')
replace_required(
    '<title>خدمات المتعاملين | العرض المؤسسي</title>',
    '<title>بوصلة المتعامل | المنصة التنفيذية لخدمات المتعاملين</title>')
replace_required(
'''        <div class="page-heading">
          <span class="eyebrow">صندوق الحماية الاجتماعية · سلطنة عُمان</span>
          <h1>المديرية العامة لخدمات المتعاملين</h1>
        </div>''',
'''        <div class="page-heading platform-identity">
          <span class="eyebrow">صندوق الحماية الاجتماعية · سلطنة عُمان</span>
          <h1>بوصلة المتعامل</h1>
          <small>المنصة التنفيذية للمديرية العامة لخدمات المتعاملين</small>
        </div>''')


replace_required(
'''          <div class="plan-summary">
            <article><span>إجمالي بنود الخطة</span><strong>20</strong><small>هدفًا ومبادرة</small></article>
            <article><span>الأهداف التشغيلية</span><strong>7</strong><small>أهداف رئيسية مفصلة</small></article>
            <article><span>المبادرات الإضافية</span><strong>13</strong><small>هدفًا داعمًا</small></article>
            <article class="plan-target"><span>المستهدف العام</span><strong>90% فأكثر</strong><small>إنجاز الخطة التشغيلية</small></article>
          </div>''',
'''          <div class="plan-summary plan-hero-kpis" aria-label="مؤشرات إنجاز الخطة التشغيلية">
            <article class="plan-target"><span>نسبة إنجاز الخطة</span><strong id="planCompletionRate">0%</strong><small>المبادرات المسلّمة من إجمالي الخطة</small></article>
            <article class="plan-kpi-on-time"><span>سُلّمت في الوقت المحدد</span><strong id="planOnTimeCount">0</strong><small>تحقق أو تفوق التوقعات</small></article>
            <article class="plan-kpi-late"><span>المبادرات المتأخرة</span><strong id="planLateCount">0</strong><small>تسليم متأخر أو تجاوز الموعد</small></article>
            <article><span>إجمالي بنود الخطة</span><strong id="planTotalCount">22</strong><small>9 أهداف و13 مبادرة إضافية</small></article>
          </div>''')

replace_required(
    '<button class="btn secondary" id="updateGuide">دليل التحديث</button>',
    '<button class="btn secondary" id="privacyLockButton">قفل العرض</button>\n          <button class="btn secondary" id="updateGuide">دليل التحديث</button>')
replace_required('الأهداف التشغيلية السبعة', 'الأهداف التشغيلية التسعة')
replace_required('سبعة أهداف رئيسية تقود التنفيذ', 'تسعة أهداف رئيسية تقود التنفيذ')

replace_required(
'''            <article class="method-application">
              <span>كيف تُطبّقها المديرية؟</span>
              <div><b>100%</b><small>تحليل شهري للشكاوى</small></div>
              <div><b>277+</b><small>ملف معرفة وأدلة خدمة</small></div>
              <ul><li>تقارير الرؤى السلوكية وشخصيات المتعاملين</li><li>تصميم الخدمات حول رحلة المتعامل وأحداث الحياة</li><li>خيار بشري وإتاحة شاملة في القنوات الرقمية</li><li>قياس التجربة والتحسين وفق النتائج</li></ul>
            </article>''',
'''            <article class="method-application">
              <span>كيف تطبّق المديرية مركزية المتعامل عمليًا؟</span>
              <p class="application-intro">مسار عمل متكرر يبدأ بصوت المتعامل وينتهي بتحسين قابل للقياس.</p>
              <ol class="application-steps">
                <li><b>1</b><div><strong>نستمع</strong><small>نجمع الشكاوى والمقترحات ونتائج الرضا.</small></div></li>
                <li><b>2</b><div><strong>نحلّل</strong><small>نحدد أكثر نقاط الألم تكرارًا وأسبابها.</small></div></li>
                <li><b>3</b><div><strong>نحسّن</strong><small>نبسّط الإجراء ونحدّث المعرفة والقنوات.</small></div></li>
                <li><b>4</b><div><strong>نقيس</strong><small>نقارن النتيجة بالمؤشر ونصحح المسار.</small></div></li>
              </ol>
              <div class="application-proof"><div><b>100%</b><small>تحليل شهري للشكاوى</small></div><div><b>277+</b><small>ملف معرفة ودليل خدمة</small></div></div>
            </article>''')

replace_required(
    '<p class="plan-data-note">يعرض القسم المستهدفات والمواعيد الواردة في الخطة المرفقة. لم تُدرج نسب إنجاز فعلية لعدم توفرها في المصدر.</p>',
    '<p class="plan-data-note">حدّث حالة التسليم وتاريخه داخل كل مبادرة؛ تُحتسب النتيجة ومؤشرات الإنجاز تلقائيًا وتُحفظ على هذا الجهاز.</p>')
replace_required('آخر تحديث في المصدر · 26 أغسطس 2026', 'آخر تحديث أسبوعي · 17 سبتمبر 2026')

replace_required(
'''            <article class="tracker-rate"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9M10 19V5M16 19v-8M22 19H2"/></svg><span>نسبة البنود المنجزة</span><strong>71%</strong><small>252 من أصل 354 بندًا</small><i><em style="width:71%"></em></i></article>
            <article><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/></svg><span>إجمالي الأعمال</span><strong>354</strong><small>خمسة أقسام تشغيلية</small></article>
            <article><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg><span>منجز</span><strong>252</strong><small>أُغلقت بنودها</small></article>
            <article><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>قيد الإجراء</span><strong>102</strong><small>تتطلب متابعة</small></article>''',
'''            <article class="tracker-rate"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9M10 19V5M16 19v-8M22 19H2"/></svg><span>نسبة البنود المنجزة</span><strong id="trackerRate">71%</strong><small id="trackerRateSummary">252 من أصل 354 بندًا</small><i><em id="trackerRateBar" style="width:71%"></em></i></article>
            <article><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/></svg><span>إجمالي الأعمال</span><strong id="trackerTotalCount">354</strong><small id="trackerCountSummary">خمسة أقسام تشغيلية</small></article>
            <article><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg><span>منجز</span><strong id="trackerDoneCount">252</strong><small>أُغلقت بنودها</small></article>
            <article><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>قيد الإجراء</span><strong id="trackerProgressCount">102</strong><small>تتطلب متابعة</small></article>''')

replace_required(
    '''            <article><div><span>مركز الاتصال</span><b>102 / 107</b></div><i><em style="width:95%"></em></i><small>95% من البنود منجزة</small></article>
            <article><div><span>التنسيق والمتابعة</span><b>7 / 7</b></div><i><em style="width:100%"></em></i><small>100% من البنود منجزة</small></article>
            <article><div><span>إدارة علاقات المتعاملين</span><b>35 / 42</b></div><i><em style="width:83%"></em></i><small>83% من البنود منجزة</small></article>
            <article><div><span>إدارة وتطوير الخدمات</span><b>72 / 123</b></div><i><em style="width:59%"></em></i><small>59% من البنود منجزة</small></article>
            <article><div><span>شؤون الدوائر والمنافذ</span><b>36 / 75</b></div><i><em style="width:48%"></em></i><small>48% من البنود منجزة</small></article>''',
    '''            <article data-tracker-dept="contact"><div><span>مركز الاتصال</span><b class="tracker-dept-ratio">102 / 107</b></div><i><em style="width:95%"></em></i><small>95% من البنود منجزة</small></article>
            <article data-tracker-dept="coord"><div><span>التنسيق والمتابعة</span><b class="tracker-dept-ratio">7 / 7</b></div><i><em style="width:100%"></em></i><small>100% من البنود منجزة</small></article>
            <article data-tracker-dept="crm"><div><span>إدارة علاقات المتعاملين</span><b class="tracker-dept-ratio">35 / 42</b></div><i><em style="width:83%"></em></i><small>83% من البنود منجزة</small></article>
            <article data-tracker-dept="service-dev"><div><span>إدارة وتطوير الخدمات</span><b class="tracker-dept-ratio">72 / 123</b></div><i><em style="width:59%"></em></i><small>59% من البنود منجزة</small></article>
            <article data-tracker-dept="branches"><div><span>شؤون الدوائر والمنافذ</span><b class="tracker-dept-ratio">36 / 75</b></div><i><em style="width:48%"></em></i><small>48% من البنود منجزة</small></article>''')

replace_required(
    '<div class="board-slide-heading"><span>05 · الموقف التنفيذي</span><h2>لوحة واحدة لمتابعة 354 بندًا تشغيليًا</h2><p>قراءة تنفيذية لحالة الأعمال حسب القسم حتى 26 أغسطس 2026.</p></div>',
    '<div class="board-slide-heading"><span>05 · الموقف التنفيذي</span><h2>لوحة واحدة لمتابعة 354 بندًا تشغيليًا</h2><p>قراءة تنفيذية لحالة الأعمال حسب القسم وفق تحديث 17 سبتمبر 2026.</p></div>')
replace_required(
    '<article class="board-maturity"><span>البنود المنجزة</span><strong>71%</strong><i><em style="width:71%"></em></i><div><b>252 منجزًا</b><b>102 قيد الإجراء</b></div></article>',
    '<article class="board-maturity"><span>البنود المنجزة</span><strong id="boardRate">71%</strong><i><em id="boardRateBar" style="width:71%"></em></i><div><b id="boardDone">252 منجزًا</b><b id="boardProgress">102 قيد الإجراء</b></div></article>')
replace_required(
    '<div class="board-proof"><article><strong>95%</strong><span>مركز الاتصال</span></article><article><strong>83%</strong><span>علاقات المتعاملين</span></article><article><strong>59%</strong><span>إدارة وتطوير الخدمات</span></article></div>',
    '<div class="board-proof"><article data-board-dept="contact"><strong>95%</strong><span>مركز الاتصال</span></article><article data-board-dept="crm"><strong>83%</strong><span>علاقات المتعاملين</span></article><article data-board-dept="branches"><strong>48%</strong><span>شؤون الدوائر والمنافذ</span></article></div>')
replace_required(
    '<div class="board-portfolio"><article><strong>100%</strong><span>التنسيق والمتابعة</span></article><article><strong>48%</strong><span>شؤون الدوائر والمنافذ</span></article><article><strong>5</strong><span>أقسام ضمن المتابعة</span></article></div>',
    '<div class="board-portfolio"><article data-board-dept="service-dev"><strong>59%</strong><span>إدارة وتطوير الخدمات</span></article><article id="boardDeptCount"><strong>5</strong><span>أقسام ضمن المتابعة</span></article><article id="boardTotalItems"><strong>354</strong><span>بندًا في التحديث الأسبوعي</span></article></div>')

privacy_modal = '''  <div class="modal" id="privacyLockModal" aria-hidden="true"><div class="modal-backdrop" data-close-privacy></div><article class="modal-panel wide privacy-panel" role="dialog" aria-modal="true" aria-labelledby="privacyLockTitle"><button class="modal-close" data-close-privacy aria-label="إغلاق">×</button><span class="modal-status">خصوصية العرض على هذا الجهاز</span><h2 id="privacyLockTitle">قفل أو تشويش تبويبات مختارة</h2><p class="privacy-note">هذا قفل عرض مناسب للاجتماعات والعروض، ولا يُعد بديلًا عن نظام دخول مؤسسي لأن الموقع الحالي صفحة عامة.</p><div class="privacy-grid" id="privacyTabChoices"></div><div class="privacy-pin"><label><span>رمز العرض</span><input id="privacyPin" type="password" inputmode="numeric" autocomplete="new-password" placeholder="أدخل 4 أرقام أو أكثر"></label><label><span>تأكيد الرمز</span><input id="privacyPinConfirm" type="password" inputmode="numeric" autocomplete="new-password" placeholder="أعد إدخال الرمز"></label></div><div class="privacy-actions"><button class="btn primary" id="savePrivacyLock">حفظ القفل</button><button class="btn secondary" id="clearPrivacyLock">إلغاء جميع الأقفال</button></div><div class="excel-import-status" id="privacyStatus" role="status" aria-live="polite"></div></article></div>

'''

replace_required(
    '  <script src="assets/data.js"></script>',
    privacy_modal + '  <script src="assets/data.js"></script>\n  <script src="assets/plan-data-2026.js"></script>')
replace_required(
    '<a class="btn secondary" href="assets/work-tracker.html" target="_blank" rel="noopener">فتح بالحجم الكامل</a>',
    '<a class="btn secondary" href="assets/work-tracker.html" target="_blank" rel="noopener">فتح وتحديث البيان التفصيلي</a>')
replace_required(
    '  <script src="assets/app.js"></script>',
    '  <script src="assets/app.js"></script>\n  <script src="assets/privacy-lock.js"></script>')

text = re.sub(r'<script>\(function\(\)\{function c\(\).*?</script>', '', text, flags=re.S)
path.write_text(text, encoding="utf-8")
