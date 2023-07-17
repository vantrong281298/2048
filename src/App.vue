<template>
  <div class="game-container">
    <GameHeader :score="score" :bestScore="bestScore" @back="back" @reset="reset" />
    <GameContent ref="gameContent" :data="data" :bestScore="bestScore" @updateScore="updateScore" @updateBestScore="updateBestScore"/>
  </div>
</template>

<script setup lang="ts">
  import GameHeader from './components/GameHeader.vue';
  import GameContent from './components/GameContent.vue';
  import { ref, onBeforeMount, onMounted } from 'vue';

  const data = ref([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]);
  const score = ref(0);
  const bestScore = ref(0);
  const gameContent = ref(null);

  onBeforeMount(() => {
    initData();
  });

  function retrieveData() {
    const myData = localStorage.getItem('bestScore');
    if (myData) {
      bestScore.value = Number(myData);
    }
  }

  function initData() {
    data.value[randomIntFromInterval()][randomIntFromInterval()] = 2;

    retrieveData();
  }

  function randomIntFromInterval(min = 0, max = 7) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function updateScore(value) {
    score.value = value;
  }

  function updateBestScore(value) {
    bestScore.value = value;
  }

  function back() {
    gameContent.value.backToPrevious();
  }

  function reset() {
    data.value = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    score.value = 0;
    initData();
    gameContent.value.reset();
  }
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  background-color: #f5f7ec;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>
