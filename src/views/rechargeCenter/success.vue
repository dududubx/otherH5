<template>
  <div class="success">
    <div class="goods_title">
      <div class="back_title">
        <div class="arrow" @click="goBack">
          <img src="../../assets/images/arrow.svg" />
        </div>
        <div class="arrow_text" @click.stop>订单详情</div>
      </div>
      <div class="goods_title-box">
        <div class="goods_title-left">
          <div class="state_img">
            <img :src="imgSrc" />
            {{ orderState(orederData?.order_status) }}
          </div>
          <div class="state_text">
            {{ stateText }}
          </div>
        </div>
        <div class="goods_title-right" :class="isClick ? '' : 'jiaji_fail'">
          <div class="right_box" @click="ClickJiaji">
            <img :src="jiajiImg" />
            <div class="jiaji_text">
              {{ jiajiText }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="goods_content">
      <div class="content_bc-img"></div>
      <div class="goods_info goods_box">
        <!-- <div class="goods_info-title">订单详情</div> -->
        <div class="goods_info-details">
          <div class="goods_info-img">
            <img :src="orederData?.productImg" />
          </div>
          <div class="goods_info-right">
            <div class="right_name">
              <div class="right_name-text">
                {{ orederData?.short_goods_name }}
              </div>
              <div class="right_name-price">
                ￥<span class="price_num">{{
                  isFloat(Number(orederData?.productCurrent_price))
                    ? orederData?.productCurrent_price
                    : orederData?.productCurrent_price + ".00"
                }}</span>
              </div>
            </div>
            <div class="right_title">
              <div class="yugujia">
                <div class="yugujia_text">预估返</div>
                <div class="yugujia_price">
                  {{
                    isFloat(Number(orederData?.productBack_price))
                      ? "￥" + orederData?.productBack_price
                      : "￥" + orederData?.productBack_price + ".00"
                  }}
                </div>
              </div>
              <!-- {{ decodeURIComponent(history.state.title as string) }} -->
              <div class="yugujia_order_num">x{{ orederData?.num || 1 }}</div>
            </div>
          </div>
        </div>
        <div class="goods_info-count">
          <div class="count_top">
            <div class="count_title">商品总价</div>
            <div class="count_price">
              ￥<span class="count_price-num">{{
                isFloat(Number(orederData?.productCurrent_price))
                  ? orederData?.productCurrent_price
                  : orederData?.productCurrent_price + ".00"
              }}</span>
            </div>
          </div>
          <div class="count_bottom">
            实付款
            <span class="count_bottom-num"
              >￥<span class="num_blod">{{
                isFloat(
                  Number(orederData?.productCurrent_price) * orederData?.count
                )
                  ? Number(orederData?.productCurrent_price) * orederData?.count
                  : Number(orederData?.productCurrent_price) *
                      orederData?.count +
                    ".00"
              }}</span></span
            >
          </div>
        </div>
      </div>
      <div class="goods_order goods_box">
        <div class="phone_input">
          <van-field
            v-model="phoneText"
            :type="'tel'"
            placeholder="请输入手机号"
            autocomplete="off"
          />
          <van-button round type="primary" class="exchange_btn"
            >获取手机号</van-button
          >
        </div>
        <!-- <div class="tip_text">
          请前往APP获取验证码
        </div> -->
        <div class="order_num">
          <div class="left_name">验证码</div>
          <div class="right_info">
            <!-- {{ orederData?.productName }} -->
            <div class="num_code">55662</div>
            <div class="opear copy-btn">复制</div>
          </div>
        </div>
        <!-- <div class="order_num">
          <div class="left_name">订单编号</div>
          <div class="right_info">
            <div class="num_code">{{ orederData?.orders }}</div>
            <div class="opear copy-btn">复制</div>
          </div>
        </div>
        <div class="order_num">
          <div class="left_name">商品名称</div>
          <div class="right_info">
            {{ orederData?.productName }}
          </div>
        </div>
        <div class="order_num">
          <div class="left_name">下单时间</div>
          <div class="right_info">{{ orederData?.create_time }}</div>
        </div>
        <div v-if="orederData?.game === '王者荣耀'">
          <div class="order_num">
            <div class="left_name">游戏系统</div>
            <div class="right_info">
              {{ orederData?.game_system }}
            </div>
          </div>
          <div class="order_num">
            <div class="left_name">游戏大区</div>
            <div class="right_info">
              {{ orederData?.zone_name }}
            </div>
          </div>
          <div class="order_num">
            <div class="left_name">游戏昵称</div>
            <div class="right_info">
              {{ decodeURIComponent(orederData?.role_name || "") }}
            </div>
          </div>
          <div class="order_num">
            <div class="left_name">游戏余额</div>
            <div class="right_info">
              <div class="num_code">{{ orederData?.game_balance }}</div>
              <div class="quan_num">点券</div>
            </div>
          </div>
          <div class="order_num">
            <div class="left_name">下单时间</div>
            <div class="right_info">{{ orederData?.orders_time }}</div>
          </div>
        </div>
        <div class="order_num" v-if="orederData?.order_status == 1 || orederData?.order_status == 3">
          <div class="left_name">完成时间</div>
          <div class="right_info">{{ orederData?.finish_time }}</div>
        </div> -->
      </div>
      <!-- <div class="goods_postscript"></div> -->
    </div>
  </div>
  <div class="gif_img success_img"></div>
  <loadingComp
    :loading="showLoading"
    :loading-text="loadingText"
    v-model:src="src"
  ></loadingComp>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getUrlParams, throttle, isFloat } from "@/utils/util";
