const fs = require('fs');
const path = require('path');

// ⚠️ CHANGE THIS to the exact path of your ORIGINAL 40MB HTML file
const originalHtmlFile = 'C:\\Users\\Brendan Yung\\Downloads\\art-yotakuou\\ver. 2\\art-yotakuou.html'; 

const outDir = './css-final';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

let html = fs.readFileSync(originalHtmlFile, 'utf8');

// 1. Extract the <style> block
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/i;
const match = html.match(styleRegex);

if (match) {
    const cssContent = match[1];
    const chunkSize = 10 * 1024 * 1024; // 10MB per chunk (Safe for GitHub)
    let links = '';
    let chunkIndex = 1;

    // 2. Split the CSS text into 10MB pieces
    for (let i = 0; i < cssContent.length; i += chunkSize) {
        const chunk = cssContent.substring(i, i + chunkSize);
        const filename = `style-part${chunkIndex}.css`;
        fs.writeFileSync(path.join(outDir, filename), chunk);
        links += `    <link rel="stylesheet" href="${outDir.replace('./', '')}/${filename}">\n`;
        chunkIndex++;
    }

    // 3. Remove the <style> block from HTML and inject the <link> tags
    html = html.replace(styleRegex, links);
    
    // 4. Remove the old inline <script> block and replace with app.js
    const scriptRegex = /<script type="module" crossorigin>[\s\S]*?<\/script>/i;
    html = html.replace(scriptRegex, '    <script type="module" crossorigin src="app.js"></script>');

    // 5. Save the new clean index.html
    fs.writeFileSync('index.html', html);
    console.log(`✅ Success! Extracted CSS into ${chunkIndex - 1} files inside ${outDir}.`);
    console.log(`✅ Created a brand new clean index.html.`);
} else {
    console.log('❌ Could not find a <style> block in the original HTML file. Check the path.');
}