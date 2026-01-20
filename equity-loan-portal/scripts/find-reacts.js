const fs = require('fs');
const path = require('path');

function walk(dir, results) {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir)) {
        const p = path.join(dir, f);
        try {
            const s = fs.statSync(p);
            if (s.isDirectory()) {
                const pj = path.join(p, 'package.json');
                if (fs.existsSync(pj)) {
                    try {
                        const j = JSON.parse(fs.readFileSync(pj, 'utf8'));
                        if (j.name === 'react') results.push({ pkg: pj, version: j.version });
                    } catch (e) { }
                }
                walk(p, results);
            }
        } catch (e) { }
    }
}

const results = [];
let dir = process.cwd();
while (true) {
    const nm = path.join(dir, 'node_modules');
    walk(nm, results);
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
}

if (results.length === 0) console.log('no react package.json found under node_modules in current and parent dirs');
else results.forEach(r => console.log('found', r.pkg, 'version', r.version));
