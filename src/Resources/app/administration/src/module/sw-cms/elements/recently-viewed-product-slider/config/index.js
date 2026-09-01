import template from './sw-cms-el-config-recently-viewed-product-slider.html.twig';

const { Component, Mixin } = Shopware;

Component.register('sw-cms-el-config-recently-viewed-product-slider', {
    template,

    inject: ['repositoryFactory', 'systemConfigApiService'],

    mixins: [
        Mixin.getByName('cms-element')
    ],

    data() {
        return {
            isLoading: false
        }
    },

    computed: {
        displayModeOptions() {
            return [
                {
                    value: 'standard',
                    label: this.$tc('sw-cms.elements.general.config.label.displayModeStandard')
                },
                {
                    value: 'cover',
                    label: this.$tc('sw-cms.elements.general.config.label.displayModeCover')
                },
                {
                    value: 'contain',
                    label: this.$tc('sw-cms.elements.general.config.label.displayModeContain')
                }
            ];
        },

        verticalAlignOptions() {
            return [
                {
                    value: 'flex-start',
                    label: this.$tc('sw-cms.elements.general.config.label.verticalAlignTop')
                },
                {
                    value: 'center',
                    label: this.$tc('sw-cms.elements.general.config.label.verticalAlignCenter')
                },
                {
                    value: 'flex-end',
                    label: this.$tc('sw-cms.elements.general.config.label.verticalAlignBottom')
                }
            ];
        }
    },

    created() {
        this.createdComponent();
    },

    methods: {
        async createdComponent() {
            if (this.element.isNew()) {
                this.isLoading = true;
                try {
                    const prefix = 'RecentlyViewedProduct.config';
                    const defaultConfig = await this.systemConfigApiService.getValues(prefix);

                    Object.keys(this.element.config).forEach(configKey => {
                        let config = prefix + '.' + configKey;

                        if (defaultConfig[config] || defaultConfig[config] === false) {
                            this.element.config[configKey].value = defaultConfig[config];
                        }
                    })
                } catch {
                    // nth
                } finally {
                    this.isLoading = false;
                }
            }

            this.initElementConfig('recently-viewed-product-slider');
        }
    }
});
