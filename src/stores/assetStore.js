import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchAssetData, fetchAssetAverages } from '@/api/assetApi'

export const useAssetStore = defineStore('asset', () => {
  const rawAssetData = ref(null)
  const assetAverages = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const loadData = async () => {
    try {
      loading.value = true
      const [assetData, averages] = await Promise.all([fetchAssetData(), fetchAssetAverages()])
      rawAssetData.value = assetData
      assetAverages.value = averages
    } catch (err) {
      console.error('데이터 가져오기 실패:', err)
      error.value = '데이터를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.'
    } finally {
      loading.value = false
    }
  }

  const parseJsonArray = (jsonString) => {
    try {
      return JSON.parse(jsonString)
    } catch (e) {
      console.error('Failed to parse JSON string:', jsonString)
      return []
    }
  }

  const fieldMapping = {
    cash: { bank: 'cashBank', account: 'cashAccount', value: 'cash' },
    deposit: { bank: 'depositBank', account: 'depositAccount', value: 'deposit' },
    stock: { bank: 'stockBank', account: 'stockAccount', value: 'stock' },
    insurance: { bank: 'insuranceCompany', account: 'insuranceName', value: 'insurance' }
  }

  const processAssetData = (data, assetTypes) => {
    return assetTypes.reduce((processed, type) => {
      const mapping = fieldMapping[type]
      if (mapping) {
        const values = parseJsonArray(data[mapping.value])
        const banks = parseJsonArray(data[mapping.bank])
        const accounts = parseJsonArray(data[mapping.account])

        processed[type] = {
          values: values.length ? values.map((v) => Number(v) || 0) : [0],
          banks: banks.length ? banks : [''],
          accounts: accounts.length ? accounts : ['']
        }
      }
      return processed
    }, {})
  }

  const calculateAverage = (values) => {
    const validValues = values.filter((v) => v > 0)
    return validValues.length
      ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length
      : 0
  }

  const processedData = computed(() => {
    if (!rawAssetData.value || rawAssetData.value.length === 0) {
      return {
        totalAsset: 0,
        assetDetails: {
          cash: { total: 0, details: [] },
          deposit: { total: 0, details: [] },
          stock: { total: 0, details: [] },
          insurance: { total: 0, details: [] },
          type: '유형을 입력해 주세요'
        },
        comparisonData: {},
        typeAverages: null,
        timeComparisonData: {},
        loanData: { amount: 0, purpose: '', period: 0, interest: 0 },
        overallAverages: null
      }
    }

    const currentData = rawAssetData.value[0] || {}
    const previousData = rawAssetData.value[1] || currentData
    const assetTypes = ['cash', 'deposit', 'stock', 'insurance']

    const currentAssetData = processAssetData(currentData, assetTypes)
    const previousAssetData = processAssetData(previousData, assetTypes)

    const calculateTotal = (assetData) =>
      Object.values(assetData).reduce(
        (total, { values }) => total + values.reduce((sum, val) => sum + Number(val), 0),
        0
      )

    const totalAsset = calculateTotal(currentAssetData)

    const assetDetails = assetTypes.reduce((details, type) => {
      const values = currentAssetData[type].values
      details[type] = {
        total: values.reduce((sum, val) => sum + val, 0),
        details: values.map((value, index) => ({
          bank: currentAssetData[type].banks[index] || '',
          account: currentAssetData[type].accounts[index] || '',
          value: value
        }))
      }
      return details
    }, {})

    const comparisonData = assetTypes.reduce((data, type) => {
      const currentValues = currentAssetData[type].values
      const previousValues = previousAssetData[type].values
      data[type] = {
        average: assetAverages.value ? assetAverages.value[type] : 0,
        user: calculateAverage(currentValues),
        previousAverage: calculateAverage(previousValues)
      }
      return data
    }, {})

    const timeComparisonData = assetTypes.reduce((data, type) => {
      data[type] = {
        previousMonth: calculateAverage(previousAssetData[type].values),
        currentMonth: calculateAverage(currentAssetData[type].values)
      }
      return data
    }, {})

    const typeAverages = assetAverages.value
      ? assetTypes.reduce((averages, type) => {
          averages[type] = { total: assetAverages.value[type] || 0 }
          return averages
        }, {})
      : null

    const overallAverages = assetAverages.value
      ? assetTypes.reduce((averages, type) => {
          averages[type] = { total: assetAverages.value[type] || 0 }
          return averages
        }, {})
      : null

    return {
      totalAsset,
      assetDetails: { ...assetDetails, type: currentData.type || '유형을 입력해주세요' },
      comparisonData,
      typeAverages,
      overallAverages,
      timeComparisonData,
      loanData: {
        amount: Number(currentData.loanAmount),
        purpose: currentData.loanPurpose,
        period: Number(currentData.period),
        interest: Number(currentData.interest)
      }
    }
  })

  return {
    rawAssetData,
    assetAverages,
    loading,
    error,
    loadData,
    processedData
  }
})
