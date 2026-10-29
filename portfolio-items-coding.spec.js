import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ترميز بنود الحافظة (Portfolio Items Coding)', () => {

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

        // 2. الانتقال إلى إعدادات النظام -> ترميز الجباية وأمانة الصندوق -> ترميز بنود الحافظة
        console.log('2. Navigating to Portfolio Items screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز الجباية وأمانة الصندوق"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز بنود الحافظة"').first().click();
        await page.waitForTimeout(4000);

        // 3. التحقق من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/بنود الحافظة/i);
        expect(decodeURI(page.url())).toContain('ترميز-بنود-الحافظة');
        console.log('Verified: Correct Title and URL for ترميز-بنود-الحافظة!');
    });

    // 1️⃣ الفحص الأول: ترك الحقول المطلوبة فارغة والتأكد من ظهور رسائل التحقق
    test('1. ترك الحقول المطلوبة فارغة والتأكد من ظهور رسائل التحقق من الصحة', async ({ page }) => {
        console.log('--- Test 1: Empty required fields validation ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من ظهور النافذة المنبثقة
        const modalFrame = page.frameLocator('iframe');
        await expect(modalFrame.locator('#P70_BRIEFCASE_BAND_NAME')).toBeVisible({ timeout: 10000 });

        // ج) الضغط على زر حفظ دون إدخال البيانات
        await modalFrame.locator('button:has-text("حفظ")').click();

        // د) التحقق من رسائل الخطأ
        const modalAlert = modalFrame.locator('.t-Alert');
        await expect(modalAlert).toBeVisible({ timeout: 15000 });
        await expect(modalAlert).toContainText('يجب إدخال قيمة اسم البند');
        await expect(modalAlert).toContainText('يجب إدخال قيمة عنصر الفواتير');
        await page.waitForTimeout(1000);

        // هـ) التقاط صورة لتوثيق الخطأ
        await page.screenshot({ path: '1_portfolio_items_empty_error.png' });
        console.log('Screenshot saved: 1_portfolio_items_empty_error.png');
    });

    // 2️⃣ الفحص الثاني: التحقق من منع تكرار عنصر الفواتير
    test('2. التحقق من صحة وقواعد منع تكرار عنصر الفواتير', async ({ page }) => {
        console.log('--- Test 2: Duplicate billing element check ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        const modalFrame = page.frameLocator('iframe');

        // ب) اختيار عنصر فواتير من الـ Popup LOV
        const mapLovBtn = modalFrame.locator('button[data-for="P70_BRIEFCASE_BAND_MAPING"], #P70_BRIEFCASE_BAND_MAPING_lov_btn');
        await mapLovBtn.first().click();
        await page.waitForTimeout(2000);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li, .ui-dialog:visible .a-PopupLOV-results tr').first().click();
        await page.waitForTimeout(1500);

        // ج) إدخال اسم البند
        await modalFrame.locator('#P70_BRIEFCASE_BAND_NAME').fill('بند تجريبي لمنع التكرار');
        await page.waitForTimeout(1000);

        // د) الضغط على زر حفظ
        await modalFrame.locator('button:has-text("حفظ")').click();

        // هـ) التحقق من ظهور رسالة منع التكرار
        const modalAlert = modalFrame.locator('.t-Alert');
        await expect(modalAlert).toBeVisible({ timeout: 15000 });
        await expect(modalAlert).toContainText('عنصر الفاتوره موجود مسبقا');
        await page.waitForTimeout(1000);

        // و) التقاط صورة لتوثيق التحقق من التكرار
        await page.screenshot({ path: '2_portfolio_items_duplicate_error.png' });
        console.log('Screenshot saved: 2_portfolio_items_duplicate_error.png');
    });

    // 3️⃣ الفحص الثالث: إغلاق النافذة المنبثقة والتحقق من اختفائها
    test('3. إغلاق النافذة المنبثقة عبر زر الإغلاق والتأكد من إغلاقها', async ({ page }) => {
        console.log('--- Test 3: Close modal dialog ---');

        // أ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ب) التأكد من فتح النافذة المنبثقة
        const modalFrame = page.frameLocator('iframe');
        await expect(modalFrame.locator('#P70_BRIEFCASE_BAND_NAME')).toBeVisible({ timeout: 10000 });

        // ج) الضغط على زر إغلاق النافذة
        const closeBtn = page.locator('.ui-dialog-titlebar-close');
        await closeBtn.click();
        await page.waitForTimeout(2000);

        // د) التأكد من إغلاق النافذة واختفاء الـ iframe
        await expect(page.locator('iframe')).toHaveCount(0);
        console.log('Verified: Modal closed successfully.');

        // هـ) التقاط صورة لتوثيق إغلاق النافذة والعودة للشاشة الرئيسية
        await page.screenshot({ path: '3_portfolio_items_close_dialog.png' });
        console.log('Screenshot saved: 3_portfolio_items_close_dialog.png');
    });

});
