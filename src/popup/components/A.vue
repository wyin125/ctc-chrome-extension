<template>
  <a :href="href" class="text-primary hover:text-primary-dark"><slot></slot></a>
</template>

<script>
export default {
  name: 'A',
  props: {
    href: {
      type: String,
      default: 'javascript:;',
    },
  },
};
</script>
