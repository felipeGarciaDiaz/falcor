const express = require("express");
const app = express();

// Exports
module.exports = {
    coverage: coverage
};

function listen(serverPort, launchWindow, cb) {
    return app.listen(serverPort, function() {
        if (cb) {
            cb();
        }
        if (launchWindow) {
            try {
                require("child_process").exec("open http://localhost:" + serverPort);
            }
            catch(err) {
             console.error(err);   
            }
        }
    });
}

function coverage(serverPort, launchWindow) {
    app.use(express.static("coverage/lcov-report"));
    return listen(serverPort, launchWindow);
}

// Run if main
if (require.main === module) {
    const port = process.argv[2] || 8080;
    const run = process.argv[3];
    switch (run) {
        case "examples":
            app.use(express.static("."));
            app.get("/500", function(req, res) {
                res.send(500);
            });
            listen(port, true);
            break;
        case "coverage":
        default:
            coverage(port, true);
            break;
    }
}
