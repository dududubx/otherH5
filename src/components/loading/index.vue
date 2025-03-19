<template>
  <!-- <van-overlay :show="loading">
        <van-loading vertical color="#1989fa">
            {{ loadingText }}
        </van-loading>
    </van-overlay> -->
    <div class="loader_page" v-show="loading">
      <!-- <img v-show="isLoading" @load="loadImg" @error="loadError" :src="src"/> -->
       <div class="loading_img">
        <Vue3Lottie :animation-data="imgData" class="vue_lottie" ref="lottie"></Vue3Lottie>
       </div>
        <!-- <iframe :src="src" @load="iframeLoading"></iframe> -->
        <!-- <div class="text_box">
            <div class="text">
                {{ text }}
            </div>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import imgData from '@/assets/images/loading.json'
import { Vue3Lottie } from "vue3-lottie";
const text = ref('')
// const src = new URL("../../assets/images/loading.gif",import.meta.url).href
const props = withDefaults(
  defineProps<{
    loading: boolean;
    loadingText?: string;
    src:string
  }>(),
  {
    loading: false,
    loadingText: "",
  }
);
const src = defineModel('src', { required:true, default:new URL("../../assets/images/loading.gif",import.meta.url).href })
const isLoading = ref(false)
const loadImg = () => {
  isLoading.value = true
  
}
const loadError = () => {
  isLoading.value = true
  src.value = new URL("../../assets/images/loading.gif",import.meta.url).href
}
const iframeLoading = () => {
    text.value = '正在努力为你加载…'
}
const lottie = ref(null)
const animationData = ref(null)
watch(() => props.loading, (val) => {
  if(val){
    // lottie.value.goToAndPlay(-1, true)
  }
  console.log(val)
})
onMounted( async () =>  {
    try {
      // 异步引入 JSON 文件
      const data = await import('@/assets/images/loading.json');
      animationData.value = data.default; // 获取默认导出的动画数据
    } catch (error) {
      console.error('加载动画失败:', error);
    } finally {
    }
  })
/* HTML: <div class="loader"></div> */
</script>

<style scoped lang="scss">
@import "../../assets/style/loading.scss";
.loading_img{
        // background-image: url('../../assets/images/loading.gif');
        // background-size: contain; /* 背景图片覆盖整个元素 */
        // background-repeat: no-repeat; /* 背景图片不重复 */
        // background-position: center; /* 背景图片居中 */
        width: 100%; /* 宽度设置为100% */
        height: 100%; /* 高度设置为500px */ 
        transform: scale(0.8);
    }
.vue_lottie {
  will-change: transform;
}
</style>
