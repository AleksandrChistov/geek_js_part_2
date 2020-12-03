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
        productsInCart: {
            default: () => {
                return { contents: [] }
            }
        }
    },
    methods: {
        declensionOfText() {
            const countGoods = this.productsInCart.countGoods;
            const words = ['товар', 'товара', 'товаров'];
            const cases = [2, 0, 1, 1, 1, 2];
            return words[ (countGoods % 100 > 4 && countGoods % 100 < 20)? 2 : cases[(countGoods % 10 < 5) ? countGoods % 10 : 5]];
        },
    },
})

Vue.component('shopping-cart-item', {
    template: `
        <p>
            <span>{{product.name}}</span>
            <span>
                <span @click="decreaseProductFromCart(product.id)" class="minus">-</span>
                {{product.quantity}}
                <span @click="increaseProductFromCart(product.id)" class="plus">+</span>
            </span>
            <span>{{product.price * product.quantity}}</span>
            <span @click="deleteProductFromCart(product.id)" class="delete">X</span>
        </p>
    `,
    props: ['product'],
    methods: {
        decreaseProductFromCart(id) {
            this.$parent.$emit('decrease-product-from-cart', id)
        },
        increaseProductFromCart(id) {
            this.$parent.$emit('increase-product-from-cart', id)
        },
        deleteProductFromCart(id) {
            this.$parent.$emit('delete-product-from-cart', id)
        }
    },
})

