module.exports = [
    'application/json',
    (feed) => JSON.stringify(feed, null, 4),
];
