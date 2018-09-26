const isDev = process.env.NODE_ENV === "development";

module.exports = {
    plugins: [
        require("postcss-import"),
        require("postcss-extend"),
        require("postcss-nested"),
        isDev ? null : require("cssnano")
    ].filter(x => x)
}
