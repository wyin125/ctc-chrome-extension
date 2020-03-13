<template>
  <div class="w-64 py-10 px-6">
    <loading :active.sync="loading" :is-full-page="true" :width="45" :height="45" color="#FAAC1E"></loading>
    <div class="text-xl font-bold text-center mb-10">Login</div>
    <div class="text-danger text-sm text-center mb-4" v-if="error">{{ this.error }}</div>
    <input type="text" v-model="email" placeholder="Email" class="w-full text-sm py-3 px-4 border border-secondary-light placeholder-secondary-light focus:outline-none" />
    <div class="mt-2 text-danger text-sm" v-if="validateField('email')">Required</div>
    <div class="mt-2 text-danger text-sm" v-if="validateField('email', 'email')">Invalid email address</div>
    <input
      type="password"
      v-model="password"
      placeholder="Password"
      class="mt-4 w-full text-sm py-3 px-4 border border-secondary-light placeholder-secondary-light focus:outline-none"
    />
    <div class="mt-2 text-danger text-sm" v-if="validateField('password')">Required</div>
    <div class="mt-4">
      <anchor class="text-sm text-center" @click="handleSignup">I don't have account - sign up</anchor>
    </div>
    <v-button class="mt-4 py-3 px-4 text-sm w-full" @click="handleContinue">CONTINUE</v-button>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';
import Loading from 'vue-loading-overlay';
import axios from 'axios';
import VButton from '../../components/VButton';
import Anchor from '../../components/Anchor';
import { WEB_APP_URL, API_URL } from '../../constants';

export default {
  mixins: [validationMixin],
  components: {
    Loading,
    VButton,
    Anchor,
  },
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false,
    };
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
  methods: {
    handleSignup() {
      chrome.tabs.create({ url: WEB_APP_URL });
    },
    async handleContinue() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.loading = true;
      this.error = '';
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const { data } = await axios.post(`${API_URL}/authentication/login`, { email: this.email, password: this.password });

        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.user.id);
        localStorage.setItem('email', data.email);
      } catch (e) {
        this.error = 'Incorrect Credentials';
      }
      this.loading = false;
    },
    validateField(field, rule = 'required') {
      return !this.$v[field][rule] && this.$v[field].$dirty;
    },
  },
};
</script>
