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

    // 1️⃣ الفحص الأول: الضغط على إضافة بدون تحديد الحقول الإلزامية الأربعة
    test('1. الضغط على إضافة بدون تحديد البيانات الإلزامية والتأكد من رسائل الخطأ الأربعة', async ({ page }) => {
        console.log('--- Test 1: Click Add without required filters ---');
        await page.locator('button:has-text("إضافة")').click();

        // ننتظر ظهور صندوق التنبيه
        await page.locator('.t-Alert').waitFor({ state: 'visible', timeout: 15000 });
        await page.waitForTimeout(1000);

        // التحقق من ظهور رسائل الخطأ الأربعة
        await expect(page.locator('.t-Alert')).toContainText('يجب إدخال قيمة المحافظات');
        await expect(page.locator('.t-Alert')).toContainText('يجب إدخال قيمة القضاء-المركز');
        await expect(page.locator('.t-Alert')).toContainText('يجب إدخال قيمة المناطق');
        await expect(page.locator('.t-Alert')).toContainText('يجب إدخال قيمة المحلة');

        await page.screenshot({ path: '1_alley_missing_filters_error.png' });
        console.log('Screenshot saved: 1_alley_missing_filters_error.png');
    });

    // 2️⃣ الفحص الثاني: اختيار الفلاتر الأربعة ثم إضافة زقاق جديد بنجاح
    test('2. اختيار المحافظة والقضاء والمنطقة والمحلة وإضافة زقاق جديد وحفظه بنجاح', async ({ page }) => {
        console.log('--- Test 2: Select all 4 filters and add new Alley ---');

        // أ) اختيار المحافظة (بغداد)
        await page.locator('#P32_SECTION_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:has-text("بغداد")').click();
        await page.waitForTimeout(2000);

        // ب) اختيار القضاء-المركز
        await page.locator('#P32_BRANCH_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // ج) اختيار المنطقة
        await page.locator('#P32_AREA_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // د) اختيار المحلة
        await page.locator('#P32_BLOCK_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // هـ) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();

        // و) التعامل مع نافذة الإضافة (iframe)
        const modal = page.frameLocator('iframe');
        await modal.locator('#P33_STREET_NAME').waitFor({ state: 'visible', timeout: 10000 });

        // ز) كتابة اسم زقاق جديد فريد وحفظه
        const newAlleyName = 'زقاق تجريبي ' + Math.floor(Math.random() * 1000);
        await modal.locator('#P33_STREET_NAME').fill(newAlleyName);
        await modal.locator('button:has-text("حفظ")').click();

        // ح) انتظار إشعار النجاح وأخذ لقطة الشاشة
        await page.waitForTimeout(3000);
        await page.screenshot({ path: '2_valid_alley_saved.png' });
        console.log('Screenshot saved: 2_valid_alley_saved.png');
    });

    // 3️⃣ الفحص الثالث: اختيار الفلاتر الأربعة ثم ترك اسم الزقاق فارغاً والضغط على حفظ
    test('3. ترك اسم الزقاق فارغاً والتأكد من رسالة الخطأ', async ({ page }) => {
        console.log('--- Test 3: Leave Alley name empty ---');

        // أ) اختيار الفلاتر الأربعة
        await page.locator('#P32_SECTION_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:has-text("بغداد")').click();
        await page.waitForTimeout(2000);

        await page.locator('#P32_BRANCH_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        await page.locator('#P32_AREA_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        await page.locator('#P32_BLOCK_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // ب) الضغط على إضافة
        await page.locator('button:has-text("إضافة")').click();

        // ج) نافذة الإضافة وترك اسم الزقاق فارغاً
        const modal = page.frameLocator('iframe');
        await modal.locator('#P33_STREET_NAME').waitFor({ state: 'visible', timeout: 10000 });
        await modal.locator('button:has-text("حفظ")').click();

        // د) انتظار ظهور رسالة الخطأ داخل الـ Modal
        await modal.locator('.t-Alert').waitFor({ state: 'visible', timeout: 15000 });
        await page.waitForTimeout(1000);

        await page.screenshot({ path: '3_alley_empty_name_error.png' });
        console.log('Screenshot saved: 3_alley_empty_name_error.png');
    });

});
