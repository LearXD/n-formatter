const fs = require('fs');

class Formatter {
    
    constructor(language, config) {
        this.language = language;
        this.config = config;
        this.config.decimal = this.config.decimal ?? 0;
        this.sizes = this.getSizesByLanguage(config.language)
    }

    getSizesByLanguage (language) {
        const file = fs.readFileSync(`./formatting/${language ?? 'en'}.json`);
        if(!file) {
            throw new Error('Language not found');
        }
        return JSON.parse(file);
    }

    format (number) {
        const size = number.toString().replace(/[-]/g, '').length;
        return this.toFormatedString(number, size);
    }

    toFormatedString (number, size) {
        const result = this.sizes.find((element) => element.range[0] <= size && element.range[1] >= size);
        if(!result) {
            return number;
        }
        const difference = size - result.size;
        console.log((number / (10**(result.size - this.config.decimal))))
        const unityNumber = (number / (10**(result.size - this.config.decimal))) * (10**(-this.config.decimal));
        return `${unityNumber.toFixed(this.config.decimal)}${this.config.simple ? result.symbol : result.identifier}`
    }
}

// try {
//     const formater = new Formatter('pt-br', {language: 'pt', simple: true, assumeResult: true, decimal: 2});
//     console.log(formater.format(12345));
// } catch (error) {
//     console.warn(error);
// }

module.exports = Formatter