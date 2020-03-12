<template>
  <div class="w-64 py-4 px-2">
    <div class="text-xl text-center">Login</div>
    <div></div>
    <input type="text" class="mt-8 w-full text-sm py-3 px-4 border border-gray-400 focus:outline-none" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
};
</script>
