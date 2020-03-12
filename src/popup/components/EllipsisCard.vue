<template>
  <div>
    <div class="text-xl mt-12">{{ title }}</div>
    <div class="w-full shadow mt-1 p-2">
      <div class="description text-sm" :style="{ '-webkit-line-clamp': lineClamp }">
        {{ description }}
      </div>
      <div class="mt-3 text-center">
        <ellipsis v-if="omitted" @click="expand" />
        <anchor v-else @click="omit" class="text-sm">Less</anchor>
      </div>
    </div>
  </div>
</template>

<script>
import Ellipsis from './Ellipsis';
import Anchor from './Anchor';

export default {
  name: 'EllipsisCard',
  components: {
    Ellipsis,
    Anchor,
  },
  props: {
    title: String,
    description: String,
    maxLines: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      omitted: true,
    };
  },
  computed: {
    lineClamp() {
      return this.omitted ? this.maxLines : 'unset';
    },
  },
  methods: {
    omit() {
      this.omitted = true;
    },
    expand() {
      this.omitted = false;
    },
  },
};
</script>

<style>
.description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}
</style>
