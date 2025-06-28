module.exports = function parseQueryValue(value) {
    if (!value) {
        return;
    }
    if (value === 'false') {
        return 'false';
    }
    return value.split(',').reduce(
        (previous, current) => {
            let [name, value] = current.split('-');
            previous[name] = value;
            return previous;
        },
        {},
    );
};
