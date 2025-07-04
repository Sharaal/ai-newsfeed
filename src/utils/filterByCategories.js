module.exports = function filterByCategories(feed, categories) {
    if (!categories) {
        return feed;
    }
    return feed.filter(news => {
        for (const [name, relevance] of Object.entries(categories)) {
            if (news.categories === undefined) {
                return false;
            }
            const categories = news.categories.filter((category) => {
                return category.name === name && category.relevance >= relevance;
            });
            if (categories.length) {
                return true;
            }
        }
        return false;
    });
};
