/**
 * Hides the "Shopware Payments" entry from the admin main menu.
 *
 * The entry is the root navigation node with id "sw-payments", registered by the
 * SwagExtensionStore plugin as an empty shell (route "sw.payments.index" has no
 * component). The ShopwarePayments service app mounts its remote iframe modules
 * ("Übersicht", "Einstellungen") as children with parent === "sw-payments".
 *
 * sw-admin-menu builds its tree as:
 *   navigationEntries (flat list)  ->  FlatTreeHelper  ->  mainMenuEntries (tree)
 *
 * We override the flat `navigationEntries` list and drop the node plus any direct
 * children. Because flattree.helper.js only reaches a child by recursing into its
 * existing parent, removing "sw-payments" before tree construction makes the whole
 * subtree disappear — whether or not the app's child modules are present (they
 * exist on the live shop, not in local dev). The explicit `parent` filter is a
 * belt-and-suspenders guard against orphan re-rooting.
 *
 * Nothing else is touched: the ShopwarePayments app, its payment methods and the
 * storefront cookie-consent integration stay fully intact. This only hides a dead
 * admin menu entry that otherwise shows "missing permissions" when clicked.
 */
const HIDDEN_NAVIGATION_ID = 'sw-payments';

Shopware.Component.override('sw-admin-menu', {
    computed: {
        navigationEntries() {
            return this.$super('navigationEntries').filter(
                (entry) => entry.id !== HIDDEN_NAVIGATION_ID && entry.parent !== HIDDEN_NAVIGATION_ID,
            );
        },
    },
});
