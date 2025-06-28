module.exports = function filterByCategories(feed, categories) {
    if (!categories) {
        return feed;
    }
    return feed.filter(news => {
        for (const [category, relevance] of Object.entries(categories)) {
            if (news.categories === undefined) {
                return false;
            }
            if (news.categories[category] >= relevance) {
                return true;
            }
        }
        return false;
    });
};
