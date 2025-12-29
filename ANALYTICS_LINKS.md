# Analytics Links & URLs

## 🎮 Your Game
- **Production App**: https://lexirain.vercel.app
- **Custom Domain** (if configured): Your custom domain

## 📊 Analytics Dashboard
- **Dashboard**: https://lexirain.vercel.app/api/dashboard
- **View Analytics API**: https://lexirain.vercel.app/api/view-analytics
- **Send Analytics API**: https://lexirain.vercel.app/api/analytics (POST only)

## 🔧 Vercel Dashboard
- **Project Overview**: https://vercel.com/gokhancodes-projects/lexirain
- **Deployments**: https://vercel.com/gokhancodes-projects/lexirain/deployments
- **Function Logs**: https://vercel.com/gokhancodes-projects/lexirain/logs
  - Filter by: `function:/api/analytics method:POST` to see answer data
- **Functions**: https://vercel.com/gokhancodes-projects/lexirain/functions
- **Settings**: https://vercel.com/gokhancodes-projects/lexirain/settings

## 📝 API Endpoints

### Send Analytics (POST)
```
POST https://lexirain.vercel.app/api/analytics
Content-Type: application/json

Body: {
  "events": [
    {
      "type": "answer",
      "data": {
        "language": "spanish",
        "wordId": "word-123",
        "word": "hello",
        "translation": "hola",
        "userAnswer": "hola",
        "isCorrect": true,
        "level": 1,
        "timestamp": "2024-12-30T..."
      }
    }
  ]
}
```

### View Analytics (GET)
```
GET https://lexirain.vercel.app/api/view-analytics
GET https://lexirain.vercel.app/api/view-analytics?type=answer&limit=100
```

### Dashboard (GET)
```
GET https://lexirain.vercel.app/api/dashboard
```

## 🧪 Test Scripts
- Test sending analytics: `node test-send-analytics.js`
- Test analytics config: `node test-analytics.js`

## 📚 Documentation
- Setup Guide: See `SETUP_ANALYTICS.md`
- How to View Data: See `HOW_TO_SEE_ANSWERS.md`
- Where to See Data: See `WHERE_TO_SEE_DATA.md`
- Analytics Details: See `ANALYTICS.md`

## 🔍 Quick Access
- **Main Dashboard**: https://lexirain.vercel.app/api/dashboard
- **Vercel Logs**: https://vercel.com/gokhancodes-projects/lexirain/logs
- **GitHub Repo**: https://github.com/gokhancode/lexirain

