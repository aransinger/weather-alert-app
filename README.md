# 🌤️ Weather Alert App

A full-stack web application to track real-time weather conditions and trigger user-defined alerts using Tomorrow.io's weather API.

---

## 🛠️ Tech Stack

| Tool / Framework     | Purpose                                     |
|----------------------|---------------------------------------------|
| **React**            | Frontend framework for building UI          |
| **Vite**             | Fast dev server and build tool for React    |
| **Tailwind CSS**     | Utility-first CSS framework for styling     |
| **Express.js**       | Backend framework for routing and API logic |
| **PostgreSQL**       | Relational database for storing alerts      |
| **Node.js**          | JavaScript runtime for backend server       |
| **Tomorrow.io API**  | Real-time weather data provider             |

---

## ⚙️ Local Development Setup

### 1. Clone the project

```bash
git clone https://github.com/your-username/weather-alert-app.git
cd weather-alert-app
```

---

### 2. Configure environment variables

#### 🧠 Backend `.env`

Create `backend/.env` with:

```env
PORT=3000
TOMORROW_API_KEY=your_tomorrow_io_api_key
DATABASE_URL=postgres://user:password@localhost:5432/weather_app
EVALUATE_SECRET=your_secret_key
```

#### 💡 Frontend `.env`

Create `frontend/.env` with:

```env
VITE_WEATHER_API_URL=http://localhost:3000
```

---

### 3. Install dependencies

#### 🔧 Backend:

```bash
cd backend
npm install
```

#### 💻 Frontend:

```bash
cd ../frontend
npm install
```

---

### 4. Start the app

In separate terminals:

#### 🟦 Backend:

```bash
cd backend
node index.js
```

#### 🟩 Frontend:

```bash
cd frontend
npm run dev
```

App will be available at: [http://localhost:5173](http://localhost:5173)

---

### 🐘 PostgreSQL Setup

Ensure your local Postgres server is running and create the database:

```sql
CREATE DATABASE weather_app;
```

Set up the `alerts` table:

```sql
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  name TEXT,
  location TEXT,
  parameter TEXT,
  threshold TEXT,
  description TEXT,
  triggered BOOLEAN DEFAULT FALSE
);
```

---

## ⏱️ Scheduled Evaluation

To regularly trigger alert evaluation, use a cron job that calls the `/evaluate` endpoint with your API key.

### 🧪 Trigger Evaluation via `curl` (Local Dev)

```bash
curl -X POST http://localhost:3000/evaluate \
  -H "x-api-key: your_secret_key"
```

### 🕒 Example Cron Job (every 5 minutes)

Edit your crontab with `crontab -e` and add:

```cron
*/5 * * * * curl -X POST https://your-api-host/evaluate \
  -H "x-api-key: your_secret_key"
```

Be sure to replace `your-api-host` and `your_secret_key` with real values.

---

## 🚀 Deployment

For scheduled evaluation on hosted deployments, you can use [cron-job.org](https://cron-job.org) to periodically send a POST request to your `/evaluate` endpoint with the appropriate API key.

Example setup:
- URL: `https://your-app.onrender.com/evaluate`
- Method: `POST`
- Headers: `x-api-key: your_secret_key`
- Interval: Every 5 minutes



- Backend: Deployed to [Render](https://render.com/)
- Frontend: Deployed to [Vercel](https://vercel.com/)

---

## 📦 Features

- Create custom weather alerts
- View triggered alerts in real-time
- Mobile-friendly UI using Tailwind
- Location-based auto-fill for alert creation
- Caching and throttling to respect API limits

---

## 🙌 Credits

- Weather data by [Tomorrow.io](https://www.tomorrow.io/)
