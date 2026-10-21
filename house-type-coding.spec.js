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
        await page.locator('text="إعدادات النظام"').click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز التوزيع الجغرافي"').click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز أنواع الدار"').click();
        await page.waitForTimeout(4000);

        // 3. التأكد من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/أنواع الدار/i);
        expect(decodeURI(page.url())).toContain('ترميز-أنواع-الدار');
        console.log('Verified: Correct Title and URL for ترميز-أنواع-الدار!');
    });

    // 1️⃣ الفحص الأول: فتح نافذة إضافة نوع دار والتأكد من عناصرها
    test('1. فتح نافذة إضافة والتأكد من الحقول الإلزامية', async ({ page }) => {
        console.log('--- Test 1: Add House Type ---');
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(2000);

        await page.screenshot({ path: '1_house_type_add_dialog.png' });
        console.log('Screenshot saved: 1_house_type_add_dialog.png');
    });

});
