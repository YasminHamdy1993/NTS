import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ترميز الأزقة', () => {

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

        // 2. الانتقال إلى شاشة ترميز الأزقة
        console.log('2. Navigating to Alleys screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز التوزيع الجغرافي"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز الأزقة"').first().click();
        await page.waitForTimeout(4000);

        // 3. التأكد من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/الأزقة/i);
        expect(decodeURI(page.url())).toContain('ترميز-الأزقة');
        console.log('Verified: Correct Title and URL for ترميز-الأزقة!');
    });

    // 1️⃣ الفحص الأول: الضغط على إضافة والتأكد من التحقق من صحة المدخلات
    test('1. الضغط على إضافة بدون تحديد الحقول والتأكد من رسالة الخطأ', async ({ page }) => {
        console.log('--- Test 1: Click Add without required filters ---');
        await page.locator('button:has-text("إضافة")').click();

        await page.locator('.t-Alert').waitFor({ state: 'visible', timeout: 15000 });
        await page.waitForTimeout(1000);

        await page.screenshot({ path: '1_alley_missing_filters_error.png' });
        console.log('Screenshot saved: 1_alley_missing_filters_error.png');
    });

});
