<template>
  <div class="card">
    <p class="card__title">{{ card.voteName || '-' }}</p>
    <p class="card__subtitle">{{ card.voteLable || '-' }}</p>
    <ul class="card__ratio">
      <li>投票人数</li>
      <li>同意表决</li>
      <li>不同意表决</li>
      <li>弃权表决</li>
      <li>{{ card.voteRecordCount }}/{{ card.allCreditorCount }}</li>
      <li>{{ card.agreeCount }}/{{ card.voteRecordCount }}</li>
      <li>{{ card.disagreeCount }}/{{ card.voteRecordCount }}</li>
      <li>{{ card.abstainCount }}/{{ card.voteRecordCount }}</li>
    </ul>
    <div class="card__percent">
      <span>同意决议人数比例</span>
      <div class="card__progress-lower">
        <p :style="{ width: agreePeople }" class="card__progress-upper"> {{ agreePeople }} </p>
      </div>
    </div>
    <div class="card__percent">
      <span>同意决议金额比例</span>
      <div class="card__progress-lower">
        <p :style="{ width: agreeMoney }" class="card__progress-upper"> {{ agreeMoney }} </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  computed: {
    agreePeople() {
      const { agreeCount, allCreditorCount } = this.card
      if (allCreditorCount) {
        return (Number(agreeCount) / Number(allCreditorCount) * 100).toFixed(2) + '%'
      } else {
        return '0.00%'
      }
    },
    agreeMoney() {
      const { agreeConfirmTotal, allConfirmTotal } = this.card
      if (allConfirmTotal) {
        return (Number(agreeConfirmTotal) / Number(allConfirmTotal) * 100).toFixed(2) + '%'
      } else {
        return '0.00%'
      }
    },
  },
}
</script>

<style scoped>
.card {
  background: linear-gradient(135deg, #e1b68a 0%, #fcefde 5%, #faf4e9 50%, #fcefde 100%);
  padding: 15px 20px;
  overflow: hidden;
  width: 440px;
  display: inline-block;
  border-radius: 10px;
  color: #666;
  font-size: 14px;
  height: 230px;
  box-sizing: border-box;
  cursor: pointer;
  box-shadow: 0 0 5px #e1b68a;
  border: 1px solid #e1b68a;
}
.card:hover {
  background: linear-gradient(135deg, #e1b68a 0%, #fcead4 10%, #fdf3df 50%, #fcead4 100%);
  border-width: 2px;
}
.card__title {
  font-size: 16px;
  color: #333;
}
.card__subtitle {
  font-size: smaller;
  color: #999;
  padding: 1em 0;
}
.card__ratio {
  display: grid;
  grid-template: 1fr 1fr / 1fr 1fr 1fr 1fr;
  gap: 20px;
  white-space: nowrap;
  text-align: center;
}
.card__percent {
  padding-top: 1.5em;
  display: grid;
  grid-template-columns: 9em 1fr;
}
.card__progress-lower {
  background-color: #eee6db;
  border-radius: 1em;
  width: 100%;
}
.card__progress-upper {
  background: linear-gradient(0deg, #e1b68a 0%, #fad7a8 35%, #e1b68a 100%);
  border-radius: 1em;
  height: 100%;
  text-align: center;
  color: #aaa;
}
</style>
