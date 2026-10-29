import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة خطوات تشغيل الإصدار (Release Operation Steps Coding)', () => {

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

        // 2. الانتقال إلى إعدادات النظام -> إعدادات التشغيل الأساسية -> خطوات تشغيل الإصدار
        console.log('2. Navigating to Release Operation Steps screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="إعدادات التشغيل الأساسية"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="خطوات تشغيل الإصدار"').first().click();
        await page.waitForTimeout(4000);

        // 3. التحقق من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/خطوات تشغيل الاصدار/i);
        expect(decodeURI(page.url())).toContain('خطوات-تشغيل-الاصدار');
        console.log('Verified: Correct Title and URL for خطوات-تشغيل-الاصدار!');
    });

    // 1️⃣ الفحص الأول: التأكد من تحميل جدول خطوات تشغيل الإصدار المرجعية والتحقق من وجود الخطوات الأساسية
    test('1. التأكد من تحميل جدول خطوات تشغيل الإصدار المرجعية والتحقق من وجود الخطوات الأساسية', async ({ page }) => {
        console.log('--- Test 1: Verify reference release steps loaded ---');

        // أ) التحقق من وجود جدول التقرير التفاعلي
        const reportTable = page.locator('table.a-IRR-table').last();
        await expect(reportTable).toBeVisible({ timeout: 15000 });

        // ب) التحقق من احتواء الجدول على الخطوات التشغيلية الأساسية
        await expect(reportTable).toContainText('فتح دورة الاصدار');
        await expect(reportTable).toContainText('تسجيل القراءات');
        await expect(reportTable).toContainText('حساب الفواتير');
        await expect(reportTable).toContainText('اغلاق الدورة');

        // ج) التحقق من عدد صفوف الخطوات
        const rowCount = await reportTable.locator('tbody tr').count();
        expect(rowCount).toBeGreaterThanOrEqual(10);
        console.log(`Verified: Found ${rowCount} reference workflow steps.`);

        // د) التقاط صورة لتوثيق عرض خطوات تشغيل الإصدار
        await page.screenshot({ path: '1_release_steps_loaded.png' });
        console.log('Screenshot saved: 1_release_steps_loaded.png');
    });

    // 2️⃣ الفحص الثاني: البحث والفلترة في خطوات التشغيل والتحقق من دقة التصفية
    test('2. البحث والفلترة في خطوات التشغيل والتحقق من دقة التصفية', async ({ page }) => {
        console.log('--- Test 2: Search and filter release steps ---');

        // أ) إدخال كلمة البحث في التقرير التفاعلي
        const searchInput = page.locator('.a-IRR-search-field, input[title*="بحث"]').first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill('الفواتير');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);

        // ب) التحقق من ظهور النتائج المفلترة المطابقة للبحث
        const reportTable = page.locator('table.a-IRR-table').last();
        await expect(reportTable).toContainText('الفواتير');

        // ج) التحقق من ظهور شارة الفلتر
        const filterBadge = page.locator('.a-IRR-controls-item');
        await expect(filterBadge).toBeVisible({ timeout: 10000 });
        console.log('Verified: Filter applied successfully.');

        // د) التقاط صورة لتوثيق نتائج التصفية
        await page.screenshot({ path: '2_release_steps_filtered.png' });
        console.log('Screenshot saved: 2_release_steps_filtered.png');
    });

    // 3️⃣ الفحص الثالث: معاينة تفاصيل خطوة التشغيل وإغلاق النافذة بنجاح
    test('3. معاينة تفاصيل خطوة التشغيل وإغلاق النافذة بنجاح', async ({ page }) => {
        console.log('--- Test 3: Preview step details and close ---');

        // أ) الضغط على أيقونة التعديل/المعاينة لأول خطوة
        const editLink = page.locator('table.a-IRR-table td a').first();
        await expect(editLink).toBeVisible({ timeout: 10000 });
        await editLink.click();
        await page.waitForTimeout(3000);

        // ب) التحقق من فتح نافذة المعاينة
        const modalFrame = page.frameLocator('iframe:visible');
        const modalTitle = page.locator('.ui-dialog-title:visible');
        await expect(modalTitle).toBeVisible({ timeout: 10000 });
        console.log('Verified: Step details modal opened.');

        // ج) إغلاق النافذة عبر زر الإغلاق العلوي
        const closeBtn = page.locator('button.ui-dialog-titlebar-close:visible');
        await closeBtn.click();
        await page.waitForTimeout(2000);

        // د) التأكد من إغلاق النافذة
        await expect(page.locator('.ui-dialog:visible')).toHaveCount(0);
        console.log('Verified: Details modal closed successfully.');

        // هـ) التقاط صورة لتوثيق العودة للشاشة الرئيسية
        await page.screenshot({ path: '3_release_steps_details_closed.png' });
        console.log('Screenshot saved: 3_release_steps_details_closed.png');
    });

});
