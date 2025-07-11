const fs = require('fs');
const { globSync } = require('glob')
const matter = require('gray-matter');

const filterByAigenerated = require('../utils/filterByAigenerated');
const filterByCategories = require('../utils/filterByCategories');
const filterByPublished = require('../utils/filterByPublished');
const filterByLanguage = require('../utils/filterByLanguage');
const filterByQualitygates = require('../utils/filterByQualitygates');
const orderByPublishedDesc = require('../utils/orderByPublishedDesc');

const data = globSync('./data/*.md')
    .map(file => {
        const { content, data } = matter(fs.readFileSync(file, 'utf-8'));
        if (data.layout !== 'post') {
            return;
        }
        if (!data.title) {
            console.warn(`File ${file} is missing a title. Skipping...`);
            return;
        }
        const published = file.substring(5, 15);
        if (!published.match(/^\d{4}-\d{2}-\d{2}$/)) {
            console.warn(`File ${file} has an invalid published format. Expected to start with YYYY-MM-DD. Skipping...`);
            return;
        }
        return {
            ...data,
            published,
            content: content.trim(),
            assets: {
                images: globSync('./public/assets/' + file.substring(5, file.length - 3) + '/images/*.*')
                    .map(asset => asset.substring(7)),
                tts: globSync('./public/assets/' + file.substring(5, file.length - 3) + '/tts.*')
                    .map(asset => asset.substring(7))[0],
            }
        }
    })
    .filter(Boolean)
    .sort(orderByPublishedDesc);

module.exports = function storage({ aigenerated, categories, language, published, qualitygates, limit, offset }) {
    let feed = data;

    feed = filterByAigenerated(feed, aigenerated);
    feed = filterByCategories(feed, categories);
    feed = filterByLanguage(feed, language);
    feed = filterByPublished(feed, published);
    feed = filterByQualitygates(feed, qualitygates);

    offset = parseInt(offset) || 0;
    limit = parseInt(limit) || feed.length;
    feed = feed.slice(offset, offset + limit);

    return feed;
};
