const path = require('path');
const {readdir, stat, unlink, mkdir, copyFile} = require('fs/promises');

const indir = path.join(__dirname,'files');
const outdir = path.join(__dirname,'files-copy');

async function copyDirf() {
             try {
                try {
                    const stats = await stat(outdir);
                    const files = await readdir(outdir);
                    for (const file of files)
                        await unlink(path.join(outdir,file));
                } catch (err) {
                    if(err.code === 'ENOENT')
                         mkdir(outdir, { recursive: true });
                    else
                        throw err;
                }
                
                const files = await readdir(indir);
                for (const file of files)
                    await copyFile(path.join(indir,file), path.join(outdir,file));
            } catch (err) {
                console.error(err);
            }
}

copyDirf();
