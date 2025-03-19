<template>
    <van-nav-bar :title="porps.title" fixed safe-area-inset-top @click-left="onClickLeft" @click-right="onClickRight">
        <template #left>
            <!-- <van-icon name="cross" size="18" /> -->
            <img src="../../assets/images/reback.png" />
        </template>
        <template #right>
            <img src="../../assets/images/top_more.png" />
        </template>
    </van-nav-bar>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

const porps = withDefaults(defineProps<{ title: string }>(), {
    title: ''
})
const emit = defineEmits<{
    'clickRight': []
}>()
const onClickLeft = () => {
    history.back()
}
const onClickRight = () => {
    emit('clickRight')
}
</script>

<style scoped></style>