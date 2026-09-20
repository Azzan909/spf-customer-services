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
            <article><span>إجمالي بنود الخطة</span><strong id="planTotalCount">20</strong><small>7 أهداف و13 مبادرة إضافية</small></article>
          </div>''')

replace_required(
    '<p class="plan-data-note">يعرض القسم المستهدفات والمواعيد الواردة في الخطة المرفقة. لم تُدرج نسب إنجاز فعلية لعدم توفرها في المصدر.</p>',
    '<p class="plan-data-note">حدّث حالة التسليم وتاريخه داخل كل مبادرة؛ تُحتسب النتيجة ومؤشرات الإنجاز تلقائيًا وتُحفظ على هذا الجهاز.</p>')
replace_required('آخر تحديث في المصدر · 26 أغسطس 2026', 'آخر تحديث أسبوعي · 17 سبتمبر 2026')

replace_required(
'''            <article class="tracker-rate"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9M10 19V5M16 19v-8M22 19H2"/></svg><span>نسبة البنود المنجزة</span><strong>71%</strong><small>252 من أصل 354 بندًا</small><i><em style="width:71%"></em></i></article>
            <article><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/></svg><span>إجمالي الأعمال</span><strong>354</strong><small>خمسة أقسام تشغيلية</small></article>
            <article><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg><span>منجز</span><strong>252</strong><small>أُغلقت بنودها</small></article>
            <article><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>قيد الإجراء</span><strong>102</strong><small>تتطلب متابعة</small></article>''',
'''            <article class="tracker-rate"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9M10 19V5M16 19v-8M22 19H2"/></svg><span>نسبة البنود المنجزة</span><strong>42%</strong><small>31 من أصل 74 بندًا</small><i><em style="width:42%"></em></i></article>
            <article><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/></svg><span>إجمالي الأعمال</span><strong>74</strong><small>أربعة أقسام تشغيلية</small></article>
            <article><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg><span>منجز</span><strong>31</strong><small>أُغلقت بنودها</small></article>
            <article><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>قيد الإجراء</span><strong>43</strong><small>تتطلب متابعة</small></article>''')

replace_required(
'''            <article><div><span>مركز الاتصال</span><b>102 / 107</b></div><i><em style="width:95%"></em></i><small>95% من البنود منجزة</small></article>
            <article><div><span>التنسيق والمتابعة</span><b>7 / 7</b></div><i><em style="width:100%"></em></i><small>100% من البنود منجزة</small></article>
            <article><div><span>إدارة علاقات المتعاملين</span><b>35 / 42</b></div><i><em style="width:83%"></em></i><small>83% من البنود منجزة</small></article>
            <article><div><span>إدارة وتطوير الخدمات</span><b>72 / 123</b></div><i><em style="width:59%"></em></i><small>59% من البنود منجزة</small></article>
            <article><div><span>شؤون الدوائر والمنافذ</span><b>36 / 75</b></div><i><em style="width:48%"></em></i><small>48% من البنود منجزة</small></article>''',
'''            <article><div><span>مركز الاتصال</span><b>13 / 16</b></div><i><em style="width:81%"></em></i><small>81% من البنود منجزة</small></article>
            <article><div><span>إدارة علاقات المتعاملين</span><b>6 / 6</b></div><i><em style="width:100%"></em></i><small>100% من البنود منجزة</small></article>
            <article><div><span>إدارة وتطوير الخدمات</span><b>4 / 37</b></div><i><em style="width:11%"></em></i><small>11% من البنود منجزة</small></article>
            <article><div><span>شؤون الدوائر والمنافذ</span><b>8 / 15</b></div><i><em style="width:53%"></em></i><small>53% من البنود منجزة</small></article>''')

replace_required(
    '<div class="board-slide-heading"><span>05 · الموقف التنفيذي</span><h2>لوحة واحدة لمتابعة 354 بندًا تشغيليًا</h2><p>قراءة تنفيذية لحالة الأعمال حسب القسم حتى 26 أغسطس 2026.</p></div>',
    '<div class="board-slide-heading"><span>05 · الموقف التنفيذي</span><h2>لوحة واحدة لمتابعة 74 بندًا تشغيليًا</h2><p>قراءة تنفيذية لحالة الأعمال حسب القسم وفق تحديث 17 سبتمبر 2026.</p></div>')
replace_required(
    '<article class="board-maturity"><span>البنود المنجزة</span><strong>71%</strong><i><em style="width:71%"></em></i><div><b>252 منجزًا</b><b>102 قيد الإجراء</b></div></article>',
    '<article class="board-maturity"><span>البنود المنجزة</span><strong>42%</strong><i><em style="width:42%"></em></i><div><b>31 منجزًا</b><b>43 قيد الإجراء</b></div></article>')
replace_required(
    '<div class="board-proof"><article><strong>95%</strong><span>مركز الاتصال</span></article><article><strong>83%</strong><span>علاقات المتعاملين</span></article><article><strong>59%</strong><span>إدارة وتطوير الخدمات</span></article></div>',
    '<div class="board-proof"><article><strong>81%</strong><span>مركز الاتصال</span></article><article><strong>100%</strong><span>علاقات المتعاملين</span></article><article><strong>53%</strong><span>شؤون الدوائر والمنافذ</span></article></div>')
replace_required(
    '<div class="board-portfolio"><article><strong>100%</strong><span>التنسيق والمتابعة</span></article><article><strong>48%</strong><span>شؤون الدوائر والمنافذ</span></article><article><strong>5</strong><span>أقسام ضمن المتابعة</span></article></div>',
    '<div class="board-portfolio"><article><strong>11%</strong><span>إدارة وتطوير الخدمات</span></article><article><strong>4</strong><span>أقسام ضمن المتابعة</span></article><article><strong>74</strong><span>بندًا في التحديث الأسبوعي</span></article></div>')

text = re.sub(r'<script>\(function\(\)\{function c\(\).*?</script>', '', text, flags=re.S)
path.write_text(text, encoding="utf-8")
