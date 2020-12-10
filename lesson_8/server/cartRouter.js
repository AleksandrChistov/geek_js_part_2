const express = require('express');
const fs = require('fs');
const router = express.Router();
const handler = require('./handler');

router.get('/', (req, res) => {
    fs.readFile('lesson_8/server/db/productsCart.json', 'utf-8', (err, data) => {
        if(err){
            res.sendStatus(404, JSON.stringify({result:0, text: err}));
        } else {
            res.send(data);
        }
    })
});
router.post('/', (req, res) => {
    handler(req, res, 'add', 'lesson_8/server/db/productsCart.json');
});
router.put('/:id', (req, res) => {
    handler(req, res, 'change', 'lesson_8/server/db/productsCart.json');
});
router.delete('/:id', (req, res) => {
    handler(req, res, 'remove', 'lesson_8/server/db/productsCart.json');
});

module.exports = router;
