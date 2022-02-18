const hostile = require('hostile');

hostile.get(false, (err, lines) => {
    if (err) {
        console.error(err);
    }

    lines.forEach(line => console.log(line));

});
