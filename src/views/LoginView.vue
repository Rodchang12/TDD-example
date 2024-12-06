<template>
    <div class="max-w-md mx-auto mt-8 p-4">
        <h2 class="text-2xl font-bold mb-6">會員登入</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
                <label for="email" class="block mb-1">信箱</label>
                <input 
                    id="email"
                    v-model="form.email" 
                    data-test="email"
                    type="text"
                    class="w-full border rounded px-3 py-2"
                    :disabled="isLocked"
                    required
                >
            </div>

            <div>
                <label for="password" class="block mb-1">密碼</label>
                <input 
                    id="password"
                    v-model="form.password"
                    data-test="password" 
                    type="password"
                    class="w-full border rounded px-3 py-2"
                    :disabled="isLocked"
                    required
                >
            </div>

            <div v-if="error" data-test="error" class="text-red-500">
                {{ error }}
            </div>

            <div v-if="success" data-test="success" class="text-green-500">
                {{ success }}
            </div>

            <button 
                type="submit"
                data-test="submit"
                :disabled="isLocked"
                class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                登入
            </button>
        </form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const MAX_ATTEMPTS = 3
const LOCK_TIME = 15 * 60 * 1000 // 15 分鐘

const form = reactive({
  email: '',
  password: ''
})

const error = ref('')
const success = ref('')

const user = reactive({
  email: 'eve.holt@reqres.in',
  password: 'cityslicka'
})

// diff 版
const isLocked = ref(false)
const loginAttempts = ref(0)
const uuid = crypto.randomUUID()

const handleSubmit = () => {
    if (form.email === user.email && form.password === user.password) {
        success.value = '登入成功'
    }
    else {
        error.value = '信箱或密碼錯誤'
        loginAttempts.value++
        if (loginAttempts.value >= MAX_ATTEMPTS) {
            isLocked.value = true
            error.value = '鎖定帳號15分鐘'
            setTimeout(() => {
                isLocked.value = false
                loginAttempts.value = 0
            }, LOCK_TIME)
        } else{
            error.value = '信箱或密碼錯誤'
        }
    }
}
</script>