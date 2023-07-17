<template>
    <div class="item">{{ value }}</div>
</template>

<script setup lang="ts">
const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
})
</script>

<style lang="scss" scoped>
    .item {
        flex: 1 0 8%;
        background-color: #d6cec3;
        padding: 5px;
        border-radius: 5px;
        text-align: center;
        font-weight: 700;
        max-width: 30px;
        min-width: 30px;
        color: #736a63;
    }
</style>