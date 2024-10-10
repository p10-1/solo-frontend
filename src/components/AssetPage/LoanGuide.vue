<template>
  <div class="loan-guide">
    <h2>대출 가이드</h2>

    <!-- 원리금 균등 상환 방식 가이드 -->
    <div class="guide-section">
      <h5>원리금 균등 상환 방식</h5>
      <br />
      <span v-if="loanData.purpose === '전세자금'">
        이번 달 이자인 {{ Math.floor(monthlyInterest).toLocaleString() }} 원으로<br>
        🍞 붕어빵 {{ monthlyInterestBread }}마리를 <br>
        🍵 커피 {{ monthlyInterestCoffee }}잔을 <br>
        🍗 치킨 {{ monthlyInterestChicken }}마리를 <br>
        🥘 호텔뷔페를 {{ monthlyInterestBuffet }}번을 <br>
        먹을 수 있어요!
      </span>
      <span v-else>
        이번 대출의 총 이자인{{ Math.floor(totalInterest).toLocaleString() }} 원으로 <br>
        🍞 붕어빵 {{ principalEqualization.bread }}마리를 <br>
        🍵 커피 {{ principalEqualization.coffee }}잔을 <br>
        🍗 치킨 {{ principalEqualization.chicken }}마리를 <br>
        🥘 호텔뷔페를 {{ principalEqualization.buffet }}번을 <br>
        먹을 수 있어요!
      </span>

    </div>

    <!-- 원금 균등 상환 방식 가이드 -->
    <div class="guide-section">
      <h5>원금 균등 상환 방식</h5>
      <br />
      <span v-if="loanData.purpose === '전세자금'">
        이번 달 이자인 {{ Math.floor(monthlyInterest).toLocaleString() }} 원으로 <br>
        🍞 붕어빵 {{ monthlyInterestBread }}마리를 <br>
        🍵 커피 {{ monthlyInterestCoffee }}잔을 <br>
        🍗 치킨 {{ monthlyInterestChicken }}마리를 <br>
        🥘 호텔뷔페를 {{ monthlyInterestBuffet }}번을 <br>
        먹을 수 있어요!
      </span>
      <span v-else>
        이번 대출의 총 이자인{{ Math.floor(totalPrincipalInterest).toLocaleString() }} 원으로<br />
        🍞 붕어빵 {{ principalEqualizationPrincipal.bread }}마리를 <br>
        🍵 커피 {{ principalEqualizationPrincipal.coffee }}잔을 <br>
        🍗 치킨 {{ principalEqualizationPrincipal.chicken }}마리를 <br>
        🥘호텔뷔페를 {{ principalEqualizationPrincipal.buffet }}번을 <br>
        먹을 수 있어요!
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  loanData: {
    type: Object,
    required: true,
    default: () => ({
      amount: 0,
      purpose: '',
      period: 0,
      interest: 0
    })
  }
})

// 가이드 기준 가격
const guidePrices = {
  붕어빵: 700,
  커피: 5000,
  치킨: 30000,
  호텔뷔페: 100000,
}

// 월 이자 계산 로직
const monthlyInterest = computed(() => {
  const { amount, interest } = props.loanData;
  const monthlyRate = interest / 100 / 12; // 월 이자율
  return amount * monthlyRate; // 월 이자
});

// 월 이자를 각 음식으로 변환
const monthlyInterestBread = computed(() => Math.floor(monthlyInterest.value / guidePrices.붕어빵));
const monthlyInterestCoffee = computed(() => Math.floor(monthlyInterest.value / guidePrices.커피));
const monthlyInterestChicken = computed(() => Math.floor(monthlyInterest.value / guidePrices.치킨));
const monthlyInterestBuffet = computed(() => Math.floor(monthlyInterest.value / guidePrices.호텔뷔페));

// 원리금 균등 상환 총 이자 계산
const totalInterest = computed(() => {
  const { amount, interest, period } = props.loanData;

  const r = interest / 100 / 12; // 월 이자율
  const monthlyPayment = (amount * r * Math.pow(1 + r, period)) / (Math.pow(1 + r, period) - 1);
  return (monthlyPayment * period - amount);
});

// 원금 균등 상환 총 이자 계산
const totalPrincipalInterest = computed(() => {
  const { amount, interest, period } = props.loanData;
  const monthlyPrincipal = amount / period;
  let totalInterest = 0;

  for (let month = 1; month <= period; month++) {
    const remainingPrincipal = amount - (monthlyPrincipal * (month - 1));
    const monthlyInterest = remainingPrincipal * (interest / 100 / 12);
    totalInterest += monthlyInterest;
  }

  return totalInterest;
});

// 원리금 균등 상환 방식 가이드 계산
const principalEqualization = computed(() => {
  const { amount } = props.loanData;
  const r = props.loanData.interest / 100 / 12;
  const monthlyPayment = (amount * r * Math.pow(1 + r, props.loanData.period)) / (Math.pow(1 + r, props.loanData.period) - 1);

  const bread = Math.floor(monthlyPayment / guidePrices.붕어빵);
  const coffee = Math.floor(monthlyPayment / guidePrices.커피);
  const chicken = Math.floor(monthlyPayment / guidePrices.치킨);
  const buffet = Math.floor(monthlyPayment / guidePrices.호텔뷔페);

  return { bread, coffee, chicken, buffet };
});

// 원금 균등 상환 방식 가이드 계산
const principalEqualizationPrincipal = computed(() => {
  const { amount } = props.loanData;
  const monthlyPrincipal = amount / props.loanData.period;
  let totalInterest = 0;

  for (let month = 1; month <= props.loanData.period; month++) {
    const remainingPrincipal = amount - (monthlyPrincipal * (month - 1));
    const monthlyInterest = remainingPrincipal * (props.loanData.interest / 100 / 12);
    totalInterest += monthlyInterest;
  }

  const bread = Math.floor(totalInterest / guidePrices.붕어빵);
  const coffee = Math.floor(totalInterest / guidePrices.커피);
  const chicken = Math.floor(totalInterest / guidePrices.치킨);
  const buffet = Math.floor(totalInterest / guidePrices.호텔뷔페);

  return { bread, coffee, chicken, buffet };
});
</script>

<style scoped>
.loan-guide {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.guide-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-bottom: 10px;
  color: #333;
}
</style>
