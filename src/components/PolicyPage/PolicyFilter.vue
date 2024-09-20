<template>
  <div class="policy-filter">
    <div v-for="(options, category) in filters" :key="category" class="filter-category">
      <h3>
        <input type="checkbox" :checked="isAllSelected(category)" @change="toggleAll(category)" />
        {{ category }}
      </h3>
      <div class="filter-options">
        <button
          v-for="option in options"
          :key="option"
          @click="toggleFilter(category, option)"
          :class="{ active: isActive(category, option) }"
        >
          {{ option }}
        </button>
      </div>
    </div>
    <div class="age-filter">
      <h3><input type="checkbox" v-model="useAgeFilter" /> 나이</h3>
      <input v-if="useAgeFilter" v-model="ageValue" type="number" placeholder="age" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  filters: Object
})

const activeFilters = ref({})
const useAgeFilter = ref(false)
const ageValue = ref('')

const emit = defineEmits(['filter-change'])

const isAllSelected = (category) => {
  return activeFilters.value[category]?.length === props.filters[category].length
}

const toggleAll = (category) => {
  if (isAllSelected(category)) {
    activeFilters.value[category] = []
  } else {
    activeFilters.value[category] = [...props.filters[category]]
  }
  emitChange()
}

const toggleFilter = (category, option) => {
  if (!activeFilters.value[category]) {
    activeFilters.value[category] = []
  }
  const index = activeFilters.value[category].indexOf(option)
  if (index > -1) {
    activeFilters.value[category].splice(index, 1)
  } else {
    activeFilters.value[category].push(option)
  }
  emitChange()
}

const isActive = (category, option) => {
  return activeFilters.value[category]?.includes(option)
}

const emitChange = () => {
  emit('filter-change', {
    ...activeFilters.value,
    age: useAgeFilter.value ? ageValue.value : null
  })
}

// Watch for changes in age filter
watch([useAgeFilter, ageValue], emitChange)
</script>
