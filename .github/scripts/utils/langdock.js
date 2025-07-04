const axios = require('axios');
const fs = require('fs');
const path = require('path');
const wait = require('./wait');

let needToWait = false;

module.exports = async function langdock(debugFilePath, template, templateData) {
    if (process.env.USE_DEBUG_FILE === 'true' && fs.existsSync(debugFilePath)) {
        console.log('Using debug file:', debugFilePath);
        return JSON.parse(fs.readFileSync(debugFilePath, 'utf8')).response.data;
    }
    
    let prompt = template.prompt;
    for (const key in templateData) {
        prompt = prompt.replace(`{${key}}`, templateData[key]);
    }

    if (needToWait) {
        await wait();
    }
    needToWait = true;

    const url = 'https://api.langdock.com/assistant/v1/chat/completions';
    const body = {
        // Temporärer Assistant
        assistant: {
            name: 'News Assistant',
            instructions: '',
            capabilities: {
                webSearch: true, // Aktiviert Web-Suche
                dataAnalyst: false,
                imageGeneration: false
            }
        },
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        output: template.output,
    };
    const options = {
        headers: {
            'Authorization': `Bearer ${process.env.LANGDOCK_API_KEY}`,
            'Content-Type': 'application/json'
        }
    };
    const response = await axios.post(url, body, options);

    const fileData = {
        request: {
            output: template.output,
            prompt,
            timestamp: new Date().toISOString(),
        },
        response: {
            data: response.data,
        },
    };

    const dir = path.dirname(debugFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(debugFilePath, JSON.stringify(fileData, null, 2), 'utf8');

    return fileData.response.data;
}
