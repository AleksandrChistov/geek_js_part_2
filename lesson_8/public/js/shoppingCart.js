Vue.component('shopping-cart', {
    template: `
        <section v-show="isVisibleCart" class="shopping-cart">
            <p v-if="!productsInCart.contents.length">Ваша корзина пуста</p>
            <div v-else="productsInCart.contents.length">
                <shopping-cart-item v-for="productInCart in productsInCart.contents" :product="productInCart" :key="productInCart.id"></shopping-cart-item>
                <p class="total">
                    <span>Итого:</span>
                    <span class="count-goods">{{productsInCart.countGoods || 0}} {{declensionOfText()}}</span>
                    <span>{{productsInCart.amount || 0}}</span>
                </p>
            </div>
        </section>
    `,
    props: {
        isVisibleCart: {
            default: false
        },
    },
    data() {
        return {
            productsInCart: {
                contents: [],
                amount: 0,
                countGoods: 0,
            },
        }
    },
    methods: {
        declensionOfText() {
            const countGoods = this.productsInCart.countGoods;
            const words = ['товар', 'товара', 'товаров'];
            const cases = [2, 0, 1, 1, 1, 2];
            return words[ (countGoods % 100 > 4 && countGoods % 100 < 20)? 2 : cases[(countGoods % 10 < 5) ? countGoods % 10 : 5]];
        },
        decreaseProductFromCart(id) {
            const currentProduct = this.productsInCart.contents.find(product => product.id === +id);

            if (currentProduct.quantity <= 1) {
                return;
            }

            this.$parent.putProductsData(`/api/cart/${currentProduct.id}`, {quantity: currentProduct.quantity - 1})
                .then(data => {
                    if (data.result === 1) {
                        currentProduct.quantity--;
                        this.productsInCart.amount -= currentProduct.price;
                        this.productsInCart.countGoods--;
                    }
                })
        },
        increaseProductFromCart(id) {
            const currentProduct = this.productsInCart.contents.find(product => product.id === +id);

            this.$parent.putProductsData(`/api/cart/${currentProduct.id}`, {quantity: currentProduct.quantity + 1})
                .then(data => {
                    if (data.result === 1) {
                        currentProduct.quantity++;
                        this.productsInCart.amount += currentProduct.price;
                        this.productsInCart.countGoods++;
                    }
                })
        },
        deleteProductFromCart(id) {
            this.$parent.deleteProductsData(`/api/cart/${id}`, {id})
                .then(data => {
                    if (data.result === 1) {
                        this.productsInCart.contents = this.productsInCart.contents.filter(product => {
                            if (product.id === +id) {
                                this.productsInCart.amount -= product.price * product.quantity;
                                this.productsInCart.countGoods -= product.quantity;
                                return false;
                            }
                            return true;
                        });
                    }
                })
        },
        addProductToCart(id) {
            let currentProductInCart = this.productsInCart.contents.find(product => product.id === +id);

            if (currentProductInCart) {
                this.$parent.putProductsData(`/api/cart/${currentProductInCart.id}`, {quantity: currentProductInCart.quantity + 1})
                    .then(data => {
                        if (data.result === 1) {
                            currentProductInCart.quantity++;
                            this.productsInCart.amount += currentProductInCart.price;
                            this.productsInCart.countGoods++;
                        }
                    })
            } else {
                currentProductInCart = this.$root.$refs.products.getProduct(id);
                const newProduct = Object.assign({quantity: 1}, currentProductInCart);

                this.$parent.postProductsData(`/api/cart`, newProduct)
                    .then(data => {
                        if(data.result === 1){
                            this.productsInCart.contents.push(newProduct);
                            this.productsInCart.amount += newProduct.price;
                            this.productsInCart.countGoods++;
                        }
                    })
            }
        },
        _getProductsForCart() {
            this.$parent.fetchProductsData('/api/cart')
                .then(goods => {
                    this.productsInCart.contents = goods.contents || [];
                    this.productsInCart.amount = goods.amount;
                    this.productsInCart.countGoods = goods.countGoods;
                })
        },
    },
    mounted() {
        this._getProductsForCart();
        this.decreaseProductFromCart = this.$parent.debounce(this.decreaseProductFromCart, 200);
        this.increaseProductFromCart = this.$parent.debounce(this.increaseProductFromCart, 200);
        this.addProductToCart = this.$parent.debounce(this.addProductToCart, 200);
    },
})

Vue.component('shopping-cart-item', {
    template: `
        <p>
            <span>{{product.name}}</span>
            <img class="img-icon" :src="imgSrc" :alt="imgAlt">
            <span>
                <button @click="$parent.decreaseProductFromCart(product.id)" class="minus">-</button>
                {{product.quantity}}
                <button @click="$parent.increaseProductFromCart(product.id)" class="plus">+</button>
            </span>
            <span class="sum">{{product.price * product.quantity}}</span>
            <button @click="$parent.deleteProductFromCart(product.id)" class="delete">X</button>
        </p>
    `,
    props: ['product'],
    computed: {
        imgSrc: function() {
            return this.product.img ? this.product.img.src : this.defaultImg.src;
        },
        imgAlt: function() {
            return this.product.img ? this.product.img.alt : this.defaultImg.alt;
        }
    },
    data() {
        return {
            defaultImg: {
                src: 'https://via.placeholder.com/25',
                alt: 'Product icon'
            },
        }
    },
})

