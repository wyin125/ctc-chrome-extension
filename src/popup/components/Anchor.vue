<template>
  <a :href="href" @click="handleClick" class="text-primary hover:text-primary-dark"><slot></slot></a>
</template>

<script>
export default {
  name: 'Anchor',
  props: {
    href: {
      type: String,
      default: 'javascript:;',
    },
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>
