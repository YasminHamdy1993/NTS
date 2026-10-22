import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ترميز حالات العدادات والمحاسبة', () => {

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

        // 2. الانتقال إلى شاشة ترميز حالات العدادات والمحاسبة
        console.log('2. Navigating to Meter Status and Billing Coding screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز الأصناف والعدادات"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز حالات العدادات والمحاسبة"').first().click();
        await page.waitForTimeout(4000);

        // 3. التأكد من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/حالات العداد/i);
        expect(decodeURI(page.url())).toContain('حالات-العدادت-وطرق-المحاسبة');
        console.log('Verified: Correct Title and URL for حالات العدادات والمحاسبة!');
    });

    // 1️⃣ الفحص الأول: ترك الحقول المطلوبة فارغة والتأكد من رسالة الخطأ
    test('1. ترك الحقول المطلوبة فارغة والتأكد من ظهور رسائل التحقق من الصحة', async ({ page }) => {
        console.log('--- Test 1: Leave fields empty and check validation errors ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من ظهور النافذة المنبثقة
        const modalFrame = page.frameLocator('iframe');
        await expect(modalFrame.locator('#P26_METER_STATUS_NAME')).toBeVisible({ timeout: 10000 });

        // ج) الضغط على زر حفظ دون إدخال أي بيانات
        await modalFrame.locator('button:has-text("حفظ")').click();

        // د) انتظار ظهور رسالة الخطأ والتحقق منها
        const modalAlert = modalFrame.locator('.t-Alert');
        await expect(modalAlert).toBeVisible({ timeout: 15000 });
        await expect(modalAlert).toContainText('يجب إدخال قيمة حالة العداد');
        await expect(modalAlert).toContainText('يجب إدخال قيمة طريقة المحاسبة');
        await page.waitForTimeout(1000);

        // هـ) التقاط صورة لتوثيق الخطأ
        await page.screenshot({ path: '1_meter_status_empty_error.png' });
        console.log('Screenshot saved: 1_meter_status_empty_error.png');
    });

    // 2️⃣ الفحص الثاني: إضافة حالة عداد جديدة واختيار طريقة المحاسبة وحفظها بنجاح
    test('2. إضافة حالة عداد جديدة واختيار طريقة المحاسبة وحفظها بنجاح', async ({ page }) => {
        console.log('--- Test 2: Add valid Meter Status and save ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) إدخال حالة العداد داخل الـ iframe
        const modalFrame = page.frameLocator('iframe');
        const uniqueStatusName = `حالة_${Date.now().toString().slice(-4)}`;
        console.log(`Adding meter status: ${uniqueStatusName}`);
        await modalFrame.locator('#P26_METER_STATUS_NAME').fill(uniqueStatusName);
        await page.waitForTimeout(1000);

        // ج) فتح قائمة طريقة المحاسبة (Popup LOV) واختيار القيمة الأولى
        const lovBtn = modalFrame.locator('button[aria-label*="طريقة المحاسبة"], button[data-for="P26_NATIONAL_CAL"], #P26_NATIONAL_CAL_lov_btn');
        if (await lovBtn.count() > 0) {
            await lovBtn.first().click();
        } else {
            await modalFrame.locator('#P26_NATIONAL_CAL').click();
        }
        await page.waitForTimeout(2000);

        // اختيار القيمة من نافذة الـ LOV
        await page.locator('.a-PopupLOV-results li, .a-PopupLOV-results tr').first().click();
        await page.waitForTimeout(1000);

        // د) الضغط على زر حفظ
        await modalFrame.locator('button:has-text("حفظ")').click();

        // هـ) التحقق من ظهور إشعار النجاح الأخضر في الصفحة الرئيسية
        const successBanner = page.locator('.t-Alert--success, .t-Alert:has-text("تم حفظ البيانات بنجاح")');
        await expect(successBanner).toBeVisible({ timeout: 15000 });
        await expect(successBanner).toContainText('تم حفظ البيانات بنجاح');
        await page.waitForTimeout(1000);

        // و) التقاط صورة لتوثيق النجاح
        await page.screenshot({ path: '2_valid_meter_status_saved.png' });
        console.log('Screenshot saved: 2_valid_meter_status_saved.png');
    });

    // 3️⃣ الفحص الثالث: فتح نافذة الإضافة والضغط على زر إلغاء والتأكد من إغلاقها
    test('3. فتح نافذة الإضافة والضغط على زر إلغاء والتأكد من إغلاق النافذة', async ({ page }) => {
        console.log('--- Test 3: Open Add dialog and Cancel ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من فتح الـ iframe
        const modalFrame = page.frameLocator('iframe');
        await expect(modalFrame.locator('#P26_METER_STATUS_NAME')).toBeVisible({ timeout: 10000 });

        // ج) كتابة نص مؤقت
        await modalFrame.locator('#P26_METER_STATUS_NAME').fill('حالة مؤقتة');
        await page.waitForTimeout(1000);

        // د) الضغط على زر إلغاء
        await modalFrame.locator('button:has-text("إلغاء")').click();
        await page.waitForTimeout(2000);

        // هـ) التأكد من إغلاق النافذة المنبثقة واختفاء الـ iframe
        await expect(page.locator('iframe')).toHaveCount(0);
        console.log('Verified: Modal closed successfully upon cancel.');

        // و) التقاط صورة لتوثيق إغلاق النافذة والعودة للشاشة الرئيسية
        await page.screenshot({ path: '3_meter_status_cancel_dialog.png' });
        console.log('Screenshot saved: 3_meter_status_cancel_dialog.png');
    });

});
