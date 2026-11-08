import template from './act-hide-shopware-payments-menu-info.html.twig';
import './act-hide-shopware-payments-menu-info.scss';

const { Component } = Shopware;

const HOW_TO_ITEM_COUNT = 5;

Component.register('act-hide-shopware-payments-menu-info', {
    template,

    computed: {
        howToItems() {
            return Array.from(
                { length: HOW_TO_ITEM_COUNT },
                (_, index) => `act-hide-shopware-payments-menu.settings.info.howTo.item${index + 1}`,
            );
        },
    },
});
