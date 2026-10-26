# Sarahah Backend

A backend system for an anonymous feedback platform inspired by Sarahah.
Users create an account, share their personal link, and receive honest
anonymous messages that only they can read.

## Features
- Authentication with JWT (separate user and admin tokens)
- Email service for account flows (confirmation / notifications)
- Anonymous public endpoint to send messages to any user
- Private inbox: users only see messages sent to them
- Account deletion with MongoDB transactions (user + their messages removed atomically)
- Rate limiting and Redis for protection against spam and abuse
- Repository pattern with Mongoose, plus request validation
- Profile image uploads

## Tech Stack
Node.js, Express, MongoDB (Mongoose), Redis, JWT, Nodemailer

## Getting Started
1. Clone the repo and run `npm install`
2. Copy `.env.sample` to `.env` and fill in your values
3. Run `npm run dev`
