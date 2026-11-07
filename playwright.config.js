
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
    testDir: "./tests",
    timeout: 30000,
    fullyParallel: false,
    reporter: "list",

    use: {
        baseURL: "http://127.0.0.1:5500",
        browserName: "chromium",
        headless: true
    },

    webServer: {
        command: "npx http-server . -p 5500 -c-1",
        url: "http://127.0.0.1:5500",
        reuseExistingServer: !process.env.CI,
        timeout: 30000
    }
});
