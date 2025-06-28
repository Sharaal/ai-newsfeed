const filterByQueriedQualitygates = require('./filterByQueriedQualitygates');
const filterByVerifiedQualitygates = require('./filterByVerifiedQualitygates');

module.exports = function filterByQualitygates(feed, qualitygates) {
    if (!qualitygates) {
        return filterByVerifiedQualitygates(feed);
    }
    if (qualitygates === 'false') {
        return feed;
    }
    return filterByQueriedQualitygates(feed, qualitygates);
};
