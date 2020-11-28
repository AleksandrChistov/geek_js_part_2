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
        defaultImg: {
            url: 'https://via.placeholder.com/150',
            alt: 'Product'
        },
        isVisibleCart: false,
        searchLine: '',
    },
    methods: {
        getProductsForView() {
            this._fetchProductsData('https://test-19da2.firebaseio.com/goods.json')
                .then(goods => this.filteredProducts = this.products = goods)
                .catch(error => console.log('Error: ', error.message))
        },
        getProductsForCart() {
            this._fetchProductsData('https://test-19da2.firebaseio.com/shoppingCart.json')
                .then(goods => {
                    if (goods.contents) {
                        this.productsInCart.contents = goods.contents;
                    }
                    this.productsInCart.amount = goods.amount;
                    this.productsInCart.countGoods = goods.countGoods;
                })
                .catch(error => console.log('Error: ', error.message));
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
            }).catch(error => console.log('Error: ', error.message));
        },
        showProductInCart() {
            this.isVisibleCart = !this.isVisibleCart;
        },
        declensionOfText() {
            const countGoods = this.productsInCart.countGoods;
            const words = ['товар', 'товара', 'товаров'];
            const cases = [2, 0, 1, 1, 1, 2];
            return words[ (countGoods % 100 > 4 && countGoods % 100 < 20)? 2 : cases[(countGoods % 10 < 5) ? countGoods % 10 : 5]];
        },
        decreaseProductFromCart(id) {
            this.productsInCart.contents.map(product => {
                if (product.id == id) {
                    if (product.quantity === 1) {
                        return;
                    }
                    product.quantity--;
                    this.productsInCart.amount -= product.price;
                    this.productsInCart.countGoods--;
                }
            });
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
                } else {
                    return product;
                }
            });
            this._putProductsData(this.productsInCart);
        },
        addProductToCart(currentProduct) {
            let currentProductInCart = this.productsInCart.contents.find(product => product.id == currentProduct.id);

            if (!currentProductInCart) {
                currentProductInCart = this.products.find(product => product.id == currentProduct.id);
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
        filterGoods() {
            this.filteredProducts = this.products.filter(product =>
                product.title.toLowerCase().includes(this.searchLine.trim().toLowerCase()));
        }
    },
    mounted() {
        this.getProductsForView();
        this.getProductsForCart();
    },
})