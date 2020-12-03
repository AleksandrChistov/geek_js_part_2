var app = new Vue({
    el: '#app',
    data: {
        products: [],
        filteredProducts: [],
        productsInCart: {
            contents: [],
            amount: 0,
            countGoods: 0,
        },
        isVisibleCart: false,
    },
    methods: {
        showCart() {
            this.isVisibleCart = !this.isVisibleCart;
        },
        decreaseProductFromCart(id) {
            const currentProduct = this.productsInCart.contents.find(product => product.id == id);

            if (currentProduct.quantity === 1) {
                return;
            }

            currentProduct.quantity--;
            this.productsInCart.amount -= currentProduct.price;
            this.productsInCart.countGoods--;

            this._putProductsData(this.productsInCart);
        },
        increaseProductFromCart(id) {
            this.productsInCart.contents.map(product => {
                if (product.id == id) {
                    product.quantity++;
                    this.productsInCart.amount += product.price;
                    this.productsInCart.countGoods++;
                }
            });
            this._putProductsData(this.productsInCart);
        },
        deleteProductFromCart(id) {
            this.productsInCart.contents = this.productsInCart.contents.filter(product => {
                if (product.id == id) {
                    this.productsInCart.countGoods -= product.quantity;
                    this.productsInCart.amount -= product.price * product.quantity;
                    return false;
                }

                return true;
            });
            this._putProductsData(this.productsInCart);
        },
        addProductToCart(id) {
            let currentProductInCart = this.productsInCart.contents.find(product => product.id == id);

            if (!currentProductInCart) {
                currentProductInCart = this.products.find(product => product.id == id);
                this.productsInCart.contents.push({
                    id: currentProductInCart.id,
                    price: currentProductInCart.price,
                    name: currentProductInCart.title,
                    quantity: 1,
                });
            } else {
                currentProductInCart.quantity++;
            }

            this.productsInCart.amount += currentProductInCart.price;
            this.productsInCart.countGoods++;

            this._putProductsData(this.productsInCart);
        },
        filterGoods(searchLine) {
            this.filteredProducts = this.products.filter(product =>
                product.title.toLowerCase().includes(searchLine.trim().toLowerCase()));
        },
        getProductsForView() {
            this._fetchProductsData('https://test-19da2.firebaseio.com/goods.json')
                .then(goods => this.filteredProducts = this.products = goods)
                .catch(error => this.$refs.errorHandler.emitError(error.message))
        },
        getProductsForCart() {
            this._fetchProductsData('https://test-19da2.firebaseio.com/shoppingCart.json')
                .then(goods => {
                    this.productsInCart.contents = goods.contents || [];
                    this.productsInCart.amount = goods.amount;
                    this.productsInCart.countGoods = goods.countGoods;
                })
                .catch(error => this.$refs.errorHandler.emitError(error.message));
        },
        _fetchProductsData(url) {
            return fetch(url).then(goods => goods.json());
        },
        _putProductsData(shoppingCart) {
            fetch(`https://test-19da2.firebaseio.com/shoppingCart.json`, {
                method: 'PUT',
                body: JSON.stringify(shoppingCart),
                headers: {
                    'Content-Typ': 'application/json'
                }
            }).catch(error => this.$refs.errorHandler.emitError(error.message));
        },
    },
    mounted() {
        this.getProductsForView();
        this.getProductsForCart();
    },
})
