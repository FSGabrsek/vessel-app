<script setup>
import { ref, watchEffect } from 'vue';
import { useAuthStore } from '../store/useAuthStore';
import { useForm } from '../composables/useForm';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const form = ref(null)
const userModel = ref({
    username: "",
    email: "",
    dateOfBirth: "",
    password: ""
})
const errorMessage = ref("");

const { isValid } = useForm({
    form: form,
    model: userModel,
    requiredKeys: ["username", "email", "dateOfBirth", "password"],
})

const register = async () => {
    try {
        console.log(userModel.value)

        await auth.register(userModel.value);
        await router.push({ name: 'home' });
    } catch(e) {
        console.error(e)
        errorMessage.value = "This email is already in use";
    }
};
</script>

<template>
    <div class="register-wrapper">
        <div class="register-content" ref="form">
            <h2 class="">Register your new Vessel account</h2>
            <div class="form-group">
                <div class="form-element">
                    <label>Email</label>
                    <input v-model="userModel.email" type="email" required="true" />
                </div>
                <div class="form-element">
                    <label>Username</label>
                    <input v-model="userModel.username" type="text" required="true" />
                </div>
            </div>
            <div class="form-element">
                <label>Date of birth</label>
                <input v-model="userModel.dateOfBirth" type="date" required="true" />
            </div>
            <div class="form-element">
                <label>Password</label>
                <input v-model="userModel.password" type="password" required="true" />
            </div>
            <div>
                <span class="tiny">Already have an account? Log in </span><RouterLink :to="{ name: 'login' }"><span class="highligh-span tiny" id="link">Here</span></RouterLink> 
            </div>
            <span class="error-span" v-if="errorMessage" >{{ errorMessage }}</span>

            <button @click="register" class="button-cyan-solid" :disabled="!isValid">Register</button>
        </div>
  </div>
</template>

<style scoped lang="scss">
@import '../styles.scss';

.register-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.register-content {
    display: flex;
    flex-direction: column;

    gap: $px-s;

    justify-content: center;
    align-items: flex-start;
}

button {
    margin-top: $px-s;
}

#link {
    color: $cyan-primary;
    text-decoration: underline;
    margin: (-$px-s) 0 (-$px-s) 0;
}

#link:hover {
    color: $cyan-bright;
}
</style>