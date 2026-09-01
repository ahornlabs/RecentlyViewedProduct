import ElementLoadingIndicatorUtil from 'src/utility/loading-indicator/element-loading-indicator.util';

export default class RecentProductSliderPlugin extends window.PluginBaseClass {
    init() {
        this.fetch();
    }

    fetch() {
        if (!this.options.id) {
            return;
        }
        ElementLoadingIndicatorUtil.create(this.el);

        let url = window.router['frontend.recent-product-slider.content'] + '?elementId=' + this.options.id;

        if(this.options.excludeProductId) {
            url += '&excludeProductId=' + this.options.excludeProductId;
        }

        fetch(url)
            .then((response) => response.text())
            .then((response) => {
                ElementLoadingIndicatorUtil.remove(this.el);

                if (!response || response.trim().length === 0) {
                    const hrBar = this.el.closest('.product-detail')?.querySelector('.recently-viewed-product-bar');

                    if (hrBar) {
                        hrBar.remove();
                    }

                    this.el.remove();
                    return;
                }

                this.renderProductSlider(response);
            });
    }

    renderProductSlider(html) {
        this.el.innerHTML = html;
        window.PluginManager.initializePlugin('ProductSlider', '.product-slider');
    }
}
