const puppeteer = require('puppeteer-core');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const path = require('path');

const artifactDir = 'C:\\Users\\SaranSM\\.gemini\\antigravity\\brain\\7c232d40-f4f1-44f0-bb78-c079a7899d1f';

async function testRefresh() {
  const browser = await puppeteer.launch({ executablePath: edgePath, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  console.log('1. Load http://localhost:3000');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  console.log('2. Scroll to #work');
  await page.evaluate(() => {
    const el = document.getElementById('work');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  console.log('3. Refresh the page (F5 / reload)');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  const state = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#work article[class*="card"]'));
    return {
      scrollY: window.scrollY,
      cardsCount: cards.length,
      cardsTransforms: cards.slice(0, 5).map(c => ({
        title: c.querySelector('h3')?.textContent?.trim(),
        transform: c.style.transform,
        computedTransform: window.getComputedStyle(c).transform,
        opacity: c.style.opacity,
        computedOpacity: window.getComputedStyle(c).opacity
      }))
    };
  });
  console.log('State after refresh:', JSON.stringify(state, null, 2));

  const shot = path.join(artifactDir, 'test_refresh_collapse.png');
  await page.screenshot({ path: shot });
  console.log('Saved screenshot to', shot);

  await browser.close();
}
testRefresh().catch(console.error);

