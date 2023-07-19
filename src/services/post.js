import db from '../models'
const { Op } = require('sequelize');
import moment from 'moment'
import generateCode from '../utils/generateCode'
import generateDate from '../utils/generateDate';
import { v4 as generateId } from 'uuid';
export const getPostsService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'average', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']

        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OKE' : 'Get posts fail',
            response
        })
    } catch (error) {

    }
})
export const getPostsLimitService = (page, query, { priceNumber, areaNumber }) => new Promise(async (resolve, reject) => {
    try {
        let offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const queries = { ...query }
        if (priceNumber) queries.priceNumber = { [Op.between]: priceNumber }
        if (areaNumber) queries.areaNumber = { [Op.between]: areaNumber }
        const response = await db.Post.findAndCountAll({
            where: queries,
            raw: true,
            nest: true,
            order: [['createdAt', 'DESC']],
            offset: offset * 8 || 0,
            limit: 8,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'average', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']

        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OKE' : 'Get posts fail',
            filter: false,
            response
        })
    } catch (error) {
        reject(error)
    }
})
export const getPostsByUserService = (page, query, id) => new Promise(async (resolve, reject) => {
    try {
        let offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const queries = { ...query ,userId:id }
       
        const response = await db.Post.findAndCountAll({
            where: queries,
            raw: true,
            nest: true,
            order: [['createdAt', 'DESC']],
            offset: offset * 8 || 0,
            limit: 8,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'average', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
                { model: db.Overview, as: 'overviews'},

            ],
            // attributes: ['id', 'title', 'star', 'address', 'description']

        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OKE' : 'Get posts fail',
            filter: false,
            response
        })
    } catch (error) {
        reject(error)
    }
})
export const getPostsServiceCondition = (offset, minPrice, maxPrice) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAndCountAll({

            raw: true,
            nest: true,

            offset: offset * 8 || 0,
            limit: 8,
            include: [
                {
                    model: db.Image,
                    as: 'images',
                    attributes: ['image']
                },
                {
                    model: db.Attribute,
                    as: 'attributes',
                    attributes: ['price', 'average', 'published', 'hashtag'],
                    where: db.sequelize.literal(`(
                        CAST(REPLACE(attributes.price, ' triệu/tháng', '') AS FLOAT) >= ${minPrice}
                        AND CAST(REPLACE(attributes.price, ' triệu/tháng', '') AS FLOAT) <= ${maxPrice}
                      )`),
                },
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['name', 'zalo', 'phone']
                },
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']

        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OKE' : 'Get posts fail',
            filter: true,
            response
        })
    } catch (error) {

    }
})
export const getPostsByAreaService = (offset, minArea, maxArea) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAndCountAll({

            raw: true,
            nest: true,

            offset: offset * 8 || 0,
            limit: 8,
            include: [
                {
                    model: db.Image,
                    as: 'images',
                    attributes: ['image']
                },
                {
                    model: db.Attribute,
                    as: 'attributes',
                    attributes: ['price', 'average', 'published', 'hashtag'],
                    where: db.sequelize.literal(`(
                        CAST(attributes.average AS FLOAT) >= ${minArea}
                        AND CAST(attributes.average AS FLOAT) <= ${maxArea}
                      )`),
                },
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['name', 'zalo', 'phone']
                },
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']

        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OKE' : 'Get posts fail',
            filter: true,
            response
        })
    } catch (error) {

    }
})
export const getPostsConditionsService = (minPrice, maxPrice, minAreaValue, maxAreaValue, address, categoryCode) => new Promise(async (resolve, reject) => {
    try {
        const rangeConditions = [];
        const whereConditions = [];
        if (minPrice && maxPrice) {
            rangeConditions.push(
                db.sequelize.literal(`CAST(REPLACE(attributes.price, ' triệu/tháng', '') AS FLOAT) >= ${minPrice}`),
                db.sequelize.literal(`CAST(REPLACE(attributes.price, ' triệu/tháng', '') AS FLOAT) <= ${maxPrice}`)
            );
        }
        if (minAreaValue && maxAreaValue) {
            rangeConditions.push(
                db.sequelize.literal(`CAST(REPLACE(attributes.average, ' m2', '') AS FLOAT) >= ${minAreaValue}`),
                db.sequelize.literal(`CAST(REPLACE(attributes.average, ' m2', '') AS FLOAT) <= ${maxAreaValue}`)
            );
        }
        if (address) {
            whereConditions.push({ address: { [Op.like]: `%${address}%` } });
        }
        if (categoryCode) {
            whereConditions.push({ categoryCode: { [Op.like]: `%${categoryCode}%` } })
        }
        const response = await db.Post.findAndCountAll({
            where: {
                [Op.and]: whereConditions
            },
            raw: true,
            nest: true,

            // offset: offset * 8 || 0,
            // limit:8,
            include: [
                {
                    model: db.Image,
                    as: 'images',
                    attributes: ['image']
                },
                {
                    model: db.Attribute,
                    as: 'attributes',
                    attributes: ['price', 'average', 'published', 'hashtag'],
                    where: {
                        [Op.and]: rangeConditions
                    },
                },
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['name', 'zalo', 'phone']
                },
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']

        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OKE' : 'Get posts fail',
            filter: true,
            response
        })
    } catch (error) {

    }
})
export const getNewPostService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            offset: 0,
            order: [['createdAt', 'DESC']],
            limit: 10,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'average', 'published', 'hashtag'] },
            ],
            attributes: ['id', 'title', 'star', 'createdAt']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Getting posts is failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})
