# Bindery
Bindery is built with the inspiration of making bookclubs a more accessible option for people. Spawned from the idea
of trying to find a book that both myself and my girlfriend can enjoy, Bindery aims to help bookclubs big and small
explore new books, find common ground amoung readers of various tastes, and so much more.

![Bun](https://img.shields.io/badge/Bun-1.1.0-black?logo=bun)
![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![Hono](https://img.shields.io/badge/Hono-Backend-orange)

## Features
- User account creation + social auth
- Create your own bookclub (private or public)
- Join a public bookclub or a friends bookclub (via invite)
- Bookclub management
- Search for books via ISBN13
- Manage your own personal library
- Manage your own bookclubs library
- Bookclub discussion threads

## The Stack
Backend: Bun.js + Hono (Typescript)
Frontend: Vite + React + TanStack Query and Router
Database: Postgresql
Database ORM: Drizzle

### In the Works
Bookclub
- [ ] Upload Bookclub Image (Avatar) stored in S3 bucket
- [ ] Add Tags (ex. "Fiction", "True Crime", etc.)
- [ ] Add Private/Public setting for clubs
- [ ] Update current book (reading goal, current page)
- [ ] Discussion and messages system
- [ ] Searching feature for public clubs (filter options)
- [ ] Invite users for private clubs
- [ ] Owner/Admin can accept/decline public users
- [ ] Owner/admin settings for bookclubs

Calendar
- [ ] Simple calendar system for setting bookclub reading goals (ex: page 230 by 12/12/25)

User/Profile
- [x] Upload Profile Image (Avatar) stored in S3 bucket
- [ ] Set Reading Goal
- [ ] Manage settings (username, reset password, etc.)

Future Features
- [ ] AI Book Recommendations for Users
- [ ] AI Book Recommendatiosn for Bookclubs
- [ ] Mobile application
- [ ] Achievements (personal/bookclub)