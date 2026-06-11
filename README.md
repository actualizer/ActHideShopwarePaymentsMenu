# ActHideShopwarePaymentsMenu - Hide the Shopware Payments admin menu entry

This plugin removes the **"Shopware Payments"** entry from the administration main
menu. Clicking that entry otherwise shows a *"You do not have the required
permissions"* page, because it is a dead shell whose remote app modules are not
reachable for the current user.

## What it does

- Hides the main menu node with navigation id `sw-payments` (registered by the
  `SwagExtensionStore` plugin) **and** its child entries (`Übersicht` /
  `Einstellungen`, provided by the `ShopwarePayments` service app).
- It does this in the administration only, by overriding the `navigationEntries`
  computed of `sw-admin-menu` and filtering the entry out before the menu tree is
  built.

## What it deliberately does NOT do

- It does **not** deactivate, uninstall or otherwise touch the `ShopwarePayments`
  app. The app must stay active — it is wired into the storefront cookie consent
  (custom field set `shopware_payments_express` and storefront gateways).
  Deactivating it causes an endless loading spinner in the storefront cookie
  settings.
- It does **not** touch `SwagExtensionStore`, any core files, the global
  `core.services.disabled` switch, ACL roles or payment methods.

Result: the dead menu entry is gone, everything else (app, payment methods,
storefront) keeps working unchanged.

## Requirements

- Shopware 6.7 (`>=6.7 <6.8`)
- PHP 8.3 or higher

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
