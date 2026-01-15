# Reddit Integration Documentation

This module provides Reddit API integration using the `snoowrap` package, allowing you to post content and retrieve posts from subreddits.

## Setup

### 1. Install Dependencies
The `snoowrap` package is already included in the project dependencies.

### 2. Configure Environment Variables
Add the following to your `.env` file:

```env
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
```

### 3. Get Reddit API Credentials

1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Fill in the details:
   - **Name**: Your app name (e.g., "SocialNest")
   - **App type**: Select "script"
   - **Description**: Optional
   - **About URL**: Optional
   - **Redirect URI**: http://localhost:3000 (required but not used for script apps)
4. Click "Create app"
5. Copy the client ID (under your app name) and client secret

## API Endpoints

### 1. Health Check
Check if Reddit integration is configured correctly.

**Endpoint**: `GET /api/reddit/health`

**Example**:
```bash
curl http://localhost:3000/api/reddit/health
```

**Response**:
```json
{
  "success": true,
  "redditEnabled": true,
  "message": "Reddit client is configured and ready"
}
```

---

### 2. Submit a Post to Subreddit
Post content to a specific subreddit.

**Endpoint**: `POST /api/reddit/post`

**Request Body**:
```json
{
  "subreddit": "test",
  "title": "My Post Title",
  "text": "This is the post content",
  "type": "text"
}
```

**Parameters**:
- `subreddit` (string, required): Name of the subreddit (without r/)
- `title` (string, required): Post title
- `text` (string, optional): Post content for text posts
- `url` (string, optional): URL for link posts
- `type` (string, optional): "text" or "link" (default: "text")

**Example - Text Post**:
```bash
curl -X POST http://localhost:3000/api/reddit/post \
  -H "Content-Type: application/json" \
  -d '{
    "subreddit": "test",
    "title": "Hello from SocialNest!",
    "text": "This is a test post from our social media management tool.",
    "type": "text"
  }'
```

**Example - Link Post**:
```bash
curl -X POST http://localhost:3000/api/reddit/post \
  -H "Content-Type: application/json" \
  -d '{
    "subreddit": "test",
    "title": "Check out this awesome GIF!",
    "url": "https://i.imgur.com/n5iOc72.gifv",
    "type": "link"
  }'
```

**Response**:
```json
{
  "success": true,
  "postId": "abc123",
  "postUrl": "https://reddit.com/r/test/comments/abc123/...",
  "data": {
    "id": "abc123",
    "title": "Hello from SocialNest!",
    "url": "https://reddit.com/r/test/comments/abc123/...",
    "permalink": "/r/test/comments/abc123/...",
    "author": "your_username",
    "created": "2026-01-15T10:30:00.000Z"
  }
}
```

---

### 3. Get Posts from Subreddit
Retrieve posts from a specific subreddit.

**Endpoint**: `GET /api/reddit/posts/:subreddit`

**Query Parameters**:
- `limit` (number, optional): Number of posts to retrieve (default: 25, max depends on Reddit API)
- `sort` (string, optional): Sort order - "hot", "new", "top", or "rising" (default: "hot")

**Example**:
```bash
# Get hot posts
curl http://localhost:3000/api/reddit/posts/test

# Get new posts with limit
curl http://localhost:3000/api/reddit/posts/test?sort=new&limit=10

# Get top posts
curl http://localhost:3000/api/reddit/posts/programming?sort=top&limit=50
```

**Response**:
```json
{
  "success": true,
  "subreddit": "test",
  "count": 25,
  "sort": "hot",
  "posts": [
    {
      "id": "abc123",
      "title": "Example Post Title",
      "author": "username",
      "subreddit": "test",
      "score": 150,
      "upvoteRatio": 0.95,
      "numComments": 42,
      "url": "https://reddit.com/r/test/comments/abc123/...",
      "permalink": "https://reddit.com/r/test/comments/abc123/...",
      "created": "2026-01-15T10:30:00.000Z",
      "selftext": "Post content here...",
      "isVideo": false,
      "thumbnail": "https://..."
    }
  ]
}
```

---

### 4. Get Comments from a Post
Retrieve comments from a specific post (useful for monitoring mentions).

**Endpoint**: `GET /api/reddit/comments/:postId`

**Query Parameters**:
- `limit` (number, optional): Number of comments to retrieve (default: 50)

**Example**:
```bash
curl http://localhost:3000/api/reddit/comments/abc123?limit=100
```

**Response**:
```json
{
  "success": true,
  "postId": "abc123",
  "count": 42,
  "comments": [
    {
      "id": "def456",
      "author": "commenter",
      "body": "Great post!",
      "score": 10,
      "created": "2026-01-15T11:00:00.000Z",
      "permalink": "https://reddit.com/r/test/comments/abc123/.../def456",
      "parentId": "t3_abc123",
      "depth": 0
    }
  ]
}
```

## Usage from Frontend

### Submit a Post
```javascript
const submitPost = async () => {
  const response = await fetch('http://localhost:3000/api/reddit/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subreddit: 'test',
      title: 'My Post Title',
      text: 'Post content here...',
      type: 'text'
    })
  });
  
  const data = await response.json();
  console.log('Post created:', data);
};
```

### Get Subreddit Posts
```javascript
const getPosts = async (subreddit) => {
  const response = await fetch(
    `http://localhost:3000/api/reddit/posts/${subreddit}?sort=hot&limit=25`
  );
  
  const data = await response.json();
  console.log('Posts:', data.posts);
};
```

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created (for new posts)
- `400`: Bad Request (missing or invalid parameters)
- `500`: Server Error (Reddit API error or configuration issue)

## Notes

- Make sure your Reddit account has sufficient karma to post in subreddits
- Some subreddits have posting restrictions (karma requirements, account age, etc.)
- Respect Reddit's rate limits (approximately 60 requests per minute)
- Always follow Reddit's API rules and the subreddit's rules
- Test with r/test subreddit first before posting to other subreddits

## Future Enhancements (Not Yet Implemented)

- Search for comments mentioning specific keywords/usernames
- Reply to comments
- Upvote/downvote functionality
- User profile information
- Subreddit moderation features
