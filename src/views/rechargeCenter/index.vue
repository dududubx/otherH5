<template>
  <div class="recharge">
    <!-- <nav>
            <navTop :title="title"></navTop>
        </nav> -->
    <section>
      <van-pull-refresh
        v-model="isLoading"
        success-text="刷新成功"
        @refresh="onRefresh"
        :disabled="banRefresh"
      >
        <div class="search_top">
          <van-search
            v-model="searchValue"
            placeholder="支持搜索更多优惠品牌"
            @search="onSearch"
            @clear="onCancel"
            shape="round"
            reverse-color
            autocomplete="off"
          />
        </div>
        <div class="section_top" @click="goImg">
          <Swipe :autoplay="3000" :show-indicators="false">
            <swipe-item
              v-for="(image, index) in swipArr"
              :key="index"
              :default="image.img_src"
            >
              <img
                :src="image.img_src"
                style="object-fit: contain; height: 100%; width: 100%"
                @click="goImg(image.img_link)"
              />
            </swipe-item>
          </Swipe>
        </div>
        <div class="section_center safari_only">
          <div
            class="section_center-card"
            v-for="(item, index) in rechargeCard"
            :key="index"
            @click.stop="chooseCard(item)"
            :class="[selectCard == item.id ? 'section_center-select' : '']"
          >
            <div class="card_img">
              <!-- <img :src="item.goods_img" /> -->
              <img :src="item.productImg" />
            </div>
            <div class="card_content">
              <div class="card_content-name">
                <!-- {{ item.goods_name }} -->
                {{ item.productName }}
              </div>
              <!-- <div class="card_content-time">
                {{ item.short_productName }}
              </div> -->
              <div class="product_code">
                商品编号:
                {{ item.productCode }}
              </div>
              <div class="card_content-price">
                <div class="price">
                  <div
                    class="price_box"
                    :class="
                      item.goods_status == '4' ||
                      item.goods_status == '5'
                        ? 'price_choose'
                        : ''
                    "
                  >
                    <span class="price_unit">￥</span>
                    <span class="price">{{
                      isFloat(Number(item.productCurrent_price))
                        ? item.productCurrent_price
                        : item.productCurrent_price + '.00'
                    }}</span>
                  </div>
                  <div class="goods_num">
                    ￥{{ isFloat(Number(item.productOriginal_price))
                        ? item.productOriginal_price
                        : item.productOriginal_price + '.00'  }}
                  </div>
                </div>

                <div class="goods_btn" v-if="['1', '2', '3', '4', '5', '6'].includes(item.goods_status) && ['1', '2'].includes(item.receive_status)">
                  <van-button
                    round
                    type="primary"
                    class="recharge_btn confirm_btn"
                    :disabled="
                      (item.goods_status == '4' || item.goods_status == '5') && item.receive_status == '2'
                    "
                    @click.stop="confirmRecharge(item)"
                    >{{
                      item.receive_status === "2" ? "点击领取" : "点击查询"
                    }}</van-button
                  >
                </div>
              </div>
            </div>
            <div
              v-if="item.goods_status"
              class="card_right-icon"
              :class="[cardState(item.goods_status)]"
            >
            </div>
          </div>
        </div>
        <div class="gif_img"></div>
      </van-pull-refresh>
      <dialogPopup
        v-model:showBottom="showBottom"
        position="bottom"
        :title="dialogTitle"
        @rechargeBtn="rechargeBtn"
        v-model:cardData="rechargeData"
        :rechargeData="rechargeData"
        :token="token"
        :card="cardId.card"
        v-model:iframeSrc="iframeSrc"
        v-model:showQR="showQR"
        @refleshData="getData"
        @loginSuccess="loginSuccess"
      >
      </dialogPopup>
    </section>
    <!-- <imgPopup v-model:showImgPopup="showImgPopup"></imgPopup> -->
  </div>
  <loadingComp
    :loading="showLoading"
    :loading-text="loadingText"
    v-model:src="src"
  ></loadingComp>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted } from "vue";
