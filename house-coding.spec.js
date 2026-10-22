import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ترميز الدار', () => {

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

        // 2. الانتقال إلى شاشة ترميز الدار
        console.log('2. Navigating to Houses screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز التوزيع الجغرافي"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز الدار"').first().click();
        await page.waitForTimeout(4000);

        // 3. التأكد من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/الدار/i);
        expect(decodeURI(page.url())).toContain('ترميز-الدار');
        console.log('Verified: Correct Title and URL for ترميز-الدار!');
    });

    // 1️⃣ الفحص الأول: الضغط على إضافة بدون تحديد الحقول الإلزامية الخمسة
    test('1. الضغط على إضافة بدون تحديد البيانات الإلزامية والتأكد من رسائل الخطأ الخمسة', async ({ page }) => {
        console.log('--- Test 1: Click Add without required filters ---');
        await page.locator('button:has-text("إضافة")').click();

        // ننتظر ظهور صندوق التنبيه
        await page.locator('.t-Alert').waitFor({ state: 'visible', timeout: 15000 });
        await page.waitForTimeout(1000);

        // التحقق من ظهور رسائل الخطأ الخمسة الإلزامية
        await expect(page.locator('.t-Alert')).toContainText('يجب إدخال قيمة المحافظات');
        await expect(page.locator('.t-Alert')).toContainText('يجب إدخال قيمة القضاء-المركز');
        await expect(page.locator('.t-Alert')).toContainText('يجب إدخال قيمة المناطق');
        await expect(page.locator('.t-Alert')).toContainText('يجب إدخال قيمة المحلة');
        await expect(page.locator('.t-Alert')).toContainText('يجب إدخال قيمة الأزقة');

        await page.screenshot({ path: '1_house_missing_filters_error.png' });
        console.log('Screenshot saved: 1_house_missing_filters_error.png');
    });

    // 2️⃣ الفحص الثاني: اختيار الفلاتر الخمسة ثم إضافة دار جديدة بنجاح
    test('2. اختيار المحافظة والقضاء والمنطقة والمحلة والزقاق وإضافة دار جديدة وحفظها بنجاح', async ({ page }) => {
        console.log('--- Test 2: Select all 5 filters and add new House ---');

        // أ) اختيار المحافظة (بغداد)
        await page.locator('#P36_SECTION_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:has-text("بغداد")').click();
        await page.waitForTimeout(2000);

        // ب) اختيار القضاء-المركز
        await page.locator('#P36_BRANCH_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // ج) اختيار المنطقة
        await page.locator('#P36_AREA_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // د) اختيار المحلة
        await page.locator('#P36_BLOCK_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // هـ) اختيار الزقاق
        await page.locator('#P36_STREET_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // و) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ز) التعامل مع الـ iframe الخاص بالنافذة المنبثقة
        const modalFrame = page.frameLocator('iframe');

        // كتابة اسم دار تجريبي مميز
        const uniqueHouseName = `دار تجريبي ${Date.now().toString().slice(-4)}`;
        console.log(`Adding house: ${uniqueHouseName}`);
        await modalFrame.locator('#P37_B_NAME').fill(uniqueHouseName);
        await page.waitForTimeout(1000);

        // ح) الضغط على زر حفظ داخل النافذة
        await modalFrame.locator('button:has-text("حفظ")').click();

        // ط) التحقق من ظهور إشعار النجاح الأخضر في الصفحة الرئيسية
        const successBanner = page.locator('.t-Alert--success, .t-Alert:has-text("تم حفظ البيانات بنجاح")');
        await expect(successBanner).toBeVisible({ timeout: 15000 });
        await expect(successBanner).toContainText('تم حفظ البيانات بنجاح');
        await page.waitForTimeout(1000);

        // ي) التقاط صورة لتوثيق نجاح الحفظ
        await page.screenshot({ path: '2_valid_house_saved.png' });
        console.log('Screenshot saved: 2_valid_house_saved.png');
    });

    // 3️⃣ الفحص الثالث: فحص التحقق من صحة المدخلات داخل نافذة إضافة الدار (إدخال نص في حقل رقمي)
    test('3. إدخال قيمة غير صالحة في حقل عدد الأدوار والتأكد من رسالة الخطأ', async ({ page }) => {
        console.log('--- Test 3: Enter invalid non-numeric value in Floor Count ---');

        // أ) اختيار المحافظة (بغداد)
        await page.locator('#P36_SECTION_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:has-text("بغداد")').click();
        await page.waitForTimeout(2000);

        // ب) اختيار القضاء-المركز
        await page.locator('#P36_BRANCH_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // ج) اختيار المنطقة
        await page.locator('#P36_AREA_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // د) اختيار المحلة
        await page.locator('#P36_BLOCK_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // هـ) اختيار الزقاق
        await page.locator('#P36_STREET_CODE_lov_btn').click();
        await page.waitForTimeout(1000);
        await page.locator('[role="option"]:visible').first().click();
        await page.waitForTimeout(2000);

        // و) الضغط على زر إضافة
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        // ز) إدخال نص غير رقمي في حقل عدد الأدوار
        const modalFrame = page.frameLocator('iframe');
        await modalFrame.locator('#P37_FLOOR_COUNT').fill('نص_غير_رقمي');
        await page.waitForTimeout(1000);

        // ح) الضغط على زر حفظ داخل النافذة المنبثقة
        await modalFrame.locator('button:has-text("حفظ")').click();

        // ط) التحقق من ظهور رسالة الخطأ داخل النافذة المنبثقة
        const modalAlert = modalFrame.locator('.t-Alert');
        await expect(modalAlert).toBeVisible({ timeout: 15000 });
        await expect(modalAlert).toContainText('يجيب إدخال رقم عدد الأدوار');
        await page.waitForTimeout(1000);

        // ي) التقاط صورة لتوثيق الخطأ
        await page.screenshot({ path: '3_house_invalid_floor_error.png' });
        console.log('Screenshot saved: 3_house_invalid_floor_error.png');
    });

});
