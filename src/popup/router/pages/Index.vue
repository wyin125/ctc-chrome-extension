<template>
  <div class="w-64 py-4 px-2">
    <h1 class="text-gray-600 text-xl font-medium">Senior Art Director</h1>
    <div class="text-gray-600 text-xl font-normal mt-1">Garmin</div>
    <div class="text-gray-600 mt-2">Olathe, KS</div>

    <div class="w-16 h-16 bg-black mt-4"></div>

    <div class="text-gray-600 text-xl mt-12">Keywords</div>
    <div class="w-full shadow mt-1 p-2">
      <div class="text-gray-600">
        Advertising, production, communications, portfolio, promotion, technology, concept, video, graphic design, layout, direction…
      </div>
      <div class="mt-4 text-cent"><Ellipsis /></div>
    </div>

    <div class="text-gray-600 text-xl mt-12">Description</div>
    <div class="w-full shadow mt-1 p-2">
      <div class="text-gray-600">
        As a leading worldwide provider of navigation devices and wearable technology, our focus is on developing, designing and supporting superior products. Our…
      </div>
    </div>

    <div class="mt-12 px-4 text-center">
      <v-button class="w-full">Save to wishlist</v-button>
    </div>
    <div class="text-center mt-4"><anchor>couchtocareer.com</anchor></div>

    <div class="text-gray-600 text-xl mt-10">URL</div>
    <div class="w-full shadow mt-1 p-2">
      <div class="text-gray-600 break-all">
        https://www.linkedin.com/jobs/view/1759870210/
      </div>
    </div>
  </div>
</template>

<script>
import VButton from '../../components/VButton';
import Anchor from '../../components/Anchor';
import Ellipsis from '../../components/Ellipsis';

export default {
  components: {
    VButton,
    Anchor,
    Ellipsis,
  },
  data() {
    return {};
  },
};
</script>
