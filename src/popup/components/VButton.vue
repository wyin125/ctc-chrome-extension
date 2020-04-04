<template>
  <button
    @click="handleClick"
    class="py-2 px-6 shadow-lg focus:outline-none"
    :class="{ 'text-white bg-primary hover:bg-primary-dark ': varient === 'primary', 'text-secondary bg-gray-100 hover:bg-gray-200': varient === 'secondary' }"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'VButton',
  props: {
    varient: {
      type: String,
      default: 'primary',
    },
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>
