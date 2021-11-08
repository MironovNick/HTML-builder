const fs = require('fs');
const path = require('path');
const {readdir, stat, unlink, mkdir, copyFile, readFile} = require('fs/promises');

const stylesDir = path.join(__dirname,'styles');
const componentsDir = path.join(__dirname,'components');
const distDir = path.join(__dirname,'project-dist');
const inAssetsDir = path.join(__dirname,'assets');
const outAssetsDir = path.join(distDir,'assets');

async function buildPage() {
    try {
        try {
            const stats = await stat(distDir);
            let files = await readdir(distDir);
            for (const file of files) {
                const stats = await stat(path.join(distDir,file));
                if( stats.isFile() )
                    await unlink(path.join(distDir,file));
            }

            files = await readdir(outAssetsDir);
            for (const file of files) {
                const stats = await stat(path.join(outAssetsDir,file));
                if( stats.isFile() )
                    await unlink(path.join(outAssetsDir,file));
                else {
                    const files1 = await readdir(path.join(outAssetsDir,file));
                    for (const file1 of files1) {
                        const stats = await stat(path.join(outAssetsDir,file ,file1));
                        if( stats.isFile() )
                            await unlink(path.join(outAssetsDir, file,file1));
                    }
                }
            }
        } catch (err) {
            if(err.code === 'ENOENT') {
                await mkdir(path.join(outAssetsDir, 'fonts'), { recursive: true });
                await mkdir(path.join(outAssetsDir, 'img'), { recursive: true });
                await mkdir(path.join(outAssetsDir, 'svg'), { recursive: true });
            } else
                throw err;
        }
к
        let files = await readdir(inAssetsDir);
        for (const file of files) {
            const stats = await stat(path.join(inAssetsDir,file));
            if( stats.isFile() )
                await copyFile(path.join(inAssetsDir,file), path.join(outAssetsDir,file));
            else {
                const files1 = await readdir(path.join(inAssetsDir,file));
                for (const file1 of files1) {
                    const stats = await stat(path.join(inAssetsDir,file ,file1));
                    if( stats.isFile() )
                        await copyFile(path.join(inAssetsDir,file, file1), path.join(outAssetsDir,file, file1));
                }
            }
        }

        const styleFile = fs.createWriteStream(path.join(distDir,'style.css'));
        files = await readdir(stylesDir);
        for (const file of files) {
            const stats = await stat(path.join(stylesDir,file));
            if( stats.isFile() && path.extname(file).slice(1).toLowerCase() === 'css' ) {
                let data = await readFile(path.join(stylesDir, file), 'utf-8');
                
                styleFile.write(data);
            }
        }

        const htmlFile = fs.createWriteStream(path.join(distDir,'index.html'));
        let tempData = await readFile(path.join(__dirname, 'template.html'), 'utf-8');
        files = await readdir(componentsDir);
        for (const file of files) {
            let data = await readFile(path.join(componentsDir, file), 'utf-8');
            let fName = path.basename(file, path.extname(file)).toLowerCase();
            if(tempData.indexOf(`{{${fName}}}`) > -1 && path.extname(file).toLowerCase() === '.html')
                tempData = tempData.replace(`{{${fName}}}`, data);
        }

        htmlFile.write(tempData);
            
    } catch (err) {
        console.error(err);
    }
}

buildPage();