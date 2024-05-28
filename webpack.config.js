const dev_ifdefLoaderOptions = { DEBUG: true };
const prod_ifdefLoaderOptions = { DEBUG: false };


function config(outFileName, mode, devtool, ifdefLoaderOptions) {
    return {
        entry: "./lib/main.js",

        target: "node",

        output:
        {
            filename: outFileName,
            path: __dirname + "/lib",
            // library: 'neshek1',
            // libraryTarget: 'umd',
            globalObject: 'this'
        },

        mode: mode,
        devtool: devtool,
        resolve: { extensions: [".js"] },

        module:
        {
            rules:
                [
                    { test: /\.js$/, use: [{ loader: "ifdef-loader", options: ifdefLoaderOptions }] },
                    { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
                ]
        }
    }
}



module.exports =
    [
        config("neshek1.dev.js", "development", "inline-source-map", dev_ifdefLoaderOptions),
        config("neshek1.js", "production", undefined, prod_ifdefLoaderOptions),
    ];