import { apiData } from "@/api";
import { showToast, closeToast } from "vant";
import router from "@/router";
import ClipboardJS from "clipboard";
import loadingComp from "@/components/loading/index.vue";
const src = ref(
  new URL("../../assets/images/loading.gif", import.meta.url).href
);
const history = window.history;
const cardId = getUrlParams(["card", "code"]);
const route = useRoute();
const resultData = ref();
const orederData = ref();
const showLoading = ref(false);
const loadingText = ref("加载中....");
const phoneText = ref("");
const imgSrc = ref(
  new URL("../../assets/images/naozhong.svg", import.meta.url).href
);
const stateText = ref("商家正在准备充值，请稍后再次查询");
const jiajiImg = ref(
  new URL("../../assets/images/jaji_fail.svg", import.meta.url).href
);
const jiajiText = ref("加急");
const orderState = computed(() => {
  return (val) => {
    let text = "";
    switch (val) {
      case 1:
        text = "充值成功";
        imgSrc.value = new URL(
          "../../assets/images/success.svg",
          import.meta.url
        ).href;
        stateText.value = "商家已经充值成功，请查询是否到账";
        break;
      case 2:
        text = "正在充值";
        imgSrc.value = new URL(
          "../../assets/images/zhunbei.svg",
          import.meta.url
        ).href;
        stateText.value = "商家正在准备充值，请稍后再次查询";
        break;
      case 3:
        text = "充值失败";
        imgSrc.value = new URL(
          "../../assets/images/fail.svg",
          import.meta.url
        ).href;
        stateText.value = "商家已经充值失败，请联系客服咨询";
        break;
      case 4:
        text = "准备充值";
        imgSrc.value = new URL(
          "../../assets/images/naozhong.svg",
          import.meta.url
        ).href;
        stateText.value = "商家正在准备充值，请稍后再次查询";
        break;
      default:
        text = "准备充值";
        imgSrc.value = new URL(
          "../../assets/images/naozhong.svg",
          import.meta.url
        ).href;
        stateText.value = "商家正在准备充值，请稍后再次查询";
        break;
    }
    return text;
  };
});
const copyCode = () => {
  const clipboard = new ClipboardJS(".copy-btn", {
    text() {
      return orederData.value?.orders;
    },
  });
  clipboard.on("success", () => {
    // console.log('复制成功')
    showToast({
      message: "复制成功",
      duration: 1500,
    });
  });
  clipboard.on("error", () => {
    // console.log('复制失败')
  });
};
let timer = null;
const goBack = () => {
  // router.back()
  // history.back()
  console.log(history.state, "bock");
  closeToast();
  router.push({
    path: "/",
    query: {
      card: localStorage.getItem("cardId") ?? "",
      // userid: localStorage.getItem("userid") || "",
    },
  });
};
const isClick = ref(false);
const ClickJiaji = () => {
  // showToast({
  //   message: "加急中",
  //   duration: 1500,
  // });
  if (!isClick.value && orederData.value.order_urgent == 2) {
    // isClick.value = true;
    // jiajiText.value = "加急中";
    // jiajiImg.value = new URL(
    //   "../../assets/images/jiaji.svg",
    //   import.meta.url
    // ).href;
    const request = () => {
      apiData
        .urgentOrder({ orders: route.query.order })
        .then((res: any) => {
          if (res.code == 200) {
            isClick.value = true;
            jiajiText.value = "加急中";
            jiajiImg.value = new URL(
              "../../assets/images/jiaji.svg",
              import.meta.url
            ).href;
            showToast({
              message: res.msg,
              duration: 1500,
            });
          } else {
            showToast({
              message: res.msg,
              duration: 1500,
            });
          }
        })
        .catch();
    };
    throttle(request);
  }
};
const loadDetails = () => {
  timer = setInterval(() => {
    apiData
      .getOrder({ orders: route.query.order })
      .then((res) => {
        if (res.code == 200) {
          orederData.value = res.data;
          if (orederData.value.order_urgent == 1) {
            isClick.value = true;
            jiajiText.value = "加急中";
            jiajiImg.value = new URL(
              "../../assets/images/jiaji.svg",
              import.meta.url
            ).href;
          }
          if (res.data.order_status == 1 || res.data.order_status === 3) {
            clearInterval(timer);
            timer = null;
          }
        } else {
          showToast({
            message: res.msg,
            duration: 200,
          });
          setTimeout(() => {
            goBack();
          }, 250);
          clearInterval(timer);
          // switch (res.code) {
          //   case -1:
          //     showToast({
          //       message: res.msg,
          //       duration: 1500,
          //     });
          //     clearInterval(timer);
          //     timer = null;
          //     goBack();
          //     break;
          //   case -3:
          //     showToast({
          //       message: res.msg,
          //       duration: 1500,
          //     });
          //     clearInterval(timer);
          //     timer = null;
          //     goBack();
          //     break;
          //   case -2:
          //     showToast({
          //       message: res.msg,
          //       duration: 1500,
          //     });
          //     clearInterval(timer);
          //     timer = null;
          //     goBack();
          //     break;
          // }
        }
      })
      .catch((err) => {
        clearInterval(timer);
        timer = null;
        goBack();
      });
  }, 5000);

  //     .getOrder({ orders: route.query.order })
  //     .then((res) => {
  //       if (res.code == 200) {
  //         orederData.value = res.data;
  //         if (orederData.value.order_urgent == 1) {
  //           isClick.value = true;
  //           jiajiText.value = "已加急";
  //           jiajiImg.value = new URL(
  //             "../../assets/images/jaji.png",
  //             import.meta.url
  //           ).href;
  //         }
  //         if (res.data.order_status == 1 || res.data.order_status === 3) {
  //           clearInterval(timer);
  //           timer = null;
  //         }
  //       } else {
  //         switch (res.code) {
  //           case -1:
  //             showToast({
  //               message: res.msg,
  //               duration: 1500,
  //             });
  //             clearInterval(timer);
  //             timer = null;
  //             goBack();
  //             break;
  //           case -3:
  //             showToast({
  //               message: res.msg,
  //               duration: 1500,
  //             });
  //             clearInterval(timer);
  //             timer = null;
  //             goBack();
  //             break;
  //           case -2:
  //             showToast({
  //               message: res.msg,
  //               duration: 1500,
  //             });
  //             clearInterval(timer);
  //             timer = null;
  //             goBack();
  //             break;
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       clearInterval(timer);
  //       timer = null;
  //       goBack();
  //     });
  // }, 20000);
};
onMounted(() => {
  document.body.classList.add('bg-yourColor');
  copyCode();
  // showLoading.value = true;
  if (localStorage.getItem("ordersData")) {
    orederData.value = JSON.parse(localStorage.getItem("ordersData"));
  }
  apiData
    .getOrder({ orders: route.query.order })
    .then((res) => {
      setTimeout(() => {
        showLoading.value = false;
      }, 1000);
      if (res.code == 200) {
        orederData.value = res.data;
        localStorage.setItem("ordersData", JSON.stringify(res.data));
        if (orederData.value.order_urgent == 1) {
          isClick.value = true;
          jiajiText.value = "加急中";
          jiajiImg.value = new URL(
            "../../assets/images/jiaji.svg",
            import.meta.url
          ).href;
        }
        if (res.data.order_status != 1 && res.data.order_status != 3) {
          loadDetails();
        }
      } else {
        showToast({
          message: res.msg,
          duration: 200,
        });
        // setTimeout(() => {
        //   goBack();
        // }, 250);
        // switch (res.code) {
        //   case -1:
        //     showToast({
        //       message: res.msg,
        //       duration: 1500,
        //     });
        //     goBack();
        //     break;
        //   case -3:
        //     showToast({
        //       message: res.msg,
        //       duration: 1500,
        //     });
        //     goBack();
        //     break;
        //   case -2:
        //     showToast({
        //       message: res.msg,
        //       duration: 1500,
        //     });
        //     goBack();
        //     break;
        // }
      }
    })
    .catch((err) => {
      goBack();
    });
});
onUnmounted(() => {
  document.body.style.backgroundColor = '#F2F2F2';
  clearInterval(timer);
});
</script>

<style scoped>

</style>
