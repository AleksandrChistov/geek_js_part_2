class Validator {
    constructor() {
        this.form = document.getElementById('form');
        this.formDataForValidation = [
            {
                element: document.getElementById('name'),
                pattern: /^([a-zа-яё\s]+)$/i,
            },
            {
                element: document.getElementById('phone'),
                pattern: /^(\+7\(\d{3}\)\d{3}-\d{4})$/i
            },
            {
                element: document.getElementById('email'),
                pattern: /^([\w]+\.?\-?[\w]+@[a-z]+\.[a-z]{2,4})$/i
            },
        ]
        this._init();
    }

    _init() {
        this.form.addEventListener('submit', (e) => this._validateData(e));

        const validateInput = Validator.debounce((e, data) => {
            const value = e.target.value.trim();
            const isValid = data.pattern.test(value);
            this._showResult(isValid, data);
        }, 300);

        this.formDataForValidation.forEach(data => {
            data.element.addEventListener('input', (e) => validateInput(e, data));
        })
    }

    static debounce(fn, ms) {
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

    _validateData(e) {
        e.preventDefault();

        this.formDataForValidation.forEach(data => {
            const value = data.element.value.trim();
            const isValid = data.pattern.test(value);
            this._showResult(isValid, data);
        })
    }

    _showResult(isValid, data) {
        if (!isValid) {
            data.element.classList.remove('valid');
            data.element.classList.add('invalid');
            data.element.nextElementSibling.style.display = 'block';
            return;
        }

        data.element.classList.remove('invalid');
        data.element.classList.add('valid');
        data.element.nextElementSibling.style.display = 'none';
    }
}

new Validator();
