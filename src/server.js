require('dotenv-safe').config();

const express = require('express');
const app = express();

app.use(express.static('public'));

const parseQueryValue = require('./utils/parseQueryValue');
const storage = require('./storages/filesystem');
const views = [
    require('./views/html'),
    require('./views/json'),
    require('./views/rss'),
];
app.get('/', (req, res) => {
    const feed = storage({
        language: req.query.language, 
        categories: parseQueryValue(req.query.categories), 
        qualitygates: parseQueryValue(req.query.qualitygates),
        aigenerated: req.query.aigenerated,
        date: req.query.date,
        limit: req.query.limit,
        offset: req.query.offset,
    });
    for (const [type, handler] of views) {
        if (req.accepts(type)) {
            res.setHeader('Content-Type', type);
            return res.send(handler(feed));
        }
    }
    return res.statusCode(406);
});

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('yamljs').load('./docs/api.yml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Visit http://localhost:${PORT}/ to see feed`)
    console.log(`Visit http://localhost:${PORT}/api-docs/ to see the API documentation`);
});
