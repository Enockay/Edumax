const puppeteer = require('puppeteer');

const launchPuppeteer = async () => {
  return puppeteer.launch({
    executablePath: '/usr/bin/google-chrome-stable', // or the path to chromium in the Docker container
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
};

module.exports = { launchPuppeteer };
