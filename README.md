


<a href="https://logsjar.com">
  <img width="1200" height="675" alt="Twitter post - 2" src="https://github.com/Bonifaceebuka/logsjar/blob/3cc621a7137311b6ff59194678b244903d077ba8/screenshots/landing-page.png" />
</a>

<div align="center" style="margin:24px 0;">
  
<br />

[![Last Commit](https://img.shields.io/github/last-commit/superloglabs/superlog?labelColor=333333&color=666666)](https://github.com/Bonifaceebuka/logsjar/commits/main)
[![Commit Activity](https://img.shields.io/github/commit-activity/m/superloglabs/superlog?labelColor=333333&color=666666)](https://github.com/Bonifaceebuka/logsjar/graphs/commit-activity)
<!-- [![MCP Toplist](https://mcptoplist.com/badge/sh.superlog%2Fsuperlog.svg)](https://mcptoplist.com/server/sh.superlog%2Fsuperlog) -->
<!-- [![Apache 2.0 License](https://img.shields.io/badge/License-Apache_2.0-555555.svg?labelColor=333333&color=666666)](./LICENSE.md)
<br>
[![Discord](https://img.shields.io/discord/1511214206123380867?logo=discord&logoColor=white&label=Discord&color=5865F2)](https://discord.gg/wJ56aRh8hx)
<a href="https://www.ycombinator.com"><img src="https://img.shields.io/badge/Y%20Combinator-P26-orange" alt="Y Combinator P26"></a>
[![Follow @superlogYC on X](https://img.shields.io/twitter/follow/superlogyc?logo=X&color=%23f5f5f5)](https://twitter.com/intent/follow?screen_name=superlogYC) -->

</div>

<p align="center">
  <a href="https://superlog.sh">Website</a>
  ·
  <a href="https://github.com/Bonifaceebuka/logsjar">Code</a>
  ·
  <a href="https://github.com/superloglabs/skills">Features</a>
  ·
  <a href="https://github.com/Bonifaceebuka">Developer</a>
  ·
  <a href="https://discord.gg/wJ56aRh8hx">WhatsApp</a>
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