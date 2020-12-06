Vue.component('products', {
    template: `
        <main>
            <div v-if="filteredProducts.length" class="products">
                <product v-for="product in filteredProducts" :product="product" :key="product.id"></product>
            </div>
            <div v-else="filteredProducts.length" class="no-products">Товары не найдены</div>
        </main>
    `,
    data() {
        return {
            products: [],
            filteredProducts: [],
        }
    },
    methods: {
        filterGoods(searchLine) {
            this.filteredProducts = this.products.filter(product =>
                product.title.toLowerCase().includes(searchLine.trim().toLowerCase()));
        },
        addProductToCart(id) {
            this.$root.$refs.cart.addProductToCart(id);
        },
        getProduct(id) {
            return this.products.find(product => product.id === +id);
        },
        _getProductsForView() {
            this.$parent.fetchProductsData('/api/products')
                .then(goods => this.filteredProducts = this.products = goods || [])
        },
    },
    mounted() {
        this._getProductsForView();
    },
})

Vue.component('product', {
    template: `
        <div class="product-item">
            <img :src="imgSrc" :alt="imgAlt">
            <h3>{{product.name}}</h3>
            <p>{{product.price}}</p>
            <button @click="$parent.addProductToCart(product.id)" class="btn buy-btn">Купить</button>
        </div>
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
                src: 'https://via.placeholder.com/150',
                alt: 'Product'
            },
        }
    },
})

