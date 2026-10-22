import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ترميز أصناف أقطار المقايسات', () => {

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

        // 2. الانتقال إلى شاشة ترميز أصناف أقطار المقايسات
        console.log('2. Navigating to Survey Diameter Items Coding screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز الأصناف والعدادات"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز أصناف أقطار المقايسات"').first().click();
        await page.waitForTimeout(4000);

        // 3. التأكد من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/أصناف أقطار المقايسات/i);
        expect(decodeURI(page.url())).toContain('ترميز-أصناف-أقطار-المقايسات');
        console.log('Verified: Correct Title and URL for ترميز-أصناف-أقطار-المقايسات!');
    });

    // 1️⃣ الفحص الأول: الضغط على حفظ في نافذة الإضافة بدون إدخال البيانات والتأكد من رسائل الخطأ
    test('1. الضغط على حفظ في نافذة الإضافة بدون إدخال البيانات والتأكد من رسائل الخطأ', async ({ page }) => {
        console.log('--- Test 1: Click Save without required fields ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التعامل مع النافذة المنبثقة داخل الـ iframe
        const modalFrame = page.frameLocator('iframe');

        // ج) الضغط على حفظ دون اختيار أي حقل
        await modalFrame.locator('button:has-text("حفظ")').click();

        // د) انتظار ظهور رسائل الخطأ والتحقق منها
        const modalAlert = modalFrame.locator('.t-Alert');
        await expect(modalAlert).toBeVisible({ timeout: 15000 });
        await expect(modalAlert).toContainText('يجب إدخال قيمة قطر المقايسة');
        await expect(modalAlert).toContainText('يجب إدخال قيمة اسم الصنف');
        await page.waitForTimeout(1000);

        // هـ) التقاط صورة لتوثيق رسائل الخطأ
        await page.screenshot({ path: '1_diameter_item_missing_fields_error.png' });
        console.log('Screenshot saved: 1_diameter_item_missing_fields_error.png');
    });

    // 2️⃣ الفحص الثاني: اختيار قطر المقايسة واسم الصنف وإدخال السعر وحفظه بنجاح
    test('2. اختيار قطر المقايسة واسم الصنف وإدخال السعر وحفظه بنجاح', async ({ page }) => {
        console.log('--- Test 2: Select Diameter, Item and Save ---');

        // أ) إضافة قطر مقايسة فريد وسريع لضمان عدم حدوث تكرار نهائياً
        const uniqueDiameter = `قطر_${Date.now().toString().slice(-4)}`;
        console.log(`Creating fresh diameter: ${uniqueDiameter}`);
        await page.locator('text="ترميز أقطار المقايسات"').first().click();
        await page.waitForTimeout(3000);

        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(2000);
        let modalFrame = page.frameLocator('iframe');
        await modalFrame.locator('#P9_CONNECTION_SIZE_NAME').fill(uniqueDiameter);
        await modalFrame.locator('button:has-text("حفظ")').click();
        await page.waitForTimeout(3000);

        // ب) العودة لشاشة ترميز أصناف أقطار المقايسات
        await page.locator('text="ترميز أصناف أقطار المقايسات"').first().click();
        await page.waitForTimeout(3000);

        // ج) فتح نافذة الإضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        modalFrame = page.frameLocator('iframe');

        // د) اختيار قطر المقايسة الجديد عبر البحث في قائمة الـ LOV
        console.log('Searching for fresh Diameter in LOV...');
        await modalFrame.locator('#P11_CONNECTION_SIZE_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('input.a-PopupLOV-search:visible').fill(uniqueDiameter);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        await page.locator(`[role="option"]:has-text("${uniqueDiameter}")`).click();
        await page.waitForTimeout(1000);

        // هـ) اختيار اسم الصنف من قائمة الـ LOV
        console.log('Selecting Item from LOV...');
        await modalFrame.locator('#P11_ITEM_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(1000);

        // و) كتابة السعر
        await modalFrame.locator('#P11_ITEM_PRICE').fill('300');
        await page.waitForTimeout(1000);

        // ز) الضغط على زر حفظ
        await modalFrame.locator('button:has-text("حفظ")').click();

        // ح) التحقق من ظهور إشعار النجاح الأخضر في الصفحة الرئيسية
        const successBanner = page.locator('.t-Alert--success, .t-Alert:has-text("تم حفظ البيانات بنجاح")');
        await expect(successBanner).toBeVisible({ timeout: 15000 });
        await expect(successBanner).toContainText('تم حفظ البيانات بنجاح');
        await page.waitForTimeout(1000);

        // ط) التقاط صورة لتوثيق النجاح
        await page.screenshot({ path: '2_valid_diameter_item_saved.png' });
        console.log('Screenshot saved: 2_valid_diameter_item_saved.png');
    });

    // 3️⃣ الفحص الثالث: فتح نافذة الإضافة والضغط على زر إلغاء والتأكد من إغلاقها
    test('3. فتح نافذة الإضافة والضغط على زر إلغاء والتأكد من إغلاق النافذة', async ({ page }) => {
        console.log('--- Test 3: Open Add dialog and Cancel ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من فتح الـ iframe
        const modalFrame = page.frameLocator('iframe');
        await expect(modalFrame.locator('#P11_ITEM_PRICE')).toBeVisible({ timeout: 10000 });

        // ج) الضغط على زر إلغاء
        await modalFrame.locator('button:has-text("إلغاء")').click();
        await page.waitForTimeout(2000);

        // د) التأكد من إغلاق النافذة المنبثقة واختفاء الـ iframe
        await expect(page.locator('iframe')).toHaveCount(0);
        console.log('Verified: Modal closed successfully upon cancel.');

        // هـ) التقاط صورة لتوثيق إغلاق النافذة والعودة للشاشة الرئيسية
        await page.screenshot({ path: '3_diameter_item_cancel_dialog.png' });
        console.log('Screenshot saved: 3_diameter_item_cancel_dialog.png');
    });

});
