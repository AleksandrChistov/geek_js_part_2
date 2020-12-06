let add = (cart, req) => {
    cart.contents.push(req.body);
    cart.amount += req.body.price;
    cart.countGoods++;
    return JSON.stringify(cart, null, 4);
};
let change = (cart, req) => {
    let amount = 0;
    let countGoods = 0;

    cart.contents.map(product => {
        if (product.id === +req.params.id) {
            product.quantity = req.body.quantity;
        }
        amount += product.price * product.quantity;
        countGoods += product.quantity;
    });

    cart.amount = amount;
    cart.countGoods = countGoods;

    return JSON.stringify(cart, null, 4);
};
let remove = (cart, req) => {
    cart.contents = cart.contents.filter(product => {
        if (product.id === +req.body.id) {
            cart.amount -= product.price * product.quantity;
            cart.countGoods -= product.quantity;
            return false;
        }
        return true;
    });

    return JSON.stringify(cart, null, 4);
};

module.exports = {
    add,
    change,
    remove
};
