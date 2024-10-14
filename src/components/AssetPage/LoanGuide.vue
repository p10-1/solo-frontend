<template>
  <div class="loan-guide">
    <dl class="comment-robot">
      <dt>
        <span class="robot-icon">
          <i class="fa-solid fa-graduation-cap"></i>
        </span>
      </dt>
      <dd>
        <div class="robot-role">대출 멘토 Tip</div>
        <!-- 원리금 균등 상환 방식 가이드 -->
        <div v-if="repaymentMethod === 'equal-principal-interest'" class="comment">
          <span>
            이번 대출의 총 이자인
            <span class="text-accent">{{ Math.floor(totalInterest).toLocaleString() }}</span
            >원으로 <br />
            🥐 붕어빵 <strong>{{ principalEqualization.bread }}</strong> 마리 <br />
            ☕️ 커피 <strong>{{ principalEqualization.coffee }}</strong> 잔 <br />
            🍗 치킨 <strong>{{ principalEqualization.chicken }}</strong> 마리 <br />
            🍽️ 호텔뷔페를 <strong>{{ principalEqualization.buffet }}</strong> 번 <br />
            먹을 수 있어요!
          </span>
        </div>

        <!-- 원금 균등 상환 방식 가이드 -->
        <div v-if="repaymentMethod === 'equal-principal'" class="comment">
          <span>
            이번 대출의 총 이자인
            <span class="text-accent">{{
              Math.floor(totalPrincipalInterest).toLocaleString()
            }}</span
            >원으로<br />
            🥐 붕어빵 <strong>{{ principalEqualizationPrincipal.bread }}</strong> 마리 <br />
            ☕️ 커피 <strong>{{ principalEqualizationPrincipal.coffee }}</strong> 잔 <br />
            🍗 치킨 <strong>{{ principalEqualizationPrincipal.chicken }}</strong> 마리 <br />
            🍽️ 호텔뷔페를 <strong>{{ principalEqualizationPrincipal.buffet }}</strong> 번 <br />
            먹을 수 있어요!
          </span>
        </div>
        <!-- 만기 일시 상환 방식 가이드 -->
        <div v-if="repaymentMethod === 'bullet-repayment'" class="comment">
          <span>
            이번 달 이자인
            <span class="text-accent">{{ Math.floor(monthlyInterest).toLocaleString() }}</span
            >원으로<br />
            🥐 붕어빵 <strong>{{ monthlyInterestBread }}</strong> 마리<br />
            ☕️ 커피 <strong>{{ monthlyInterestCoffee }}</strong> 잔<br />
            🍗 치킨 <strong>{{ monthlyInterestChicken }}</strong> 마리<br />
            🥘 호텔뷔페를 <strong>{{ monthlyInterestBuffet }}</strong> 번 <br />
            먹을 수 있어요!
          </span>
        </div>
      </dd>
    </dl>
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
  },
  repaymentMethod: {
    type: String,
    required: true
  }
})

// 가이드 기준 가격
const guidePrices = {
  붕어빵: 700,
  커피: 5000,
  치킨: 30000,
  호텔뷔페: 100000
}

// 월 이자 계산 로직
const monthlyInterest = computed(() => {
  const { amount, interest } = props.loanData
  const monthlyRate = interest / 100 / 12 // 월 이자율
  return amount * monthlyRate // 월 이자
})

// 월 이자를 각 음식으로 변환
const monthlyInterestBread = computed(() => Math.floor(monthlyInterest.value / guidePrices.붕어빵))
const monthlyInterestCoffee = computed(() => Math.floor(monthlyInterest.value / guidePrices.커피))
const monthlyInterestChicken = computed(() => Math.floor(monthlyInterest.value / guidePrices.치킨))
const monthlyInterestBuffet = computed(() =>
  Math.floor(monthlyInterest.value / guidePrices.호텔뷔페)
)

// 원리금 균등 상환 총 이자 계산
const totalInterest = computed(() => {
  const { amount, interest, period } = props.loanData

  const r = interest / 100 / 12 // 월 이자율
  const monthlyPayment = (amount * r * Math.pow(1 + r, period)) / (Math.pow(1 + r, period) - 1)
  return monthlyPayment * period - amount
})

// 원금 균등 상환 총 이자 계산
const totalPrincipalInterest = computed(() => {
  const { amount, interest, period } = props.loanData
  const monthlyPrincipal = amount / period
  let totalInterest = 0

  for (let month = 1; month <= period; month++) {
    const remainingPrincipal = amount - monthlyPrincipal * (month - 1)
    const monthlyInterest = remainingPrincipal * (interest / 100 / 12)
    totalInterest += monthlyInterest
  }

  return totalInterest
})

// 원리금 균등 상환 방식 가이드 계산
const principalEqualization = computed(() => {
  const bread = Math.floor(totalInterest.value / guidePrices.붕어빵)
  const coffee = Math.floor(totalInterest.value / guidePrices.커피)
  const chicken = Math.floor(totalInterest.value / guidePrices.치킨)
  const buffet = Math.floor(totalInterest.value / guidePrices.호텔뷔페)

  return { bread, coffee, chicken, buffet }
})

// 원금 균등 상환 방식 가이드 계산
const principalEqualizationPrincipal = computed(() => {
  const bread = Math.floor(totalPrincipalInterest.value / guidePrices.붕어빵)
  const coffee = Math.floor(totalPrincipalInterest.value / guidePrices.커피)
  const chicken = Math.floor(totalPrincipalInterest.value / guidePrices.치킨)
  const buffet = Math.floor(totalPrincipalInterest.value / guidePrices.호텔뷔페)

  return { bread, coffee, chicken, buffet }
})
</script>

<style scoped>
.loan-guide .comment-robot .comment {
  font-size: 1.19rem;
  line-height: 1.8rem;
  letter-spacing: -1px;
  color: #333;
}
.loan-guide .comment-robot .comment .text-accent {
  font-weight: 600;
  font-size: 1.5rem;
}
.loan-guide .comment-robot .comment strong {
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
}
</style>
