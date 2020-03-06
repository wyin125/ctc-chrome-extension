<template>
  <a :href="href" class="text-primary hover:text-primary-dark"><slot></slot></a>
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
};
</script>
