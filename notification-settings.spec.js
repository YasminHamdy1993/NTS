import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة إعدادات الإشعارات (Notification Settings)', () => {

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

        // 2. الانتقال إلى إعدادات النظام -> ترميز خدمات الزبائن -> إعدادات الإشعارات
        console.log('2. Navigating to Notification Settings screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز خدمات الزبائن"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="إعدادات الإشعارات"').first().click();
        await page.waitForTimeout(4000);

        // 3. التحقق من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/إعدادات الإشعارات/i);
        expect(decodeURI(page.url())).toContain('إعدادات-الإشعارات');
        console.log('Verified: Correct Title and URL for إعدادات-الإشعارات!');
    });

    // 1️⃣ الفحص الأول: ترك الحقول المطلوبة فارغة والتأكد من ظهور رسالة التحقق
    test('1. ترك الحقول المطلوبة فارغة والتأكد من ظهور رسائل التحقق من الصحة', async ({ page }) => {
        console.log('--- Test 1: Empty required fields validation in Notification Details ---');

        // أ) الضغط على رابط التعديل لأول خدمة في التقرير
        const editLink = page.locator('table.a-IRR-table td a').first();
        await expect(editLink).toBeVisible({ timeout: 10000 });
        await editLink.click();
        await page.waitForTimeout(3000);

        // ب) التأكد من فتح صفحة تفاصيل إعدادات الإشعارات
        await expect(page.locator('#P382_REQ_COMMENT_TITLE')).toBeVisible({ timeout: 10000 });

        // ج) مسح عنوان إشعار التعليق والضغط على زر حفظ
        await page.locator('#P382_REQ_COMMENT_TITLE').fill('');
        await page.locator('button:has-text("حفظ")').click();

        // د) التحقق من ظهور رسالة الخطأ
        const errorAlert = page.locator('.t-Alert--error, .t-Alert:has-text("يجب إدخال قيمة عنوان إشعار التعليق")');
        await expect(errorAlert).toBeVisible({ timeout: 10000 });
        await expect(errorAlert).toContainText('يجب إدخال قيمة عنوان إشعار التعليق');
        await page.waitForTimeout(1000);

        // هـ) التقاط صورة لتوثيق التحقق من الخطأ
        await page.screenshot({ path: '1_notification_settings_empty_error.png' });
        console.log('Screenshot saved: 1_notification_settings_empty_error.png');
    });

    // 2️⃣ الفحص الثاني: تعديل إعدادات الإشعار وحفظ التغييرات بنجاح
    test('2. تعديل إعدادات الإشعار وحفظ التغييرات بنجاح', async ({ page }) => {
        console.log('--- Test 2: Update Notification Settings and save ---');

        // أ) الضغط على رابط التعديل لأول خدمة في التقرير
        const editLink = page.locator('table.a-IRR-table td a').first();
        await expect(editLink).toBeVisible({ timeout: 10000 });
        await editLink.click();
        await page.waitForTimeout(3000);

        // ب) إدخال عنوان إشعار محدث
        await expect(page.locator('#P382_REQ_COMMENT_TITLE')).toBeVisible({ timeout: 10000 });
        const updatedTitle = `تعليق من الموظف - محدث`;
        await page.locator('#P382_REQ_COMMENT_TITLE').fill(updatedTitle);
        await page.waitForTimeout(1000);

        // ج) الضغط على زر حفظ
        await page.locator('button:has-text("حفظ")').click();

        // د) التحقق من العودة لشاشة إعدادات الإشعارات وظهور إشعار النجاح الأخضر
        const successBanner = page.locator('.t-Alert--success, .t-Alert:has-text("تم تعديل البيانات بنجاح")');
        await expect(successBanner).toBeVisible({ timeout: 15000 });
        await expect(successBanner).toContainText('تم تعديل البيانات بنجاح');
        await page.waitForTimeout(1000);

        // هـ) التقاط صورة لتوثيق النجاح
        await page.screenshot({ path: '2_valid_notification_settings_saved.png' });
        console.log('Screenshot saved: 2_valid_notification_settings_saved.png');
    });

    // 3️⃣ الفحص الثالث: فتح صفحة التفاصيل والضغط على زر إلغاء والتأكد من العودة
    test('3. فتح صفحة التفاصيل والضغط على زر إلغاء والتأكد من العودة للقائمة', async ({ page }) => {
        console.log('--- Test 3: Open details and Cancel ---');

        // أ) الضغط على رابط التعديل لأول خدمة
        const editLink = page.locator('table.a-IRR-table td a').first();
        await expect(editLink).toBeVisible({ timeout: 10000 });
        await editLink.click();
        await page.waitForTimeout(3000);

        // ب) التأكد من فتح صفحة التفاصيل
        await expect(page.locator('#P382_REQ_COMMENT_TITLE')).toBeVisible({ timeout: 10000 });

        // ج) الضغط على زر إلغاء
        await page.locator('button:has-text("إلغاء")').click();
        await page.waitForTimeout(3000);

        // د) التأكد من العودة لشاشة إعدادات الإشعارات
        expect(decodeURI(page.url())).toContain('إعدادات-الإشعارات');
        console.log('Verified: Returned to Notification Settings upon cancel.');

        // هـ) التقاط صورة لتوثيق العودة
        await page.screenshot({ path: '3_notification_settings_cancel.png' });
        console.log('Screenshot saved: 3_notification_settings_cancel.png');
    });

});
