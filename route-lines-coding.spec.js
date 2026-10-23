import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ترميز خطوط السير', () => {

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

        // 2. الانتقال إلى شاشة ترميز خطوط السير
        console.log('2. Navigating to Route Lines Coding screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز الجباة"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز خطوط السير"').first().click();
        await page.waitForTimeout(4000);

        // 3. التأكد من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/خطوط السير/i);
        expect(decodeURI(page.url())).toContain('ترميز-خطوط-السير');
        console.log('Verified: Correct Title and URL for ترميز-خطوط-السير!');
    });

    // 1️⃣ الفحص الأول: ترك الحقول المطلوبة فارغة والتأكد من ظهور رسائل التحقق
    test('1. ترك الحقول المطلوبة فارغة والتأكد من ظهور رسائل التحقق من الصحة', async ({ page }) => {
        console.log('--- Test 1: Leave fields empty and check validation errors ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من ظهور النافذة المنبثقة
        const modalFrame = page.frameLocator('iframe');
        await expect(modalFrame.locator('#P35_MARCH_NAME')).toBeVisible({ timeout: 10000 });

        // ج) الضغط على زر حفظ دون إدخال أي بيانات
        await modalFrame.locator('button:has-text("حفظ")').click();

        // د) انتظار ظهور رسالة الخطأ والتحقق من الحقول الإلزامية
        const modalAlert = modalFrame.locator('.t-Alert');
        await expect(modalAlert).toBeVisible({ timeout: 15000 });
        await expect(modalAlert).toContainText('يجب إدخال قيمة المحافظة');
        await expect(modalAlert).toContainText('يجب إدخال قيمة القضاء');
        await expect(modalAlert).toContainText('يجب إدخال قيمة رمز خط السير');
        await expect(modalAlert).toContainText('يجب إدخال قيمة اسم خط السير');
        await expect(modalAlert).toContainText('يجب إدخال قيمة القارئ');
        await expect(modalAlert).toContainText('يجب إدخال قيمة الجابي');
        await expect(modalAlert).toContainText('يجب إدخال قيمة الجابي المركزي');
        await page.waitForTimeout(1000);

        // هـ) التقاط صورة لتوثيق الخطأ
        await page.screenshot({ path: '1_route_line_empty_error.png' });
        console.log('Screenshot saved: 1_route_line_empty_error.png');
    });

    // 2️⃣ الفحص الثاني: إضافة خط سير جديد وحفظه بنجاح
    test('2. إضافة خط سير جديد وحفظه بنجاح', async ({ page }) => {
        console.log('--- Test 2: Add valid Route Line and save ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        const modalFrame = page.frameLocator('iframe');

        // ب) اختيار المحافظة من الـ Popup LOV
        const secLovBtn = modalFrame.locator('button[aria-label*="المحافظة"], button[data-for="P35_SECTION_CODE"], #P35_SECTION_CODE_lov_btn');
        if (await secLovBtn.count() > 0) {
            await secLovBtn.first().click();
        } else {
            await modalFrame.locator('#P35_SECTION_CODE').click();
        }
        await page.waitForTimeout(2000);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li, .ui-dialog:visible .a-PopupLOV-results tr').first().click();
        await page.waitForTimeout(2000);

        // ج) اختيار القضاء من الـ Popup LOV
        const branchLovBtn = modalFrame.locator('button[aria-label*="القضاء"], button[data-for="P35_BRANCH_CODE"], #P35_BRANCH_CODE_lov_btn');
        if (await branchLovBtn.count() > 0) {
            await branchLovBtn.first().click();
        } else {
            await modalFrame.locator('#P35_BRANCH_CODE').click();
        }
        await page.waitForTimeout(2000);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li, .ui-dialog:visible .a-PopupLOV-results tr').first().click();
        await page.waitForTimeout(2000);

        // د) إدخال رمز خط السير واسم خط السير
        const uniqueCode = Math.floor(Math.random() * 8999 + 1000).toString();
        const uniqueName = `خط سير تجريبي ${Date.now().toString().slice(-4)}`;
        await modalFrame.locator('#P35_MARCH_CODE').fill(uniqueCode);
        await modalFrame.locator('#P35_MARCH_NAME').fill(uniqueName);
        console.log(`Filled route line code: ${uniqueCode}, name: ${uniqueName}`);

        // هـ) اختيار القارئ
        const readerLovBtn = modalFrame.locator('button[aria-label*="القارئ"], button[data-for="P35_MARCH_READER_CODE"], #P35_MARCH_READER_CODE_lov_btn');
        if (await readerLovBtn.count() > 0) {
            await readerLovBtn.first().click();
        } else {
            await modalFrame.locator('#P35_MARCH_READER_CODE').click();
        }
        await page.waitForTimeout(2000);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li, .ui-dialog:visible .a-PopupLOV-results tr').first().click();
        await page.waitForTimeout(2000);

        // و) اختيار الجابي
        const collectorLovBtn = modalFrame.locator('button[aria-label*="الجابي"], button[data-for="P35_MARCH_COLLECTOR_CODE"], #P35_MARCH_COLLECTOR_CODE_lov_btn');
        if (await collectorLovBtn.count() > 0) {
            await collectorLovBtn.first().click();
        } else {
            await modalFrame.locator('#P35_MARCH_COLLECTOR_CODE').click();
        }
        await page.waitForTimeout(2000);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li, .ui-dialog:visible .a-PopupLOV-results tr').first().click();
        await page.waitForTimeout(2000);

        // ز) اختيار الجابي المركزي
        const shibakLovBtn = modalFrame.locator('button[aria-label*="الجابي المركزي"], button[data-for="P35_MARCH_SHIBAK_CODE"], #P35_MARCH_SHIBAK_CODE_lov_btn');
        if (await shibakLovBtn.count() > 0) {
            await shibakLovBtn.first().click();
        } else {
            await modalFrame.locator('#P35_MARCH_SHIBAK_CODE').click();
        }
        await page.waitForTimeout(2000);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li, .ui-dialog:visible .a-PopupLOV-results tr').first().click();
        await page.waitForTimeout(1000);

        // ح) الضغط على زر حفظ
        await modalFrame.locator('button:has-text("حفظ")').click();

        // ط) التحقق من ظهور إشعار النجاح الأخضر في الصفحة الرئيسية
        const successBanner = page.locator('.t-Alert--success, .t-Alert:has-text("تم حفظ البيانات بنجاح")');
        await expect(successBanner).toBeVisible({ timeout: 15000 });
        await expect(successBanner).toContainText('تم حفظ البيانات بنجاح');
        await page.waitForTimeout(1000);

        // ي) التقاط صورة لتوثيق النجاح
        await page.screenshot({ path: '2_valid_route_line_saved.png' });
        console.log('Screenshot saved: 2_valid_route_line_saved.png');
    });

    // 3️⃣ الفحص الثالث: فتح نافذة الإضافة والضغط على زر إلغاء والتأكد من إغلاقها
    test('3. فتح نافذة الإضافة والضغط على زر إلغاء والتأكد من إغلاق النافذة', async ({ page }) => {
        console.log('--- Test 3: Open Add dialog and Cancel ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من فتح الـ iframe
        const modalFrame = page.frameLocator('iframe');
        await expect(modalFrame.locator('#P35_MARCH_NAME')).toBeVisible({ timeout: 10000 });

        // ج) كتابة نص مؤقت
        await modalFrame.locator('#P35_MARCH_NAME').fill('خط سير مؤقت');
        await page.waitForTimeout(1000);

        // د) الضغط على زر إلغاء
        await modalFrame.locator('button:has-text("إلغاء")').click();
        await page.waitForTimeout(2000);

        // هـ) التأكد من إغلاق النافذة المنبثقة واختفاء الـ iframe
        await expect(page.locator('iframe')).toHaveCount(0);
        console.log('Verified: Modal closed successfully upon cancel.');

        // و) التقاط صورة لتوثيق إغلاق النافذة والعودة للشاشة الرئيسية
        await page.screenshot({ path: '3_route_line_cancel_dialog.png' });
        console.log('Screenshot saved: 3_route_line_cancel_dialog.png');
    });

});
