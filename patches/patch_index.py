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
    '        <a href="#work-tracker">متابعة الأعمال</a>\n        <a href="#performance">الأداء والمؤشرات</a>',
    '        <a href="#work-tracker">متابعة الأعمال</a>\n        <a href="#risk-register">سجل المخاطر</a>\n        <a href="#performance">الأداء والمؤشرات</a>')
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

risk_section = '''        <section class="section-block risk-register-section" id="risk-register">
          <div class="section-heading">
            <div><span class="section-kicker">07 · سجل المخاطر</span><h2>المخاطر المصاحبة لأنشطة المديرية لعام 2026</h2></div>
            <span class="section-note">4 مخاطر تشغيلية نشطة · آخر تحديث 5 أبريل 2026</span>
          </div>
          <div class="risk-summary" aria-label="الملخص التنفيذي لسجل المخاطر">
            <article><span>إجمالي المخاطر</span><strong>4</strong><small>جميعها نشطة وتشغيلية</small></article>
            <article class="risk-before"><span>متوسط الخطر المتأصل</span><strong>14</strong><small>مرتفع قبل تطبيق الضوابط</small></article>
            <article class="risk-after"><span>متوسط الخطر المتبقي</span><strong>7</strong><small>معتدل بعد تطبيق الضوابط</small></article>
            <article class="risk-reduction"><span>خفض مستوى التعرض</span><strong>52%</strong><small>من 56 إلى 27 نقطة إجمالية</small></article>
          </div>
          <div class="risk-scale" aria-label="مفتاح تصنيف المخاطر"><span><i class="risk-dot high"></i>متأصل كبير</span><span><i class="risk-dot medium"></i>متبقٍ معتدل</span><span><i class="risk-dot active"></i>الحالة: نشط</span><small>اضغط على أي خطر لعرض الضوابط وخطة المعالجة كاملة.</small></div>
          <div class="risk-cards">
            <details class="risk-card" open>
              <summary>
                <span class="risk-ref">R01</span><div class="risk-title"><small>إدارة العمليات التشغيلية لخدمات المتعاملين</small><h3>ارتفاع حجم الأعباء التشغيلية على موظفي خدمات المتعاملين ومركز الاتصال</h3><div><span class="risk-chip">تشغيلي</span><span class="risk-chip active">نشط</span><span class="risk-date">المعالجة المستهدفة: الربع الأول 2027</span></div></div>
                <div class="risk-score-flow"><span class="score inherent"><b>12</b><small>كبير · متأصل</small></span><i>←</i><span class="score residual"><b>6</b><small>معتدل · متبقٍ</small></span></div>
              </summary>
              <div class="risk-detail-grid">
                <article class="risk-description"><h4>وصف الخطر</h4><p>تزايد المهام والمسؤوليات التشغيلية على موظفي خدمات المتعاملين ومركز الاتصال بما يفوق الطاقة التشغيلية، بسبب التغيرات على منظومة الحماية الاجتماعية وعدم كفاية نقل المعرفة من التقسيمات الإدارية؛ بما قد يؤثر في كفاءة الأداء وجودة الخدمات ورضا المتعاملين والسمعة المؤسسية.</p></article>
                <article><h4>التقييم المتأصل</h4><ul class="risk-metrics"><li><span>الاحتمالية</span><b>محتمل · 3</b></li><li><span>الأثر التشغيلي</span><b>عالٍ · 4</b></li><li><span>الأثر الاستراتيجي</span><b>معتدل · 3</b></li><li><span>الأثر المالي</span><b>منخفض · 1</b></li><li><span>أثر الامتثال</span><b>لا ينطبق · 0</b></li></ul></article>
                <article><h4>الضوابط الداخلية · C1</h4><p class="control-name">تعزيز الموارد البشرية والتوعية المجتمعية</p><ul><li>طلب تعزيز المديرية بالتعيين أو الندب أو التدوير الوظيفي أو العقود والتدريب حسب الموارد المتاحة.</li><li>زيادة التوعية باستخدام القنوات الرقمية لتقليل الحضور الشخصي وعبء الأعمال.</li></ul><div class="control-meta"><span>وقائي</span><span>يدوي</span><span>دوري</span><span>التصميم: فعال 3</span><span>التشغيل: فعال جزئيًا 2</span><span>الرقابة: كافية جزئيًا</span></div></article>
                <article><h4>التقييم المتبقي</h4><ul class="risk-metrics"><li><span>الاحتمالية</span><b>نادر · 2</b></li><li><span>الأثر التشغيلي</span><b>معتدل · 3</b></li><li><span>الأثر الاستراتيجي</span><b>لا ينطبق · 0</b></li><li><span>الأثر المالي</span><b>منخفض · 1</b></li><li><span>أثر الامتثال</span><b>لا ينطبق · 0</b></li></ul></article>
                <article class="risk-actions"><h4>الإجراءات الإضافية لمعالجة الخطر</h4><ol><li>العمل مع دائرة رأس المال البشري لاستحداث معايير قياسية تجمع الأبعاد الكمية والنوعية لتحديد الاحتياج، وإدراج المخرجات ضمن آليات الاستقطاب والاختيار الوظيفي.</li><li>تعزيز الكوادر البشرية بالندب أو التدريب أو التعيين أو التدوير لشغل الشواغر المتاحة.</li><li>تمكين موظفي تقديم الخدمة ومركز الاتصال من البيانات والمعلومات في الأنظمة التقنية.</li></ol></article>
                <article class="risk-accountability"><h4>الملكية والمسؤولية</h4><dl><div><dt>مالك الخطر</dt><dd>مدير عام المديرية العامة لخدمات المتعاملين</dd></div><div><dt>مسؤول الخطر والضابط</dt><dd>المديرية العامة لخدمات المتعاملين بالتنسيق مع المديرية العامة للدعم المؤسسي</dd></div><div><dt>مسؤولية التنفيذ</dt><dd>المديرية العامة للدعم المؤسسي، التقسيمات الإدارية المعنية، والمديرية العامة لخدمات المتعاملين</dd></div><div><dt>النطاق</dt><dd>جميع التقسيمات، ودائرة إدارة وتطوير الخدمات، ودوائر الحماية الاجتماعية والمنافذ في المحافظات</dd></div><div><dt>التواريخ</dt><dd>التعرف: 4 نوفمبر 2025 · آخر تحديث: 4 أبريل 2026</dd></div></dl></article>
              </div>
            </details>

            <details class="risk-card">
              <summary>
                <span class="risk-ref">R02</span><div class="risk-title"><small>معالجة طلبات المستفيدين</small><h3>ضعف كفاءة الاستجابة لمعالجة طلبات المتعاملين</h3><div><span class="risk-chip">تشغيلي</span><span class="risk-chip active">نشط</span><span class="risk-date">المعالجة المستهدفة: الربع الثاني 2027</span></div></div>
                <div class="risk-score-flow"><span class="score inherent"><b>16</b><small>كبير · متأصل</small></span><i>←</i><span class="score residual"><b>6</b><small>معتدل · متبقٍ</small></span></div>
              </summary>
              <div class="risk-detail-grid">
                <article class="risk-description"><h4>وصف الخطر</h4><p>ضعف الاستجابة وإنجاز طلبات المتعاملين من التقسيمات الإدارية أو الجهات الخارجية في معاملات المنافع، ومنها منفعة الإعاقة ودعم دخل الأسر والحقيبة المدرسية ومستحقات منافع كبار السن والطفولة وطلبات الاسترداد؛ نتيجة عدم اكتمال الربط بين الجهات المعنية والمديرية، مما يؤثر في سرعة الإنجاز وجودة الخدمة ورضا المتعاملين والتقييم المؤسسي.</p></article>
                <article><h4>التقييم المتأصل</h4><ul class="risk-metrics"><li><span>الاحتمالية</span><b>مرجح · 4</b></li><li><span>الأثر التشغيلي</span><b>عالٍ · 4</b></li><li><span>الأثر الاستراتيجي</span><b>معتدل · 3</b></li><li><span>الأثر المالي</span><b>منخفض · 1</b></li><li><span>أثر الامتثال</span><b>لا ينطبق · 0</b></li></ul></article>
                <article><h4>الضوابط الداخلية · C2</h4><p class="control-name">التنسيق الداخلي ومعالجة طلبات المستفيدين</p><ul><li>المتابعة المستمرة مع التقسيمات والجهات المعنية لتسريع كفاءة الاستجابة.</li><li>تقديم بلاغ عبر نظام الدعم الفني لتنفيذ المعالجات المطلوبة في البيانات.</li><li>المتابعة واتخاذ إجراءات التصعيد المعمول بها.</li></ul><div class="control-meta"><span>تصحيحي</span><span>يدوي</span><span>دوري</span><span>التصميم: فعال جزئيًا 2</span><span>التشغيل: فعال 3</span><span>الرقابة: كافية جزئيًا</span></div></article>
                <article><h4>التقييم المتبقي</h4><ul class="risk-metrics"><li><span>الاحتمالية</span><b>نادر · 2</b></li><li><span>الأثر التشغيلي</span><b>معتدل · 3</b></li><li><span>الأثر الاستراتيجي</span><b>منخفض · 2</b></li><li><span>الأثر المالي</span><b>منخفض · 1</b></li><li><span>أثر الامتثال</span><b>لا ينطبق · 0</b></li></ul></article>
                <article class="risk-actions"><h4>الإجراءات الإضافية لمعالجة الخطر</h4><ol><li>التنسيق مع المديرية العامة للحلول الرقمية ونظم المعلومات لتسريع الربط مع الجهات المعنية.</li><li>إعداد آلية تصعيد واضحة ومتابعة تنفيذها.</li></ol></article>
                <article class="risk-accountability"><h4>الملكية والمسؤولية</h4><dl><div><dt>مالك الخطر</dt><dd>مدير عام المديرية العامة لخدمات المتعاملين</dd></div><div><dt>مسؤول الخطر والضابط</dt><dd>المديرية العامة لخدمات المتعاملين</dd></div><div><dt>مسؤولية التنفيذ</dt><dd>المديرية العامة للحلول الرقمية ونظم المعلومات، المديرية العامة لخدمات المتعاملين، ودائرة التخطيط ومتابعة الرؤية</dd></div><div><dt>النطاق</dt><dd>جميع التقسيمات، ودائرة إدارة وتطوير الخدمات، ودوائر الحماية الاجتماعية والمنافذ في المحافظات</dd></div><div><dt>التواريخ</dt><dd>التعرف: 4 نوفمبر 2025 · آخر تحديث: 4 أبريل 2026</dd></div></dl></article>
              </div>
            </details>

            <details class="risk-card">
              <summary>
                <span class="risk-ref">R03</span><div class="risk-title"><small>إدارة العمليات التشغيلية لخدمات المتعاملين</small><h3>توقف قنوات تقديم الخدمات</h3><div><span class="risk-chip">تشغيلي</span><span class="risk-chip active">نشط</span><span class="risk-date urgent">المعالجة المستهدفة: الربع الرابع 2026</span></div></div>
                <div class="risk-score-flow"><span class="score inherent"><b>16</b><small>كبير · متأصل</small></span><i>←</i><span class="score residual"><b>9</b><small>معتدل · متبقٍ</small></span></div>
              </summary>
              <div class="risk-detail-grid">
                <article class="risk-description"><h4>وصف الخطر</h4><p>توقف الخدمات المقدمة للمتعاملين عبر الموقع الإلكتروني ومركز الاتصال والتطبيق الإلكتروني ووسائل التواصل الاجتماعي ونظام «ثقة»، إضافة إلى توقف أو تأثر مواقع تقديم الخدمات المباشرة بسبب انقطاع الإنترنت أو الكهرباء أو العوامل الطبيعية مثل الأعاصير والأمراض المعدية أو أي ظروف طارئة واستثنائية.</p></article>
                <article><h4>التقييم المتأصل</h4><ul class="risk-metrics"><li><span>الاحتمالية</span><b>مرجح · 4</b></li><li><span>الأثر التشغيلي</span><b>عالٍ · 4</b></li><li><span>الأثر الاستراتيجي</span><b>منخفض · 2</b></li><li><span>الأثر المالي</span><b>منخفض · 1</b></li><li><span>أثر الامتثال</span><b>لا ينطبق · 0</b></li></ul></article>
                <article><h4>الضوابط الداخلية · C3</h4><p class="control-name">استمرارية الأعمال</p><ul><li>العمل عن بعد عند انقطاع الكهرباء وفي الحالات الاستثنائية للوظائف الملائمة.</li><li>تشغيل الحد الأدنى من العمليات واستخدام النماذج اليدوية كبدائل.</li><li>التنسيق مع دوائر المحافظات لتوفير مواقع بديلة لاستقبال المتعاملين.</li><li>إشعار المتعاملين بتوقف الخدمة عبر الوسائل الإعلامية.</li><li>تفعيل خطة استمرارية الأعمال والتوعية بالقنوات الرقمية البديلة.</li></ul><div class="control-meta"><span>تصحيحي</span><span>آلي</span><span>دوري</span><span>التصميم: فعال جزئيًا 2</span><span>التشغيل: فعال جزئيًا 2</span><span>الرقابة: كافية جزئيًا</span></div></article>
                <article><h4>التقييم المتبقي</h4><ul class="risk-metrics"><li><span>الاحتمالية</span><b>محتمل · 3</b></li><li><span>الأثر التشغيلي</span><b>معتدل · 3</b></li><li><span>الأثر الاستراتيجي</span><b>منخفض · 2</b></li><li><span>الأثر المالي</span><b>منخفض · 1</b></li><li><span>أثر الامتثال</span><b>لا ينطبق · 0</b></li></ul></article>
                <article class="risk-actions"><h4>الإجراءات الإضافية لمعالجة الخطر</h4><ol><li>استخدام مولد كهربائي لضمان استمرارية تقديم الخدمة في الدوائر.</li><li>تعزيز التوعية والاستعانة بدليل الاستجابة السريعة للمخاطر الصحية والنفسية والعامة والمرتبطة بالأنظمة، بالتنسيق مع دائرة الحوكمة وإدارة المخاطر والامتثال.</li></ol></article>
                <article class="risk-accountability"><h4>الملكية والمسؤولية</h4><dl><div><dt>مالك الخطر</dt><dd>مدير عام المديرية العامة لخدمات المتعاملين</dd></div><div><dt>مسؤول الخطر والضابط</dt><dd>المديرية العامة لخدمات المتعاملين</dd></div><div><dt>مسؤولية التنفيذ</dt><dd>المديرية العامة لخدمات المتعاملين، المديرية العامة للحلول الرقمية ونظم المعلومات، دائرة الحوكمة وإدارة المخاطر والامتثال، ودائرة التواصل والإعلام</dd></div><div><dt>النطاق</dt><dd>دوائر الحماية الاجتماعية بالمحافظات، ودائرة إدارة وتطوير الخدمات، والدوائر والمنافذ</dd></div><div><dt>التواريخ</dt><dd>التعرف: 4 ديسمبر 2025 · آخر تحديث: 5 أبريل 2026</dd></div></dl></article>
              </div>
            </details>

            <details class="risk-card">
              <summary>
                <span class="risk-ref">R04</span><div class="risk-title"><small>إدارة إطلاق وتعميم البرامج التأمينية</small><h3>عدم جاهزية مقدم الخدمة وموظفي مركز الاتصال عند إطلاق برامج وتحديثات جديدة</h3><div><span class="risk-chip">تشغيلي</span><span class="risk-chip active">نشط</span><span class="risk-date">المعالجة المستهدفة: الربع الأول 2027</span></div></div>
                <div class="risk-score-flow"><span class="score inherent"><b>12</b><small>كبير · متأصل</small></span><i>←</i><span class="score residual"><b>6</b><small>معتدل · متبقٍ</small></span></div>
              </summary>
              <div class="risk-detail-grid">
                <article class="risk-description"><h4>وصف الخطر</h4><p>عدم إشراك مديرية خدمات المتعاملين عند إطلاق برامج أو تنفيذ تحديثات على الأنظمة دون تنسيق مسبق وكافٍ، مما يؤدي إلى عدم جاهزية مقدمي الخدمة وموظفي مركز الاتصال ومنصة تجاوب وحساب العناية بالمتعاملين في منصة «إكس» من حيث التأهيل والتدريب، ويرفع الضغط التشغيلي ويؤثر سلبًا في جودة الخدمة ورضا المتعاملين وسمعة الصندوق وتقييمه المؤسسي.</p></article>
                <article><h4>التقييم المتأصل</h4><ul class="risk-metrics"><li><span>الاحتمالية</span><b>محتمل · 3</b></li><li><span>الأثر التشغيلي</span><b>معتدل · 3</b></li><li><span>الأثر الاستراتيجي</span><b>عالٍ · 4</b></li><li><span>الأثر المالي</span><b>منخفض · 1</b></li><li><span>أثر الامتثال</span><b>لا ينطبق · 0</b></li></ul></article>
                <article><h4>الضوابط الداخلية · C4</h4><p class="control-name">التواصل الداخلي وبناء القدرات التشغيلية</p><p>بعد اطلاع المديرية بالمستجدات، يجري التنسيق الفوري مع التقسيمات المعنية وعقد لقاءات لموظفي خدمات المتعاملين ومركز الاتصال لشرح المستجدات وتعزيز الفهم والتطبيق الصحيح للإجراءات وضمان الجاهزية.</p><div class="control-meta"><span>وقائي</span><span>يدوي</span><span>دوري</span><span>التصميم: فعال 3</span><span>التشغيل: فعال جزئيًا 2</span><span>الرقابة: كافية جزئيًا</span></div></article>
                <article><h4>التقييم المتبقي</h4><ul class="risk-metrics"><li><span>الاحتمالية</span><b>نادر · 2</b></li><li><span>الأثر التشغيلي</span><b>معتدل · 3</b></li><li><span>الأثر الاستراتيجي</span><b>منخفض · 2</b></li><li><span>الأثر المالي</span><b>منخفض · 1</b></li><li><span>أثر الامتثال</span><b>لا ينطبق · 0</b></li></ul></article>
                <article class="risk-actions"><h4>الإجراءات الإضافية لمعالجة الخطر</h4><ol><li>إعداد منهجية واضحة للخدمات والبرامج الجديدة والمنقولة من جهات خارجية، ودورة مستندية للتعاميم تضمن وضوح الإجراءات والمتابعة والتنفيذ.</li><li>إعداد مواد إعلامية توضّح تسلسل الإجراءات والرسائل المطلوب نشرها، بالتنسيق مع التقسيمات المختصة.</li><li>إعداد أدلة إرشادية وتنفيذ ورش عمل لمقدمي الخدمة وموظفي مركز الاتصال قبل إطلاق البرامج أو القرارات الجديدة.</li></ol></article>
                <article class="risk-accountability"><h4>الملكية والمسؤولية</h4><dl><div><dt>مالك الخطر</dt><dd>مدير عام المديرية العامة لخدمات المتعاملين</dd></div><div><dt>مسؤول الخطر والضابط</dt><dd>المديرية العامة لخدمات المتعاملين</dd></div><div><dt>مسؤولية التنفيذ</dt><dd>التقسيمات الإدارية المعنية، دائرة التواصل والإعلام، ودائرة التخطيط ومتابعة الرؤية</dd></div><div><dt>النطاق</dt><dd>جميع التقسيمات، ودائرة إدارة وتطوير الخدمات، ودوائر الحماية الاجتماعية والمنافذ في المحافظات</dd></div><div><dt>التواريخ</dt><dd>التعرف: 4 نوفمبر 2025 · آخر تحديث: 4 أبريل 2026</dd></div></dl></article>
              </div>
            </details>
          </div>
          <p class="risk-source-note">المصدر: سجل المخاطر المصاحبة لأنشطة المديرية العامة لخدمات المتعاملين لعام 2026م. التصنيف المتأصل لجميع المخاطر «كبير»، والتصنيف المتبقي لجميعها «معتدل» بعد تطبيق الضوابط.</p>
        </section>

'''

