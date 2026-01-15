# Reddit API Testing Guide

## Quick Test Steps

### 1. Setup Environment Variables
Create a `.env` file in the backend folder:

```env
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
```

### 2. Start the Server
```bash
cd backend
npm install
npm start
```

### 3. Test the Endpoints

#### Test Health Check
```bash
curl http://localhost:3000/api/reddit/health
```

#### Test Submit Post (Text)
```bash
curl -X POST http://localhost:3000/api/reddit/post \
  -H "Content-Type: application/json" \
  -d "{\"subreddit\": \"test\", \"title\": \"Hello from SocialNest!\", \"text\": \"This is a test post.\", \"type\": \"text\"}"
```

#### Test Get Posts from Subreddit
```bash
curl "http://localhost:3000/api/reddit/posts/test?limit=10&sort=hot"
```

#### Test Get Comments
```bash
# Replace 'abc123' with a real post ID
curl "http://localhost:3000/api/reddit/comments/abc123?limit=50"
```

## Test from Frontend (React/Next.js)

### Example: Submit a Post
```typescript
const handleSubmitPost = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/reddit/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subreddit: 'test',
        title: 'My Post Title',
        text: 'This is the content of my post',
        type: 'text'
      })
    });

    const data = await response.json();
    console.log('Post created:', data);
    
    if (data.success) {
      alert(`Post created successfully! URL: ${data.postUrl}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Example: Get Posts
```typescript
const handleGetPosts = async (subreddit: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/reddit/posts/${subreddit}?sort=hot&limit=25`
    );

    const data = await response.json();
    console.log('Posts:', data.posts);
    
    if (data.success) {
      // Display posts in your UI
      setPosts(data.posts);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Important Notes

1. **Rate Limiting**: Reddit API has rate limits (approximately 60 requests per minute)
2. **Subreddit Restrictions**: Some subreddits require minimum karma or account age
3. **Testing**: Always test with r/test subreddit first
4. **Authentication**: Make sure all environment variables are set correctly

## Troubleshooting

### Error: "Reddit client not initialized"
- Check that all environment variables are set in `.env`
- Verify credentials are correct

### Error: "Failed to submit post"
- Check if you have enough karma to post in that subreddit
- Verify the subreddit name is correct (no r/ prefix)
- Ensure your account meets the subreddit's requirements

### Error: 429 (Too Many Requests)
- You've hit Reddit's rate limit
- Wait for a few minutes before trying again
- Reduce the frequency of requests
