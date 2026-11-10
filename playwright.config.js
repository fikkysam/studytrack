const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
    testDir: "./tests",
    timeout: 30000,
    fullyParallel: false,
    reporter: [
        ["list"],
        ["html", { outputFolder: "playwright-report", open: "never" }]
    ],

    use: {
        baseURL: "http://127.0.0.1:5500",
        browserName: "chromium",
        headless: true,
        trace: "retain-on-failure",
        screenshot: "only-on-failure"
    },

    webServer: {
        command: "npx http-server . -p 5500 -c-1",
        url: "http://127.0.0.1:5500",
        reuseExistingServer: !process.env.CI,
        timeout: 30000
    }
});
