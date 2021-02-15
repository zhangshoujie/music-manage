// 引入异步请求库
const rp = require('request-promise')
// 你的微信小程序的APPID和APPSECRET
const APPID = "wx1e2a2b43e365828d"
const APPSECRET = "38e704b926d3a4aefca1dd8c672d4cae"
// 请求access_token的URL
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
//引入node.js的文件操作模块（自带）
const fs = require('fs')
//引入node.js的文件路径和文件名
const path = require('path')
//定义access_token缓存路径和文件名
const fileName = path.resolve(__dirname, './access_token.json')

//异步方法，请求更新access_token
const updateAccessToken = async () => {
    //发起异步get请求，得到结果（JSON字符串，这和axios库得到的就是JSON对象有所不同
    const resStr = await rp(URL)
    //将JSON字符串反序列化为JSON对象
    const res = JSON.parse(resStr)
    console.log(res)
    //如果返回结果中有access_token，则写入文件
    if(res.access_token) {

        fs.writeFileSync(
            fileName,
            JSON.stringify({
                access_token: res.access_token,
                createTime: new Date(),
            })
        )
    }else {

        await updateAccessToken()
    }
}

//定义一个getAccessToken为异步执行函数
const getAccessToken = async () => {
    try {

        const readRes = fs.readFileSync(fileName, 'utf8')

        const readObj = JSON.parse(readRes)

        const createTime = new Date(readObj.createTime).getTime()

        const nowTime = new Date().getTime()

        if((nowTime - createTime) / 1000 / 60 / 60 >= 2) {
            await updateAccessToken()
            await getAccessToken()
        } 

        return readObj.access_token
    } catch (error) {

        await updateAccessToken()
        await getAccessToken()
    }
}

//定时器，快要到7200秒就请求更新access_token
setInterval(async () => {
    await updateAccessToken()
},(7200 - 300) * 1000)

updateAccessToken()

module.exports = getAccessToken