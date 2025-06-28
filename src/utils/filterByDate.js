module.exports = function filterByLanguage(feed, date) {
    if (!date) {
        return feed;
    }
    return feed.filter(news => news.date >= date);
};
