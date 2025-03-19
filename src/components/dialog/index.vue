<template>
  <loadingComp
    :loading="showLoading"
    :loading-text="loadingText"
    v-model:src="src"
  ></loadingComp>
  <van-popup v-model:show="showBottom" round :position="props.position">
    <div class="popup_content other_popup">
      <div class="popup_content-center other-content">
        <div class="top_content">
          <div class="left_img">
            <img :src="rechargeData.productImg" />
          </div>
          <div class="right_text">
            <div class="right_text-top">
              {{ rechargeData.productName }}
            </div>
            <div class="right_text-bottom">
              <div class="bottom_price">
                <div class="price_unit">￥</div>
                <div class="price_num">
                  {{ isFloat(Number(rechargeData.productOriginal_price)) ? rechargeData.productOriginal_price : rechargeData.productOriginal_price + '.00' }}
                </div>
              </div>
              <div class="bottom_other">会员价:{{ isFloat(Number(rechargeData.productCurrent_price)) ? rechargeData.productCurrent_price : rechargeData.productCurrent_price + '.00' }}</div>
            </div>
          </div>
        </div>
        <div class="popup_content-center" v-if="showQR">
          <div v-for="(item, index) in cardData.goods_tpl" :key="index">
            <van-field
              v-if="item.type == 'text'"
              v-model="item.textValue"
              :required="item.required"
              :type="item.name == 'phone' ? 'tel' : 'text'"
              :placeholder="item.value"
              autocomplete="off"
            />
            <van-field
              v-else-if="item.type == 'text_sms'"
              v-model="item.textValue"
              :required="item.required"
              center
              clearable
              :placeholder="item.value"
              autocomplete="off"
            >
            </van-field>
          </div>
        </div>
        <div class="bottom_content" :class="showQR ? 'has_edit' : ''">
          <div class="bottom_left">
            <div class="left_img shouye" @click="() => (showBottom = false)">
              <img src="../../assets/images/tsst.svg" />
              <div class="img_text">首页</div>
            </div>
            <div class="left_img kefu">
              <img src="../../assets/images/newkefu.svg" />
              <div class="img_text">客服</div>
            </div>
            <div class="left_img dingdan">
              <img src="../../assets/images/order.svg" />
              <div class="img_text">订单</div>
            </div>
          </div>
          <van-button
            round
            type="primary"
            class="exchange_btn"
            @click="submitUserInfo"
            >立即领取</van-button
          >
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import loadingComp from "@/components/loading/index.vue";
import { showToast, PopupPosition, Picker, VantStepper, Toast, closeToast} from "vant";
import router from "@/router";
import { apiData } from "@/api";
import { getUrlParams, throttle, isFloat } from "@/utils/util";
import { text } from "stream/consumers";
import { resolve } from "path";

const src = ref(
  new URL("../../assets/images/loading.gif", import.meta.url).href
);
const showBottom = defineModel<boolean>("showBottom", {
  required: true,
  default: false,
}); //是否打开弹出层
const iframeSrc = defineModel<string>("iframeSrc", {
  default: "",
  required: false,
});
const showQR = defineModel("showQR", { required: true });
const cardData = defineModel("cardData", { required: true });
const props = withDefaults(
  defineProps<{
    position: PopupPosition; //弹出位置left、top、bottom、right
    title?: string;
    token?: string;
    card: string;
    rechargeData?: {};
  }>(),
  {
    position: "bottom",
    title: "",
    token: "",
    card: "",
  }
);
const checked = ref(true);
const closeDialog = () => {
  showBottom.value = false;
  // showImg.value = true
};
const showImg = ref(false);
const platform = ref("微信-ios");
const fenqu = ref("");
const role = ref("");
const roleArr = ref([]);
const showrole = ref(false);
const showLoading = ref(false);

const loadingText = ref("加载二维码中");
const emit = defineEmits<{
  rechargeBtn: [];
  refleshData: [];
  loginSuccess: [];
}>();
let timer: NodeJS.Timeout | null = null;
watch(showBottom, (val) => {
  if (!val) {
  }
});
const yueData = ref("");
const goDetailsPage = (orders) => {
  router.push({
    name: "success",
    // state: {
    //   name: encodeURIComponent(props.rechargeData.productName),
    //   title: encodeURIComponent(props.rechargeData.productTitle),
    //   img: encodeURIComponent(props.rechargeData.productImg),
    //   id: props.rechargeData.productId,
    // },
    query: {
      order: orders,
    },
  });
};

