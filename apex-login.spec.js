import { test, expect } from '@playwright/test';

test.describe('اختبارات شاشة تسجيل الدخول - Oracle APEX', () => {

    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000);
        console.log('Navigating to APEX login page...');
        await page.goto('https://apex.ntgcloud.net/ords/r/nts/master-app102/login', { waitUntil: 'domcontentloaded' });
    });

    // 1️⃣ الحالة الأولى: تجربة بيانات خاطئة (Invalid)
    test('Invalid_login', async ({ page }) => {
        console.log('--- Test 1: Invalid Credentials ---');
        await page.locator('#P9999_USERNAME').fill('yasmin');
        await page.locator('#P9999_PASSWORD').fill('123');
        await page.locator('button:has-text("تسجيل الدخول")').click();

        // ننتظر حتى تظهر رسالة الخطأ وتكتمل واجهة الصفحة بالكامل
        console.log('Waiting for error message & login card...');
        await page.locator('.t-Alert').waitFor({ state: 'visible', timeout: 20000 });
        await page.locator('#P9999_USERNAME').waitFor({ state: 'visible', timeout: 20000 });
        await page.waitForTimeout(1000);

        await page.screenshot({ path: '1_invalid_login.png' });
        console.log('Screenshot saved: 1_invalid_login.png');
    });

    // 2️⃣ الحالة الثانية: ترك الحقول فارغة (Empty Fields)
    test('Empty Fields', async ({ page }) => {
        console.log('--- Test 2: Empty Fields ---');
        await page.locator('button:has-text("تسجيل الدخول")').click();

        // ننتظر حتى تظهر رسالة التنبيه وتبقى واجهة تسجيل الدخول واضحة
        console.log('Waiting for alert & login card...');
        await page.locator('.t-Alert').waitFor({ state: 'visible', timeout: 20000 });
        await page.locator('#P9999_USERNAME').waitFor({ state: 'visible', timeout: 20000 });
        await page.waitForTimeout(1000);

        await page.screenshot({ path: '2_empty_fields.png' });
        console.log('Screenshot saved: 2_empty_fields.png');
    });

    // 3️⃣ الحالة الثالثة: تسجيل دخول ببيانات صحيحة (Valid)
    test('Valid_login', async ({ page }) => {
        console.log('--- Test 3: Valid Credentials ---');
        await page.locator('#P9999_USERNAME').fill('ADMIN');
        await page.locator('#P9999_PASSWORD').fill('admin');
        await page.locator('#P9999_SELECT_APP').selectOption('100');
        await page.locator('#P9999_REMEMBER_0').check();
        await page.locator('button:has-text("تسجيل الدخول")').click();

        console.log('Waiting for dashboard to load...');
        await page.waitForTimeout(6000);

        await page.screenshot({ path: '3_valid_login.png' });
        console.log('Screenshot saved: 3_valid_login.png');
    });

});
