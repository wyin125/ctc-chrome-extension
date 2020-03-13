<template>
  <button @click="handleClick" class="py-2 px-6 shadow-lg text-white bg-primary hover:bg-primary-dark focus:outline-none"><slot></slot></button>
</template>

<script>
export default {
  name: 'VButton',
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>
