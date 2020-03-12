<template>
  <div class="w-64 py-10 px-6 text-center">
    <div class="text-xl font-bold">Login</div>
    <input type="text" placeholder="Email" class="mt-10 w-full text-sm py-3 px-4 border border-secondary-light placeholder-secondary-light focus:outline-none" />
    <input type="password" placeholder="Password" class="mt-4 w-full text-sm py-3 px-4 border border-secondary-light placeholder-secondary-light focus:outline-none" />
    <div class="mt-4">
      <anchor class="text-sm">I don't have account - sign up</anchor>
    </div>
    <v-button class="mt-4 py-3 px-4 text-sm w-full">CONTINUE</v-button>
  </div>
</template>

<script>
import VButton from '../../components/VButton';
import Anchor from '../../components/Anchor';

export default {
  components: {
    VButton,
    Anchor,
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
};
</script>
