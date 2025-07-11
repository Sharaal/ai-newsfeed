const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

module.exports = [
    'text/html',
    (feed) => {
        const itemsHtml = feed.map((item, index) => {
            let paragraphs = [];
            const excerptSymbol = '<!--more-->';
            if (item.content.includes(excerptSymbol)) {
                paragraphs = item.content.split(excerptSymbol);
            } else {
                paragraphs = item.content.split(/\n\s*\n/);
            }
            const summaryHtml = paragraphs[0] ? md.render(paragraphs[0]) : '';
            const fullHtml = paragraphs.slice(1).map(p => md.render(p)).join('');
            const toggleHtml = `
                <a href="#" class="toggle" onclick="
                    const fullElem = document.querySelector('#item-${index} .full');
                    fullElem.style.display = fullElem.style.display === 'none' ? 'block' : 'none';
                    // Toggle the text of all links in this article
                    const links = document.querySelectorAll('#item-${index} a.toggle');
                    links.forEach(link => {
                        link.textContent = fullElem.style.display === 'none' ? 'more' : 'less';
                    });
                    return false;
                ">more</a>
            `;
            return `
<article id="item-${index}">
    <h2>${item.published}: ${item.title}</h2>
    ${
        item.categories 
        ? `<p><em>
            ${item.categories.map(
                ({ name, relevance }) => `<a href="${process.env.URL}/?categories=${name}">${name}</a>-${relevance}`
            ).join(', ')}
        </em></p>`
        : ''
    }
    ${item.assets?.tts ? `<audio controls><source src="${process.env.URL}/${item.assets.tts}" type="audio/mpeg"></audio>` : ''}
    <div class="summary">${summaryHtml}</div>
    <div class="full" style="display:none">
        ${toggleHtml}
        ${fullHtml}
        ${item.aigenerated ? '<p>News is completely AI Generated</p>' : ''}
    </div>
    ${toggleHtml}
</article>`;
        }).join('');
        return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8"/>
    <title>AI Newsfeed</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        header { border-bottom: 1px solid #ccc; margin-bottom: 20px; padding-bottom: 20px; }
        article { margin-bottom: 20px; }
        .summary, .full { margin-bottom: 10px; }
    </style>
</head>
<body>
    <header>
        <h1><a href="${process.env.URL}">AI Newsfeed</a></h1>
        <a href="${process.env.URL}/api-docs" target="_blank">API Docs</a>
    </header>
    <main>${itemsHtml}</main>
</body>
</html>`;
    },
];
