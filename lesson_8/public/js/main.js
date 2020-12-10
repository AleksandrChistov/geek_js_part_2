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
        postProductsData(url, data) {
            return fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(result => result.json())
                .catch(error => this.$refs.errorHandler.emitError(error.message));
        },
        putProductsData(url, data) {
            return fetch(url, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            })
                .then(result => result.json())
                .catch(error => this.$refs.errorHandler.emitError(error.message));
        },
        deleteProductsData(url, data) {
            return fetch(url, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            })
                .then(result => result.json())
                .catch(error => this.$refs.errorHandler.emitError(error.message));
        },
        debounce(fn, ms) {
            let timeout;
            return function (...args) {
                const later = () => {
                    clearTimeout(timeout);
                    fn(...args);
                }
                clearTimeout(timeout);
                timeout = setTimeout(later, ms);
            }
        }
    },
})
