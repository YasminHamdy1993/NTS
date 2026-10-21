import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ترميز المحلة', () => {

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

        // 2. الانتقال إلى شاشة ترميز المحلة
        console.log('2. Navigating to Mahalla screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز التوزيع الجغرافي"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز المحلة"').first().click();
        await page.waitForTimeout(4000);

        // 3. التأكد من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/المحلة/i);
        expect(decodeURI(page.url())).toContain('ترميز-المحلة');
        console.log('Verified: Correct Title and URL for ترميز-المحلة!');
    });

    // 1️⃣ الفحص الأول: الضغط على إضافة بدون تحديد المحافظة والقضاء والمنطقة
    test('1. الضغط على إضافة بدون تحديد البيانات الإلزامية والتأكد من رسائل الخطأ الثلاث', async ({ page }) => {
        console.log('--- Test 1: Click Add without required filters ---');
        await page.locator('button:has-text("إضافة")').click();

        // ننتظر ظهور صندوق التنبيه
        await page.locator('.t-Alert').waitFor({ state: 'visible', timeout: 15000 });
        await page.waitForTimeout(1000);

        // التحقق من ظهور رسائل الخطأ الثلاث
        await expect(page.locator('.t-Alert')).toContainText('يجب إدخال قيمة المحافظات');
        await expect(page.locator('.t-Alert')).toContainText('يجب إدخال قيمة القضاء-المركز');
        await expect(page.locator('.t-Alert')).toContainText('يجب إدخال قيمة المناطق');

        await page.screenshot({ path: '1_mahalla_missing_filters_error.png' });
        console.log('Screenshot saved: 1_mahalla_missing_filters_error.png');
    });

    // 2️⃣ الفحص الثاني: اختيار المحافظة والقضاء والمنطقة ثم إضافة محلة جديدة وحفظها بنجاح
    test('2. اختيار المحافظة والقضاء والمنطقة وإضافة محلة جديدة وحفظها بنجاح', async ({ page }) => {
        console.log('--- Test 2: Select Province, District, Area, and Add new Mahalla ---');

        // أ) اختيار المحافظة (بغداد)
        await page.locator('#P30_SECTION_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:has-text("بغداد")').click();
        await page.waitForTimeout(2000);

        // ب) اختيار القضاء-المركز
        await page.locator('#P30_BRANCH_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // ج) اختيار المنطقة
        await page.locator('#P30_AREA_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // د) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();

        // هـ) التعامل مع نافذة الإضافة (iframe)
        const modal = page.frameLocator('iframe');
        await modal.locator('#P31_BLOCK_NAME').waitFor({ state: 'visible', timeout: 10000 });

        // و) كتابة اسم محلة جديدة فريد وحفظها
        const newMahallaName = 'محلة تجريبية ' + Math.floor(Math.random() * 1000);
        await modal.locator('#P31_BLOCK_NAME').fill(newMahallaName);
        await modal.locator('button:has-text("حفظ")').click();

        // ز) انتظار إشعار النجاح وأخذ لقطة الشاشة
        await page.waitForTimeout(3000);
        await page.screenshot({ path: '2_valid_mahalla_saved.png' });
        console.log('Screenshot saved: 2_valid_mahalla_saved.png');
    });

    // 3️⃣ الفحص الثالث: اختيار المحافظة والقضاء والمنطقة ثم ترك اسم المحلة فارغاً والضغط على حفظ
    test('3. ترك اسم المحلة فارغاً والتأكد من رسالة الخطأ', async ({ page }) => {
        console.log('--- Test 3: Leave Mahalla name empty ---');

        // أ) اختيار الفلاتر الثلاثة
        await page.locator('#P30_SECTION_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:has-text("بغداد")').click();
        await page.waitForTimeout(2000);

        await page.locator('#P30_BRANCH_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        await page.locator('#P30_AREA_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // ب) الضغط على إضافة
        await page.locator('button:has-text("إضافة")').click();

        // ج) نافذة الإضافة وترك اسم المحلة فارغاً
        const modal = page.frameLocator('iframe');
        await modal.locator('#P31_BLOCK_NAME').waitFor({ state: 'visible', timeout: 10000 });
        await modal.locator('button:has-text("حفظ")').click();

        // د) انتظار ظهور رسالة الخطأ داخل الـ Modal
        await modal.locator('.t-Alert').waitFor({ state: 'visible', timeout: 15000 });
        await page.waitForTimeout(1000);

        await page.screenshot({ path: '3_mahalla_empty_name_error.png' });
        console.log('Screenshot saved: 3_mahalla_empty_name_error.png');
    });

});
