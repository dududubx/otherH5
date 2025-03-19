import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path, { resolve } from 'path'
import pxtovw from 'postcss-px-to-viewport'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
const loder_pxtovw = pxtovw({
  //这里是设计稿宽度 自己修改
  viewportWidth: 375,
  viewportUnit: 'vw'
})
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()]
    })
  ],
  css: {
    postcss: {
      plugins: [loder_pxtovw]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    open: true,
    cors: true,
    host: '0.0.0.0',
    proxy: {
      '/baseApi': {
        target: 'http://124.222.84.152:6060/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/baseApi/, '')
      },
      // '/imgApi':{
      //   target:'https://open.weixin.qq.com',
      //   changeOrigin:true,
      //   rewrite: path => path.replace(/^\/imgApi/, '')
      // },
      // '/codeApi':{
      //   target:'https://long.open.weixin.qq.com',
      //   changeOrigin:true,
      //   rewrite: path => path.replace(/^\/codeApi/, '')
      // },
      // '/infoApi':{
      //   target:'https://pay.gq.com',
      //   changeOrigin:true,
      //   rewrite: path => path.replace(/^\/infoApi/, '')
      // },
      // '/userApi':{
      //   target:'https://api.unipay.qq.com',
      //   changeOrigin:true,
      //   rewrite: path => path.replace(/^\/userApi/, '')
      // }
    }
  },
  base: '',
})
