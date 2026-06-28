# ActHideShopwarePaymentsMenu - Hide the Shopware Payments admin menu entry

This plugin removes the **"Shopware Payments"** entries from the administration
navigation. Shopware aggressively injects this payment method into the admin menu.
Its primary purpose is to **tidy up the main navigation for shops that do not use
Shopware Payments**. (Earlier Shopware versions also threw a *"You do not have the
required permissions"* page when the entry was clicked — that bug is fixed in
current Shopware, but the unused entries remain.)

Shopware surfaces "Shopware Payments" in **two** separate places in the navigation
via two different mechanisms, so the plugin filters both.

## What it does

- Hides the main menu node with navigation id `sw-payments` (registered by the
  `SwagExtensionStore` plugin) **and** its child entries (`Übersicht` /
  `Einstellungen`, the `ShopwarePayments` service app's manifest modules with
  `parent === "sw-payments"`).
- Hides the **second** entry that appears under **"Erweiterungen"** (`sw-extension`).
  Newer `ShopwarePayments` versions register it through the Meteor Admin SDK
  (`menuItem.add`) from inside their iframe; such entries get a random id and
  default to `parent: "sw-extension"`, so they cannot be matched by id/parent.
  They are matched instead via their SDK module's `baseUrl`, which points at the
  app's service domain (`shopware-payments.services.shopware.io`).
- It does this in the administration only, by overriding the `navigationEntries`
  computed of `sw-admin-menu` and filtering the entries out before the menu tree is
  built.

## What it deliberately does NOT do

- It does **not** deactivate, uninstall or otherwise touch the `ShopwarePayments`
  app. The app must stay active — it is wired into the storefront cookie consent
  (custom field set `shopware_payments_express` and storefront gateways).
  Deactivating it causes an endless loading spinner in the storefront cookie
  settings.
- It does **not** touch `SwagExtensionStore`, any core files, the global
  `core.services.disabled` switch, ACL roles or payment methods.
- It only cleans up the **navigation menu**. Shopware Payments is still reachable
  via **Settings → Extensions** (`Einstellungen`), where the `ShopwarePayments`
  app keeps showing up in the extensions list like any other installed extension.
  This is intentional — the goal is a tidy main menu, not making the app
  inaccessible.

Result: both navigation entries are gone, everything else (app, payment methods,
storefront, the extensions list under Settings) keeps working unchanged.

## Requirements

- Shopware 6.7 (`>=6.7 <6.8`)
- PHP 8.4 or higher

## Installation

This plugin is not published on Packagist.

Place the plugin in `custom/plugins/ActHideShopwarePaymentsMenu` (via Git clone,
ZIP upload in the plugin manager, or your deployment process), then:

```bash
bin/console plugin:refresh
bin/console plugin:install --activate ActHideShopwarePaymentsMenu
bin/console assets:install
bin/console cache:clear
```

The compiled administration assets are shipped in
`src/Resources/public/administration/`, so no Node build is required on the target
system. After install, do a hard reload (Ctrl+Shift+R) of the admin.

## Development

Build the administration assets after changing `main.js`:

```bash
./bin/build-administration.sh
bin/console assets:install
bin/console cache:clear
```

## Support

For issues and feature requests, please use the GitHub issue tracker.

## License

This plugin is licensed under the MIT License.

## Credits

Developed by Actualize

---

Made with ❤️ for the Shopware Community
