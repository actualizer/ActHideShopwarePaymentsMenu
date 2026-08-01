# ActHideShopwarePaymentsMenu - Hide the Shopware Payments admin entries

This plugin removes the **"Shopware Payments"** entries from the administration
navigation and from the order detail view. Shopware adds this payment offering to
the admin menu by default. Its primary purpose is to **tidy up the admin for shops
that do not use Shopware Payments**. (Earlier Shopware versions also threw a *"You
do not have the required permissions"* page when the entry was clicked — that bug
is fixed in current Shopware, but the unused entries remain.)

Shopware surfaces "Shopware Payments" in **two** separate places in the navigation
via two different mechanisms, plus a **third** one as a tab in the order detail
view, so the plugin filters all three.

The entry under **Settings** is deliberately kept — that one is a sensible place
for the app's configuration.

> **Note:** This is not a statement against Shopware Payments — it is a solid
> product and a great fit for many shops. This plugin simply addresses the admin
> clutter for the shops that don't use it: it only hides UI entries and leaves the
> app, its payment methods and all functionality fully intact, so it can be
> enabled again at any time.

## What it does

- Hides the main menu node with navigation id `sw-payments` (registered by the
  `SwagExtensionStore` plugin) **and** its child entries (`Overview` /
  `Settings`, the `ShopwarePayments` service app's manifest modules with
  `parent === "sw-payments"`).
- Hides the **second** entry that appears under **"Extensions"** (`sw-extension`).
  Newer `ShopwarePayments` versions register it through the Meteor Admin SDK
  (`menuItem.add`) from inside their iframe; such entries get a random id and
  default to `parent: "sw-extension"`, so they cannot be matched by id/parent.
  They are matched instead via their SDK module's `baseUrl`, which points at the
  app's service domain (`shopware-payments.services.shopware.io`).
- Hides the **"Shopware Payments" tab in the order detail view**. That one is not a
  navigation entry at all: the app registers it through the Meteor Admin SDK
  (`ui.tabs('sw-order-detail').addTabItem()`), which stores only a `label` and a
  `componentSectionId`. The tab is traced back to its app through that
  `componentSectionId` — the matching entry in the `extensionComponentSections`
  store carries the registering app's `src`, again the app's service domain. This
  is more robust than matching the `label`, which is translated display text.
- It does this in the administration only, by overriding the `navigationEntries`
  computed of `sw-admin-menu` and the `tabExtensions` computed of the tab
  components, filtering the entries out before they are rendered.

## What it deliberately does NOT do

- It does **not** deactivate, uninstall or otherwise touch the `ShopwarePayments`
  app. The app must stay active — it is wired into the storefront cookie consent
  (custom field set `shopware_payments_express` and storefront gateways).
  Deactivating it causes an endless loading spinner in the storefront cookie
  settings.
- It does **not** touch `SwagExtensionStore`, any core files, the global
  `core.services.disabled` switch, ACL roles or payment methods.
- It does **not** hide the app's entry under **Settings**, and it does not touch the
  app's own admin pages — those are component sections, not tabs.
- It only removes the **navigation entries and the order detail tab** — nothing
  else. The change is purely cosmetic and fully reversible: deactivate this plugin
  and the entries reappear. The goal is a tidy admin, not making the app
  inaccessible.

Result: both navigation entries and the order detail tab are gone, everything else
(the app, its payment methods and the storefront integration) keeps working
unchanged.

## Requirements

- Shopware 6.7 (`>=6.7 <6.8`)
- PHP 8.4 or higher

## Installation

### Via Composer (recommended)

```bash
composer require actualizer/hide-shopware-payments-menu
```

### Manual

Place the plugin in `custom/plugins/ActHideShopwarePaymentsMenu` (via Git clone,
ZIP upload in the plugin manager, or your deployment process).

Then, regardless of the install method, enable it:

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
