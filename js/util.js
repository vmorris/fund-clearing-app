module.exports.guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 65536)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

module.exports.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
module.exports.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}