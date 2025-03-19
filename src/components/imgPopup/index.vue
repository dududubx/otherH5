<template>
  <div class="popup_box">
    <van-popup v-model:show="show">
      <div class="popup_img">
        <div class="popup_img-top">
          <img src="../../assets/images/Group_tip.png"/>
        </div>
        <div class="popup_img-left">
          <img src="../../assets/images/Group_img.png"/>
        </div>
        <!-- <img src="../../assets/images/Frame_img.png" /> -->
        <div class="popup_img-btn" @click="openWinxi">
          <img src="../../assets/images/Group.png" />
          <div class="popup_img-btn_text">
            <img src="../../assets/images/Group_name.png"/> 
          </div>
        </div>
      </div>
      <div class="popup_close" @click="clickPopup">
        <img src="../../assets/images/Frame_close.png" />
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
const show = defineModel("showImgPopup", { required: true, default: true });
const clickPopup = () => {
  show.value = false;
};
const openWinxi = () => {
  // var timeout,
  //   t = 1000,
  //   hasApp = true;
  // setTimeout(function () {
  //   if (!hasApp) {
  //     //没有安装微信
  //     var r = confirm("您没有安装微信，请先安装微信!");
  //     if (r == true) {
  //       location.href = "http://weixin.qq.com/";
  //     }
  //   } else {
  //     //安装微信
  //   }
  //   document.body.removeChild(ifr);
  // }, 2000);

  // var t1 = Date.now();
  // var ifr = document.createElement("iframe");
  // ifr.setAttribute("src", 'weixin://');
  // ifr.setAttribute("style", "display:none");
  // document.body.appendChild(ifr);
  // timeout = setTimeout(function () {
  //   var t2 = Date.now();
  //   if (!t1 || t2 - t1 < t + 100) {
  //     hasApp = false;
  //   }
  // }, t);
};
</script>

<style scope lang="scss">
.popup_box{
  .van-popup {
  background: transparent;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
}
.popup_img {
  height: 368px;
  width: 267px;
  overflow: hidden;
  position: relative;
  background-image: url('../../assets/images/Frame_img.png');
  background-repeat: no-repeat;
  background-size: cover;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &-top{
    width: 190px;
    height: 87px;
    position: absolute;
    top: 89px;
    left: 25px;
  }
  &-left{
    width: 80px;
    height: 80px;
    position: absolute;
    top: 205px;
    left: 38px;
  }
  .popup_img-btn {
    width: 166px;
    height: 35px;
    position: absolute;
    left: 51px;
    bottom: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    &_text{
      width: 96px;
      height: 18px;
      position: absolute;
      z-index: 2;
    }
  }
}

.popup_close {
  height: 28px;
  width: 28px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
