const RSS = require('rss');

module.exports = [
    'application/rss+xml',
    (feed) => {
        const rss = new RSS({
            title: 'AI Newsfeed',
            description: ' ',
            site_url: process.env.URL,
            generator: ' ',
        });
        feed.forEach(news => {
            rss.item({
                title: news.title,
                description: news.content,
                date: news.date,
                enclosure: {
                    url: news.assets?.tts ? process.env.URL + '/' + news.assets.tts : undefined,
                },
                custom_elements: [
                    { language: news.language },
                    { 
                        assets: [
                            ...news.assets?.images
                                ? news.assets?.images.map(url => ({ image: process.env.URL + '/' + url }))
                                : [],
                        ],
                    },
                ]
                    .concat(
                        Object.entries(news.categories || {}).map(([category, relevance]) => ({
                            category: [
                                { _attr: { relevance } },
                                category,
                            ],
                        })),
                    )
                    .concat(
                        Object.entries(news.qualitygates || {}).map(([qualitygate, verified]) => ({
                            qualitygate: [
                                { _attr: { verified } },
                                qualitygate,
                            ],
                        })),
                    ),
            })
        });
        return rss.xml();
    },
];
