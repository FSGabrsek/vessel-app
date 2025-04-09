<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useForm } from '../composables/useForm';

const router = useRouter();
const auth = useAuth();

const form = ref(null)

const loginModel = ref({
    email: "",
    password: ""
})
const errorMessage = ref('');
const { isValid } = useForm({
    form: form, 
    model: loginModel, 
    requiredKeys: ["email", "password"]
})

const login = async () => {
    try {
        await auth.login(loginModel.value.email, loginModel.value.password);
        await router.push('/'); // Redirect to home after successful login
    } catch(e) {
        console.error(e)
        errorMessage.value = 'Invalid email or password';
    }
};
</script>

<template>
    <div class="login-wrapper">
        <div class="login-content" ref="form">
            <h2 class="">Login</h2>
            <div class="form-element">
                <label>Email</label>
                <input v-model="loginModel.email" type="email" />
            </div>
            <div class="form-element">
                <label>Password</label>
                <input v-model="loginModel.password" type="password" />
            </div>
            <div>
                <span class="tiny">Don't have an account? Create one </span><RouterLink :to="{ name: 'register' }"><span class="highligh-span tiny" id="link">Here</span></RouterLink> 
            </div>
            <span class="error-span" v-if="errorMessage" >{{ errorMessage }}</span>

            <button @click="login" :disabled="!isValid" class="button-cyan-hollow">Login</button>
        </div>
  </div>
</template>

<style scoped lang="scss">
@import '../styles.scss';

.login-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.login-content {
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