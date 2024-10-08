<template>
  <a :href="productDetailLink" target="_blank" class="kb-product-card">
    <div class="company-name">{{ props.product.korCoNm }}</div>
    <h2 class="product-name">{{ props.product.finPrdtNm }}</h2>
    <div class="detail">
      {{ props.product.mtrtInt }}
      {{ props.product.loanLmt }}
      {{ props.product.dlyRate }}
      {{ props.product.erlyRpayFee }}
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})
const productLinks = {
  'KB Star 정기예금':
    'https://obank.kbstar.com/quics?page=C016613&cc=b061496:b061645&isNew=N&prcode=DP01000938',
  'KB국민프리미엄적금(정액)':
    'https://obank.kbstar.com/quics?page=C016613&cc=b061496:b061645&%EB%B8%8C%EB%9E%9C%EB%93%9C%EC%83%81%ED%92%88%EC%BD%94%EB%93%9C=DP01000428&QSL=F&prcode=DP01000428',
  KB맑은하늘적금:
    'https://obank.kbstar.com/quics?page=C016613&cc=b061496:b061645&%EB%B8%8C%EB%9E%9C%EB%93%9C%EC%83%81%ED%92%88%EC%BD%94%EB%93%9C=DP01000942&QSL=F&prcode=DP01000942',
  KB반려행복적금:
    'https://obank.kbstar.com/quics?page=C016613&cc=b061496:b061645&%EB%B8%8C%EB%9E%9C%EB%93%9C%EC%83%81%ED%92%88%EC%BD%94%EB%93%9C=DP01001491&QSL=F&prcode=DP01001491',
  'KB 특★한 적금':
    'https://obank.kbstar.com/quics?page=C016613&cc=b061496:b061645&%EB%B8%8C%EB%9E%9C%EB%93%9C%EC%83%81%ED%92%88%EC%BD%94%EB%93%9C=DP01001566&QSL=F&prcode=DP01001566',
  'KB차차차 적금':
    'https://obank.kbstar.com/quics?page=C016613&cc=b061496:b061645&%EB%B8%8C%EB%9E%9C%EB%93%9C%EC%83%81%ED%92%88%EC%BD%94%EB%93%9C=DP01001583&QSL=F&prcode=DP01001583',
  KB주택전세자금대출:
    'https://obank.kbstar.com/quics?page=C103507&cc=b104363:b104516&isNew=N&prcode=LN20000026&QSL=F',
  KB플러스전세자금대출:
    'https://obank.kbstar.com/quics?page=C103507&cc=b104363:b104516&isNew=N&prcode=LN20000041&QSL=F'
}
const productDetailLink = computed(() => {
  return productLinks[props.product.finPrdtNm] || '#'
})
</script>
<style scoped>
.kb-product-card {
  flex: 0 0 calc(33.8% - 17px);
  width: 100%;
  min-height: 10rem;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgb(221, 214, 255);
  border-radius: 25px;
  padding: 2rem 1.7rem;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.kb-product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 0 18px #cfc6fd;
}

.kb-product-card:hover .product-name {
  color: #6846f5;
  font-weight: 600;
}

.kb-product-card .company-name {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.5px;
  background-color: #6846f5;
  color: #fff;
  padding: 3px 8px;
  line-height: 1;
  border-radius: 20px;
  margin-bottom: 8px;
}

.kb-product-card .product-name {
  font-size: 1.22rem;
  word-break: keep-all;
  line-height: 1.6rem;
  letter-spacing: -1px;
}

.kb-product-card .detail {
  border-top: 1px dashed #e4deff;
  padding-top: 10px;
  font-size: 0.9rem;
  color: #333;
  font-weight: 400;
  word-break: keep-all;
  line-height: 24px;
  letter-spacing: -1px;
  font-weight: 400;
  margin: 10px 0 0;
  white-space: pre-line;
}
</style>
