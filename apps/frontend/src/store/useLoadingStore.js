import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore("loading", () => {
    const error = ref(false)
    const pending = ref(0)

    const start = () => {
        if (pending.value === 0) {
            error.value = false
        }
        pending.value++
    }

    const finish = (success) => {
        pending.value--
        error.value = !success
    }

    return { pending, error, start, finish }
})