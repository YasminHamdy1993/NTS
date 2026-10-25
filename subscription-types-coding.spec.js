import { test, expect } from '@playwright/test';

test.describe.serial('ترميز أنواع الاشتراكات وشرائح الاستهلاك (Subscription Types & Consumption Slices)', () => {
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

        // 2. Navigate to System Settings -> ترميز الأسعار وحالات الحساب -> ترميز أنواع الاشتراكات وشرائح الاستهلاك
        await page.locator('text="إعدادات النظام"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز الأسعار وحالات الحساب"').first().click();
        await page.waitForTimeout(1000);
        await page.locator('text="ترميز أنواع الاشتراكات وشرائح الاستهلاك"').first().click();
        await page.waitForTimeout(4000);
    });

    test.afterAll(async () => {
        if (page) {
            await page.close();
        }
    });

    test('1. Validation Error: Required field validation upon empty row save', async () => {
        test.setTimeout(60000);

        // Select Billing Run
        await page.locator('#P44_BILLING_RUN_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li:has-text("آب")').first().click();
        await page.waitForTimeout(3000);

        // Click Add Row on Master Grid without filling required cell
        await page.locator('button[data-action="selection-add-row"]').first().click();
        await page.waitForTimeout(1500);

        // Click main Save button at bottom
        await page.locator('button:has-text("حفظ")').last().click();
        await page.waitForTimeout(3000);

        // Verify validation error
        const errorAlert = page.locator('.t-Alert--error, .a-Notification--error');
        await expect(errorAlert).toBeVisible();
        const errorText = await errorAlert.innerText();
        expect(errorText).toContain('يجب إدخال قيمة النشاط الرئيسي');

        // Screenshot
        await page.screenshot({ path: '1_subscription_types_validation_error.png', fullPage: true });

        // Reload page to reset dirty state
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(4000);
    });

    test('2. Master-Detail Synchronization: Multi-grid synchronization across activities and slices', async () => {
        test.setTimeout(60000);

        // Select Billing Run
        await page.locator('#P44_BILLING_RUN_lov_btn').click();
        await page.waitForTimeout(1500);
        await page.locator('.ui-dialog:visible .a-PopupLOV-results li:has-text("آب")').first().click();
        await page.waitForTimeout(3000);

        // Click on Governmental activity ("حكومى")
        await page.locator('#R70571415831113984_ig td:has-text("حكومى")').first().click();
        await page.waitForTimeout(2000);

        // Assert Grid 2 updates with governmental sub-activities
        const grid2Hokomi = await page.locator('#R70580376203114261_ig').innerText();
        expect(grid2Hokomi).toContain('حكومي عام');

        // Click on Residential activity ("سكنى")
        await page.locator('#R70571415831113984_ig td:has-text("سكنى")').first().click();
        await page.waitForTimeout(2000);

        // Assert Grid 2 updates with residential sub-activities
        const grid2Sakani = await page.locator('#R70580376203114261_ig').innerText();
        expect(grid2Sakani).toContain('منزل');

        // Assert Grid 3 updates with residential consumption brackets
        const grid3Sakani = await page.locator('#BL_RATES_PL_ig').innerText();
        expect(grid3Sakani).toContain('30');

        // Screenshot
        await page.screenshot({ path: '2_subscription_types_master_detail_sync.png', fullPage: true });
    });

    test('3. Grid Toolbar & Search Filter: Filtering and restoring grid records', async () => {
        test.setTimeout(60000);

        // Search for "تجارى" in Grid 1 toolbar
        const searchInput = page.locator('#R70571415831113984_ig_toolbar_search_field');
        await searchInput.fill('تجارى');
        await page.locator('#R70571415831113984_ig_toolbar button[data-action="search"]').click();
        await page.waitForTimeout(2000);

        // Verify only "تجارى" is displayed
        const rowsAfterSearch = await page.locator('#R70571415831113984_ig .a-GV-table tr').allInnerTexts();
        const combinedText = rowsAfterSearch.join(' ');
        expect(combinedText).toContain('تجارى');
        expect(combinedText).not.toContain('سكنى');

        // Remove filter via filter remove button
        const removeFilterBtn = page.locator('#R70571415831113984_ig button.a-IG-button--remove, #R70571415831113984_ig button[title="Remove فلتر"]');
        await removeFilterBtn.click();
        await page.waitForTimeout(2000);

        // Verify all activities return
        const rowsAfterReset = await page.locator('#R70571415831113984_ig .a-GV-table tr').allInnerTexts();
        const resetText = rowsAfterReset.join(' ');
        expect(resetText).toContain('سكنى');
        expect(resetText).toContain('تجارى');

        // Screenshot
        await page.screenshot({ path: '3_subscription_types_grid_search_filter.png', fullPage: true });
    });
});
