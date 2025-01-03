# Online News

## Description

Named, **The Cipher**, a project by a group of 5 talented (this is questionable) young men and 1 something.

|    ID    |       Name        |                       Role                        | Tasks!                                                                                                                        |
| :------: | :---------------: | :-----------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------- |
| 22127002 |  Nguyễn Phúc An   |          Team Leader, Backend Developer           | Backend (sessions, passport, reCaptcha, controllers, mail verification), Project Manager                                      |
| 22127070 | Nguyễn Quang Doãn |                Frontend Developer                 | Frontend (search page, view article page)                                                                                     |
| 22127211 |  Phạm Đình Khôi   |                Frontend Developer                 | Frontend (create post, view posts, editorial pages)                                                                           |
| 22127373 |   Trình Anh Tài   |                Frontend Developer                 | Frontend (main layout, home page, search page, view by categories page, view by tags page, profile page)                      |
| 20127384 | Văng Khánh Tường  |                Frontend Developer                 | Frontend (some components), Preparing the Data                                                                                |
| 22127145 | Nguyễn Quốc Hưng  | Frontend Developer, Backend Developer, DB Manager | Frontend (admin pages, create post, view posts), Backend (routing, controllers), Manage VPS, Manage S3, Manage Git, Manage DB |

## Architecture

### Application

- Backend Handler: **ExpressJS**
- Programming Language: **JavaScript**
- Runtime: **NodeJS** (preferably v22)
- Renderer: **EJS**

### Platforms

- Database: **MongoDB** (hosted on _Mongo Atlas_)
- Image Storage: **Amazon S3-compliant package** (hosted on _Contabo_)
- Node Server: **nginx** on a VPS (hosted on _Contabo_)
- Email Server: **SMTP-compliant service** (hosted on _PurelyMail_)

Budget: (it's all my money)

- $2.99: Image Storage
- $4.99: VPS
- $9.99: Email Service

## Installation

Preferably please use a new version of Node. At the time of writing this, my Node version is `23.2.0`.

```bash
node -v
```

How to start the server locally (each section is separate, depending on what package manager you use):

```bash
npm ci
npm run start

pnpm i
pnpm start

yarn install
yarn start
```

You might have to setup environment variables (in a `.env` file):

```env
SMTP_HOST =
SMTP_USER =
SMTP_PASS =

MONGO_URL =
PORT =

S3_CLIENT =
S3_SECRET =
S3_HOST =
S3_PERM =

GMAIL_ID =
GMAIL_SECRET =
```

Explanation:

- `SMTP_HOST`: The hostname of the email service that supports SMTP.
- `SMTP_USER`: The email address or username credentials for the sender email.
- `SMTP_PASS`: The password authentication for the sender email.
- `MONGO_URL`: Your MongoDB URL
- `PORT`: The port the server should run on. (usually 3000)
- `S3_CLIENT`: The client key for the S3 database.
- `S3_SECRET`: The secret key for the S3 database.
- `S3_HOST`: The hostname for your S3 database.
- `S3_PERM`: The perma-link to resources within the S3 buckets.
- `GMAIL_ID`: Google Mail API ID, for using the OAuth strategy.
- `GMAIL_SECRET`: Google Mail API secret.

## Routes

- `/`: Home page
- `/category`: Posts in categories page:
  - `/category/:parent`: Shows posts in the parent category and all of it's children categories.
  - `/category/:parent/:id`: Shows posts in only the child's category.
- `/tag`: List posts tagged
  - `/tag/:id`: List all posts tagged with that ID.
- `/search`: Search for posts (_search.ejs_)
- `/post`:
  - `/`: Upload a new post, **clearance level 2**.
  - `/:id`: Query for a post.
  - `/image`: POST route for uploading images from TinyMCE. There is no GET route for this, **clearance level 2**.
- `/posts`: See all of my works, including drafts, denied, etc. **clearance level 2**.
- `/profile`: See my profile, **clearance level 1**.
- `/login`: Login form.
- `/register`: Register form.
- `/edit`: Edit a post.
- `/editorial`: Editorial tools, for approving/denying posts, **clearance level 3**.
- `/admin`: Administrator pages, all here have **clearance level 4**.
  - `/admin/categories`: Manage categories
  - `/admin/tags`: Manage tags
  - `/admin/posts`: Manage posts
  - `/admin/users`: Manage users
