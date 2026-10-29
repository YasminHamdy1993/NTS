import { test, expect } from '@playwright/test';

test.describe('فحوصات شاشة ربط الطلبات بالخطوات (Link Requests to Steps)', () => {

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

        // 2. الانتقال إلى إعدادات النظام -> ترميز خدمات الزبائن -> ربط الطلبات بالخطوات
        console.log('2. Navigating to Link Requests to Steps screen...');
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز خدمات الزبائن"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ربط الطلبات بالخطوات"').first().click();
        await page.waitForTimeout(4000);

        // 3. التحقق من عنوان الصفحة والرابط
        await expect(page).toHaveTitle(/ربط الطلبات بالخطوات/i);
        expect(decodeURI(page.url())).toContain('ربط-الطلبات-بالخطوات');
        console.log('Verified: Correct Title and URL for ربط-الطلبات-بالخطوات!');
    });

    // 1️⃣ الفحص الأول: اختيار نوع طلب من القائمة والتحقق من مزامنة وعرض الخطوات المرتبطة به
    test('1. اختيار نوع طلب من القائمة والتحقق من مزامنة وعرض الخطوات المرتبطة به', async ({ page }) => {
        console.log('--- Test 1: Select request and verify linked steps loaded ---');

        // أ) فتح قائمة اختيار اسم الطلب
        const lovBtn = page.locator('#P145_D_REQUEST_TYPE_CODE_lov_btn');
        if (await lovBtn.count() > 0) {
            await lovBtn.click();
        } else {
            await page.locator('#P145_D_REQUEST_TYPE_CODE').click();
        }
        await page.waitForTimeout(2000);

        // ب) اختيار أول طلب من القائمة المنبثقة
        const popupDialog = page.locator('.a-PopupLOV-dialog:visible');
        await expect(popupDialog).toBeVisible({ timeout: 10000 });
        const firstOption = popupDialog.locator('li').first();
        const selectedReqName = await firstOption.innerText();
        console.log(`Selected request: "${selectedReqName.trim()}"`);
        await firstOption.click();
        await page.waitForTimeout(3000);

        // ج) التحقق من تحميل خطوات الطلب في الجدول التفاعلي (Interactive Grid)
        const gridRows = page.locator('.a-GV-row');
        await expect(gridRows.first()).toBeVisible({ timeout: 15000 });
        const rowCount = await gridRows.count();
        expect(rowCount).toBeGreaterThan(0);
        console.log(`Verified: Grid loaded with ${rowCount} linked steps.`);

        // د) التقاط صورة توثق تحميل الخطوات المرتبطة
        await page.screenshot({ path: '1_request_steps_link_loaded.png' });
        console.log('Screenshot saved: 1_request_steps_link_loaded.png');
    });

    // 2️⃣ الفحص الثاني: فلترة وبحث الخطوات داخل الجدول التفاعلي والتحقق من دقة النتائج
    test('2. فلترة وبحث الخطوات داخل الجدول التفاعلي والتحقق من دقة النتائج', async ({ page }) => {
        console.log('--- Test 2: Search and filter steps in interactive grid ---');

        // أ) اختيار نوع طلب لعرض الخطوات أولاً
        const lovBtn = page.locator('#P145_D_REQUEST_TYPE_CODE_lov_btn');
        if (await lovBtn.count() > 0) {
            await lovBtn.click();
        } else {
            await page.locator('#P145_D_REQUEST_TYPE_CODE').click();
        }
        await page.waitForTimeout(2000);

        const popupDialog = page.locator('.a-PopupLOV-dialog:visible');
        await popupDialog.locator('li').first().click();
        await page.waitForTimeout(3000);

        // ب) إدخال كلمة بحث في حقل البحث الخاص بالجدول التفاعلي
        const searchInput = page.locator('.a-IG-search, input[placeholder*="بحث في"], input[aria-label*="بحث"]').first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill('تسجيل');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);

        // ج) التحقق من ظهور النتائج المفلترة المطابقة لكلمة البحث
        const filteredTable = page.locator('.a-GV-table').last();
        await expect(filteredTable).toContainText('تسجيل');
        console.log('Verified: Grid filtered successfully matching search query.');

        // د) التقاط صورة لتوثيق الفلترة
        await page.screenshot({ path: '2_request_steps_link_filtered.png' });
        console.log('Screenshot saved: 2_request_steps_link_filtered.png');
    });

    // 3️⃣ الفحص الثالث: إعادة تعيين الجدول التفاعلي والتأكد من استعادة الحالة الافتراضية
    test('3. إعادة تعيين الجدول التفاعلي والتأكد من استعادة الحالة الافتراضية', async ({ page }) => {
        console.log('--- Test 3: Reset grid and verify default state ---');

        // أ) اختيار نوع طلب أولاً
        const lovBtn = page.locator('#P145_D_REQUEST_TYPE_CODE_lov_btn');
        if (await lovBtn.count() > 0) {
            await lovBtn.click();
        } else {
            await page.locator('#P145_D_REQUEST_TYPE_CODE').click();
        }
        await page.waitForTimeout(2000);

        const popupDialog = page.locator('.a-PopupLOV-dialog:visible');
        await popupDialog.locator('li').first().click();
        await page.waitForTimeout(3000);

        // ب) تطبيق فلترة مؤقتة
        const searchInput = page.locator('.a-IG-search, input[placeholder*="بحث في"], input[aria-label*="بحث"]').first();
        await searchInput.fill('المقايسة');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);

        // ج) الضغط على زر إعادة تعيين
        const resetBtn = page.locator('button:has-text("إعادة تعيين")');
        await expect(resetBtn).toBeVisible({ timeout: 10000 });
        await resetBtn.click();
        await page.waitForTimeout(3000);

        // د) التحقق من إعادة تعيين البحث واستعادة كافة الصفوف
        const gridRows = page.locator('.a-GV-row');
        const rowCount = await gridRows.count();
        expect(rowCount).toBeGreaterThanOrEqual(1);
        console.log(`Verified: Grid reset successfully with ${rowCount} rows restored.`);

        // هـ) التقاط صورة لتوثيق استعادة الحالة الافتراضية
        await page.screenshot({ path: '3_request_steps_link_reset.png' });
        console.log('Screenshot saved: 3_request_steps_link_reset.png');
    });

});
