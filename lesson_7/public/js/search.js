Vue.component('search', {
    template: `
        <label class="search" for="search">
            <input v-model="searchLine" @input="filterItems(searchLine)" type="search" :id="name" :name="name" :placeholder="placeholder">
            <span class="search_icon">&#128269;</span>
        </label>
    `,
    props: {
        name: {
            default: 'search'
        },
        placeholder: {
            default: 'Поиск по сайту'
        }
    },
    data() {
        return {
            searchLine: ''
        }
    },
    methods: {
        filterItems(searchLine) {
            this.$emit('search-line-changed', searchLine);
        },
    },
    mounted() {
        this.filterItems = this.$parent.debounce(this.filterItems, 300);
    },
})
