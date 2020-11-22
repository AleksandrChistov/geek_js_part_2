function declensionOfText(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number % 100 > 4 && number % 100 < 20)? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

class ShoppingCart {
    constructor(container = '.shopping-cart') {
        this.container = container;
        this.goods = [];
        this.amount = 0;
        this.countGoods = 0;
        this.init();
    }

    init() {
        this.container = document.querySelector(this.container);
        this.container.addEventListener('click', (event) => this.handleClick(event));

        const buttonCart = document.querySelector('[data-action="show"]');
        buttonCart.addEventListener('click', () => this.showCartData());
    }

    showCartData() {
        this._fetchProductsData().then(goods => {
            if (goods.contents) {
                this.goods = goods.contents.map(product => new ShoppingCartItem(product));
            }
            this.amount = goods.amount;
            this.countGoods = goods.countGoods;
            this.render();
        });
    }

    render() {
        const text = declensionOfText(this.countGoods, ['товар', 'товара', 'товаров']);

        const layoutsGoods = this.goods.map(product => product.render());
        const layoutTotal = `
            <p class="total">
                <span>Итого:</span> 
                <span>${this.countGoods} ${text}</span> 
                <span>${this.amount}</span>
            </p>
        `;

        this.container.innerHTML = layoutsGoods.join('') + layoutTotal;
    }

    handleClick(event) {
        const id = event.target.dataset.id;
        const action = event.target.dataset.action;

        if (!id) return;

        if (action === 'delete') {
            this._deleteProduct(id);
        }

        if (action === 'decrease' || action === 'increase') {
            this._updateShoppingCart(id, action);
        }
    }

    addProduct(id, dataProduct) {
        let currentProduct = this.goods.find(product => product.id == id);

        if (!currentProduct) {
            currentProduct = new ShoppingCartItem(dataProduct);
            this.goods.push(currentProduct);
        }

        currentProduct.increaseQuantity();
        this.countGoods++;
        this.amount += currentProduct.price;

        this._putShoppingCartData().then(() => this.render());
    }

    _fetchProductsData() {
        return fetch('https://test-19da2.firebaseio.com/shoppingCart.json')
            .then(goods => goods.json());
    }

    _putShoppingCartData() {
        const shoppingCart = this._prepareShoppingCartDataForPutting();

        return fetch(`https://test-19da2.firebaseio.com/shoppingCart.json`, {
            method: 'PUT',
            body: JSON.stringify(shoppingCart),
            headers: {
                'Content-Typ': 'application/json'
            }
        });
    }

    _prepareShoppingCartDataForPutting() {
        const contents = this.goods.map(product => product.content);

        return {
            amount: this.amount,
            contents: contents,
            countGoods: this.countGoods
        }
    }

    _updateShoppingCart(id, action) {
        const currentProduct = this.goods.find(product => product.id == id);

        if (!currentProduct) return;

        if (action === 'increase') {
            currentProduct.increaseQuantity();
            this.countGoods++;
            this.amount += currentProduct.price;
        } else {
            const isDecreased = currentProduct.decreaseQuantity();
            if (!isDecreased) {
                return;
            }
            this.countGoods--;
            this.amount -= currentProduct.price;
        }

        this._putShoppingCartData().then(() => this.render());
    }

    _deleteProduct(id) {
        this.goods = this.goods.filter(product => {
            if (product.id == id) {
                this.countGoods -= product.quantity;
                this.amount -= product.sum;
            } else {
                return product;
            }
        });

        this._putShoppingCartData().then(() => this.render());
    }
}

class ShoppingCartItem {
    constructor(data) {
        this.id = data.id;
        this.name = data.name || data.title;
        this.price = data.price;
        this.quantity = data.quantity || 0;
    }

    render() {
        return `
            <p>
                <span>${this.name}</span> 
                <span>
                    <span class="minus" data-id="${this.id}" data-action="decrease">-</span>
                    ${this.quantity}
                    <span class="plus" data-id="${this.id}" data-action="increase">+</span>
                </span> 
                <span>${this.sum}</span>
                <span class="delete" data-id="${this.id}" data-action="delete">X</span>
            </p>
        `
    }

    get sum() {
        return this.price * this.quantity;
    }

    decreaseQuantity() {
        if (this.quantity === 1) {
            return;
        }
        this.quantity--;
        return true;
    }

    increaseQuantity() {
        this.quantity++;
    }

    get content() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            quantity: this.quantity
        }
    }
}

class ProductsList {
    constructor(shoppingCart, container = '.products') {
        this.shoppingCart = shoppingCart;
        this.container = container;
        this.productsData = [];
        this.products = [];
        this.init(container);
    }

    init() {
        this.container = document.querySelector(this.container);
        this.container.addEventListener('click', (event) => this.handleClick(event));

        this._fetchProductsData().then(goods => {
            this.productsData = goods;
            this.render();
        });
    }

    render() {
        this.productsData.forEach(productData => {
            const product = new Product(productData);
            this.products.push(product);
            this.container.insertAdjacentHTML('beforeend', product.html);
        });
    }

    handleClick(event) {
        const id = event.target.dataset.id;
        const action = event.target.dataset.action;

        if (!id) return;

        if (action === 'buy') {
            const currentProduct = this.productsData.find(product => product.id == id);
            this.shoppingCart.addProduct(id, currentProduct);
        }
    }

    get totalCost() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.products.length) {
                    clearInterval(interval);
                    const total = this.products.reduce((total, product) => product.price + total, 0);
                    resolve(total);
                }
            }, 100);
        })
    }

    _fetchProductsData() {
        return fetch('https://test-19da2.firebaseio.com/goods.json')
            .then(goods => goods.json());
    }
}

class Product {
    constructor(product = {}) {
        this.id = product.id;
        this.title = product.title || '';
        this.price = product.price || '';
        this.img = product.img || { url: 'img/product.jpg', alt: 'Product' };
    }

    get html() {
        return `<div class="product-item">
                <img src="${this.img.url}" alt="${this.img.alt}">
                <h3>${this.title}</h3>
                <p>${this.price}</p>
                <button class="btn buy-btn" data-id="${this.id}" data-action="buy">Купить</button>
            </div>`
    }
}

const shoppingCart = new ShoppingCart();

const productsList = new ProductsList(shoppingCart);
// calculate the total cost of goods
productsList.totalCost.then(result => console.log('Total cost of goods: ', result));


