import http from '@/utils/request'
export const apiData = {
    //获取商品信息
    getGoodsInfo: (params: object) => {
        return http('get', 'api/Product/runInitCamilo', params)
    },
    getWZInfo:(params: object) => {
        return http('post', 'api/Product/runInitCamilo', params)
    },
    getNickNameInfo:(params: object):Promise<any> => {
        return http('get', 'api/games/query_nickname', params)
    },
    getGamePartInfo:(params: object):Promise<any> => {
        return http('get', 'api/games/region_interface_get', params)
    },
    getLoginInfo:(params: object):Promise<any> => {
        return http('get', 'api/games/exchangeCamiloGoods', params)
    },
    getOrder:(params: object):Promise<any> => {
        return http('get', 'api/Orders/getOrderInfo', params)
    },
    submitOrder:(params: object):Promise<any> => {
        return http('post', 'api/Orders/CreateOrder', params)
    },
    // getQRCodeImg:(params: object) => {
    //     return http('get', 'api/img/get_qrcode', params)
    // },
    submitUserinfo:(params: object):Promise<any> => {
        return http('post', 'api/Product/submitExchange', params,'base','','text/html; charset=UTF-8')
    },
    //发送验证码
    returnSms: (params: object) => {
        return http('post', 'api/sendSms', params)
    },
    //兑换接口
    rechargeGoods: (params: object) => {
        return http('post', 'api/goodsCamilo/exchangeCamiloGoods', params)
    },
    urgentOrder: (params:object) => {
        return http('get', 'api/Orders/OrderUrgentProcess', params)
    }
}