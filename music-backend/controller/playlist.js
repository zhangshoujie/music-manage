
const Router = require('koa-router')

const router = new Router()

const callCloudFn = require('../utils/callCloudFn')

//歌单模块：获取歌单列表接口
router.get('/list', async (ctx, next) => {

    const query = ctx.request.query

    const res = await callCloudFn(ctx, 'music', {
        $url: 'playlist',
        start: parseInt(query.start),
        count: parseInt(query.count),
    })
    let data = []

    if (res.resp_data) {

        data = JSON.parse(res.resp_data).data
    }

    ctx.body = {
        data,
        code: 20000,
    }
})

module.exports = router