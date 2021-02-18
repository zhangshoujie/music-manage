const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const ENV = 'sjzhang-2goaemvweb23a8ba'
//跨域
app.use(
    cors({
        origin: ['http://localhost:9528'],
        credentials: true,
    })
)
//接收post参数解析
app.use(
    koaBody({
        multipart: true,
    })
)
//配置云环境
app.use(async (ctx, next) => {
    ctx.state.env = ENV
    await next()
})

const playlist = require('./controller/playlist.js')
const swiper = require('./controller/swiper.js')
const blog = require('./controller/blog.js')

router.use('/playlist', playlist.routes())
router.use('/swiper', swiper.routes())
router.use('/blog', blog.routes())

//使用路由
app.use(router.routes())
app.use(router.allowedMethods())

//对3000端口开启监听，这是node.js的默认端口，如果已经被占用，可以停止相应进程或换端口
app.listen(3000, () => {
    console.log('服务开启在3000端口')
})