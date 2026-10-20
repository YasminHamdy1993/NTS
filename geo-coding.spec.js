import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ترميز المحافظات', () => {

    // خطوة تتكرر قبل كل فحص: فتح الصفحة والتأكد من العنوان والـ URL
    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000);

        // 1. تسجيل الدخول
        console.log('1. Navigating and Logging in...');
        await page.goto('https://apex.ntgcloud.net/ords/r/nts/master-app102/login', { waitUntil: 'domcontentloaded' });
        await page.locator('#P9999_USERNAME').fill('ADMIN');
        await page.locator('#P9999_PASSWORD').fill('admin');
        await page.locator('#P9999_SELECT_APP').selectOption('100');
        await page.locator('button:has-text("تسجيل الدخول")').click();
        await page.waitForTimeout(5000);

        // 2. الوصول لشاشة ترميز المحافظات
        console.log('2. Navigating to Provinces screen...');
        await page.locator('text="إعدادات النظام"').click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز التوزيع الجغرافي"').click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز المحافظات"').click();
        await page.waitForTimeout(4000);

        // 3. التأكد من عنوان الصفحة (Title) والرابط (URL)
        await expect(page).toHaveTitle(/المحافظات/i);
        expect(decodeURI(page.url())).toContain('ترميز-المحافظات');
        console.log('Verified: Correct Title and URL for ترميز-المحافظات!');
    });

    // 1️⃣ الحالة الأولى: ترك الحقل فارغاً (Empty Field)
    test('1. ترك اسم المحافظة فارغاً والضغط على حفظ', async ({ page }) => {
        console.log('--- Test 1: Empty Field ---');
        await page.locator('button:has-text("إضافة")').click();

        const modal = page.frameLocator('iframe');
        // ننتظر فتح النافذة وظهور حقل الإدخال
        await modal.locator('#P3_SECTION_NAME').waitFor({ state: 'visible', timeout: 10000 });
        await modal.locator('button:has-text("حفظ")').click();

        // ننتظر ظهور رسالة الخطأ بوضوح لتجنب التقاط علامة التحميل (Spinner)
        console.log('Waiting for error message...');
        await modal.locator('.t-Alert').waitFor({ state: 'visible', timeout: 15000 });
        await page.waitForTimeout(1000);

        await page.screenshot({ path: '1_empty_province_error.png' });
        console.log('Screenshot saved: 1_empty_province_error.png');
    });

    // 2️⃣ الحالة الثانية: إدخال اسم مكرر موجود مسبقاً (Duplicate Data)
    test('2. إدخال اسم محافظة مكررة والتأكد من رفض التكرار', async ({ page }) => {
        console.log('--- Test 2: Duplicate Province ---');
        await page.locator('button:has-text("إضافة")').click();

        const modal = page.frameLocator('iframe');
        await modal.locator('#P3_SECTION_NAME').waitFor({ state: 'visible', timeout: 10000 });
        // نكتب اسماً موجوداً بالفعل في الجدول (مثل بغداد)
        await modal.locator('#P3_SECTION_NAME').fill('بغداد');
        await modal.locator('button:has-text("حفظ")').click();

        // ننتظر حتى ينتهي الحفظ أو يظهر الرد لتأكيد نتيجة الاختبار
        await page.waitForTimeout(3000);

        await page.screenshot({ path: '2_duplicate_province_error.png' });
        console.log('Screenshot saved: 2_duplicate_province_error.png');
    });

    // 3️⃣ الحالة الثالثة: إدخال محافظة جديدة وحفظها بنجاح (Valid Data)
    test('3. إدخال محافظة جديدة وحفظها بنجاح', async ({ page }) => {
        console.log('--- Test 3: Valid Province ---');
        await page.locator('button:has-text("إضافة")').click();

        const modal = page.frameLocator('iframe');
        // اسم عشوائي جديد حتى لا يتكرر في كل فحص
        const newProvinceName = 'محافظة تجريبية ' + Math.floor(Math.random() * 1000);
        await modal.locator('#P3_SECTION_NAME').fill(newProvinceName);
        await modal.locator('button:has-text("حفظ")').click();

        await page.waitForTimeout(3000);
        await page.screenshot({ path: '3_valid_province_saved.png' });
        console.log('Screenshot saved: 3_valid_province_saved.png');
    });

});
