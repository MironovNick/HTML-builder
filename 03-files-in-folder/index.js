const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname,'secret-folder'), (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach(file => {
        fs.stat(path.join(__dirname,'secret-folder',file), (err, stats) => {
            if (err) {
                console.error(err);
                return;
            }
            if(stats.isFile()) {
                const extname = path.extname(file) 
                const res = path.basename(file, extname) + " - " + extname.slice(1) + " - " + (stats.size / 1024).toFixed(3) + "kb";
                console.log(res);
            }
        })
    });
})