import { ref, watchEffect } from 'vue'

export function useForm({ form, model, requiredKeys = [] }) {
    const isValid = ref(false)

    watchEffect(() => {
        const data = model.value

        // Check required keys exist and have non-empty values
        const hasAllRequired = requiredKeys.every(key => {
            return data.hasOwnProperty(key) && data[key] !== ''
        })

        // Check DOM fields
        let domValid = true
        if (form.value) {
                const controls = form.value.querySelectorAll('input, select, textarea')
                domValid = Array.from(controls).every(el => {
                return el.offsetParent === null || el.checkValidity()
            })
        }

        isValid.value = hasAllRequired && domValid
    })

    return {
        isValid
    }
}