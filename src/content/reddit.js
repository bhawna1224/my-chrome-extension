chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "export_data") {
    console.log("Received message in Reddit content script");

    // Extract main post data
    const mainPosts = document.querySelectorAll('shreddit-post');
    const comments = document.querySelectorAll('shreddit-comment');

    const data = Array.from(mainPosts).map(post => {
      // Extract post text (content)
      const contentElement = post.querySelector('div[id*="-post-rtjson-content"]');
      const postText = contentElement ? contentElement.innerText.trim() : "No content";

      // Extract author name
      const author = post.getAttribute('author') || "No author";

      // Extract date posted
      const datePosted = post.getAttribute('created-timestamp') || "No date";

      // Extract number of upvotes
      const upvotes = post.getAttribute('score') || "No upvotes";

      // Extract number of comments
      const commentCount = post.getAttribute('comment-count') || "No comments";

      // Logging for debugging
      console.log('Full post HTML:', post.outerHTML);
      console.log(`Post: ${postText}`);
      console.log(`Author: ${author}`);
      console.log(`Date Posted: ${datePosted}`);
      console.log(`Upvotes: ${upvotes}`);
      console.log(`Comments: ${commentCount}`);

      return {
        type: 'post',
        text: postText,
        author: author,
        datePosted: datePosted,
        upvotes: upvotes,
        comments: commentCount
      };
    });

    // Extract comment data
    const commentData = Array.from(comments).map(comment => {
      // Extract comment text
      const commentTextElement = comment.querySelector('div[id*="-comment-rtjson-content"]');
      const commentText = commentTextElement ? commentTextElement.innerText.trim() : "No content";

      // Extract author name
      const author = comment.getAttribute('author') || "No author";

      // Extract number of upvotes
      const upvotes = comment.getAttribute('score') || "No upvotes";

      // Check if the comment is a top-level comment
      const isTopLevel = !comment.hasAttribute('parent-comment-id');

      // Logging for debugging
      console.log('Full comment HTML:', comment.outerHTML);
      console.log(`Comment: ${commentText}`);
      console.log(`Author: ${author}`);
      console.log(`Upvotes: ${upvotes}`);
      console.log(`Top-level: ${isTopLevel}`);

      return {
        type: 'comment',
        text: commentText,
        author: author,
        upvotes: upvotes,
        isTopLevel: isTopLevel
      };
    });

    const allData = data.concat(commentData);

    console.log("Extracted data:", allData);
    sendResponse({ data: allData });
  }
});