export const createNewPostService = (body,userId) => new Promise(async (resolve, reject) => {
    try {
        const attributesId = generateId()
        const imagesId = generateId()
        const overviewId = generateId()
        const labelCode = generateCode(body.label)
        const hashtag = `#${Math.floor(Math.random() * Math.pow(10, 6))}`
        
         await db.Post.create({
            id: generateId(),
            title: body.title,
            labelCode,
            address: body.address || null,
            attributesId,
            categoryCode:body.categoryCode,
                
            description: JSON.stringify(body.description) || null,
            userId,
            overviewId,
            imagesId,
            areaCode: body.areaCode || null,
            priceCode: body.priceCode || null,
            provinceCode: body?.provinceCode?.includes('Thành phố') ? generateCode(body?.province?.replace('Thành phố ', '')) : generateCode(body?.province?.replace('Tỉnh ', '')) || null,
            priceNumber: body.priceNumber,
            areaNumber: body.areaNumber
        })

        await db.Attribute.create({
            
            id: attributesId,
            price: +body.priceNumber < 1 ? `${+body.priceNumber * 1000000} đồng/tháng` : `${body.priceNumber} triệu/tháng`,
            average: `${body.areaNumber} m2`,
            published: moment(new Date).format('DD/MM/YYYY'),
            hashtag
        })
        await db.Image.create({

            id: imagesId,
            image: JSON.stringify(body.images)
        })
        await db.Overview.create({
            id: overviewId,
            code: hashtag,
            area: body.label,
            type: body?.category,
            target: body?.target,
            bonus: 'Tin thường',
            create: generateDate().today,
            expire: generateDate().expireDay,
        })

        await db.Province.findOrCreate({
            where: {

                [Op.or]: [

                    { value: body?.province?.replace('Thành phố ', '') },
                    { value: body?.province?.replace('Tỉnh ', '') }]
            },
            defaults: {


                code: body?.province?.includes('Thành phố') ? generateCode(body?.province?.replace('Thành phố ', '')) : generateCode(body?.province?.replace('Tỉnh ', '')),
                value: body?.province?.includes('Thành phố') ? body?.province?.replace('Thành phố ', '') : body?.province?.replace('Tỉnh ', '')
            }
        })
        await db.Label.findOrCreate({
            where: {

                code: labelCode
            },
            defaults: {
                code: labelCode,
                value: body.label
            }
        })
        // resolve({
        //     err: response ? 0 : 1,
        //     msg: response ? 'OK' : 'Getting posts is failed.',
        //     response
        // })
        resolve('Create post success!')
    } catch (error) {
        reject(error)
    }
})
export const updatePostService = ({postId,overviewId,imagesId,attributesId,...body}) => new Promise(async (resolve, reject) => {
    try {
        
        const labelCode = generateCode(body.label)
        const hashtag = `#${Math.floor(Math.random() * Math.pow(10, 6))}`
        
         await db.Post.update({
          
            title: body.title,
            labelCode,
            address: body.address || null,
           
            categoryCode:body.categoryCode,
                
            description: JSON.stringify(body.description) || null,
           
            areaCode: body.areaCode || null,
            priceCode: body.priceCode || null,
            provinceCode: body?.provinceCode?.includes('Thành phố') ? generateCode(body?.province?.replace('Thành phố ', '')) : generateCode(body?.province?.replace('Tỉnh ', '')) || null,
            priceNumber: body.priceNumber,
            areaNumber: body.areaNumber
        },{
            where : {id: postId}
        })

        await db.Attribute.update({
            
            id: attributesId,
            price: +body.priceNumber < 1 ? `${+body.priceNumber * 1000000} đồng/tháng` : `${body.priceNumber} triệu/tháng`,
            average: `${body.areaNumber} m2`,
           
            hashtag
        },{
            where : {id : attributesId}
        })
        await db.Image.update({

            image: JSON.stringify(body.images)
        }, {
            where : {id : imagesId}
        })
        await db.Overview.update({
          
            code: hashtag,
            area: body.label,
            type: body?.category,
            target: body?.target,
            bonus: 'Tin thường',
            
        },{
            where : {id : overviewId}
        })

        await db.Province.findOrCreate({
            where: {

                [Op.or]: [

                    { value: body?.province?.replace('Thành phố ', '') },
                    { value: body?.province?.replace('Tỉnh ', '') }]
            },
            defaults: {


                code: body?.province?.includes('Thành phố') ? generateCode(body?.province?.replace('Thành phố ', '')) : generateCode(body?.province?.replace('Tỉnh ', '')),
                value: body?.province?.includes('Thành phố') ? body?.province?.replace('Thành phố ', '') : body?.province?.replace('Tỉnh ', '')
            }
        })
        await db.Label.findOrCreate({
            where: {

                code: labelCode
            },
            defaults: {
                code: labelCode,
                value: body.label
            }
        })
        // resolve({
        //     err: response ? 0 : 1,
        //     msg: response ? 'OK' : 'Getting posts is failed.',
        //     response
        // })
        resolve('update post success!')
    } catch (error) {
        reject(error)
    }
})
export const deletePost = (postId) => new Promise(async (resolve,reject)=>{
    try {
        const response = await db.Post.destroy({
            where:{id:postId}
        })
        resolve({
            err : response > 0 ? 0 : 1,
            msg : response > 0 ? 'Delete Oke' :'deleted post fail'
        })
    } catch (error) {
        reject(error)
    }
})