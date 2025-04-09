<script setup>
import { computed, onBeforeMount, onMounted } from 'vue'

const props = defineProps(['watch'])

const progressClass = computed(() => {
    if (props.watch.progress <= 0) {
        return "not-started"
    }
    if (props.watch.progress >= props.watch.vessel.finalLength) {
        return "finished"
    }
    return "in-progress"
})


</script>

<template>
    <div class="list-item-wrapper" :class="progressClass">
        <div class="icon">
            <svg class="tv-icon" v-if="props.watch.vessel.type.includes('series')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M15.414 5h5.594c.548 0 .992.445.992 1v14c0 .552-.455 1-.992 1H2.992A.994.994 0 0 1 2 20V6c0-.552.455-1 .992-1h5.594L6.05 2.464 7.464 1.05 11.414 5h1.172l3.95-3.95 1.414 1.414L15.414 5z"/></svg>
            <svg class="film-icon" v-if="props.watch.vessel.type.includes('film')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM4 5v2h2V5H4zm14 0v2h2V5h-2zM4 9v2h2V9H4zm14 0v2h2V9h-2zM4 13v2h2v-2H4zm14 0v2h2v-2h-2zM4 17v2h2v-2H4zm14 0v2h2v-2h-2z"/></svg>
            <svg class="book-icon" v-if="props.watch.vessel.type.includes('literature')" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M20 22H6.5A3.5 3.5 0 0 1 3 18.5V5a3 3 0 0 1 3-3h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zm-1-2v-3H6.5a1.5 1.5 0 0 0 0 3H19z"/></svg>
        </div>
        <div class="title">
            <span>{{ props.watch.vessel.title }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "../styles";

.not-started {
    background-color: $red-primary;

    &:hover {
        background-color: $red-bright;
    } 
}

.in-progress {
    background-color: $amber-primary;

    &:hover {
        background-color: $amber-bright;
    } 
}

.finished {
    background-color: $cyan-primary;

    &:hover {
        background-color: $cyan-bright;
    } 
    
}

.list-item-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: $px-s;

    padding: $px-xs;

    &:hover {
        cursor: pointer;
    }
}

.icon {
    display: flex;
    justify-content: center;
    align-items: center;
}

.title {
    font-size: 1.125rem;
}
</style>