import {PlaywrightTestConfig} from '@playwright/test';

const config: PlaywrightTestConfig = {
    testMatch: '*.etest.ts',
    use: {
        baseURL: "http://localhost:8080",
        screenshot: "only-on-failure"
    },
    retries: 1
};

export default config;