const loadImg = () => {
  showImg.value = false;
  let count = 0;
  // const loadInfo = () => {
  //   if (showBottom.value) {
  //     if (count == 30) {
  //       refleshSrc();
  //       // loadInfo();
  //     } else {
  //       ++count;
  //       apiData
  //         .getLoginInfo({
  //           card: cardId.card,
  //           productId: props.rechargeData.productId,
  //         })
  //         .then((resolve) => {
  //           if (resolve.code == 200) {
  //             count = 0;
  //             role.value = "";
  //             // showQR.value = false;
  //             loadGameInfo();
  //             //emit('loginSuccess')
  //           } else {
  //             // refleshSrc()
  //             // showToast(resolve.message);
  //             switch (resolve.code) {
  //               case 403:
  //                 setTimeout(() => {
  //                   loadInfo();
  //                 }, 5000);
  //                 break;
  //               case 402:
  //                 refleshSrc();
  //                 // count = 0;
  //                 // loadInfo();
  //                 break;
  //               case -4:
  //                 showToast({
  //                   message: resolve.msg,
  //                   duration: 1500,
  //                 });
  //                 count = 0;
  //                 emit("refleshData");
  //                 showBottom.value = false;
  //                 break;
  //               case -1:
  //                 showToast({
  //                   message: resolve.msg,
  //                   duration: 1500,
  //                 });
  //                 emit("refleshData");
  //                 count = 0;
  //                 showBottom.value = false;
  //                 break;
  //               // case 300:
  //               //   if (resolve.data.orders) {
  //               //     goDetailsPage(resolve.data.orders);
  //               //   }
  //               //   break;
  //               case -2:
  //                 count = 0;
  //                 showBottom.value = false;
  //                 showToast({
  //                   message: resolve.msg,
  //                   duration: 1500,
  //                 });
  //                 emit("refleshData");
  //                 break;
  //             }
  //           }
  //         })
  //         .catch((err) => {});
  //     }
  //   }
  // };
  // loadInfo();
};
const loadError = () => {
  showToast("加载失败，请重新获取二维码");
  // refleshSrc();
};
const getAuthCode = () => {
  let phone = cardData.value.goods_tpl.find((item) => {
    return item.name == "phone";
  });
  if (!phone.textValue) {
    return showToast("请输入手机号");
  }
};
const cardId = getUrlParams(["card", "code"]);
const gamePart = ref([]);
const isRole = ref(false);
const columns = ref([]);
const openInfo = () => {
  showImg.value = false;
};
const openRole = (val: boolean) => {
  isRole.value = val;
  showrole.value = true;
  columns.value = [];
  // pircker.value.setColumnIndex = -1
  if (!val) {
    gamePart.value.forEach((item) => {
      columns.value.push({
        text: item.zone_name,
        value: item.zone_id,
      });
    });
  } else columns.value = roleArr.value;
};
const zoneid = ref("");
const returnData = (val) => {
  showrole.value = false;
  if (val.selectedIndexes[0] != -1) {
    if (!isRole.value) {
      zoneid.value = val.selectedOptions[0].value;
      fenqu.value = val.selectedOptions[0].text;
      yueData.value = "";
    } else role.value = val.selectedOptions[0].text;
  }
};
const formSubmit = ref();
const formData = ref([]);
const submitUserInfo = () => {
  const params = {
    cards: cardId.card,
    token: props.token,
    productCode: cardData.value.productCode,
  };
  if (cardData.value.goods_tpl) {
    params.account = [];
    const isEmpty = cardData.value.goods_tpl.find((item) => {
      return !item.textValue && item.required;
    });
    if (isEmpty) {
      return showToast(`${isEmpty.value}`);
    }
    cardData.value.goods_tpl.forEach((item) => {
      const obj = {}
      obj[item.lable] = item.textValue
      params["account"].push(obj);
    });
  }
  apiData.submitOrder(params).then((res) => {
    
    if (res.code == 200) {
      showToast({
        message: res.msg,
        duration: 200,
      });
      setTimeout(() => {
        closeToast()
        router.push({
          name: "success",
          query: {
            order: res.data.orders,
          },
        });
      }, 250)
      
    }
    else{
      showToast({
        message: res.msg,
        duration: 200,
      });
    }
  });
  // const url = import.meta.env.VITE_Base_Url + "api/Product/submitExchange";
  // const request = () => {
  //   fetch(url, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       card: cardId.card,
  //       productId: props.rechargeData.productId,
  //       zone_id: zoneid.value,
  //       token: props.token,
  //     }),
  //   })
  //     .then((res) => {
  //       // console.log(res.json);
  //       return res.json();
  //     })
  //     .then((res) => {
  //       if (res.code == 200) {
  //         showBottom.value = false;
  //         // showToast({
  //         //   type: "success",
  //         //   message: res.msg,
  //         //   className: "send_success",
  //         //   position: "top",
  //         //   icon: "checked",
  //         //   duration: 500,
  //         // });
  //         // showToast(res.msg);
  //         // emit("refleshData");
  //         showToast({
  //           message: res.msg,
  //           duration: 500,
  //         });
  //         setTimeout(() => {
  //           router.push({
  //             name: "success",
  //             // state: {
  //             //   name: encodeURIComponent(props.rechargeData.productName),
  //             //   title: encodeURIComponent(props.rechargeData.productTitle),
  //             //   img: encodeURIComponent(props.rechargeData.productImg),
  //             //   id: props.rechargeData.productId,
  //             // },
  //             query: {
  //               order: res.data.orders,
  //             },
  //           });
  //         }, 600);
  //       } else {
  //         // showToast(res.message);
  //         switch (res.code) {
  //           case -1:
  //             showToast({
  //               message: res.msg,
  //               duration: 500,
  //             });
  //             emit("refleshData");
  //             showBottom.value = false;
  //             break;
  //           case -3:
  //             showToast({
  //               message: res.msg,
  //               duration: 500,
  //             });
  //             emit("refleshData");
  //             showBottom.value = false;
  //             break;
  //           // case 300:
  //           //   if (res.data.orders) {
  //           //     goDetailsPage(res.data.orders);
  //           //   }
  //           //   break;
  //           case -2:
  //             showToast({
  //               message: res.msg,
  //               duration: 500,
  //             });
  //             emit("refleshData");
  //             break;
  //           default:
  //             showToast({
  //               message: res.msg,
  //               duration: 500,
  //             });
  //             emit("refleshData");
  //             showBottom.value = false;
  //         }
  //       }
  //     });
  // };
  // throttle(request);
};
onMounted(() => {
  showBottom.value = false;
});
</script>

<style scoped></style>
