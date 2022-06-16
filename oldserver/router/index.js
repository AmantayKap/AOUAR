const Router = require('express').Router;
const userController = require('../controllers/user-controller')
const postController = require('../controllers/post-controller')
const messageController = require('../controllers/message-controller')
const conversationController = require('../controllers/conversation-controller')
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middleWare/auth-middleware');


router.post('/register',
    body('username').isString(),
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
);
//User routes
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);
router.put('/:id/follow', userController.follow);
router.put('/:id/unfollow',userController.unfollow);
router.get('/', userController.getUser);
router.get('/friends/:userId', userController.getFriends);
//Post routes
router.post('/createPost', postController.createPost);
router.put('/updatePost/:id', postController.updatePost);
router.delete('/deletePost/:id', postController.deletePost);
router.put('/likePost/:id', postController.likePost);
router.get('/getPost/:id', postController.getPost);
router.get('/newsline/:userId', postController.newsline);
router.get('/profile/:username', postController.getAllPosts);
//Conversation routes
router.post('/conversation', conversationController.newConv);
router.get('/conversation/:userId', conversationController.getConv);
router.get('/conversation/find/:firstUserId/:secondUserId', conversationController.getTwoUserConv);
//Message routes
router.post('/message', messageController.addMessage);
router.get('/message/conversationId', messageController.getMessage);

module.exports = router
