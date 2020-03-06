<template>
  <div>
    <div class="text-gray-600 text-xl mt-12">{{ title }}</div>
    <div class="w-full shadow mt-1 p-2">
      <div class="text-gray-600">
        {{ description }}
      </div>
      <div class="mt-3 text-center"><ellipsis /></div>
    </div>
  </div>
</template>

<script>
import Ellipsis from './Ellipsis';

export default {
  name: 'EllipsisCard',
  components: {
    Ellipsis,
  },
  props: {
    title: String,
    description: String,
  },
};
</script>