import dialogPopup from "@/components/dialog/index.vue";
import loadingComp from "@/components/loading/index.vue";
import inobounce from "inobounce";
import { Card, showToast, Swipe, SwipeItem } from "vant";
import { apiData } from "@/api";
import { getUrlParams, isJson, isFloat } from "@/utils/util";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const src = ref(
  new URL("../../assets/images/loading.gif", import.meta.url).href
);
const form = ref();
const submitForm = () => {
  form.value.submit();
};
const searchValue = ref("");
const showImgPopup = ref(false);
const isLoading = ref(false);
const banRefresh = ref(true);
const onRefresh = () => {
  isLoading.value = true;

  getData();
};
const rechargeCard = ref([]);
const selectCard = ref<string>("");

interface GoodsTpl {
  // 根据实际数据结构添加必要的字段
  [key: string]: any;
}

interface RechargeData {
  id: string;
  goods_img: string;
  goods_name: string;
  goods_title: string;
  goods_orders_skate: number;
  goods_tpl: GoodsTpl[];
  time: string;
  code: string;
  social: string;
  productId: string;
  orders: string;
  productImg: string;
  productName: string;
  productCurrent_price: number;
  productTitle: string;
}

const rechargeData = ref<RechargeData>({
  id: "",
  goods_img: "",
  goods_name: "",
  goods_title: "",
  goods_orders_skate: 0,
  goods_tpl: [],
  time: "",
  code: "",
  social: "",
  productId: "",
  orders: "",
  productImg: "",
  productName: "",
  productCurrent_price: 0,
  productTitle: "",
});
// const cardData = ref<cardTpl[]>([])
const showBottom = ref(false);
const loadingText = ref("");
const iframeSrc = ref("");
const swipArr = ref([]);
let timer = null;
const cardStateManual = {
  1: () => {
    router.push({
      name: "success",
      // state: {
      //     name: encodeURIComponent(rechargeData.value.productName),
      //     title: encodeURIComponent(rechargeData.value.productTitle),
      //     img: encodeURIComponent(rechargeData.value.productImg),
      //     id: rechargeData.value.productId,
      // },
      query: {
        order: rechargeData.value.orders,
      },
    });
  },
  2: () => {},
  3: () => {
    // showLoading.value = true
    // loadingText.value = '充值中'
    // setTimeout(() => {
    //     showLoading.value = false
    //     selectCard.value = ''
    //     router.push({
    //         path: 'success',
    //         query: {
    //             card: cardId.card,
    //         }
    //     })
    // }, 2000)
    router.push({
      name: "success",
      // state: {
      //     name: encodeURIComponent(rechargeData.value.productName),
      //     title: encodeURIComponent(rechargeData.value.productTitle),
      //     img: encodeURIComponent(rechargeData.value.productImg),
      //     id: rechargeData.value.productId,
      // },
      query: {
        order: rechargeData.value.orders,
      },
    });
  },
  4: () => {},
};
const dialogTitle = ref("");
const chooseCard = (item) => {};
const showQR = ref(true);
const confirmRecharge = (item) => {
  rechargeData.value = item;
  if (item.receive_status == "2") {
    dialogTitle.value = "兑换充值";

    item.goods_tpl = isJson(item.goods_tpl);
    if (Array.isArray(item.goods_tpl)) {
      item.goods_tpl.forEach((citem) => {
        citem.textValue = "";
      });
      showQR.value = true;
    } else {
      showQR.value = false;
    }
    showBottom.value = true;
  } else {
    router.push({
      name: "success",
      query: {
        order: item.orders,
      },
    });
    // const params = {
    //   cards: cardId.card,
    //   token:token.value,
    //   productCode: rechargeData.value.productCode,
    // };
    //   apiData.submitOrder(params).then((res) => {

    //     if (res.code == 200) {
    //         router.push({
    //           name: "success",
    //           query: {
    //             order: res.data.orders,
    //           },
    //         });
    //     }
    //   });
  }
};
const showLoading = ref(false);
const rechargeBtn = () => {
  // setTimeout(() => {
  //     showBottom.value = false
  // }, 200)
  showBottom.value = false;
  showLoading.value = true;
  loadingText.value = "充值中";
};
const cardState = computed(() => {
  return (val) => {
    let text = "";
    switch (val) {
      case "1":
        text = "has_received";
        break;
      case "2":
        text = "can_receive";
        break;
      case "3":
        text = "get_recharge";
        break;
      case "4":
        text = "error_received";
        break;
      case "5":
        text = "shixiao_received";
        break;
      case "6":
        text = "fail_received";
        break;
      // default:
      //   text = "";
    }
    return text;
  };
});
const token = ref("");
const cardId = getUrlParams(["card", "code", "userid"]);
const setData = ref([]);
const imgToUrl = ref("");
const usualLoadData = () => {
  const url = import.meta.env.VITE_Base_Url + "api/Product/runInitCamilo";
  const request = () => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        cards: cardId.card,
      }),
    })
      .then((res) => {
        // console.log(res.json);
        return res.json();
      })
      .then((res) => {
        isLoading.value = false;
        setTimeout(() => {
          showLoading.value = false;
          showImgPopup.value = true;
        }, 2000);
        if (res.code == 200) {
          rechargeCard.value = [];
          res.data.goodsInfo.forEach((item, index) => {
            item["id"] = index + 1;
            rechargeCard.value.push(item);
          });
          setData.value = rechargeCard.value;
          token.value = res.data.token;
          swipArr.value = res.data.bannerList;
        } else {
          // showToast(res.message)
          switch (res.code) {
            case -1:
              showToast({
                message: res.msg,
                duration: 1500,
              });
              showBottom.value = false;
              break;
            case -3:
              showToast({
                message: res.msg,
                duration: 1500,
              });
              showBottom.value = false;
              break;
            // case 300:
            //     break;
            case -2:
              showBottom.value = false;
              showToast({
                message: res.msg,
                duration: 1500,
              });
              break;
          }
        }
      })
      .catch((err) => {
        setTimeout(() => {
          showLoading.value = false;
          showToast({
            message: "获取数据失败",
            duration: 1500,
          });
        }, 2000);
        isLoading.value = false;
      });
  };
  request();
};
const getData = () => {
  setTimeout(() => {
    showBottom.value = false;
  }, 200);
  showLoading.value = true;
  loadingText.value = "加载中...";
  usualLoadData();
};
const loginSuccess = () => {
  usualLoadData();
};
const reloadPage = (event) => {
  if (event.persisted) {
    setTimeout(() => {
      showBottom.value = false;
    }, 200);
    window.location.reload();
  }
};
const goImg = (src) => {
  window.open(src);
};
const onSearch = (val) => {
  if (!val) {
    rechargeCard.value = setData.value;
    return;
  }
  rechargeCard.value = rechargeCard.value.filter((item) =>
    item.productName.includes(val)
  );
};
const onCancel = (val) => {
  rechargeCard.value = setData.value;
};
let pagehide = false;
onMounted(() => {
  localStorage.setItem("cardId", cardId.card);
  localStorage.setItem("userid", cardId.userid || "");
  setTimeout(() => {
    showBottom.value = false;
  }, 200);
  let u = navigator.userAgent;
  let iLastTouchTime = null;
  if (u.indexOf("iPhone") > -1 || u.indexOf("ipad") > -1) {
    window.addEventListener("pageshow", (event) => {
      if (pagehide) {
        window.location.reload();
      }
    });
    window.addEventListener("popstate", (event) => {
      window.location.reload();
    });
    window.addEventListener("pagehide", () => {
      pagehide = true;
    });
    inobounce.enable();
    document.body.addEventListener(
      "touchend",
      function (event) {
        let iNowTime = new Date().getTime();
        iLastTouchTime = iLastTouchTime || iNowTime + 1;
        let delta = iNowTime - iLastTouchTime; //记录两次点击的时间间隔
        if (delta < 500 && delta > 0) {
          event.preventDefault();
          return false;
        }
        iLastTouchTime = iNowTime;
      },
      false
    );
  }
  // document
  //   .querySelector(".van-pull-refresh")
  //   .addEventListener("scroll", (event) => {
  //     if (document.querySelector(".van-pull-refresh").scrollTop == 0) {
  //       banRefresh.value = false;
  //     } else {
  //       banRefresh.value = true;
  //     }
  //   });
  // 页面卸载时触发
  window.addEventListener("unload", function () {
    setTimeout(() => {
      showBottom.value = false;
    }, 200);
    // 关闭弹窗的代码
  });
  getData();
});
onUnmounted(() => {
  setTimeout(() => {
    showBottom.value = false;
  }, 200);
  for (let i = 0; i < 1000; i++) {
    clearInterval(i);
    clearTimeout(i);
  }
  window.removeEventListener("pageshow", reloadPage);
});
</script>

<style scoped></style>
