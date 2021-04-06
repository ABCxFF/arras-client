module.exports.configureDefault = function (options, defaults) {
    for (let key in defaults) {
        if (typeof defaults[key] === 'object') {
            options[key] = module.exports.configureDefault(options[key], defaults[key])
            continue;
        }
        options[key] = typeof options[key] === 'undefined' ? defaults[key] : options[key];
    }
    return options
}
