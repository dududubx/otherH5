/**
 * @description 获取href中的参数
 * @param {string[]} params 要获取的参数数组
 */

export function getUrlParams<T extends string>(params: T[]) {
    let paramsObj = <{ [key in T]: string }>{}
    params.map((item: string) => {
        let reg = new RegExp('(^|&)' + item + '=([^&]*)(&|$)')
        let r = window.location.href.slice(window.location.href.indexOf('?') + 1).match(reg)
        if (r != null) {
            if (r[2].indexOf('#') > -1) {
                r[2] = r[2].slice(0, r[2].indexOf('#'))
            }
            paramsObj[item] = decodeURIComponent(r[2])
        }
    })
    return paramsObj
}
let timer = null
export function throttle (fn, delay = 300){
    if(timer == null){
        timer = setTimeout(() => {
            fn()
            clearTimeout(timer)
            timer = null
        }, delay)
    }
}

export const isJson = (val) => {
    try {
        return JSON.parse(val)
    } catch (error) {
        return val
    }
}

export const isFloat = (n: number): boolean => {
    return Number(n) === n && n % 1 !== 0;
}