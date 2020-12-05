Vue.component('shopping-cart', {
    template: `
        <section v-show="isVisibleCart" class="shopping-cart">
            <p v-if="!productsInCart.contents.length">Ваша корзина пуста</p>
            <div v-else="productsInCart.contents.length">
                <shopping-cart-item v-for="productInCart in productsInCart.contents" :product="productInCart" :key="productInCart.id"></shopping-cart-item>
                <p class="total">
                    <span>Итого:</span>
                    <span>{{productsInCart.countGoods || 0}} {{declensionOfText()}}</span>
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
            const currentProduct = this.productsInCart.contents.find(product => product.id == id);

            if (currentProduct.quantity === 1) {
                return;
            }

            currentProduct.quantity--;
            this.productsInCart.amount -= currentProduct.price;
            this.productsInCart.countGoods--;

            this.$parent.putProductsData(this.productsInCart);
        },
        increaseProductFromCart(id) {
            this.productsInCart.contents.map(product => {
                if (product.id == id) {
                    product.quantity++;
                    this.productsInCart.amount += product.price;
                    this.productsInCart.countGoods++;
                }
            });
            this.$parent.putProductsData(this.productsInCart);
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
            this.$parent.putProductsData(this.productsInCart);
        },
        addProductToCart(id) {
            let currentProductInCart = this.productsInCart.contents.find(product => product.id == id);

            if (!currentProductInCart) {
                currentProductInCart = this.$root.$refs.products.getProduct(id);
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

            this.$parent.putProductsData(this.productsInCart);
        },
        _getProductsForCart() {
            this.$parent.fetchProductsData('https://test-19da2.firebaseio.com/shoppingCart.json')
                .then(goods => {
                    this.productsInCart.contents = goods.contents || [];
                    this.productsInCart.amount = goods.amount;
                    this.productsInCart.countGoods = goods.countGoods;
                })
        },
    },
    mounted() {
        this._getProductsForCart();
    },
})

Vue.component('shopping-cart-item', {
    template: `
        <p>
            <span>{{product.name}}</span>
            <span>
                <span @click="$parent.decreaseProductFromCart(product.id)" class="minus">-</span>
                {{product.quantity}}
                <span @click="$parent.increaseProductFromCart(product.id)" class="plus">+</span>
            </span>
            <span>{{product.price * product.quantity}}</span>
            <span @click="$parent.deleteProductFromCart(product.id)" class="delete">X</span>
        </p>
    `,
    props: ['product'],
})

