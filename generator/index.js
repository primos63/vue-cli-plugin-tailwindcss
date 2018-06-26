module.exports = (api, options, rootOptions) => {
    const tailwindPkg = {
        devDependencies: {
            "tailwindcss": "^0.6.1"
        }
    }

    api.extendPackage(tailwindPkg)

    api.render({
        "./src/assets/styles/main.css": "./templates/assets/styles/main.css",
        "./tailwind.config.js": "./templates/assets/tailwind.config.js"
    }, options)

    const postcssConfig = {
        "plugins": {
            "tailwindcss": "./tailwind.config.js",
            "autoprefixer": {}
        }
    }

    api.extendPackage({ postcss: postcssConfig })

    api.onCreateComplete(() => {
        // inject into App.vue
        const fs = require("fs")
        const mainPath = api.resolve("./src/main.js")

        // get content
        let contentMain = fs.readFileSync(mainPath, {encoding: "utf-8"})
        const lines = contentMain.split(/\r?\n/g).reverse()

        // inject import
        const lastImportIndex = lines.findIndex((line) => line.match(/^import/))
        lines[lastImportIndex] += '\nimport "@/assets/styles/main.css";'

        // write file
        contentMain = lines.reverse().join("\n")
        fs.writeFileSync(mainPath, contentMain, {encoding: "utf-8"})
    })
}