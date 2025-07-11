module.exports = function orderByPublishedDesc(a, b) {
    if (a.published > b.published) {
        return -1;
    }
    if (a.published < b.published) {
        return 1;
    }
    return 0;
};
