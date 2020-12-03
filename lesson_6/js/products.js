Vue.component('products', {
    template: `
        <main>
            <div v-if="filteredProducts.length" class="products">
                <product v-for="product in filteredProducts" :product="product" :key="product.id"></product>
            </div>
            <div v-else="filteredProducts.length" class="no-products">Товары не найдены</div>
        </main>
    `,
    props: {
        filteredProducts: {
            default: () => {
                return []
            }
        },
    },
})

Vue.component('product', {
    template: `
        <div class="product-item">
            <img :src="defaultImg.url" :alt="defaultImg.alt">
            <h3>{{product.title}}</h3>
            <p>{{product.price}}</p>
            <button @click="addProductToCart(product.id)" class="btn buy-btn">Купить</button>
        </div>
    `,
    props: ['product'],
    data() {
        return {
            defaultImg: {
                url: 'https://via.placeholder.com/150',
                alt: 'Product'
            },
        }
    },
    methods: {
        addProductToCart(id) {
            this.$parent.$emit('add-product-to-cart', id)
        },
    },
})

