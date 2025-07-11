module.exports = function filterByPublished(feed, published) {
    if (!published) {
        return feed;
    }
    return feed.filter(news => news.published >= published);
};
