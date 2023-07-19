import express from 'express'
import * as postController from '../controllers/post'
import verifyToken from '../middlewares/verifyToken'
const router = express.Router()
router.get('/all',postController.getPosts)
router.get('/limit', postController.getPostsLimit)
router.get('/', (req, res) => {
    const minValue = req.query.min;
    const maxValue = req.query.max;
    
    postController.getPostsCondition(req, res, minValue, maxValue);
  });
router.get('/filter', (req, res) => {
    const minValue = req.query.minArea;
    const maxValue = req.query.maxArea;
    
    postController.getPostsByArea(req, res, minValue, maxValue);
  });
router.get('/conditions', (req, res) => {
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const minAreaValue = req.query.minArea;
    const maxAreaValue = req.query.maxArea;
    const address = req.query.address;
    const categoryCode = req.query.categoryCode
    postController.getPostsConditions(req, res, minPrice, maxPrice, minAreaValue, maxAreaValue, address,categoryCode);
  });
router.get('/new-post', postController.getNewPosts)
router.use(verifyToken)
router.get('/get-post',postController.getPostsLimitUser)
router.post('/create-post',postController.createNewPosts)
router.put('/update',postController.updatePosts)
router.delete('/delete',postController.deletePost)
export default router