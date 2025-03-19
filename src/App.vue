<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(() => {
    let startX = 0
    let startY = 0
    let endX = 0
    let endY = 0
    document.querySelector('#app').addEventListener('touchstart', (event:any) => {
        startX = event.touches[0].pageX
        startY = event.touches[0].pageY
    })
    document.querySelector('#app').addEventListener('touchend', (event:any) => {
        endX = event.changedTouches[0].pageX
        endY = event.changedTouches[0].pageY
        let disX = endX - startX
        let disY = endY - startY
        if(Math.abs(disX) > Math.abs(disY) + 20){
            if(disX > 0){
                router.back()
                setTimeout(() => {
                  let layer = document.querySelector('.van-overlay') as HTMLDivElement
                  let pop = document.querySelector('.van-popup--bottom') as HTMLDivElement
                  if(layer){
                    layer.style.display = 'none'
                  }
                  if(pop){
                    pop.style.display = 'none'
                  }
                }, 500)
               
            }
        }
    })
    // let agent = navigator.userAgent.toLowerCase();
    // let iLastTouchTime = null;
    // if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
    //     document.querySelector("#app").addEventListener('touchend',
    //     function (event) {
    //         let iNowTime = new Date().getTime();
    //         iLastTouchTime = iLastTouchTime || iNowTime+ 1;
    //         let delta = iNowTime- iLastTouchTime;
    //         if (delta < 500 && delta > 0) {
    //             event.preventDefault();
    //             return false;
    //         }
    //         iLastTouchTime = iNowTime;
    //     }, false);
    // };
})
</script>

<template>
  <router-view></router-view>
  <!-- 开启底部安全区适配 -->
  <!-- <van-number-keyboard safe-area-inset-bottom /> -->
</template>

<style scoped></style>
