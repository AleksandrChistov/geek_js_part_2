Vue.component('search', {
    template: `
        <label class="search" for="search">
            <input v-model="searchLine" @input="filterItems" type="search" :id="name" :name="name" :placeholder="placeholder">
            <span class="search_icon">&#128269;</span>
        </label>
    `,
    props: {
        name: {
            default: 'name'
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
        filterItems() {},
        _debounce(fn, ms) {
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
    mounted() {
        this.filterItems = this._debounce(() => this.$emit('filter-goods', this.searchLine), 300);
    },
})
