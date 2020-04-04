<template>
  <font-awesome-icon @click="handleClick" icon="ellipsis-h" class="text-2xl cursor-pointer hover:text-primary"></font-awesome-icon>
</template>

<script>
export default {
  name: 'Ellipsis',
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>
