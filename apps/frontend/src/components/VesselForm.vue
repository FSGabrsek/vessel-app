<script setup>
import { computed, ref, watch, watchEffect } from 'vue';
import { useForm } from '../composables/useForm';


const props = defineProps (['prefill'])
const emit = defineEmits(['submit', 'cancel'])

const vesselModel = ref({
    title: props.prefill,
    type: "series",
    bulkRelease: false,
    status: 'upcoming',
    releaseInterval: 1
})

const form = ref(null)

const releaseIntervalNumber = ref(1)
const releaseIntervalModifier = ref(1)

const { isValid } = useForm({
    form: form, 
    model: vesselModel, 
    requiredKeys: ["title", "type", "synopsis", "finalLength", "status", "releaseDate", "releaseInterval", "bulkRelease"]
})

watch(() => vesselModel.value.type, (newType) => {
    if (newType = "film") {
        vesselModel.value.bulkRelease = true

        if (vesselModel.value.status === "ongoing") {
            vesselModel.value.status = "finished"
        }
    }
})

watch(() => [releaseIntervalNumber.value, releaseIntervalModifier.value], ([newNumber, newModifier]) => {
    vesselModel.value.releaseInterval = newNumber * newModifier
})

watch(() => vesselModel.value.releaseDate, () => {
    if (new Date() < vesselModel.releaseDate) {
        vesselModel.value.status = "upcoming"
    }
})

const flavourText = computed(() => {
    if (vesselModel.value.type === "film") {
        return "minute"
    }
    if (vesselModel.value.type === "literature") {
        return "chapter"
    }
    return "episode"
})

const submit = () => {
    emit("submit", vesselModel.value)
}

const cancel = () => {
    emit("cancel")
}
</script>

<template>
<div class="create-vessel-form">
    <div class="form-header">
        <h2>Create a new vessel</h2>
        <svg @click="cancel" id="cancel" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z"></path></svg>
    </div>
    <form class="create-vessel-form" ref="form" @submit.prevent="submit">
        <div class="form-element">
            <label for="vessel-type">Type of Vessel</label>
            <select v-model="vesselModel.type" required=true id="vessel-type">
                <option disabled value="">Select a type</option>
                <option :value="'series'">Series</option>
                <option :value="'film'">Film</option>
                <option :value="'literature'">Literature</option>
            </select>
        </div>
        <div class="form-group">
            <div class="form-element">
                <label for="vessel-title">Title</label>
                <input type="text" v-model.trim="vesselModel.title" required=true id="vessel-title">
            </div>
            <div class="form-element">
                <label for="vessel-synopsis">Synopsis</label>
                <textarea type="text" v-model="vesselModel.synopsis" required=true id="vessel-synopsis" :placeholder="'What is this ' + [[ vesselModel.type ]] + ' about'"></textarea>
            </div>
        </div>
        <div class="form-element">
            <label for="vessel-status">Release Status</label>
            <select v-model="vesselModel.status" required=true id="vessel-status">
                <option disabled value="">Select a status</option>
                <option :value="'upcoming'">Upcoming</option>
                <option :value="'ongoing'" v-if="vesselModel.type !== 'film'">Ongoing</option>
                <option :value="'finished'">{{ vesselModel.type === "film" ? "Released" :  "Finished" }}</option>
            </select>
        </div>
        <div class="form-group">
            <div class="form-element">
                <label for="vessel-final-length">Total {{ flavourText }}s</label>
                <input type="number" v-model.number="vesselModel.finalLength" required=true id="vessel-final-length">
            </div>
            <div class="form-element" v-if="vesselModel.type !== 'film'">
                <label for="vessel-release-type">{{ flavourText.charAt(0).toUpperCase() + flavourText.slice(1) }}s are released</label>
                <select v-model="vesselModel.bulkRelease" id="vessel-release-type">
                    <option :value=false>Gradually</option>
                    <option :value=true>All at once</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <div class="form-element">
                <label for="vessel-release-date">Release date</label>
                <input type="date" v-model="vesselModel.releaseDate" required=true id="vessel-release-date">
            </div>
            <div class="form-element" v-if="vesselModel.bulkRelease === false">
                <label for="vessel-release-interval">New {{ flavourText }} every</label>
                <div class="form-parallel">
                    <input type="number" v-model="releaseIntervalNumber" id="vessel-release-interval">
                    <select v-model="releaseIntervalModifier" id="vessel-release-interval">
                        <option :value=1>day{{ releaseIntervalNumber > 1 ? "s" : "" }}</option>
                        <option :value=7>week{{ releaseIntervalNumber > 1 ? "s" : "" }}</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="form-element">
            <button class="button-cyan-solid" :disabled="!isValid" type="submit">Add to my list</button>
        </div>
    </form>
</div>
</template>

<style lang="scss" scoped>
@import "../styles";

.create-vessel-form {
    display: flex;
    flex-direction: column;
    gap: $px-s;
}

input[type=text], select {
    width: clamp(5em, 30vw, $px-xl);
}

input[type=number] {
    width: 5em;
}

textarea {
    height: 5em;
    width: 20em;
}

button {
    align-self: flex-start;
}
</style>