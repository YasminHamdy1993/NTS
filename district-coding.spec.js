import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ترميز القضاء-المركز', () => {

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

        // 2. الانتقال إلى شاشة ترميز القضاء-المركز
        console.log('2. Navigating to Districts screen...');
        await page.locator('text="إعدادات النظام"').click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز التوزيع الجغرافي"').click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز القضاء-المركز"').click();
        await page.waitForTimeout(4000);

        // 3. التأكد من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/القضاء-المركز/i);
        expect(decodeURI(page.url())).toContain('ترميز-القضاء-المركز');
        console.log('Verified: Correct Title and URL for ترميز-القضاء-المركز!');
    });

    // 1️⃣ الفحص الأول: الضغط على إضافة بدون اختيار محافظة
    test('1. الضغط على إضافة بدون اختيار محافظة والتأكد من رسالة الخطأ', async ({ page }) => {
        console.log('--- Test 1: Click Add without selecting province ---');
        await page.locator('button:has-text("إضافة")').click();

        // ننتظر ظهور رسالة الخطأ الصفراء
        await page.locator('.t-Alert').waitFor({ state: 'visible', timeout: 15000 });
        await page.waitForTimeout(1000);

        // التحقق من نص رسالة الخطأ
        await expect(page.locator('.t-Alert')).toContainText('يجب إدخال قيمة المحافظات');

        await page.screenshot({ path: '1_district_missing_province_error.png' });
        console.log('Screenshot saved: 1_district_missing_province_error.png');
    });

    // 2️⃣ الفحص الثاني: اختيار محافظة مسبقة ثم إضافة قضاء وحفظه بنجاح
    test('2. اختيار محافظة وإضافة قضاء جديد وحفظه بنجاح', async ({ page }) => {
        console.log('--- Test 2: Select province and add new district ---');

        // أ) فتح قائمة المحافظات واختيار محافظة (مثلاً: الديوانية)
        await page.locator('#P6_SECTION_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:has-text("الديوانية")').click();
        await page.waitForTimeout(2000);

        // ب) الضغط على زر إضافة بعد تحديد المحافظة
        await page.locator('button:has-text("إضافة")').click();

        // ج) التعامل مع النافذة المنبثقة (iframe)
        const modal = page.frameLocator('iframe');
        await modal.locator('#P7_BRANCH_NAME').waitFor({ state: 'visible', timeout: 10000 });

        // د) كتابة اسم قضاء جديد فريد وحفظه
        const newDistrictName = 'قضاء تجريبي ' + Math.floor(Math.random() * 1000);
        await modal.locator('#P7_BRANCH_NAME').fill(newDistrictName);
        await modal.locator('button:has-text("حفظ")').click();

        // هـ) ننتظر حتى ينتهي الحفظ وتظهر رسالة النجاح
        await page.waitForTimeout(3000);
        await page.screenshot({ path: '2_valid_district_saved.png' });
        console.log('Screenshot saved: 2_valid_district_saved.png');
    });

    // 3️⃣ الفحص الثالث: اختيار محافظة وترك حقل اسم القضاء فارغاً والضغط على حفظ
    test('3. ترك اسم القضاء-المركز فارغاً والتأكد من رسالة الخطأ', async ({ page }) => {
        console.log('--- Test 3: Leave district name empty ---');

        // أ) اختيار محافظة (الديوانية)
        await page.locator('#P6_SECTION_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:has-text("الديوانية")').click();
        await page.waitForTimeout(2000);

        // ب) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();

        // ج) النافذة المنبثقة (iframe)
        const modal = page.frameLocator('iframe');
        await modal.locator('#P7_BRANCH_NAME').waitFor({ state: 'visible', timeout: 10000 });

        // د) نترك الحقل فارغاً ونضغط على حفظ مباشرة
        await modal.locator('button:has-text("حفظ")').click();

        // هـ) ننتظر ظهور رسالة الخطأ داخل الـ modal
        await modal.locator('.t-Alert').waitFor({ state: 'visible', timeout: 15000 });
        await page.waitForTimeout(1000);

        await page.screenshot({ path: '3_district_empty_name_error.png' });
        console.log('Screenshot saved: 3_district_empty_name_error.png');
    });

});

