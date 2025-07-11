module.exports = function filterByVerifiedQualitygates(feed) {
    return feed.filter(news => {
        if (news.qualitygates === undefined) {
            return true;
        }
        for (const { verified } of news.qualitygates) {
            if (!verified) {
                return false;
            }
        }
        return true;
    });
};
