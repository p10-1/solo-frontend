<template>
  <div class="kb-product-card">
    <div class="company-name">{{ props.product.korCoNm }}</div>
    <h2 class="product-name">{{ props.product.finPrdtNm }}</h2>
    <div class="interest-rate">{{ props.product.mtrtInt }}</div>
  </div>
</template>

<script setup>
// props 선언
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
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

.kb-product-card .interest-rate {
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
