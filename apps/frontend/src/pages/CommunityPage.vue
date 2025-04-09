<script setup>
import { useAuth } from '../composables/useAuth';
import { computed, onBeforeMount, ref, useModel, watchEffect } from 'vue';
import UserItem from '../components/UserItem.vue';
import { useUser } from '../composables/useUser';
import { useWatch } from '../composables/useWatch';

const auth = useAuth();
const { loadUser, updateUser } = useUser()
const { loadWatches } = useWatch()

const user = ref(null)
const userWatches = ref(null)
const followers = ref(true)
const userModel = ref(null)
const userUpdateModel = ref(null)
const editMode = ref(false)

const form = ref(null)
const formIsvalid = ref(false)
const errorMessage = ref(null)

const reloadUser = async () => {
    user.value = await loadUser(auth.user.value._id)
    userModel.value = user.value

    userModel.value.dateOfBirth = new Date(userModel.value.dateOfBirth).toISOString().split('T')[0]
    userUpdateModel.value = userModel.value
}

const logout = async () => {
    auth.logout()
}

onBeforeMount(async () => {
    [user.value, userWatches.value] = await Promise.all([
        loadUser(auth.user.value._id),
        loadWatches(auth.user.value._id)
    ])
    userModel.value = user.value

    userModel.value.dateOfBirth = new Date(userModel.value.dateOfBirth).toISOString().split('T')[0]
    userUpdateModel.value = userModel.value

})

const submit = async () => {
    try {
        userUpdateModel.value.dateOfBirth = new Date(userUpdateModel.value.dateOfBirth).toISOString()
        await updateUser(auth.user.value._id, userUpdateModel.value)
        errorMessage.value = null
    } catch (e) {
        errorMessage.value = e.message
        return
    }

    await reloadUser()
    auth.updateStorageUser(userUpdateModel.value.username, userUpdateModel.value.email)

    editMode.value = false
}

watchEffect(() => {
    let model = userUpdateModel.value

    if (model == null) {
        model = {}
    }

    const required = ["username", "email", "dateOfBirth"];
    const hasAllFields = required.every(key => model.hasOwnProperty(key) && model[key] !== "");

    let domValid = true;
    if (form.value) {
        const controls = form.value.querySelectorAll('input, select, textarea');
        domValid = Array.from(controls).every(el => {
            return el.offsetParent === null || el.checkValidity();
        });
    }

    formIsvalid.value = hasAllFields && domValid;
})

</script>

