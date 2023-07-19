import * as postService from'../services/post'

export const getPosts = async (req,res) =>{
    try {
        const response = await postService.getPostsService()
        res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err : -1,
            msg : 'Fail at post controller'+ error
        })
    }
}
export const getPostsLimit = async (req,res) =>{
     const {page,priceNumber,areaNumber,...query} = req.query
     try {
        const response = await postService.getPostsLimitService(page,query,{priceNumber,areaNumber})
        res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err : -1,
            msg : 'Fail at post controller'+ error
        })
    }
}
export const getPostsLimitUser = async (req,res) =>{
    const {page,...query} = req.query
    const { id } = req.user
   
    try {
        if(!id) return res.status(400).json({err:1, msg: 'Missing input'})
        
       const response = await postService.getPostsByUserService(page,query,id)
       res.status(200).json(response)
   } catch (error) {
       return res.status(500).json({
           err : -1,
           msg : 'Fail at post controller'+ error
       })
   }
}
export const getPostsCondition = async (req,res,min,max) =>{
    const {page} = req.query
    try {
       const response = await postService.getPostsServiceCondition(page,min,max)
       res.status(200).json(response)
   } catch (error) {
       return res.status(500).json({
           err : -1,
           msg : 'Fail at post controller'+ error
       })
   }
}
export const getPostsConditions = async (req,res,minPrice, maxPrice, minAreaValue, maxAreaValue, address,categoryCode) =>{
    const {page} = req.query
    try {
       const response = await postService.getPostsConditionsService(minPrice, maxPrice, minAreaValue, maxAreaValue, address,categoryCode)
       res.status(200).json(response)
   } catch (error) {
       return res.status(500).json({
           err : -1,
           msg : 'Fail at post controller'+ error
       })
   }
}
export const getPostsByArea = async (req,res,min,max) =>{
    const {page} = req.query
    try {
       const response = await postService.getPostsByAreaService(page,min,max)
       res.status(200).json(response)
   } catch (error) {
       return res.status(500).json({
           err : -1,
           msg : 'Fail at post controller'+ error
       })
   }
}
export const getNewPosts = async (req,res) =>{
    
    try {
       const response = await postService.getNewPostService()
       res.status(200).json(response)
   } catch (error) {
       return res.status(500).json({
           err : -1,
           msg : 'Fail at post controller'+ error
       })
   }
}
export const createNewPosts = async (req,res) =>{
    
    try {
       const {categoryCode,userId,title,priceNumber,areaNumber,label} = req.body
       
       if(!categoryCode || !userId || !title || !priceNumber || !areaNumber || !label) return res.status(400).json({
        err:1,
        msg: 'Missing input'
       })
       const response = await postService.createNewPostService(req.body,userId)
       res.status(200).json(response)
   } catch (error) {
       return res.status(500).json({
           err : -1,
           msg : 'Fail at post controller'+ error
       })
   }
}
export const updatePosts = async (req,res) =>{
    const {postId,overviewId,imagesId,attributesId,...payload} = req.body
    
    try {
       if(!postId || !overviewId || !imagesId || !attributesId ) return res.status(400).json({
        err:1,
        msg: 'Missing input'
       })
       const response = await postService.updatePostService(req.body)
       res.status(200).json(response)
   } catch (error) {
       return res.status(500).json({
           err : -1,
           msg : 'Fail at post controller'+ error
       })
   }
}
export const deletePost = async (req,res) =>{
    const {postId} = req.query
    if(!postId) return res.status(400).json({
        err:1,
        msg:'Missing input'
    })
    try {
        const response = await postService.deletePost(postId)
        res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err : -1,
            msg : 'Fail at post controller'+ error
        })
    }
}