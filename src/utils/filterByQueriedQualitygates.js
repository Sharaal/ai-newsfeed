module.exports = function filterByQueriedQualitygates(feed, qualitygates) {
    return feed.filter(news => {
        if (news.qualitygates === undefined) {
            return true;
        }
        for (const [qualitygate, verified] of Object.entries(qualitygates)) {
            const newsQualitygate = news.qualitygates.find(newsQualitygate => newsQualitygate.name === qualitygate);
            if (newsQualitygate && newsQualitygate.verified !== (verified === 'true')) {
                return false;
            }
        }
        return true;
    });
};
