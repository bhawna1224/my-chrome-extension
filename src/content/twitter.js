chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "export_data") {
    console.log("Received message in Twitter content script");

    const tweets = document.querySelectorAll('article');

    const data = Array.from(tweets).map(tweet => {
      // Extract tweet text
      const tweetTextElement = tweet.querySelector('div[data-testid="tweetText"]');
      const tweetText = tweetTextElement ? tweetTextElement.innerText : "No text";

      // Extract tweet author name
      const authorElement = tweet.querySelector('div[dir="ltr"] > span > span');
      const author = authorElement ? authorElement.innerText : "No author";

      // Extract tweet handle
      const handleElement = tweet.querySelector('a[href*="/"] > div > span');
      const handle = handleElement ? handleElement.innerText : "No handle";

      // Extract date and time (using time element)
      const timeElement = tweet.querySelector('time');
      const datetime = timeElement ? timeElement.getAttribute('datetime') : "No datetime";

      // Extract metrics (replies, retweets, likes)
      let replies = 0, retweets = 0, likes = 0, views = 0;
      const metrics = tweet.querySelectorAll('div[role="group"] > div');
      if (metrics.length > 0) {
        replies = metrics[0] ? metrics[0].querySelector('span').innerText : null;
        retweets = metrics[1] ? metrics[1].querySelector('span').innerText : null;
        likes = metrics[2] ? metrics[2].querySelector('span').innerText : null;
      }

      // Extract views separately if it is located outside the typical metrics container
      const viewsElement = tweet.querySelector('span[data-testid="app-text-transition-container"] > span > span');
      views = viewsElement ? viewsElement.innerText : "0";

      // Logging for debugging
      console.log(`Tweet: ${tweetText}`);
      console.log(`Author: ${author}`);
      console.log(`Handle: ${handle}`);
      console.log(`Datetime: ${datetime}`);
      console.log(`Replies: ${replies}`);
      console.log(`Retweets: ${retweets}`);
      console.log(`Likes: ${likes}`);
      console.log(`Views: ${views}`);

      return {
        text: tweetText,
        author: author,
        handle: handle,
        datetime: datetime,
        replies: replies,
        retweets: retweets,
        likes: likes,
        views: views
      };
    });

    console.log("Extracted data:", data);
    sendResponse({ data });
  }
});
