module.exports = function filterByLanguage(feed, language) {
    if (!language) {
        return feed;
    }
    return feed.filter(news => news.language === language);
};
