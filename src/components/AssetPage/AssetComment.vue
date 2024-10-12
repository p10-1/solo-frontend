<!-- AssetComment.vue -->
<template>
  <div class="asset-comment margin-top-1rem">
    <dl class="comment-robot">
      <dt>
        <!-- <span class="robot-icon">
          <i class="fa-solid fa-graduation-cap"></i>
        </span> -->
      </dt>
      <dd>
        <div class="robot-role">분석 멘토 Report</div>
        <div class="comment">
          <h4 class="report-title margin-top-1rem">
            {{ customTitle || title }}
          </h4>
          <div class="report-content margin-top-1rem">
            <p class="intro">{{ assetEvaluationIntro }}</p>
            <p class="comparison">{{ assetEvaluationComparison }}</p>
            <div class="advice">
              <div class="guide">Solution</div>
              <p>{{ assetEvaluationAdvice }}</p>
            </div>
          </div>
        </div>
      </dd>
    </dl>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  assetDetails: {
    type: Object,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  overallAverages: {
    type: Object,
    required: true
  },
  typeAverages: {
    type: Object,
    required: true
  },
  comparisonType: {
    type: String,
    required: true
  },
  customTitle: {
    type: String,
    default: ''
  }
})

const title = computed(() => {
  switch (props.comparisonType) {
    case 'personal':
      return '내 자산 평가'
    case 'typeAverage':
      return `${props.userType} 평균 자산 비교`
    case 'overallAverage':
      return '전체 평균 자산 비교'
    default:
      return '자산 평가'
  }
})

const calculateAssetRatios = (assets) => {
  if (!assets) return { safeRatio: 0, riskRatio: 0 }

  const safeAsset =
    ((assets.cash && assets.cash.total) || 0) +
    ((assets.deposit && assets.deposit.total) || 0) +
    ((assets.insurance && assets.insurance.total) || 0)
  const riskAsset = (assets.stock && assets.stock.total) || 0
  const totalAsset = safeAsset + riskAsset

  if (totalAsset === 0) return { safeRatio: 0, riskRatio: 0 }

  return {
    safeRatio: safeAsset / totalAsset,
    riskRatio: riskAsset / totalAsset
  }
}

const getIdealRatios = (userType) => {
  switch (userType) {
    case '위험 추구형':
      return { safe: 0.5, risk: 0.5 }
    case '자산 분산형':
      return { safe: 0.6, risk: 0.4 }
    case '안정 추구형':
      return { safe: 0.8, risk: 0.2 }
    case '대출 우선형':
      return { safe: 1.0, risk: 0.0 }
    default:
      return { safe: 0.6, risk: 0.4 }
  }
}

const getRelativeDescription = (diff) => {
  if (Math.abs(diff) < 0.2) return null // 20% 미만 차이는 언급하지 않음
  if (Math.abs(diff) < 0.3) return diff > 0 ? '높은' : '낮은'
  return diff > 0 ? '매우 높은' : '매우 낮은'
}

const assetEvaluationIntro = computed(() => {
  const { safeRatio, riskRatio } = calculateAssetRatios(props.assetDetails)
  const idealRatios = getIdealRatios(props.userType)
  return `자산 비율은 
  안전자산 ${(safeRatio * 100).toFixed(1)}%, 
  위험자산 ${(riskRatio * 100).toFixed(1)}%
  입니다.`
})

const assetEvaluationComparison = computed(() => {
  const { safeRatio } = calculateAssetRatios(props.assetDetails)
  const idealRatios = getIdealRatios(props.userType)
  const difference = safeRatio - idealRatios.safe
  const safeDescription = getRelativeDescription(difference)

  if (!safeDescription) {
    return `자산 분배가 ${props.userType}의 평균과 큰 차이가 없습니다.`
  } else {
    return `안전자산 비중이 ${props.userType}의 평균에 비해 ${safeDescription} 편이에요.`
  }
})

const assetEvaluationAdvice = computed(() => {
  const { safeRatio } = calculateAssetRatios(props.assetDetails)
  const idealRatios = getIdealRatios(props.userType)
  const difference = safeRatio - idealRatios.safe

  if (Math.abs(difference) < 0.2) {
    return `전반적으로 ${props.userType}에 적합한 자산 분배를 하고 계시네요. 현재의 균형을 잘 유지해 보세요.`
  } else if (difference > 0) {
    if (difference > 0.4) {
      return `안전자산 비중이 상당히 높습니다. 일부 안전자산을 위험자산으로 전환하는 것을 고려해보시는 건 어떨까요? 잠재적으로 더 높은 수익을 얻을 기회를 제공할 수 있습니다.`
    } else {
      return `위험자산 비중을 조금 높이는 것을 고려해보시는 건 어떨까요? 장기적으로 더 높은 수익을 얻을 수 있는 기회를 제공할 수 있습니다.`
    }
  } else {
    if (difference < -0.4) {
      return `위험자산 비중이 상당히 높습니다. 일부 위험자산을 안전자산으로 전환하는 것을 고려해보시는 건 어떨까요? 자산을 보호하고 리스크를 줄이는 데 도움이 될 수 있습니다.`
    } else {
      return `안전자산 비중을 조금 높이는 것을 고려해보시는 건 어떨까요? 자산을 안정적으로 관리하는 데 도움이 될 수 있습니다.`
    }
  }
})
</script>

<style scoped>
.comment-robot .comment .report-title {
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
  word-break: keep-all;
}
.comment-robot .comment .report-content {
  border-top: 1px dashed #cfc6fd;
  padding-top: 10px;
}
.comment-robot .comment .report-content p {
  font-size: 1rem;
  line-height: 1.3;
  color: #333;
  word-break: keep-all;
  margin-bottom: 10px;
}
.comment-robot .comment .report-content p:last-child {
  margin-bottom: 0;
}
.comment-robot .comment .report-content .intro {
  font-weight: 600;
  color: #6846f5;
}
.comment-robot .comment .report-content .advice {
  border-top: 1px dashed #cfc6fd;
  margin-top: 10px;
  padding-top: 10px;
}
.comment-robot .comment .report-content .advice .guide {
  display: block;
  font-weight: 600;
  color: #b6a8ff;
  letter-spacing: -0.8px;
  margin-bottom: 5px;
}
.comment-robot .comment .report-content .advice p {
  color: #666;
  word-break: keep-all;
}
</style>
