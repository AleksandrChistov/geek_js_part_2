class Hamburger {
    constructor({size = 'small', filling = 'cheese'} = {}) {
        this.size = size;
        this.filling = filling;
        this.seasoning = false;
        this.mayonnaise = false;
        this.dataForCalculation = {
            small: {
                price: 50,
                calories: 20
            },
            big: {
                price: 100,
                calories: 40
            },
            cheese: {
                price: 10,
                calories: 20
            },
            salad: {
                price: 20,
                calories: 5
            },
            potatoes: {
                price: 15,
                calories: 10
            },
            seasoning: {
                price: 15,
                calories: 0
            },
            mayonnaise: {
                price: 20,
                calories: 5
            }
        }
        this.init();
    }

    init() {
        document.getElementById(this.size).setAttribute('checked', 'true');
        document.getElementById(this.filling).setAttribute('checked', 'true');

        const sizeElement = document.getElementById('size');
        const fillingElement = document.getElementById('filling');
        const seasoningElement = document.getElementById('seasoning');
        const mayonnaiseElement = document.getElementById('mayonnaise');
        const calculateElement = document.getElementById('calculate');

        sizeElement.addEventListener('change', event => this.changeSize(event));
        fillingElement.addEventListener('change', event => this.changeFilling(event));
        seasoningElement.addEventListener('change', () => this.addSeasoning());
        mayonnaiseElement.addEventListener('change', () => this.addMayonnaise());
        calculateElement.addEventListener('click', () => this.showResult());
    }

    changeSize(event) {
        this.size = event.target.value;
    }

    changeFilling(event) {
        this.filling = event.target.value;
    }

    addSeasoning() {
        this.seasoning = !this.seasoning;
    }

    addMayonnaise() {
        this.mayonnaise = !this.mayonnaise;
    }

    showResult() {
        const totalPrice = this.calculate('price');
        const totalCalories = this.calculate('calories');
        const totalElement = document.getElementById('total');
        totalElement.innerHTML = `
                <p>Total price: <b>${totalPrice}</b></p>
                <p>Total calories: <b>${totalCalories}</b></p>
            `
    }

    calculate(value) {
        let total = 0;
        total += this.dataForCalculation[this.size][value];
        total += this.dataForCalculation[this.filling][value];
        if (this.seasoning) {
            total += this.dataForCalculation.seasoning[value];
        }
        if (this.mayonnaise) {
            total += this.dataForCalculation.mayonnaise[value];
        }
        return total;
    }
}

const productsList = new Hamburger();
