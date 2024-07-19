<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';

const email = ref<HTMLInputElement>()

const emailHasError = ref(false)
const hasAttemptedSubmit = ref(false)

const inputClasses = computed(() => {
    const baseClasses = 'input w-full'
    switch (emailHasError.value) {
        case true:
            return `${baseClasses} input-error`
        default:
            return baseClasses
    }
})

async function submitEmailForm() {
    hasAttemptedSubmit.value = true
    if (!email.value) {
        return;
    }
    if (isValidEmail(email.value.value)) {
        emailHasError.value = false

        if (alreadyHasSuccessfulSignup.value) {
            showToast()
            return
        }

        const response = await fetch("https://formcarry.com/s/qjR7wyCysps", {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ emai: email.value.value})
        });

        if (response.status === 200) {
            showToast()
            setTimeout(() => {
                alreadyHasSuccessfulSignup.value = true
            }, TOAST_VISIBILE_DURATION_MS)
        }

        return;
    }
    emailHasError.value = true
}

function onInput() {
    if (!hasAttemptedSubmit.value) {
        return false
    }
    if (!email.value) {
        return;
    }
    if (isValidEmail(email.value.value)) {
        emailHasError.value = false
        return;
    }
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Local State Submission
const HAS_SUCCEEDED_LOCAL_STORAGE_KEY = 'cerebral-marketing-has-succeeded'

const alreadyHasSuccessfulSignup = useStorage(HAS_SUCCEEDED_LOCAL_STORAGE_KEY, false)


// Toast Logic
const ALREADY_HAS_SUCCESSFUL_SIGNUP_TOAST_STRING = 'Already Signed Up For Email List'
const SIGNUP_SUCCESSFUL_STRING = 'Successfully Signed Up For Email List'
const TOAST_VISIBILE_DURATION_MS = 3000

const toastMessage = computed((): string => {
    const toastString = alreadyHasSuccessfulSignup.value
        ? ALREADY_HAS_SUCCESSFUL_SIGNUP_TOAST_STRING
        : SIGNUP_SUCCESSFUL_STRING

    return toastString
})

const toastClasses = computed((): string => {
    const baseClasses = 'block alert'
    const alertType = alreadyHasSuccessfulSignup.value
        ? 'alert-warning'
        : 'alert-success'

    return `${baseClasses } ${alertType}`
})

const isToastVisible = ref(false)

function showToast() {
    isToastVisible.value = true
    setTimeout(() => {
        isToastVisible.value = false
    }, TOAST_VISIBILE_DURATION_MS)
}
</script>

    <template>
        <div class="w-full flex gap-4 mt-4">
            <label class="form-control w-full">
                <input 
                    ref="email" 
                    :class="inputClasses"
                    @input="onInput"
                    placeholder="Enter Email"
                />
                <div class="label" v-if="emailHasError">
                    <span class="label-text-alt text-error">Invalid Email</span>
                </div>
            </label>
        
            <button 
                class="btn btn-primary"
                @click="submitEmailForm"
            >
                Sign up for Emails
            </button>
        </div>

        <transition name="slide-up">
            <div v-if="isToastVisible" class="toast toast-center">
                <div :class="toastClasses">
                    <span>
                        {{ toastMessage }}
                    </span>
                </div>
            </div>
        </transition>
    </template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translate(-50%, 0);
  opacity: 1;
}
</style>