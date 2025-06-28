module.exports = function filterByQueriedQualitygates(feed, qualitygates) {
    return feed.filter(news => {
        if (news.qualitygates === undefined) {
            return true;
        }
        for (const [qualitygate, verified] of Object.entries(qualitygates)) {
            if (news.qualitygates[qualitygate] !== (verified === 'true')) {
                return false;
            }
        }
        return true;
    });
};
