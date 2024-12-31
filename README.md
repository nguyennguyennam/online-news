# Online News

## Routes

- `/`: Home page (_home.ejs_)
- `/category`: Posts in categories page:
  - `/category/:parent`: Shows posts in the parent category and all of it's children categories. (_category-grid.ejs_)
  - `/category/:parent/:id`: Shows posts in only the child's category. (_category-grid.ejs_)
- `/tag`: List posts tagged
  - `/tag/:id`: List all posts tagged with that ID. (_tag-grid.ejs_)
- `/search`: Search for posts (_search.ejs_)
- `/post`:
  - `/`: Upload a new post, **clearance level 2**. (_create-post.ejs_)
  - `/:id`: Query for a post. (_article.ejs_)
  - `/image`: POST route for uploading images from TinyMCE. There is no GET route for this.
- `/posts`: See all of my works, including drafts, denied, etc. (_post-list.ejs_)
- `/profile`: See my profile, **clearance level 1**. (_profile.ejs_)
- `/login`: Login form. (_login.ejs_)
- `/register`: Register form. (_register.ejs_)
