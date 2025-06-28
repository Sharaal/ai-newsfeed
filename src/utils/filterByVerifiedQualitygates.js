module.exports = function filterByVerifiedQualitygates(feed) {
    return feed.filter(news => {
        if (news.qualitygates === undefined) {
            return true;
        }
        for (const [, verified] of Object.entries(news.qualitygates)) {
            if (!verified) {
                return false;
            }
        }
        return true;
    });
};
