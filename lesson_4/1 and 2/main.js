function getText(url = './texttoreplace.txt') {
    return fetch(url).then(result => result.text());
}

class TextReplacer {
    replaceSingleQuotesWithDouble(text) {
        const newString = text.replace(/^'|(\s)'|'(\s)|'$/gi, '$1"$2');
        console.log(newString);
    }
}

const textReplacer = new TextReplacer();

getText().then(text => textReplacer.replaceSingleQuotesWithDouble(text));
