#!/usr/bin/env node

require('dotenv-safe').config({ allowEmptyValues: true});

const fs = require('fs');
const { globSync } = require('glob')
const matter = require('gray-matter');
const path = require('path');

const langdock = require('./utils/langdock');
const selectCategories = require('../../config/promptTemplates/selectCategories.js');

async function main() {
    const categories = fs.readFileSync(`config/categories.md`, 'utf8').trim();

    // Alle News aus /data laden, die noch keine Kategorien haben
    const files = globSync('data/*.md')
        .map(file => {
            const { content, data } = matter(fs.readFileSync(file, 'utf-8'));
            if (data.layout !== 'post' || data.categories) {
                return;
            }
            return { file, content, data };
        })
        .filter(Boolean);

    if (files.length === 0) {
        console.log('No news files found without categories.');
        return;
    }

    // Durchgehen und für jede News die Kategorien prompten
    for (const { file, content, data } of files) {
        console.log(`Processing file: ${file}`);

        const debugFilePath = `.github/debug/${path.basename(file, '.md')}/selectCategories.json`;
        const templateData = { categories, content, title: data.title };
        const response = await langdock(debugFilePath, selectCategories, templateData);

        data.categories = response.formattedResult[0] || [];
        
        fs.writeFileSync(file, matter.stringify(content, data));
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
