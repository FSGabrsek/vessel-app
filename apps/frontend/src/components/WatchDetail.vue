<script setup>
import { onBeforeMount, ref, Teleport } from 'vue';
import { useVessel } from '../composables/useVessel';
import { useWatch } from '../composables/useWatch';
import WatchProgressItem from './WatchProgressItem.vue';
import { useRoute, useRouter } from 'vue-router';
import { lengthFlavourText } from '../utils/vesselUtils';
import ReviewItem from './ReviewItem.vue';
import { useAuthStore } from '../store/useAuthStore';

const props = defineProps(['watch'])
const route = useRoute()
const router = useRouter()

const auth = useAuthStore()
const { updateVessel, loadWatchers, removeVessel } = useVessel()
const { loadWatches, addWatch, updateWatch, removeWatch, setReview, unsetReview } = useWatch()

const userWatches = ref(null)
const watchModel = ref(props.watch)
const watchUpdateModel = ref(props.watch)

const editMode = ref(false)
const deleteMode = ref(false)
const reviewMode = ref(false)
const progressTimer = ref(null)
const permanentDelete = ref(false)

const reviewItemComponent = ref(null)

onBeforeMount(async () => {
    userWatches.value = await loadWatches(auth.user._id)
});

const add = async () => {
    const postModel = watchModel.value
    postModel.progress = 0

    const res = await addWatch(auth.user._id, postModel)
    router.push(`/user/${auth.user._id}/watch/${res._id}`)
}

const remove = async () => {
    const watchers = await loadWatchers(watchModel.value.vessel._id)
    
    if ((watchers.length === 1) && (watchers[0]._id === auth.user._id) && (watchModel.value.vessel.owner === auth.user._id)) {
        deleteMode.value = true
    } else {
        await commitRemove()
    }
}

const commitRemove = async () => {
    deleteMode.value = false
    const res = await removeWatch(auth.user._id, watchModel.value._id)
    if (permanentDelete.value) {
        await removeVessel(res.vessel._id)
        permanentDelete.value = false
    }
    router.push({ name: "watch", params: { userId: auth.user.id } })
}


const saveVessel = async () => {
    const res = await updateVessel(watchModel.value.vessel._id, watchUpdateModel.value.vessel)
    watchModel.value.vessel = res
    watchUpdateModel.value = watchModel.value

    editMode.value = false
};

const onProgress = (progress) => {
    watchModel.value.progress = progress
    saveProgress()
}

const saveProgress = () => {
    if (progressTimer.value) {
        clearTimeout(progressTimer.value)
    }
    progressTimer.value = setTimeout(async () => {
        await updateWatch(auth.user._id, watchModel.value._id, watchModel.value)
    }, 400)
};

const saveReview = async (review) => {
    if (review.content == "") {
        await unsetReview(auth.user._id, watchModel.value._id)
        watchModel.value.review = undefined
    } else {
        await setReview(auth.user._id, watchModel.value._id, review)
        watchModel.value.review = review
    }
}

const triggerReview = () => {
    reviewMode.value = false
    reviewItemComponent.value.submit()
}

</script>

