import { createApp } from 'vue'
import './style.css'
import '@/assets/style/index.less'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 在使用函数组件时，unplugin-vue-components 无法自动引入对应的样式，因此需要手动引入样式
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';
import '@vant/touch-emulator'
import {
    Skeleton} from 'vant';
const pinia = createPinia()
createApp(App).use(router).use(pinia).use(Skeleton).mount('#app')
