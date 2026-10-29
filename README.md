# NTS Billing Portal - Test Automation Project

مشروع أتمتة اختبارات الجودة (QA Automation) المتكامل والشامل لنظام الفواتير والتحصيل **NTS Billing** المبني على **Oracle APEX** باستخدام إطار العمل الحديث **Playwright**.

---

## 📌 تغطية الفحوصات والوحدات المنجزة

تمت تغطية الشاشات عبر سيناريوهات فحص مؤتمتة متسلسلة تتعامل بدقة مع عناصر Oracle APEX المعقدة (Popup LOVs, iFrames, Modal Dialogs, Cascading Filters, Master-Detail Grids):

### 📑 قائمة ملفات الفحص والوحدات المغطاة:

#### 1. بوابة تسجيل الدخول (Authentication)
| # | الشاشة | ملف الفحص | السيناريوهات المغطاة |
|---|---|---|---|
| 1 | **تسجيل الدخول** | [apex-login.spec.js](file:///c:/Users/Yasmine/Desktop/nts/apex-login.spec.js) | فحص البيانات الخاطئة، الحقول الفارغة، تسجيل الدخول الناجح واختيار التطبيق |

#### 2. وحدة ترميز التوزيع الجغرافي (Geographic Coding)
| # | الشاشة | ملف الفحص | السيناريوهات المغطاة |
|---|---|---|---|
| 2 | **ترميز المحافظات** | [geo-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/geo-coding.spec.js) | فحص الحقول الفارغة، محاكاة التكرار، إضافة محافظة جديدة بنجاح |
| 3 | **ترميز القضاء-المركز** | [district-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/district-coding.spec.js) | فحص إلزامية اختيار المحافظة أولاً، إضافة قضاء للمحافظة المحددة، الحقول الفارغة |
| 4 | **ترميز المناطق** | [area-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/area-coding.spec.js) | فحص إلزامية المحافظة والقضاء، إضافة منطقة جديدة بالتسلسل، الحقول الفارغة |
| 5 | **ترميز المحلة** | [mahalla-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/mahalla-coding.spec.js) | فحص إلزامية الفلاتر الثلاثة (محافظة، قضاء، منطقة)، إضافة محلة جديدة، الحقول الفارغة |
| 6 | **ترميز الأزقة** | [alley-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/alley-coding.spec.js) | فحص إلزامية الفلاتر الأربعة، إضافة زقاق جديد، فحص رسائل الخطأ |
| 7 | **ترميز الدار** | [house-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/house-coding.spec.js) | فحص الفلاتر الخمسة المتسلسلة، إضافة دار جديدة، التحقق من صحة الحقول الرقمية |
| 8 | **ترميز أنواع الدار** | [house-type-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/house-type-coding.spec.js) | فحص الحقول الإلزامية في النافذة المنبثقة، إضافة نوع دار جديد، فحص زر الإلغاء |

#### 3. وحدة ترميز الأصناف والعدادات (Items & Meters Coding)
| # | الشاشة | ملف الفحص | السيناريوهات المغطاة |
|---|---|---|---|
| 9 | **ترميز وحدات القياس** | [units-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/units-coding.spec.js) | فحص الحقول الفارغة، إضافة وحدة جديدة مع إدارة سعة الأكواد، فحص زر الإلغاء |
| 10 | **ترميز الأصناف** | [items-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/items-coding.spec.js) | فحص الحقول المطلوبة، إضافة صنف جديد واختيار الوحدة، فحص زر الإلغاء |
| 11 | **ترميز أقطار المقايسات** | [survey-diameters-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/survey-diameters-coding.spec.js) | فحص الحقول الإلزامية، إضافة قطر مقايسة مع التكلفة، فحص زر الإلغاء |
| 12 | **ترميز أصناف أقطار المقايسات** | [survey-diameter-items-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/survey-diameter-items-coding.spec.js) | فحص الربط بالقوائم المنسدلة، إضافة وتوزيع الأصناف للأقطار، الحقول الإلزامية |
| 13 | **ترميز أنواع العدادات** | [meter-types-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/meter-types-coding.spec.js) | فحص الحقول الإلزامية، إضافة نوع عداد جديد، فحص زر الإلغاء |
| 14 | **ترميز أقطار العدادات** | [meter-diameters-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/meter-diameters-coding.spec.js) | فحص الحقول الإلزامية، إضافة قطر عداد جديد، فحص زر الإلغاء |
| 15 | **ترميز أماكن العدادات** | [meter-locations-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/meter-locations-coding.spec.js) | فحص الحقول الإلزامية، إضافة مكان عداد جديد، فحص زر الإلغاء |
| 16 | **ترميز حالات العدادات والمحاسبة** | [meter-status-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/meter-status-coding.spec.js) | فحص خيارات المحاسبة وحالة العداد، إضافة حالة جديدة، الحقول الإلزامية |
| 17 | **ترميز الأعطال** | [malfunctions-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/malfunctions-coding.spec.js) | فحص الحقول الإلزامية، إضافة عطل جديد وتحديد الإجراء، فحص زر الإلغاء |

#### 4. وحدة ترميز الجباة وخطوط السير (Collectors & Route Lines)
| # | الشاشة | ملف الفحص | السيناريوهات المغطاة |
|---|---|---|---|
| 18 | **ترميز الجباة** | [collectors-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/collectors-coding.spec.js) | فحص 5 حقول إلزامية، اختيار المحافظة والقضاء عبر الـ LOV، إضافة جابي بنجاح |
| 19 | **ترميز خطوط السير** | [route-lines-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/route-lines-coding.spec.js) | فحص الفلاتر الجغرافية المتتالية، إضافة خط سير جديد، التحقق من الإلغاء |
| 20 | **ترميز مناطق خطوط السير** | [route-areas-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/route-areas-coding.spec.js) | فحص التحقق من خط السير، ربط الأماكن الجغرافية بخط السير، فحص الإلغاء |
| 21 | **توزيع الجباة على المناطق** | [collector-areas-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/collector-areas-coding.spec.js) | فحص إلزامية اختيار الجابي والمنطقة، ربط الجابي بالمناطق وحفظ الإسناد |

#### 5. وحدة ترميز الأسعار وحالات الحساب (Pricing & Account Statuses) - مكتملة 100%
| # | الشاشة | ملف الفحص | السيناريوهات المغطاة |
|---|---|---|---|
| 22 | **ترميز أنواع الاشتراكات وشرائح الاستهلاك** | [subscription-types-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/subscription-types-coding.spec.js) | فحص الحقول المطلوبة في الجريد، مزامنة الجداول المتعددة (Master-Detail)، البحث والفلترة |
| 23 | **ترميز فئات العملاء** | [customer-categories-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/customer-categories-coding.spec.js) | فحص التحقق من اسم الفئة، إضافة فئة عملاء مع رسوم الجباية، فحص الإلغاء |
| 24 | **ترميز حالات الحساب** | [account-statuses-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/account-statuses-coding.spec.js) | فحص إلزامية الاسم، إضافة حالة حساب جديدة، فحص زر الإلغاء |
| 25 | **ترميز حالات حساب الصرف الصحي** | [sewage-status-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/sewage-status-coding.spec.js) | فحص إلزامية الاسم، إضافة حالة صرف صحي جديدة، فحص زر الإلغاء |
| 26 | **ترميز نسب المتناقضات** | [discrepancy-rates-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/discrepancy-rates-coding.spec.js) | فحص 5 حقول إلزامية، اختيار نوع الحساب وحالة العداد عبر الـ LOV، إضافة وحفظ النسب |
| 27 | **ترميز الأنشطة الرئيسية** | [main-activities-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/main-activities-coding.spec.js) | فحص إلزامية الاسم، إضافة نشاط رئيسي وتفعيله، فحص زر الإلغاء |
| 28 | **ترميز الأنشطة الفرعية** | [sub-activities-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/sub-activities-coding.spec.js) | فحص إلزامية النشاط الرئيسي والاسم، ربط النشاط بالنشاط الرئيسي عبر الـ LOV، الحفظ والإلغاء |

#### 6. وحدة ترميز الجباية وأمانة الصندوق (Cashier & Safes) - مكتملة 100%
| # | الشاشة | ملف الفحص | السيناريوهات المغطاة |
|---|---|---|---|
| 29 | **ترميز الخزائن** | [safes-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/safes-coding.spec.js) | فحص 4 حقول إلزامية، تعديل وحفظ بيانات الخزينة وأمين الصندوق، فحص زر الإلغاء |
| 30 | **ترميز البنوك** | [banks-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/banks-coding.spec.js) | فحص إلزامية اسم البنك، إضافة بنك جديد وتفعيله، فحص زر الإلغاء |
| 31 | **ترميز حافظات التوريد** | [portfolios-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/portfolios-coding.spec.js) | فحص الحقول الإلزامية في صفحة الإنشاء، إضافة حافظة توريد جديدة، فحص زر الإلغاء |
| 32 | **ترميز بنود الحافظة** | [portfolio-items-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/portfolio-items-coding.spec.js) | فحص إلزامية اسم البند وعنصر الفواتير، التحقق من قواعد منع التكرار، فحص زر الإغلاق |
| 33 | **ترميز حالات إيصالات السداد** | [receipt-status-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/receipt-status-coding.spec.js) | فحص إلزامية الاسم، إضافة حالة إيصال سداد جديدة، فحص زر الإلغاء |

#### 7. وحدة ترميز خدمات الزبائن (Customer Services) - مكتملة 100%
| # | الشاشة | ملف الفحص | السيناريوهات المغطاة |
|---|---|---|---|
| 34 | **ترميز أنواع الشكاوى** | [complaint-types-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/complaint-types-coding.spec.js) | فحص إلزامية اسم الشكوى، إضافة نوع شكوى جديد وتفعيله، فحص زر الإلغاء |
| 35 | **ترميز إدارات الشكاوى** | [complaint-departments-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/complaint-departments-coding.spec.js) | فحص إلزامية اسم الإدارة، إضافة إدارة شكاوى وتوليد الرمز، فحص زر الإلغاء |
| 36 | **ترميز أنواع المستندات** | [document-types-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/document-types-coding.spec.js) | فحص إلزامية الاسم، إضافة نوع مستند جديد وتفعيله، فحص زر الإلغاء |
| 37 | **ترميز الطلبات** | [requests-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/requests-coding.spec.js) | فحص إلزامية الاسم بالعربي والإنجليزي، إضافة نوع طلب جديد، فحص زر الإلغاء |
| 38 | **ترميز خطوات الطلب** | [request-steps-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/request-steps-coding.spec.js) | فحص إلزامية الاسم بالعربي والإنجليزي، إضافة خطوة طلب جديدة، فحص زر الإلغاء |
| 39 | **ربط الطلبات بالخطوات** | [request-steps-link-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/request-steps-link-coding.spec.js) | فحص مزامنة القائمة المنسدلة مع الجريد التفاعلي، البحث وتصفية الخطوات، إعادة تعيين الجريد |
| 40 | **ترميز أسباب استبدال العداد** | [meter-replacement-reasons-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/meter-replacement-reasons-coding.spec.js) | فحص قيود الحروف العربية والإنجليزية حصراً، إضافة سبب استبدال مع التفعيل، فحص زر الإلغاء |
| 41 | **إعدادات الإشعارات** | [notification-settings.spec.js](file:///c:/Users/Yasmine/Desktop/nts/notification-settings.spec.js) | فحص إلزامية عنوان إشعار التعليق، تعديل وحفظ إعدادات إشعارات الخدمة بنجاح، فحص زر الإلغاء |

#### 8. وحدة ترميز الخدمات المالية (Financial Services) - مكتملة 100%
| # | الشاشة | ملف الفحص | السيناريوهات المغطاة |
|---|---|---|---|
| 42 | **ترميز أنواع أقساط الجدولة** | [scheduling-installment-types-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/scheduling-installment-types-coding.spec.js) | فحص إلزامية اسم القسط، إضافة نوع قسط جدولة جديد وحفظه، فحص زر الإلغاء |
| 43 | **ترميز الخدمات المضافة** | [additional-services-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/additional-services-coding.spec.js) | فحص إلزامية الاسم والقيمة، إضافة خدمة مضافة مع نوع النشاط، فحص زر الإلغاء |

#### 9. وحدة إعدادات التشغيل الأساسية (Operational Settings) - مكتملة 100%
| # | الشاشة | ملف الفحص | السيناريوهات المغطاة |
|---|---|---|---|
| 44 | **إعدادات التشغيل** | [operational-settings-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/operational-settings-coding.spec.js) | فحص إلزامية الإعدادات بالإنجليزية والعربية والقيمة، إضافة إعداد تشغيل وحفظه، فحص الإلغاء |
| 45 | **خطوات تشغيل الإصدار** | [release-steps-coding.spec.js](file:///c:/Users/Yasmine/Desktop/nts/release-steps-coding.spec.js) | فحص جدول الخطوات التشغيلية المرجعية الـ 10، البحث والفلترة في التقرير، معاينة التفاصيل وإغلاقها |

---

## 📸 التوثيق واللقطات (Screenshots)

يقوم كل فحص بالتقاط لقطات شاشة أوتوماتيكية موثقة بدقة لكل سيناريو:
- `1_*_error.png`: توثيق رسائل الخطأ والتحقق من الحقول الإلزامية.
- `2_*_saved.png`: توثيق ظهور إشعار النجاح الأخضر "تم حفظ البيانات بنجاح" أو التعديل.
- `3_*_cancel_dialog.png` / `close_dialog.png`: توثيق إغلاق النوافذ المنبثقة وأزرار الإلغاء.

---

## 🚀 كيفية تشغيل الاختبارات

### المتطلبات المسبقة:
* [Node.js](https://nodejs.org/) (إصدار 18 أو أحدث)
* الاتصال بشبكة النظام (VPN)

### 1. تشغيل فحوصات الشاشات الجديدة:
```powershell
# فحص ترميز أسباب استبدال العداد
npx.cmd playwright test meter-replacement-reasons-coding.spec.js

# فحص ربط الطلبات بالخطوات
npx.cmd playwright test request-steps-link-coding.spec.js

# فحص إعدادات الإشعارات
npx.cmd playwright test notification-settings.spec.js

# فحص ترميز أنواع أقساط الجدولة
npx.cmd playwright test scheduling-installment-types-coding.spec.js

# فحص ترميز الخدمات المضافة
npx.cmd playwright test additional-services-coding.spec.js

# فحص إعدادات التشغيل
npx.cmd playwright test operational-settings-coding.spec.js

# فحص خطوات تشغيل الإصدار
npx.cmd playwright test release-steps-coding.spec.js
```

### 2. تشغيل الشاشة مع رؤية المتصفح (Headed):
```powershell
npx.cmd playwright test customer-categories-coding.spec.js --headed
```

### 3. عرض تقرير الاختبارات التفاعلي (HTML Report):
```powershell
npx.cmd playwright show-report
```

---

## 🛠️ التقنيات المستخدمة
* **Playwright** - إطار عمل الاختبارات الآلية الحديث E2E
* **JavaScript (Node.js)** - لغة كتابة سيناريوهات الفحص
* **Oracle APEX** - النظام قيد الاختبار
