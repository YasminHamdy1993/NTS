import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ترميز أنواع الدار', () => {

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

        // 2. الانتقال إلى شاشة ترميز أنواع الدار
        console.log('2. Navigating to House Types screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز التوزيع الجغرافي"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز أنواع الدار"').first().click();
        await page.waitForTimeout(4000);

        // 3. التأكد من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/أنواع الدار/i);
        expect(decodeURI(page.url())).toContain('ترميز-أنواع-الدار');
        console.log('Verified: Correct Title and URL for ترميز-أنواع-الدار!');
    });

    // 1️⃣ الفحص الأول: ترك حقل الاسم فارغاً والتأكد من ظهور رسالة الخطأ
    test('1. ترك حقل الاسم فارغاً والتأكد من رسالة الخطأ', async ({ page }) => {
        console.log('--- Test 1: Leave House Type name empty ---');
        
        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التعامل مع النافذة المنبثقة داخل الـ iframe
        const modalFrame = page.frameLocator('iframe');

        // ج) التأكد من أن حقل الاسم فارغ ثم الضغط على حفظ
        await modalFrame.locator('#P41_TYPE_NAME').fill('');
        await modalFrame.locator('button:has-text("حفظ")').click();

        // د) انتظار ظهور رسالة الخطأ والتحقق منها
        const modalAlert = modalFrame.locator('.t-Alert');
        await expect(modalAlert).toBeVisible({ timeout: 15000 });
        await expect(modalAlert).toContainText('يجب إدخال قيمة الاسم');
        await page.waitForTimeout(1000);

        // هـ) التقاط صورة لتوثيق الخطأ
        await page.screenshot({ path: '1_house_type_empty_name_error.png' });
        console.log('Screenshot saved: 1_house_type_empty_name_error.png');
    });

    // 2️⃣ الفحص الثاني: إضافة نوع دار جديد وحفظه بنجاح
    test('2. إضافة نوع دار جديد وحفظه بنجاح', async ({ page }) => {
        console.log('--- Test 2: Add valid House Type and save ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) كتابة اسم نوع دار جديد مميز داخل الـ iframe
        const modalFrame = page.frameLocator('iframe');
        const uniqueHouseTypeName = `نوع دار تجريبي ${Date.now().toString().slice(-4)}`;
        console.log(`Adding house type: ${uniqueHouseTypeName}`);

        await modalFrame.locator('#P41_TYPE_NAME').fill(uniqueHouseTypeName);
        await page.waitForTimeout(1000);

        // ج) الضغط على زر حفظ
        await modalFrame.locator('button:has-text("حفظ")').click();

        // د) التحقق من ظهور إشعار النجاح الأخضر
        const successBanner = page.locator('.t-Alert--success, .t-Alert:has-text("تم حفظ البيانات بنجاح")');
        await expect(successBanner).toBeVisible({ timeout: 15000 });
        await expect(successBanner).toContainText('تم حفظ البيانات بنجاح');
        await page.waitForTimeout(1000);

        // هـ) التقاط صورة لتوثيق النجاح
        await page.screenshot({ path: '2_valid_house_type_saved.png' });
        console.log('Screenshot saved: 2_valid_house_type_saved.png');
    });

    // 3️⃣ الفحص الثالث: فتح نافذة الإضافة والضغط على زر إلغاء والتأكد من إغلاقها
    test('3. فتح نافذة الإضافة والضغط على زر إلغاء والتأكد من إغلاق النافذة', async ({ page }) => {
        console.log('--- Test 3: Open Add dialog and Cancel ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من فتح الـ iframe
        const modalFrame = page.frameLocator('iframe');
        await expect(modalFrame.locator('#P41_TYPE_NAME')).toBeVisible({ timeout: 10000 });

        // ج) كتابة نص مؤقت
        await modalFrame.locator('#P41_TYPE_NAME').fill('نوع مؤقت للتجربة');
        await page.waitForTimeout(1000);

        // د) الضغط على زر إلغاء
        await modalFrame.locator('button:has-text("إلغاء")').click();
        await page.waitForTimeout(2000);

        // هـ) التأكد من إغلاق النافذة المنبثقة واختفاء الـ iframe
        await expect(page.locator('iframe')).toHaveCount(0);
        console.log('Verified: Modal closed successfully upon cancel.');

        // و) التقاط صورة لتوثيق إغلاق النافذة والعودة للشاشة الرئيسية
        await page.screenshot({ path: '3_house_type_cancel_dialog.png' });
        console.log('Screenshot saved: 3_house_type_cancel_dialog.png');
    });

});
