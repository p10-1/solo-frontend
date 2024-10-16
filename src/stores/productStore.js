import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    productType: '예금' // 기본값 설정
  }),
  actions: {
    setProductType(type) {
      this.productType = type // productType 업데이트
    }
  }
})
