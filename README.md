<a href="https://logsjar.com">
  <img width="1200" height="675" alt="Twitter post - 2" src="https://github.com/Bonifaceebuka/logsjar/blob/3cc621a7137311b6ff59194678b244903d077ba8/screenshots/landing-page.png" />
</a>

<div align="center" style="margin:24px 0;">
  
<br />

[![Last Commit](https://img.shields.io/github/last-commit/Bonifaceebuka/logsjar?labelColor=333333&color=666666)](https://github.com/Bonifaceebuka/logsjar/commits/main)

[![Commit Activity](https://img.shields.io/github/commit-activity/m/logsjar/logsjar?labelColor=333333&color=666666)](https://github.com/Bonifaceebuka/logsjar/graphs/commit-activity)
<br>
[![Follow @bonifaceebuka on X](https://img.shields.io/twitter/follow/bonifaceebuka?logo=X&color=%23f5f5f5)](https://twitter.com/intent/follow?screen_name=bonifaceebuka)

[![Follow @bonifaceebuka on LinkedIn](https://img.shields.io/linkedin/follow?logo=linkedin&color=%23f5f5f5)](https://www.linkedin.com/in/build-with-ebuka)

[![Follow @bonifaceebuka on Facebook](https://img.shields.io/facebook/follow?logo=facebook&color=%23f5f5f5)](https://www.facebook.com/boniface.ebuka.5)

</div>

<p align="center">
  <a href="https://logsjar.sh">Website</a>
  ·
  <a href="https://github.com/Bonifaceebuka/logsjar">Code</a>
  ·
  <a href="https://bonifaceebuka.vercel.app">Developer</a>
  ·
  <a href="https://api.whatsapp.com/send/?phone=2348135759609&text=Hi+Boniface+-+I+want+to+start+a+new+project.+Can+we+discuss%3F&type=phone_number&app_absent=0">WhatsApp</a>
</p>

## About

## What is Superlog?

[Logsjar](https://logsjar.com) is an open-source production-worthy real-time software log monitoring tool. It ingests logs and watches your infra while you sleep.

This repository contains the fully open-source, free developer edition containing:

- Web app and RESTful API
- Worker processes for incident grouping and background jobs
- Postgres schema and ClickHouse-backed queries.

I am also planning to provide a hosted Logsjar Cloud edition with a free tier, a pay-as-you-go plan and monthly plans.

## System Requirements
Logsjar was built and tested on a Windows 11 64-bit Operating System with the following specifications:

- **Node.js**: Version 20.19.5
- **npm**: Version 10.8.2


## Repository Layout

- `frontend` - Nextjs frontend
- `backend` - HTTP RESTful API that is built with Nodejs, Typescript & Expressjs


## Tech Stack & Libraries Used for the Frontend

- **Nextjs**
- **TypeScript**
- **Zustand**
- **Zod**
- **Axios**
- **Tanstack Query**
- **Tailwind CSS**
- **Shadcn-ui**


## Tech Stack & Libraries Used for the Backend

- **Node.js**
- **Postgresql**
- **Clickhouse**
- **Winston log**
- **Swagger UI**
- **Dotenv**

## Installation

You can install Logsjar in your project by following the steps below:

### Frontend Installation

```bash
git clone https://github.com/Bonifaceebuka/logsjar.git
cd logsjar/frontend
cp .env.example .env
Update the environment variables to match your setup is locally
npm install
npm run dev
```

### Backend Installation

```bash
git clone https://github.com/Bonifaceebuka/logsjar.git
cd logsjar/backend
cp .env.example .env
Update the environment variables to match your setup is locally
npm install
npm run dev
```

The default local services are:

- Web: `http://localhost:3000`
- API: `http://localhost:2026/api`

## License

Logsjar is totally free to use for anyone that has access to the codebase.