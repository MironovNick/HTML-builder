const fs = require('fs');
const path = require('path');
const {readdir, stat, readFile} = require('fs/promises');

const indir = path.join(__dirname,'styles');
const outdir = path.join(__dirname,'project-dist');

const outfile = fs.createWriteStream(path.join(outdir,'bundle.css'));

async function mergeStyles() {
    try {
        const files = await readdir(indir);
        for (const file of files) {
            const stats = await stat(path.join(indir,file));
            if( stats.isFile() && path.extname(file).slice(1).toLowerCase() === 'css' ) {
                let data = await readFile(path.join(indir, file), 'utf-8');
                
                outfile.write(data);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

mergeStyles();