module.exports = function filterByAigenerated(feed, aigenerated) {
    if (!aigenerated || aigenerated !== 'false') {
        return feed;
    }
    return feed.filter(news => !news.aigenerated);
};
