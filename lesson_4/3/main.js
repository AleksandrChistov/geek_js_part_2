const form = document.getElementById('form');
const name = document.getElementById('name');
const phone = document.getElementById('phone');
const email = document.getElementById('email');

form.addEventListener('submit', validation);

function validation(e) {
    e.preventDefault();

    const regexpForName = /^([a-zа-яё|\s]+)$/i;
    const nameValue = name.value.trim();
    const nameIsValid = regexpForName.test(nameValue);

    name.nextElementSibling.style.display = nameIsValid ? 'none' : 'block';

    const regexpForPhone = /^(\+7\(\d{3}\)\d{3}\-\d{4})$/i;
    const phoneValue = phone.value.trim();
    const phoneIsValid = regexpForPhone.test(phoneValue);

    phone.nextElementSibling.style.display = phoneIsValid ? 'none' : 'block';

    const regexpForEmail = /^([a-z0-9]+\.?\-?[a-z0-9]+@[a-z]+\.[a-z]{2,4})$/i;
    const emailValue = email.value.trim();
    const emailIsValid = regexpForEmail.test(emailValue);

    email.nextElementSibling.style.display = emailIsValid ? 'none' : 'block';
}