<template>
    <div class="wrapper" v-if="user && auth.user.value">
        <h1>Community</h1>
        <div class="content-wrapper">
            <div class="menu" ref="form">
                <div class="menu-top unfocus">
                    <div class="header-group">
                        <h3 v-if="!editMode">{{ user.username }}</h3>
                        <svg class="hoverable" v-if="!editMode" id="edit" @click="editMode = true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path></svg>
                        <input v-if="editMode" type="text" required="true" v-model="userUpdateModel.username"/>
                    </div>
                    <button class="button-red-hollow" @click="logout">Log out</button>
                </div>
                <div class="menu-content">
                    <div>
                        <span class="highlight-span">Email: </span>
                        <span v-if="!editMode">{{ user.email }}</span>
                        <input v-if="editMode" type="email" required="true" v-model="userUpdateModel.email">
                    </div>
                    <div>
                        <span class="highlight-span">Date of birth: </span>
                        <span v-if="!editMode">{{ new Date(user.dateOfBirth)
                        .toLocaleString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }) }}
                        </span>
                        <input v-if="editMode" type="date" required="true" v-model="userUpdateModel.dateOfBirth">
                    </div>
                    <div v-if="editMode" id="password-form">
                        <h4>Password</h4>
                        <div>
                            <span class="highlight-span">Old password: </span>
                            <input type="password" v-model="userUpdateModel.oldPassword">
                        </div>
                        <div>
                            <span class="highlight-span">New password: </span>
                            <input type="password" v-model="userUpdateModel.password">
                        </div>
                    </div>
                    <span class="error-span" v-if="errorMessage">{{ errorMessage }}</span>
                    <div v-if="editMode" class="button-group">
                        <button class="button-cyan-solid" :disabled="!formIsvalid" @click="submit">Confirm</button>
                        <button class="button-red-hollow" @click="editMode = false">Cancel</button>
                    </div>
                </div>
            </div>
            <div class="menu" v-if="userWatches">
                <div class="menu-top unfocus">
                    <h3>Your stats</h3>
                </div>
                <div class="menu-content">
                    <div class="point">
                        <svg xmlns="http://www.w3.org/2000/svg" height="2rem" width="2rem" viewBox="0 0 24 24" fill="currentColor"><path d="M12.1717 12.0005L9.34326 9.17203L10.7575 7.75781L15.0001 12.0005L10.7575 16.2431L9.34326 14.8289L12.1717 12.0005Z"></path></svg>
                        <span class="highlight-span">{{ userWatches.filter(w => w.vessel.owner === auth.user.value._id).length }}</span>
                        <span>vessel{{ userWatches.filter(w => w.vessel.owner === auth.user.value._id).length === 1 ? "" : "s" }} created</span>
                    </div>
                    <div class="point">
                        <svg xmlns="http://www.w3.org/2000/svg" height="2rem" viewBox="0 0 24 24" fill="currentColor"><path d="M12.1717 12.0005L9.34326 9.17203L10.7575 7.75781L15.0001 12.0005L10.7575 16.2431L9.34326 14.8289L12.1717 12.0005Z"></path></svg>
                        <span>Watching</span><span class="highlight-span">{{ userWatches.length }}</span>
                        <span>vessel{{ userWatches.length === 1 ? "" : "s" }}</span>
                    </div>
                    <div class="point">
                        <svg xmlns="http://www.w3.org/2000/svg" height="2rem"viewBox="0 0 24 24" fill="currentColor"><path d="M12.1717 12.0005L9.34326 9.17203L10.7575 7.75781L15.0001 12.0005L10.7575 16.2431L9.34326 14.8289L12.1717 12.0005Z"></path></svg>
                        <span class="highlight-span">{{ userWatches.filter(w => w.review != undefined).length }}</span>
                        <span>review{{ userWatches.filter(w => w.review != undefined).length === 1 ? "" : "s" }} written</span>
                    </div>
                </div>
            </div>
            <div class="menu">
                <div class="menu-top focus">
                    <h3 @click="followers = !followers" class="hoverable" :class="{ selected: followers }">Followers</h3>
                    <h3>|</h3>
                    <h3 @click="followers = !followers" class="hoverable" :class="{ selected: !followers }">Following</h3>
                </div>
                <div class="menu-content">
                    <UserItem v-for="follower in user.followers" v-if="followers" :target="follower" :follows="user.follows.some(f => f._id === follower._id)" @reload="reloadUser"/>
                    <UserItem v-for="following in user.follows" v-if="!followers" :target="following" :follows="user.follows.some(f => f._id === following._id)" @reload="reloadUser"/>
                    <div v-if="(followers && user.followers.length  == 0) || (!followers && user.follows.length  == 0)" class="user-item tiny">
                        <span>There's nothing here</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../styles.scss';

.content-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    gap: clamp($px-m, 5%, $px-xl);
}

.menu {
    border-radius: $px-xs;
    background-color: $bg-secondary;
}

.menu-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;

    gap: $px-s;

    border-radius: $px-xxs $px-xxs 0 0;
    padding:  $px-xs $px-s;
}

.header-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;

    gap: $px-xxs;

    input {
        background-color: $bg-brighter;
    }
}

.button-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    
    gap: $px-xs;
}

.unfocus {
    background-color: $bg-bright;
}

.focus {
    background-color: $cyan-primary;
}

.point {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    gap: $px-xxs;

}

.menu-content {
    display: flex;
    flex-direction: column;
    gap: $px-xxs;

    padding:  $px-xs $px-s;
}


#password-form {
    display: flex;
    flex-direction: column;
    gap: $px-xxs;

    margin-top: $px-xxs;
}


.selected {
    text-decoration: underline;
}

.hoverable:hover {
    color: $text-highlight;
    cursor: pointer;
}

h3, h4 {
    margin-bottom: 0;
}
</style>