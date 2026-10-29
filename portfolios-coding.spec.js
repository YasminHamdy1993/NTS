import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ترميز حافظات التوريد (Supply Portfolios Coding)', () => {

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

        // 2. الانتقال إلى إعدادات النظام -> ترميز الجباية وأمانة الصندوق -> ترميز حافظات التوريد
        console.log('2. Navigating to Portfolios screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز الجباية وأمانة الصندوق"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز حافظات التوريد"').first().click();
        await page.waitForTimeout(4000);

        // 3. التحقق من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/حافظات التوريد/i);
        expect(decodeURI(page.url())).toContain('ترميز-حافظات-التوريد');
        console.log('Verified: Correct Title and URL for ترميز-حافظات-التوريد!');
    });

    // 1️⃣ الفحص الأول: ترك الحقول المطلوبة فارغة والتأكد من ظهور رسالة التحقق
    test('1. ترك الحقول المطلوبة فارغة والتأكد من ظهور رسائل التحقق من الصحة', async ({ page }) => {
        console.log('--- Test 1: Empty required fields validation ---');

        // أ) الضغط على زر إضافة للانتقال لصفحة الإنشاء
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من ظهور حقل اسم الحافظة
        await expect(page.locator('#P72_BRIEFCASE_NAME')).toBeVisible({ timeout: 10000 });

        // ج) الضغط على زر حفظ دون إدخال الاسم
        await page.locator('button:has-text("حفظ")').first().click();

        // د) التحقق من رسالة الخطأ
        const errorAlert = page.locator('.t-Alert');
        await expect(errorAlert).toBeVisible({ timeout: 15000 });
        await expect(errorAlert).toContainText('يجب إدخال قيمة اسم الحافظة');
        await page.waitForTimeout(1000);

        // هـ) التقاط صورة لتوثيق الخطأ
        await page.screenshot({ path: '1_portfolio_empty_error.png' });
        console.log('Screenshot saved: 1_portfolio_empty_error.png');
    });

    // 2️⃣ الفحص الثاني: إضافة حافظة توريد جديدة بنجاح
    test('2. إضافة حافظة توريد جديدة وحفظها بنجاح', async ({ page }) => {
        console.log('--- Test 2: Add valid Portfolio and save ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) إدخال البيانات المطلوبة
        const uniqueSuffix = Date.now().toString().slice(-4);
        const briefcaseName = `حافظة توريد اختبارية ${uniqueSuffix}`;

        console.log(`Adding Portfolio: Name=${briefcaseName}`);
        await page.locator('#P72_BRIEFCASE_NAME').fill(briefcaseName);
        await page.locator('#P72_BRIEFCASE_TYPE').selectOption({ index: 1 });
        await page.waitForTimeout(1000);

        // ج) الضغط على زر حفظ
        await page.locator('button:has-text("حفظ")').first().click();

        // د) التحقق من ظهور إشعار النجاح الأخضر
        const successBanner = page.locator('.t-Alert--success, .t-Alert:has-text("تم حفظ البيانات بنجاح")');
        await expect(successBanner).toBeVisible({ timeout: 15000 });
        await expect(successBanner).toContainText('تم حفظ البيانات بنجاح');
        await page.waitForTimeout(1000);

        // هـ) التقاط صورة لتوثيق النجاح
        await page.screenshot({ path: '2_valid_portfolio_saved.png' });
        console.log('Screenshot saved: 2_valid_portfolio_saved.png');
    });

    // 3️⃣ الفحص الثالث: الضغط على زر إلغاء والتحقق من العودة للقائمة الرئيسية
    test('3. الضغط على زر إلغاء والتأكد من العودة لشاشة الحافظات الرئيسية', async ({ page }) => {
        console.log('--- Test 3: Click Cancel and return to main list ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من فتح صفحة التعديل/الإضافة
        await expect(page.locator('#P72_BRIEFCASE_NAME')).toBeVisible({ timeout: 10000 });

        // ج) كتابة نص مؤقت
        await page.locator('#P72_BRIEFCASE_NAME').fill('حافظة مؤقتة للإلغاء');
        await page.waitForTimeout(1000);

        // د) الضغط على زر إلغاء
        await page.locator('button:has-text("إلغاء")').first().click();
        await page.waitForTimeout(3000);

        // هـ) التأكد من العودة للشاشة الرئيسية
        expect(decodeURI(page.url())).toContain('ترميز-حافظات-التوريد');
        console.log('Verified: Returned to main list successfully upon cancel.');

        // و) التقاط صورة لتوثيق إلغاء العملية والعودة للشاشة الرئيسية
        await page.screenshot({ path: '3_portfolio_cancel_action.png' });
        console.log('Screenshot saved: 3_portfolio_cancel_action.png');
    });

});
