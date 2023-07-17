<template>
    <div class="game-header">
        <div class="game-header__score">
            <p class="name">2048</p>
            <div class="score-container">
                <p>ĐIỂM</p>
                <p>{{ score }}</p>
            </div>
            <div class="score-container">
                <p>SỐ ĐIỂM CAO</p>
                <p>{{ score }}</p>
            </div>
        </div>
        <div class="game-header__actions">
            <p>Đánh giá</p>
            <p>Chia sẻ</p>
            <p @click="$emit('back')">back</p>
            <p @click="$emit('reset')">reset</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    score: {
        type: Number,
        default: 0
    }
});

</script>

<style lang="scss" scoped>
.game-header {
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__score {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .name {
            font-size: 50px;
            font-weight: 700;
            line-height: 10px;
            color: #736a63;
        }
        .score-container {
            background-color: #b9ad9f;
            padding: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #fff;
            border-radius: 10px;
            min-width: 90px;
            width: 90px;
            cursor: pointer;

            p {
                padding: 0;
                margin: 0;
                font-size: 14px;
            }
        }
    }
    &__actions {
        display: flex;
        justify-content: space-between;
        align-items: center;

        p {
            margin: 0;
            font-size: 14px;
            color: #fff;
            background-color: #b9ad9f;
            padding: 5px;
            border-radius: 5px;
            cursor: pointer;
        }
    }
}
</style>