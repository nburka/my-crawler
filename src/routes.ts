import { Dataset, createPuppeteerRouter } from 'crawlee';

export const router = createPuppeteerRouter();

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
    log.info(`enqueueing new URLs`);
    await enqueueLinks({
        globs: ['https://www.emrap.org/**'],
        label: 'detail',
    });
});

router.addHandler('detail', async ({ request, page, log }) => {
    const title = await page.title();
    const h1Handle = await page.$('h1');
    const jsHandleH1 = h1Handle === null ? '' : await h1Handle.getProperty('innerHTML');
    const h1 = jsHandleH1 === "" ? "" : await jsHandleH1.jsonValue();
    log.info(`${title}`, { url: request.loadedUrl });
    log.info(`${h1}`, { url: request.loadedUrl });

    await Dataset.pushData({
        url: request.loadedUrl,
        title,
    });
});