replace_required('        <section class="section-block" id="performance">', risk_section + '        <section class="section-block" id="performance">')
replace_required('07 · الأداء وحجم الأعمال', '08 · الأداء وحجم الأعمال')
replace_required('08 · منصة تجاوب', '09 · منصة تجاوب')
replace_required('09 · الحضور المؤسسي', '10 · الحضور المؤسسي')
replace_required('10 · محفظة التطوير', '11 · محفظة التطوير')
replace_required('11 · الريادة والشراكة المجتمعية', '12 · الريادة والشراكة المجتمعية')

performance_section = '''        <section class="section-block performance-priority" id="performance">
          <div class="section-heading">
            <div><span class="section-kicker">08 · الأداء والمؤشرات</span><h2>المؤشر الرئيسي للمديرية ثم الأداء التشغيلي وحجم الأعمال</h2></div>
            <span class="section-note">يناير–يونيو 2026</span>
          </div>
          <svg class="performance-icon-sprite" aria-hidden="true">
            <symbol id="pi-heart" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></symbol>
            <symbol id="pi-message" viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 8h8M8 12h5"/></symbol>
            <symbol id="pi-headset" viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0 1 16 0v2M18 19h-2v-6h4v4a2 2 0 0 1-2 2ZM6 19H4a2 2 0 0 1-2-2v-4h4v6ZM18 19c0 2-2 3-5 3"/></symbol>
            <symbol id="pi-inbox" viewBox="0 0 24 24"><path d="M4 4h16v16H4zM4 14h4l2 3h4l2-3h4"/></symbol>
            <symbol id="pi-layers" viewBox="0 0 24 24"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></symbol>
            <symbol id="pi-digital" viewBox="0 0 24 24"><rect x="3" y="3" width="14" height="12" rx="2"/><path d="M8 21h8M12 15v6M19 8h2v11h-5"/></symbol>
            <symbol id="pi-building" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h1M14 10h1M9 14h1M14 14h1M10 21v-3h4v3"/></symbol>
            <symbol id="pi-chart" viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></symbol>
            <symbol id="pi-bot" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M12 3v4M8 12h.01M16 12h.01M8 16h8"/></symbol>
            <symbol id="pi-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
            <symbol id="pi-timer" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M9 2h6M12 5v2M18 7l2-2M12 13l3-2"/></symbol>
            <symbol id="pi-smile" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 10h.01M16 10h.01M8 15c1.2 1.3 2.5 2 4 2s2.8-.7 4-2"/></symbol>
          </svg>

          <article class="primary-kpi-hero" aria-label="مؤشر التواصل ورضا المستفيدين">
            <div class="primary-kpi-copy">
              <span>المؤشر المؤسسي الرئيسي للمديرية</span>
              <h3>مؤشر التواصل ورضا المستفيدين</h3>
              <div class="primary-kpi-trend" aria-label="تحسن المؤشر من 82 إلى 86 بالمئة"><div><b>82%</b><i>منتصف 2025</i></div><span><em>+4</em><u></u></span><div><b>86%</b><i>النصف الأول 2026</i></div></div>
            </div>
            <div class="primary-kpi-score"><div class="score-ring"><strong>86%</strong><span>النتيجة المعتمدة</span></div><small>التقييم العام · جيد</small></div>
          </article>

          <div class="kpi-components" aria-label="مكونات المؤشر الرئيسي وأوزانها">
            <article class="component-card satisfaction-component">
              <div class="component-head"><div class="icon-title"><svg class="card-icon"><use href="#pi-heart"/></svg><div><span>المكوّن الأول</span><h3>مؤشر رضا المستفيدين</h3></div></div><b>70%<small>الوزن</small></b></div>
              <div class="component-result"><div class="component-ring" style="--value:86"><strong>86%</strong><span>النتيجة</span></div></div>
              <div class="quarter-comparison"><div><span>الربع الأول</span><b>82%</b></div><div><span>الربع الثاني</span><b>87%</b><small>↑ 5 نقاط</small></div></div>
              <div class="satisfaction-sources">
                <span>المؤشرات الفرعية المعتمدة</span>
                <div><article><i>01</i><b>المركز الوطني للإحصاء والمعلومات</b><small>وفق مؤشرات المركز</small></article><article><i>02</i><b>وزارة العمل</b><small>وفق مؤشرات الوزارة</small></article><article><i>03</i><b>منصة تجاوب</b><small>المقترحات والشكاوى والبلاغات</small></article></div>
              </div>
            </article>
            <article class="component-card communication-component">
              <div class="component-head"><div class="icon-title"><svg class="card-icon gold-icon"><use href="#pi-message"/></svg><div><span>المكوّن الثاني</span><h3>مؤشر التواصل والتفاعل</h3></div></div><b>30%<small>الوزن</small></b></div>
              <div class="component-result"><div class="component-ring gold-ring" style="--value:88"><strong>88%</strong><span>النتيجة</span></div></div>
              <div class="quarter-comparison"><div><span>الربع الأول</span><b>90%</b></div><div><span>الربع الثاني</span><b>86%</b><small>انخفاض 4 نقاط</small></div></div>
            </article>
          </div>

          <div class="performance-tier-heading"><div><span>المستوى الثاني</span><h3>المؤشرات التشغيلية ذات الأولوية</h3></div><small>مؤشران مباشران لكفاءة الاستجابة</small></div>
          <div class="operational-priority-grid">
            <article><div class="operational-rank"><svg class="card-icon"><use href="#pi-headset"/></svg></div><div><span>كفاءة استجابة مركز الخدمة الهاتفية</span><strong>100%</strong></div><div class="target-achievement target-ring" style="--target:90"><b>90%</b><small>المستهدف</small><em>+10</em></div></article>
            <article><div class="operational-rank"><svg class="card-icon"><use href="#pi-inbox"/></svg></div><div><span>الاستجابة لطلبات منصة تجاوب</span><strong>100%</strong></div><div class="target-achievement target-ring" style="--target:85"><b>85%</b><small>المستهدف</small><em>+15</em></div></article>
          </div>

          <div class="performance-tier-heading workload-heading"><div><span>المستوى الثالث</span><h3>حجم الأعمال حسب قناة تقديم الخدمة</h3></div><small>تفاصيل تشغيلية بعد المؤشرات الرئيسية</small></div>
          <div class="workload-overview">
            <article class="workload-total"><svg class="summary-icon"><use href="#pi-layers"/></svg><span>إجمالي حجم الأعمال</span><strong>452,453</strong><small>خدمة خلال ستة أشهر · 3,428 خدمة يوميًا</small></article>
            <article class="channel-share"><div class="performance-share-ring" style="--share:62"><svg class="ring-icon"><use href="#pi-digital"/></svg><b>62%</b></div><div><span>القنوات الرقمية</span><strong>279,580</strong><small>من إجمالي الأعمال</small></div></article>
            <article class="channel-share physical-share"><div class="performance-share-ring" style="--share:38"><svg class="ring-icon"><use href="#pi-building"/></svg><b>38%</b></div><div><span>القنوات غير الرقمية</span><strong>172,873</strong><small>من إجمالي الأعمال</small></div></article>
          </div>

          <div class="workload-groups">
            <article class="workload-group branches-workload">
              <div class="workload-group-head"><div class="icon-title"><svg class="card-icon"><use href="#pi-building"/></svg><div><span>دوائر ومنافذ المحافظات</span><h3>الوصول والخدمات المباشرة</h3></div></div><b>6 مؤشرات</b></div>
              <div class="workload-metrics visual-metrics"><div style="--v:62"><span>حجوزات المواعيد</span><strong>94,081</strong><i></i><small>713 يوميًا</small></div><div style="--v:100"><span>استخدام تقييم QR</span><strong>151,117</strong><i></i><small>الأعلى حجمًا</small></div><div style="--v:16"><span>الخدمات الميدانية</span><strong>24,773</strong><i></i><small>188 يوميًا</small></div><div style="--v:3"><span>الخدمات الاستباقية</span><strong>4,294</strong><i></i><small>33 يوميًا</small></div><div style="--v:11"><span>الخدمات الذاتية</span><strong>17,160</strong><i></i><small>130 يوميًا</small></div><div style="--v:1"><span>الأنشطة الإعلامية</span><strong>313</strong><i></i><small>52 شهريًا</small></div></div>
            </article>
            <article class="workload-group contact-workload">
              <div class="workload-group-head"><div class="icon-title"><svg class="card-icon"><use href="#pi-headset"/></svg><div><span>مركز الاتصال</span><h3>المكالمات وجودة الاستجابة</h3></div></div><b>184,197 مكالمة</b></div>
              <div class="contact-workload-lead"><svg class="contact-lead-icon"><use href="#pi-headset"/></svg><strong>184,197</strong><span>مكالمة مستلمة خلال ستة أشهر</span></div>
              <div class="workload-metrics compact contact-visual-metrics"><div><svg class="contact-metric-icon"><use href="#pi-clock"/></svg><span>متوسط الانتظار</span><strong>52</strong><small>ثانية</small></div><div><svg class="contact-metric-icon"><use href="#pi-timer"/></svg><span>متوسط المكالمة</span><strong>3:15</strong><small>دقيقة</small></div><div><svg class="contact-metric-icon"><use href="#pi-smile"/></svg><span>الرضا عن الخدمة الهاتفية</span><strong>86.7%</strong><small>نتيجة القياس</small></div></div>
            </article>
            <article class="workload-group digital-workload">
              <div class="workload-group-head"><div class="icon-title"><svg class="card-icon gold-icon"><use href="#pi-bot"/></svg><div><span>القنوات التفاعلية</span><h3>المساعد الذكي ومنصات التواصل</h3></div></div><b>42,803 خدمة</b></div>
              <div class="digital-workload-row"><div><img src="assets/channels/whatsapp.png" alt=""><span>المساعد الذكي وواتساب</span><strong>40,736</strong></div><div><img src="assets/channels/x.png" alt=""><span>منصة X</span><strong>2,067</strong></div></div>
            </article>
          </div>
        </section>'''

text, performance_replacements = re.subn(
    r'        <section class="section-block" id="performance">.*?        </section>',
    performance_section,
    text,
    count=1,
    flags=re.S,
)
if performance_replacements != 1:
    raise SystemExit("Expected the performance section once")

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
