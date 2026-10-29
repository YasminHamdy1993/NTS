import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ترميز الأنشطة الفرعية (Sub Activities Coding)', () => {

    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000);

        // 1. تسجيل الدخول
        console.log('1. Logging in...');
        await page.goto('https://apex.ntgcloud.net/ords/r/nts/master-app102/login', { waitUntil: 'domcontentloaded' });
        await page.locator('#P9999_USERNAME').fill('ADMIN');
        await page.locator('#P9999_PASSWORD').fill('admin');
        await page.locator('#P9999_SELECT_APP').selectOption('100');
        await page.locator('button:has-text("تسجيل الدخول")').click();
        await page.waitForTimeout(5000);

        // 2. الانتقال إلى إعدادات النظام -> ترميز الأسعار وحالات الحساب -> ترميز الأنشطة الفرعية
        console.log('2. Navigating to Sub Activities screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز الأسعار وحالات الحساب"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز الأنشطة الفرعية"').first().click();
        await page.waitForTimeout(4000);

        // 3. التحقق من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/الأنشطة الفرعية/i);
        expect(decodeURI(page.url())).toContain('ترميز-الأنشطة-الفرعية');
        console.log('Verified: Correct Title and URL for ترميز-الأنشطة-الفرعية!');
    });

    // 1️⃣ الفحص الأول: ترك الحقول المطلوبة فارغة والتأكد من ظهور رسائل التحقق
    test('1. ترك الحقول المطلوبة فارغة والتأكد من ظهور رسائل التحقق من الصحة', async ({ page }) => {
        console.log('--- Test 1: Empty required fields validation ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من ظهور النافذة المنبثقة
        const modalFrame = page.frameLocator('iframe');
        await expect(modalFrame.locator('#P76_ACCOUNT_TYPE_NAME')).toBeVisible({ timeout: 10000 });

        // ج) الضغط على زر حفظ دون إدخال البيانات
        await modalFrame.locator('button:has-text("حفظ")').click();

        // د) التحقق من رسائل الخطأ
        const modalAlert = modalFrame.locator('.t-Alert');
        await expect(modalAlert).toBeVisible({ timeout: 15000 });
        await expect(modalAlert).toContainText('يجب إدخال قيمة النشاط الرئيسى');
        await expect(modalAlert).toContainText('يجب إدخال قيمة الاسم');
        await page.waitForTimeout(1000);

        // هـ) التقاط صورة لتوثيق الخطأ
        await page.screenshot({ path: '1_sub_activity_empty_error.png' });
        console.log('Screenshot saved: 1_sub_activity_empty_error.png');
    });

    // 2️⃣ الفحص الثاني: إضافة نشاط فرعي جديد بنجاح
    test('2. إضافة نشاط فرعي جديد وحفظه بنجاح', async ({ page }) => {
        console.log('--- Test 2: Add valid Sub Activity and save ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        const modalFrame = page.frameLocator('iframe');

        // ب) اختيار النشاط الرئيسي من الـ Popup LOV
        const masterLovBtn = modalFrame.locator('button[data-for="P76_MASTER_ACCOUNT_CODE"], #P76_MASTER_ACCOUNT_CODE_lov_btn');
        if (await masterLovBtn.count() > 0) {
            await masterLovBtn.first().click();
        } else {
            await modalFrame.locator('#P76_MASTER_ACCOUNT_CODE').click();
        }
        await page.waitForTimeout(2000);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li, .ui-dialog:visible .a-PopupLOV-results tr').first().click();
        await page.waitForTimeout(1500);

        // ج) إدخال الكود واسم النشاط الفرعي
        const uniqueSuffix = Date.now().toString().slice(-4);
        const subCode = Math.floor(1000 + Math.random() * 9000).toString();
        const subName = `نشاط فرعي اختباري ${uniqueSuffix}`;

        console.log(`Adding Sub Activity: Code=${subCode}, Name=${subName}`);
        await modalFrame.locator('#P76_CODE').fill(subCode);
        await modalFrame.locator('#P76_ACCOUNT_TYPE_NAME').fill(subName);
        await page.waitForTimeout(1000);

        // د) الضغط على زر حفظ
        await modalFrame.locator('button:has-text("حفظ")').click();

        // هـ) التحقق من ظهور إشعار النجاح الأخضر
        const successBanner = page.locator('.t-Alert--success, .t-Alert:has-text("تم حفظ البيانات بنجاح")');
        await expect(successBanner).toBeVisible({ timeout: 15000 });
        await expect(successBanner).toContainText('تم حفظ البيانات بنجاح');
        await page.waitForTimeout(1000);

        // و) التقاط صورة لتوثيق النجاح
        await page.screenshot({ path: '2_valid_sub_activity_saved.png' });
        console.log('Screenshot saved: 2_valid_sub_activity_saved.png');
    });

    // 3️⃣ الفحص الثالث: فتح نافذة الإضافة والضغط على زر إلغاء والتأكد من إغلاقها
    test('3. فتح نافذة الإضافة والضغط على زر إلغاء والتأكد من إغلاق النافذة', async ({ page }) => {
        console.log('--- Test 3: Open Add dialog and Cancel ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من فتح النافذة المنبثقة
        const modalFrame = page.frameLocator('iframe');
        await expect(modalFrame.locator('#P76_ACCOUNT_TYPE_NAME')).toBeVisible({ timeout: 10000 });

        // ج) كتابة نص مؤقت
        await modalFrame.locator('#P76_ACCOUNT_TYPE_NAME').fill('نشاط فرعي مؤقت');
        await page.waitForTimeout(1000);

        // د) الضغط على زر إلغاء
        await modalFrame.locator('button:has-text("إلغاء")').click();
        await page.waitForTimeout(2000);

        // هـ) التأكد من إغلاق النافذة واختفاء الـ iframe
        await expect(page.locator('iframe')).toHaveCount(0);
        console.log('Verified: Modal closed successfully upon cancel.');

        // و) التقاط صورة لتوثيق إغلاق النافذة والعودة للشاشة الرئيسية
        await page.screenshot({ path: '3_sub_activity_cancel_dialog.png' });
        console.log('Screenshot saved: 3_sub_activity_cancel_dialog.png');
    });

});
