import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ترميز فئات العملاء (Customer Categories Coding)', () => {

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

        // 2. الانتقال إلى إعدادات النظام -> ترميز الأسعار وحالات الحساب -> ترميز فئات العملاء
        console.log('2. Navigating to Customer Categories screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز الأسعار وحالات الحساب"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز فئات العملاء"').first().click();
        await page.waitForTimeout(4000);

        // 3. التحقق من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/فئات العملاء/i);
        expect(decodeURI(page.url())).toContain('ترميز-فئات-العملاء');
        console.log('Verified: Correct Title and URL for ترميز-فئات-العملاء!');
    });

    // 1️⃣ الفحص الأول: ترك الحقول المطلوبة فارغة والتأكد من ظهور رسالة التحقق
    test('1. ترك الحقول المطلوبة فارغة والتأكد من ظهور رسائل التحقق من الصحة', async ({ page }) => {
        console.log('--- Test 1: Empty required fields validation ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من ظهور النافذة المنبثقة
        const modalFrame = page.frameLocator('iframe');
        await expect(modalFrame.locator('#P58_NAME')).toBeVisible({ timeout: 10000 });

        // ج) الضغط على زر حفظ دون إدخال الاسم
        await modalFrame.locator('button:has-text("حفظ")').click();

        // د) التحقق من رسالة الخطأ
        const modalAlert = modalFrame.locator('.t-Alert');
        await expect(modalAlert).toBeVisible({ timeout: 15000 });
        await expect(modalAlert).toContainText('يجب إدخال قيمة الاسم');
        await page.waitForTimeout(1000);

        // هـ) التقاط صورة لتوثيق الخطأ
        await page.screenshot({ path: '1_customer_categories_empty_error.png' });
        console.log('Screenshot saved: 1_customer_categories_empty_error.png');
    });

    // 2️⃣ الفحص الثاني: إضافة فئة عملاء جديدة بنجاح
    test('2. إضافة فئة عملاء جديدة وحفظها بنجاح', async ({ page }) => {
        console.log('--- Test 2: Add valid Customer Category and save ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) إدخال البيانات في النافذة المنبثقة
        const modalFrame = page.frameLocator('iframe');
        const uniqueSuffix = Date.now().toString().slice(-4);
        const categoryCode = Math.floor(1000 + Math.random() * 9000).toString();
        const categoryName = `فئة اختبارية ${uniqueSuffix}`;
        const collectionFees = '250';

        console.log(`Adding Category: Code=${categoryCode}, Name=${categoryName}, Fees=${collectionFees}`);
        await modalFrame.locator('#P58_CODE').fill(categoryCode);
        await modalFrame.locator('#P58_NAME').fill(categoryName);
        await modalFrame.locator('#P58_COLLECTION_FEES').fill(collectionFees);
        await page.waitForTimeout(1000);

        // ج) الضغط على زر حفظ
        await modalFrame.locator('button:has-text("حفظ")').click();

        // د) التحقق من ظهور إشعار النجاح الأخضر
        const successBanner = page.locator('.t-Alert--success, .t-Alert:has-text("تم حفظ البيانات بنجاح")');
        await expect(successBanner).toBeVisible({ timeout: 15000 });
        await expect(successBanner).toContainText('تم حفظ البيانات بنجاح');
        await page.waitForTimeout(1000);

        // هـ) التقاط صورة لتوثيق النجاح
        await page.screenshot({ path: '2_valid_customer_categories_saved.png' });
        console.log('Screenshot saved: 2_valid_customer_categories_saved.png');
    });

    // 3️⃣ الفحص الثالث: فتح نافذة الإضافة والضغط على زر إلغاء والتأكد من إغلاقها
    test('3. فتح نافذة الإضافة والضغط على زر إلغاء والتأكد من إغلاق النافذة', async ({ page }) => {
        console.log('--- Test 3: Open Add dialog and Cancel ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من فتح النافذة المنبثقة
        const modalFrame = page.frameLocator('iframe');
        await expect(modalFrame.locator('#P58_NAME')).toBeVisible({ timeout: 10000 });

        // ج) كتابة نص مؤقت
        await modalFrame.locator('#P58_NAME').fill('فئة مؤقتة للإلغاء');
        await page.waitForTimeout(1000);

        // د) الضغط على زر إلغاء
        await modalFrame.locator('button:has-text("إلغاء")').click();
        await page.waitForTimeout(2000);

        // هـ) التأكد من إغلاق النافذة واختفاء الـ iframe
        await expect(page.locator('iframe')).toHaveCount(0);
        console.log('Verified: Modal closed successfully upon cancel.');

        // و) التقاط صورة لتوثيق إغلاق النافذة والعودة للشاشة الرئيسية
        await page.screenshot({ path: '3_customer_categories_cancel_dialog.png' });
        console.log('Screenshot saved: 3_customer_categories_cancel_dialog.png');
    });

});
