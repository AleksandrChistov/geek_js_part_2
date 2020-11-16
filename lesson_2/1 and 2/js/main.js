// === the first task ===
class ShoppingCart {
    constructor() {
        this.goods = [];
    }

    putProduct(product) {
        const currentProduct = this.goods.find(good => good.id === product.id);

        if (currentProduct) {
            currentProduct.amount++;
            return;
        }

        const item = new ShoppingCartItem(product);
        this.goods.push(item);
    }
}

class ShoppingCartItem {
    constructor(data) {
        this.price = data.price;
        this.amount = 0;
    }

    get sum() {
        return this.price * this.amount;
    }
}

class ProductsList {
    constructor(container = '.products') {
        this.productsData = null;
        this.products = [];
        this.container = null;
        this.init(container);
    }

    init(container) {
        this.container = document.querySelector(container);
        this.productsData = this._fetchProductData();
    }

    _fetchProductData() {
        return [
            {id: 1, title: 'Notebook', price: 2000},
            {id: 2, title: 'Mouse', price: 20},
            {id: 3, title: 'Keyboard', price: 200},
            {id: 4, title: 'Gamepad', price: 50},
        ];
    }

    render() {
        this.productsData.forEach(productData => {
            const product = new Product(productData);
            this.products.push(product);
            this.container.insertAdjacentHTML('beforeend', product.html);
        });
    }

    // === the second task ===
    get totalCost() {
        return this.products.reduce((total, product) => product.price + total, 0);
    }
}

class Product {
    constructor(product = {}) {
        this.title = product.title || '';
        this.price = product.price || '';
        this.img = product.img || { url: 'img/product.jpg', alt: 'Product' };
    }

    get html() {
        return `<div class="product-item">
                <img src="${this.img.url}" alt="${this.img.alt}">
                <h3>${this.title}</h3>
                <p>${this.price}</p>
                <button class="btn buy-btn">Купить</button>
            </div>`
    }
}

const productsList = new ProductsList();
productsList.render();

// calculate the total cost of goods
console.log('Total: ', productsList.totalCost);
