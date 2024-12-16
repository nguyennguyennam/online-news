import express from "express";
const router = express.Router();

const rawData = [
    {
        id: 1, title: 'Bài viết 1', status: 'approved', imageUrl: 'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/05fa/live/89bc72d0-ad37-11ef-8ab9-9192db313061.png.webp'
        , summary: 'aklsfjalksfalf'
        , content: "Phạm đình khôi sạdksahdsakjdhaskajfhsakfjsah ádjkhsadksajdhdsadkjsahdsakdj sạkdhaskdjsahdksajdhsa jkasdhsakjdhsadkjh"
        , author: "Pham A"
    },
    {
        id: 2, title: 'Bài viết 2', status: 'pending', imageUrl: 'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/fae3/live/ab3bbe70-ad46-11ef-bdf5-b7cb2fa86e10.jpg.webp',
        summary: 'aklsfjalksfalf',
        content: "Phạm đình khôi sạdksahdsakjdhaskajfhsakfjsah ádjkhsadksajdhdsadkjsahdsakdj sạkdhaskdjsahdksajdhsa jkasdhsakjdhsadkjh"
        , author: "Pham E"
    },
    {
        id: 3, title: 'Bài viết 3', status: 'rejected', imageUrl: 'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/3c5e/live/4f65d9a0-ab6b-11ef-8ab9-9192db313061.png.webp'
        , summary: 'aklsfjalksfalf'
        , content: "Phạm đình khôi sạdksahdsakjdhaskajfhsakfjsah ádjkhsadksajdhdsadkjsahdsakdj sạkdhaskdjsahdksajdhsa jkasdhsakjdhsadkjh"
        , author: "Pham B"
    },
    {
        id: 4, title: 'Bài viết 4', status: 'unapproved', imageUrl: 'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/1f27/live/40ec5670-aca0-11ef-bdf5-b7cb2fa86e10.jpg.webp'
        , summary: 'aklsfjalksfalf'
        , content: "Phạm đình khôi sạdksahdsakjdhaskajfhsakfjsah ádjkhsadksajdhdsadkjsahdsakdj sạkdhaskdjsahdksajdhsa jkasdhsakjdhsadkjh"
        , author: "Pham C"
    },
    {
        id: 5, title: 'Bài viết 5', status: 'approved', imageUrl: 'https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/997d/live/703ffe00-ac5e-11ef-a4fe-a3e9a6c5d640.jpg.webp'
        , summary: 'aklsfjalksfalf'
        , content: "Phạm đình khôi sạdksahdsakjdhaskajfhsakfjsah ádjkhsadksajdhdsadkjsahdsakdj sạkdhaskdjsahdksajdhsa jkasdhsakjdhsadkjh"
        , author: "Pham D"
    },
];
router.get('/', (req, res) => {
    res.render('pages/home-writer'); // Gọi đúng đường dẫn đến index.ejs
});
router.get('/postlist', (req, res) => {
    // Chia dữ liệu thành các nhóm theo trạng thái
    const approvedPosts = rawData.filter(post => post.status === 'approved');
    const pendingPosts = rawData.filter(post => post.status === 'pending');
    const rejectedPosts = rawData.filter(post => post.status === 'rejected');
    const unapprovedPosts = rawData.filter(post => post.status === 'unapproved');

    // Render trang post-list với dữ liệu
    res.render('writer/post-list', {
        approvedPosts,
        pendingPosts,
        rejectedPosts,
        unapprovedPosts,
    });
});
router.get('/createpost', (req, res) => {
    res.render('writer/create-post'); 
});
router.get('/approvepost', (req, res) => {
    res.render('writer/approve');
});
router.get('/edit-post/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = rawData.find(p => p.id === postId);
    if (post) {
        res.render('writer/edit-post', { post });
    } else {
        res.status(404).send('Post not found');
    }
});
// Update post route
router.put('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, summary, content, category, tags } = req.body;

    const postIndex = rawData.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        // Update the post data
        rawData[postIndex] = {
            ...rawData[postIndex],
            title,
            author,
            summary,
            content,
            category,
            tags: tags.split(',').map(tag => tag.trim()) // Convert tags to an array
        };
        res.redirect('/postlist'); // Redirect to the post list after update
    } else {
        res.status(404).send('Post not found');
    }
});

export default router;
