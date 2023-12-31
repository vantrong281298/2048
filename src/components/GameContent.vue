<template>
    <div class="game-content">
        <div class="body" @touchstart="startSwipe" @touchmove="moveSwipe" @touchend="endSwipe">
            <div class="row" v-for="(row, rowIndex) in dataRef" :key="rowIndex">
                <div
                    :class="[
                        'item',
                        item > 2 && 'white'
                    ]"
                    :style="{ backgroundColor: getItemBGColor(item) }"
                    v-for="(item, index) in row"
                    :key="index"
                >
                    {{ item ? item : '' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, toRef, watch, onMounted } from 'vue';
// @ts-ignore
import { cloneDeep } from 'lodash';
const props = defineProps({
    data: {
        type: Array,
        default: []
    },
    bestScore: {
        type: Number,
        default: 0
    }
});

const emits = defineEmits(['updateScore', 'updateBestScore']);

const COLOR_BY_SCORE = [
  {
      value: 0,
      color: 'rgb(204, 192, 179)',
  },
  {
      value: 2,
      color: 'rgb(239,226,220)',
  },
  {
      value: 4,
      color: 'rgb(237, 224, 200)',
  },
  {
      value: 8,
      color: 'rgb(242, 177, 121)',
  },
  {
      value: 16,
      color: 'rgb(245, 149, 99)',
  },
  {
      value: 32,
      color: 'rgb(246, 124, 95)',
  },
  {
      value: 64,
      color: 'rgb(246, 94, 59)',
  },
  {
      value: 128,
      color: 'rgb(237, 207, 114)',
  },
  {
      value: 256,
      color: 'rgb(237, 204, 97)',
  },
  {
      value: 512,
      color: 'rgb(237, 200, 80)',
  },
  {
      value: 1024,
      color: 'rgb(237, 197, 63)',
  },
  {
      value: 2048,
      color: 'rgb(237, 194, 46)',
  },
  {
      value: 1,
      color: 'rgb(91,187,2)',
  },
];
const dataRef = ref([]);
const data = toRef(props, 'data');
const boxLeft = ref(0);
const boxTop = ref(0);
const score = ref(0);
let swipeStartX = 0;
let swipeStartY = 0;
let swipeEndX = 0;
let swipeEndY = 0;
let swipeDirection = '';
const previousPosition = ref(null);

// @ts-ignore
watch(data, (value) => {
    // @ts-ignore
    dataRef.value = data.value;
});

onMounted(() => {
    // @ts-ignore
    dataRef.value = data.value;
});

// @ts-ignore
function randomIntFromInterval(min = 0, max = 7) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// @ts-ignore
function getItemBGColor(value) {
    const index = COLOR_BY_SCORE.findIndex(item => item.value === value);

    if (index > -1) {
        return COLOR_BY_SCORE[index].color;
    } else {
        return COLOR_BY_SCORE[COLOR_BY_SCORE.length - 1].color;
    }
}

// @ts-ignore
function startSwipe(event) {
    swipeStartX = event.touches[0].clientX;
    swipeStartY = event.touches[0].clientY;
}

// @ts-ignore
function moveSwipe(event) {
    swipeEndX = event.touches[0].clientX;
    swipeEndY = event.touches[0].clientY;

    const swipeDistanceX = Math.abs(swipeEndX - swipeStartX);
    const swipeDistanceY = Math.abs(swipeEndY - swipeStartY);

    if (swipeDistanceX > swipeDistanceY) {
        // horizontal swipe
        if (swipeEndX > swipeStartX) {
            swipeDirection = 'right';
            boxLeft.value += swipeDistanceX;
        } else {
            swipeDirection = 'left';
            boxLeft.value -= swipeDistanceX;
        }
    } else {
        // vertical swipe
        if (swipeEndY > swipeStartY) {
            swipeDirection = 'down';
            boxTop.value += swipeDistanceY;
        } else {
            swipeDirection = 'up';
            boxTop.value -= swipeDistanceY;
        }
    }

    swipeStartX = swipeEndX;
    swipeStartY = swipeEndY;
}

// @ts-ignore
function endSwipe (event) {
    updatePosition(swipeDirection);
    swipeDirection = '';
}

// @ts-ignore
function updatePosition(direction) {
    previousPosition.value = cloneDeep(dataRef.value);
    let moved = false;
    switch (direction) {
        case 'left':
            moved = slideLeft();
            break;
        case 'right':
            moved = slideRight();
            break;
        case 'up':
            moved = slideUp();
            break;
        case 'down':
            moved = slideDown();
            break;
    }
    if (moved) {
        emits('updateScore', score.value);
        if (checkGameOver()) {
            alert('Game over!');
        }
        newRandom();
        saveData();
    }
}

function saveData() {
    if (score.value > props.bestScore) {
        // @ts-ignore
        localStorage.setItem('bestScore', score.value);
        emits('updateBestScore', score.value);
    }
}

function checkGameOver() {
    // @ts-ignore
    for (let i = 0; i < dataRef.value.length; i++) {
        // @ts-ignore
        for (let j = 0; j < dataRef.value[i].length; j++) {
            // @ts-ignore
            if (dataRef.value[i][j] === 0) {
                return false;
            }
            // @ts-ignore
            if (j < dataRef.value[i].length - 1 && dataRef.value[i][j] === dataRef.value[i][j + 1]) {
                return false;
            }
            // @ts-ignore
            if (i < dataRef.value.length - 1 && dataRef.value[i][j] === dataRef.value[i + 1][j]) {
                return false;
            }
        }
    }
    return true;
}

function slideLeft() {
    let moved = false;
    for (let i = 0; i < dataRef.value.length; i++) {
        // @ts-ignore
        for (let j = 1; j < dataRef.value[i].length; j++) {
            if (dataRef.value[i][j] !== 0) {
                for (let k = j; k > 0; k--) {
                    if (dataRef.value[i][k - 1] === 0) {
                        // @ts-ignore
                        dataRef.value[i][k - 1] = dataRef.value[i][k];
                        // @ts-ignore
                        dataRef.value[i][k] = 0;
                        moved = true;
                    } else if (dataRef.value[i][k - 1] === dataRef.value[i][k]) {
                        // @ts-ignore
                        dataRef.value[i][k - 1] *= 2;
                        // @ts-ignore
                        dataRef.value[i][k] = 0;
                        score.value += dataRef.value[i][k - 1];
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for (let j = 0; j < dataRef.value.length; j++) {
        for (let i = dataRef.value.length- 2; i >= 0; i--) {
            if (dataRef.value[i][j] !== 0) {
                // @ts-ignore
                for (let k = i; k < dataRef.value.length - 1; k++) {
                    if (dataRef.value[k + 1][j] === 0) {
                        // @ts-ignore
                        dataRef.value[k + 1][j] = dataRef.value[k][j];
                        // @ts-ignore
                        dataRef.value[k][j] = 0;
                        moved = true;
                    } else if (dataRef.value[k + 1][j] === dataRef.value[k][j]) {
                        // @ts-ignore
                        dataRef.value[k + 1][j] *= 2;
                        // @ts-ignore
                        dataRef.value[k][j] = 0;
                        score.value += dataRef.value[k + 1][j];
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    return moved;
}

function slideUp() {
    let moved = false;
    for (let j = 0; j < dataRef.value.length; j++) {
        for (let i = 1; i < dataRef.value.length; i++) {
            if (dataRef.value[i][j] !== 0) {
                for (let k = i; k > 0; k--) {
                    if (dataRef.value[k - 1][j] === 0) {
                        // @ts-ignore
                        dataRef.value[k - 1][j] = dataRef.value[k][j];
                        // @ts-ignore
                        dataRef.value[k][j] = 0;
                        moved = true;
                    } else if (dataRef.value[k - 1][j] === dataRef.value[k][j]) {
                        // @ts-ignore
                        dataRef.value[k - 1][j] *= 2;
                        // @ts-ignore
                        dataRef.value[k][j] = 0;
                        score.value += dataRef.value[k - 1][j];
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    return moved;
}

function slideRight() {
    let moved = false;
    for (let i = 0; i < dataRef.value.length; i++) {
        // @ts-ignore
        for (let j = dataRef.value[i].length - 2; j >= 0; j--) {
            if (dataRef.value[i][j] !== 0) {
                // @ts-ignore
                for (let k = j; k < dataRef.value[i].length - 1; k++) {
                    if (dataRef.value[i][k + 1] === 0) {
                        dataRef.value[i][k + 1] = dataRef.value[i][k];
                        // @ts-ignore
                        dataRef.value[i][k] = 0;
                        moved = true;
                    } else if (dataRef.value[i][k + 1] === dataRef.value[i][k]) {
                        // @ts-ignore
                        dataRef.value[i][k + 1] *= 2;
                        // @ts-ignore
                        dataRef.value[i][k] = 0;
                        score.value += dataRef.value[i][k + 1];
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    return moved;
}

function newRandom() {
    const rowIndex = randomIntFromInterval();
    const columnIndex = randomIntFromInterval();

    if (!dataRef.value[rowIndex][columnIndex]) {
        // @ts-ignore
        dataRef.value[rowIndex][columnIndex] = 2;

        return;
    } else {
        newRandom();
    }
}

function backToPrevious() {
    if (!previousPosition.value) return;

    dataRef.value = previousPosition.value;
}

function reset() {
    score.value = 0;
}

defineExpose({ backToPrevious, reset });

</script>

<style lang="scss" scoped>
.game-content {
    padding: 0 10px;

    .body {
        padding: 5px;
        background-color: #b9ad9f;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .row {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            justify-content: center;

            .item {
                flex: 1 0 8%;
                background-color: #d6cec3;
                padding: 5px;
                border-radius: 5px;
                text-align: center;
                font-weight: 700;
                max-width: 26px;
                min-width: 26px;
                min-height: 26px;
                max-height: 26px;
                color: #736a63;
                transition: transform 0.5s ease-in-out;
            }
            .white {
                color: #fff;
            }
        }
    }
}
</style>