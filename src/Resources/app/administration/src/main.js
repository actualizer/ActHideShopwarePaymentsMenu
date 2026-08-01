/**
 * Hides every "Shopware Payments" entry from the admin navigation, plus the tab the
 * app adds to the order detail view.
 *
 * In the navigation the ShopwarePayments service app surfaces itself in TWO
 * independent places, via two different mechanisms — so a single filter is not
 * enough (the order detail tab is a third mechanism, documented further down):
 *
 * 1. Main-menu shell "sw-payments"
 *    The root navigation node with id "sw-payments" is registered by the
 *    SwagExtensionStore plugin. The app's manifest modules ("Übersicht",
 *    "Einstellungen") mount as children with parent === "sw-payments".
 *    -> dropped by the id / parent === "sw-payments" filter.
 *
 * 2. Extension-SDK menu item under "Erweiterungen" (sw-extension)
 *    Newer ShopwarePayments versions also register a menu entry through the
 *    Meteor Admin SDK (menuItem.add) from inside their iframe. Those entries get
 *    a RANDOM id (Shopware.Utils.createId()) and default to parent "sw-extension",
 *    so they can be matched by neither id nor parent. Each carries
 *    params.id === the SDK module id; that module (extensionSdkModules store)
 *    holds the app's baseUrl. We resolve the app's module ids via its service
 *    domain and drop those entries too.
 *
 * sw-admin-menu builds its tree as:
 *   navigationEntries (flat list)  ->  FlatTreeHelper  ->  mainMenuEntries (tree)
 * We override the flat `navigationEntries` list and drop both vectors before the
 * tree is built. Removing a parent before tree construction also removes its
 * subtree, because flattree.helper.js only reaches a child through its parent.
 *
 * Nothing else is touched: the ShopwarePayments app, its payment methods and the
 * storefront cookie-consent integration stay fully intact. This only hides the
 * menu entries, which the shop does not use.
 *
 * Note: the app is a cloud/service app and is not installed in local dev, so the
 * entries only exist on the live shop — there is nothing to hide locally.
 */
const HIDDEN_NAVIGATION_ID = 'sw-payments';
const HIDDEN_APP_BASE_URL = 'shopware-payments.services.shopware.io';

Shopware.Component.override('sw-admin-menu', {
    computed: {
        navigationEntries() {
            const entries = this.$super('navigationEntries');

            const hiddenSdkModuleIds = (Shopware.Store.get('extensionSdkModules')?.modules ?? [])
                .filter((module) => typeof module.baseUrl === 'string' && module.baseUrl.includes(HIDDEN_APP_BASE_URL))
                .map((module) => module.id);

            return entries.filter(
                (entry) =>
                    entry.id !== HIDDEN_NAVIGATION_ID &&
                    entry.parent !== HIDDEN_NAVIGATION_ID &&
                    !hiddenSdkModuleIds.includes(entry.params?.id),
            );
        },
    },
});

/**
 * Hides the "Shopware Payments" tab in the order detail view.
 *
 * This tab is not a navigation entry at all. The app registers it through the
 * Meteor Admin SDK (ui.tabs('sw-order-detail').addTabItem()), which stores it in
 * the `tabs` store as { label, componentSectionId } only — no app id and no
 * baseUrl to match on. The componentSectionId is the position the app renders its
 * own iframe section into, and THAT entry (extensionComponentSections store) does
 * carry the registering app's `src`. So we resolve the tab back to its app through
 * the section store, rather than matching `label`, which is app-provided display
 * text and changes with translation.
 *
 * sw-tabs delegates to sw-tabs-deprecated, or to the mt-tabs wrapper once the
 * V6_8_0_0 feature flag is on. Both read the SDK tabs through the same
 * `tabExtensions` computed and use it for the tab bar as well as the tab content,
 * so overriding it in both components covers every render path.
 *
 * The filter is deliberately not limited to position "sw-order-detail": it drops
 * the app's SDK tabs wherever they appear. The app's own admin pages are not
 * affected — they are component sections, not tabs.
 *
 * Note: Component.override() mutates the config object it is handed (it sets
 * config.name), so each call gets its own instance from this factory.
 */
const hiddenAppTabsOverride = () => ({
    computed: {
        tabExtensions() {
            const sections = Shopware.Store.get('extensionComponentSections')?.identifier ?? {};

            return this.$super('tabExtensions').filter(
                (tabItem) =>
                    !(sections[tabItem.componentSectionId] ?? []).some(
                        (section) => typeof section.src === 'string' && section.src.includes(HIDDEN_APP_BASE_URL),
                    ),
            );
        },
    },
});

Shopware.Component.override('sw-tabs-deprecated', hiddenAppTabsOverride());
Shopware.Component.override('mt-tabs', hiddenAppTabsOverride());
