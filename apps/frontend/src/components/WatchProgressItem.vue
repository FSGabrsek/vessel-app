<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps(['progress', 'final']);
const emit = defineEmits(['progressChanged'])

const progress = ref(props.progress);
const final = ref(props.final);

const progressStyle = computed(() => {
    if (final.value == 0) {
        return "width: 0%";
    } else {
        return `width: ${( progress.value / final.value ) * 100}%`;
    }
}) 

const progressClass = computed(() => {
    return props.progress == props.final ? "progress-finished" : "progress-in-progress";
})

const increaseProgress = () => {
    progress.value++;
}

const decreaseProgress = () => {
    progress.value--;
}

watch(() => progress.value, () => {
    if (progress.value < 0) {
        progress.value = 0
    }
    if (progress.value > final.value) {
        progress.value = final.value
    }
    emit("progressChanged", progress.value)
})

</script>

<template>
    <div class="progress-wrapper">
        <div class="progress-track">
            <div class="progress-measure" :style="progressStyle" :class="progressClass"></div>
        </div>
        <div class="progress-control-group">
            <button class="button-control" @click="decreaseProgress">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M5 11h14v2H5z"/></svg>

            </button>
            <div class="progress-numerical">
                <input class="input-control" type="number" v-model="progress">
                <div class="divider">/</div>
                <div class="total">{{ props.final }}</div>
            </div>
            <button class="button-control" @click="increaseProgress">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "../styles";

.progress-wrapper {
    margin-top: $px-xxs;
}

.progress-track {
    height: 1rem;
    width: 100%;

    background-color: $bg-bright;
    border-radius: .5rem;
}

.progress-measure {
    height: 1rem;

    border-radius: .5rem;
}

.progress-in-progress {
    background-color: $amber-primary;
}

.progress-finished {
    background-color: $cyan-primary;
}

.progress-control-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;

    margin: $px-xs $px-xs 0 $px-xs;
}

.progress-numerical {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    gap: .5em;
}

.divider {
    font-size: 1.5em;
    font-weight: $semibold;
}

.total {
    font-size: 13.333333px;
}

.button-control {
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: $bg-bright;
    color: $text;

    padding: $px-xxs;
    border-radius: $px-xxs;

    &:hover {
        background-color: $bg-brighter;
    }
}

.input-control {
    width: 3em;
    padding: .25rem;
    text-align: center;
}
</style>