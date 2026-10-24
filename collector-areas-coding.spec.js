import { test, expect } from '@playwright/test';

test.describe.serial('توزيع الجباة على المناطق (Collector Areas Assignment Coding)', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        // 1. Login
        await page.goto('https://apex.ntgcloud.net/ords/r/nts/master-app102/login', { waitUntil: 'domcontentloaded' });
        await page.locator('#P9999_USERNAME').fill('ADMIN');
        await page.locator('#P9999_PASSWORD').fill('admin');
        await page.locator('#P9999_SELECT_APP').selectOption('100');
        await page.locator('button:has-text("تسجيل الدخول")').click();
        await page.waitForTimeout(5000);

        // 2. Navigate to System Settings -> ترميز الجباة -> توزيع الجباة على المناطق
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز الجباة"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="توزيع الجباة على المناطق"').first().click();
        await page.waitForTimeout(4000);
    });

    test.afterAll(async () => {
        if (page) {
            await page.close();
        }
    });

    test('1. Validation Error: Required fields validation upon empty save', async () => {
        test.setTimeout(60000);

        // Click "إضافة" to open modal
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        const frame = page.frameLocator('iframe');

        // Click "حفظ" without filling any fields
        await frame.locator('button:has-text("حفظ")').click();
        await page.waitForTimeout(2000);

        // Verify validation error messages
        const errorAlert = frame.locator('.t-Alert--error, .a-Notification--error');
        await expect(errorAlert).toBeVisible();

        const errorText = await errorAlert.innerText();
        expect(errorText).toContain('يجب إدخال قيمة');

        // Screenshot
        await page.screenshot({ path: '1_collector_areas_validation_error.png', fullPage: true });

        // Close modal
        await frame.locator('button:has-text("إلغاء")').click();
        await page.waitForTimeout(2000);
    });

    test('2. Valid Add: Successfully assigning an area to a collector', async () => {
        test.setTimeout(90000);

        // Step A: Filter on Page 55 to check if "المعارض" is already assigned to this collector, and clean up if needed
        await page.locator('#P55_SECTION_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li').first().click();
        await page.waitForTimeout(1500);

        await page.locator('#P55_BRANCH_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li').first().click();
        await page.waitForTimeout(1500);

        await page.locator('#P55_COLLECTOR_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li').first().click();
        await page.waitForTimeout(3000);

        // If row with "المعارض" exists in table, delete it first to ensure clean test state
        const rowWithMaared = page.locator('table.a-IRR-table tr:has-text("المعارض")');
        if (await rowWithMaared.count() > 0) {
            await rowWithMaared.first().locator('a[href*="p56_rowid"]').click();
            await page.waitForTimeout(3000);
            const editFrame = page.frameLocator('iframe');
            await editFrame.locator('button:has-text("حذف")').click();
            await page.waitForTimeout(2000);
            const alertDialog = page.locator('div[role="alertdialog"]:visible');
            if (await alertDialog.count() > 0) {
                await alertDialog.locator('button:has-text("حذف")').click();
                await page.waitForTimeout(4000);
            }
        }

        // Step B: Add assignment
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(3000);

        const addFrame = page.frameLocator('iframe');

        // 1. Section
        await addFrame.locator('#P56_SECTION_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li').first().click();
        await page.waitForTimeout(2000);

        // 2. Branch
        await addFrame.locator('#P56_BRANCH_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li').first().click();
        await page.waitForTimeout(2500);

        // 3. Collector
        await addFrame.locator('#P56_COLLECTOR_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li').first().click();
        await page.waitForTimeout(2500);

        // 4. Area -> search "المعارض"
        await addFrame.locator('#P56_AREA_CODE_lov_btn').click();
        await page.waitForTimeout(1500);
        const searchArea = page.locator('.ui-dialog:visible input.a-PopupLOV-search');
        if (await searchArea.count() > 0) {
            await searchArea.fill('المعارض');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(1500);
        }
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li').first().click();
        await page.waitForTimeout(2000);

        // Save
        await addFrame.locator('button:has-text("حفظ")').click();
        await page.waitForTimeout(4000);

        // Verify success message
        const successAlert = page.locator('.t-Alert--success, .t-Alert-content, #t_Alert_Success');
        await expect(successAlert.first()).toBeVisible();
        const successText = await successAlert.first().innerText();
        expect(successText).toContain('تم حفظ البيانات بنجاح');

        // Screenshot
        await page.screenshot({ path: '2_collector_areas_valid_add.png', fullPage: true });
    });

    test('3. Modal Management: Verify Opening and Closing Modal via Cancel', async () => {
        test.setTimeout(60000);

        // Open modal
        await page.locator('button:has-text("إضافة")').click();
        await page.waitForTimeout(2500);

        const modalDialog = page.locator('div.ui-dialog:visible');
        await expect(modalDialog.first()).toBeVisible();

        const frame = page.frameLocator('iframe');
        // Click Cancel
        await frame.locator('button:has-text("إلغاء")').click();
        await page.waitForTimeout(2500);

        // Verify modal is closed
        await expect(page.locator('iframe')).toHaveCount(0);

        // Screenshot
        await page.screenshot({ path: '3_collector_areas_modal_closed.png', fullPage: true });
    });
});
