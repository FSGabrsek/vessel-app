<script setup>
import { computed, onBeforeMount, ref } from 'vue';

const props = defineProps(['review', 'editmode'])
const emit = defineEmits(['submit', 'cancel'])

const review = ref(props.review)

onBeforeMount(() => {
    if (!props.review) {
        review.value = {
            rating: "",
            content: ""
        }
    } else {
        review.value = props.review
    }
})

const color = (rating, selected) => {
    let style = "deselected"
    if (rating !== selected) {
        style = "deselected"
    } else {
        if (rating == "+") {
            style = "cyan"
        }
        if (rating == "~") {
            style = "amber"
        }
        if (rating == "-") {
            style = "red"
        }
        if (rating === selected) {
            style = style + " selected"
        }
    }
    return style
}

const submit = () => {  
    emit("submit", review.value)
}

defineExpose({submit})
</script>

<template>
    <div class="review-wrapper">
        <div class="view">
            <div class="rating" v-if="!editmode">
                <div class="indicator" :class="color(review.rating, review.rating)">
                    {{ review.rating }}
                </div>
            </div>
            <div class="content" v-if="!editmode">
                {{ review.content }}
            </div>
        </div>
        <div class="edit">
            <div class="rating-selector" v-if="editmode">
                <div class="indicator" v-for="rating in ['+', '~', '-']" :class="color(rating, review.rating)" @click="review.rating = rating">
                    {{ rating }}
                </div>
            </div>
            <textarea v-model="review.content" v-if="editmode"></textarea>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "../styles";

.review-wrapper {
    display: flex;
    flex-direction: column;
    
    gap: $px-xxs;
    padding: $px-xxs $px-s $px-s $px-s
}

.cyan {
    color: $cyan-primary
}

.amber {
    color: $amber-primary
}

.red {
    color: $red-primary
}

.deselected {
    color: $highlight
}

.view {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: $px-xs;
}

.edit {
    display: flex;
    flex-direction: column;
    gap: $px-xs;
}

.rating-selector {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: $px-m;
    align-items: center;
}

.indicator {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: $px-xxs;
    border-radius: $px-xxs;
    font-size: 24px;
    font-weight: $bold;

    height: 24px;
    width: 24px;

    background-color: $bg-bright;
}

.selected {
    background-color: $bg-brightest !important;
}

</style>