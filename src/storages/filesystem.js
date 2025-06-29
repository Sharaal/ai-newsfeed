const fs = require('fs');
const { globSync } = require('glob')
const matter = require('gray-matter');

const filterByAigenerated = require('../utils/filterByAigenerated');
const filterByCategories = require('../utils/filterByCategories');
const filterByDate = require('../utils/filterByDate');
const filterByLanguage = require('../utils/filterByLanguage');
const filterByQualitygates = require('../utils/filterByQualitygates');
const orderByDateDesc = require('../utils/orderByDateDesc');

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
        const date = file.substring(5, 15);
        if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            console.warn(`File ${file} has an invalid name format. Expected to start with YYYY-MM-DD. Skipping...`);
            return;
        }
        return {
            ...data,
            date,
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
    .sort(orderByDateDesc);

module.exports = function storage({ language, categories, qualitygates, aigenerated, date, limit, offset }) {
    let feed = data;

    feed = filterByLanguage(feed, language);
    feed = filterByCategories(feed, categories);
    feed = filterByQualitygates(feed, qualitygates);
    feed = filterByAigenerated(feed, aigenerated);
    feed = filterByDate(feed, date);

    offset = parseInt(offset) || 0;
    limit = parseInt(limit) || feed.length;
    feed = feed.slice(offset, offset + limit);

    return feed;
};
