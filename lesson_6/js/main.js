const app = new Vue({
    el: '#app',
    data: {
        isVisibleCart: false,
    },
    methods: {
        showCart() {
            this.isVisibleCart = !this.isVisibleCart;
        },
        filterGoods(searchLine) {
            this.$refs.products.filterGoods(searchLine);
        },
        fetchProductsData(url) {
            return fetch(url)
                .then(goods => goods.json())
                .catch(error => this.$refs.errorHandler.emitError(error.message));
        },
        putProductsData(shoppingCart) {
            fetch(`https://test-19da2.firebaseio.com/shoppingCart.json`, {
                method: 'PUT',
                body: JSON.stringify(shoppingCart),
                headers: {
                    'Content-Typ': 'application/json'
                }
            }).catch(error => this.$refs.errorHandler.emitError(error.message));
        },
    },
})