<template>
    <Teleport to="body" v-if="deleteMode">
        <div class="overlay"></div>
        <div class="global-wrapper">
            <div class="delete-modal">
                <div class="delete-head">
                    <h2>Delete this vessel completely?</h2>
                    <svg @click="deleteMode = false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg>
                </div>
                <div class="delete-content">
                    <p>You created this vessel and are the only person to have it in your list. Do you want to <span class="highlight-span">permanently</span> delete this vessel, or keep it around for other people to find?</p>
                    <div class="detail-group">
                        <button class="button-cyan-hollow" @click="(permanentDelete = false) && commitRemove()">Keep it</button>
                        <button class="button-red-solid" @click="(permanentDelete = true) && commitRemove()">Delete it forever</button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>

    <div class="detail-content-wrapper">
        <div class="detail-element-row">
            <div>
                <span class="highlight-span">Status: </span>
                <span v-if="!editMode">{{ watchModel.vessel.status }}</span>
                <select v-if="editMode" v-model="watchUpdateModel.vessel.status">
                    <option>upcoming</option>
                    <option>ongoing</option>
                    <option>finished</option>
                </select>
            </div>
            <div class="edit-control-group" v-if="watchModel.vessel.owner === auth.user._id">
                <div title="edit" v-if="!editMode && !reviewMode" @click="editMode=true">
                    <svg id="edit" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path></svg>
                </div>
                <div title="save edits" v-if="editMode && !reviewMode" @click="saveVessel">
                    <svg id="save" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 19H19V6.82843L17.1716 5H16V9H7V5H5V19H6V12H18V19ZM4 3H18L20.7071 5.70711C20.8946 5.89464 21 6.149 21 6.41421V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM8 14V19H16V14H8Z"></path></svg>
                </div>
                <div title="cancel edits" v-if="editMode && !reviewMode" @click="editMode=false">
                    <svg id="cancel" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z"></path></svg>
                </div>
            </div>
        </div>
        <div class="detail-element">
            <h3>Synopsis</h3>
            <p>{{ watchModel.vessel.synopsis }}</p>
        </div>
        <div class="detail-element">
            <span class="highlight-span" v-if="!editMode">{{ lengthFlavourText(watchModel.vessel) }}</span>
            <div v-if="editMode">
                <span class="highlights-span">Complete length: </span>
                <input type="number" v-model="watchUpdateModel.vessel.finalLength">
            </div>
        </div>
        <div class="detail-element" v-if="(route.params.userId === auth.user._id) && !editMode">
            <h3>Progress</h3>
            <WatchProgressItem :final="watchModel.vessel.currentLength" :progress="watchModel.progress" @progressChanged="(p) => onProgress(p)"/>
        </div>
        <div class="detail-element" v-if="watchModel.review || reviewMode">
            <div class="detail-element-row">
                <h3>Review</h3>
                <svg @click="reviewMode = false" v-if="reviewMode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path fill="currentColor" d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg>
            </div>
            <ReviewItem :review="watchModel.review" :editmode="reviewMode" @submit="saveReview" ref="reviewItemComponent"/>
        </div>
        <div class="detail-element" id="last" v-if="(userWatches !== null) && !editMode">
            <div class="detail-group">
                <button class="button-amber-hollow" v-if="!reviewMode" @click="reviewMode = true">{{ watchModel.review ? "Edit your" : "Write a" }} review</button>
                <button class="button-amber-solid" v-if="reviewMode" @click="triggerReview">Submit review</button>
                <button class="button-red-hollow" v-if="route.params.userId === auth.user._id" @click="remove">remove from list</button>
                <button class="button-cyan-hollow" v-if="!(userWatches.map(w => w.vessel._id).includes(watchModel.vessel._id))" @click="add">Add to list</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "../styles";

.detail-content-wrapper {
    display: flex;
    flex-direction: column;
    gap: $px-xs;

    padding: $px-s;
}

.detail-element-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.edit-control-group {
    display: flex;
    flex-direction: row;
    gap: $px-xxs;

    color: $highlight;

    svg:hover {
        color: $text-highlight
    }
}

h3 {
    margin: 0;
}

p {
    margin: $px-xxs 0 0 0;
}

.detail-group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: $px-s;
}

svg:hover {
    color: $text-highlight;
    cursor: pointer;
}

#last {
    margin-top: $px-s;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    
    width: 100%;
    height: 100%;

    background-color: $bg-primary;
    opacity: 0.7;
}

.global-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

}

.delete-head {
    display: flex;
    justify-content: space-between;
    align-items: center;

    background-color: $amber-primary;
    padding: $px-xs $px-s;
    border-radius: $px-xxs $px-xxs 0 0 ;


    h2 {
        margin: 0;
    }
}

.delete-content {
    display: flex;
    flex-direction: column;
    gap: $px-xs;

    padding: $px-s;
}

.delete-modal {
    max-width: 30%;

    background-color: $bg-primary;
    border-radius: $px-xxs;
}
</style>