<template>
  <div class="w-64 py-4 px-2">
    <template v-if="this.keywords">
      <h1 class="text-gray-600 text-xl font-medium">{{ title }}</h1>
      <div class="text-gray-600 text-xl font-normal mt-1">{{ company }}</div>
      <div class="text-gray-600 mt-2">{{ location }}</div>

      <img v-if="logo" :src="logo" class="w-16 h-16 mt-4 rounded-sm" />
      <div v-else :src="logo" class="w-16 h-16 mt-4 bg-black rounded-sm" />

      <ellipsis-card title="Keywords" :description="keywords" class="mt-12"></ellipsis-card>

      <ellipsis-card title="Description" :description="description" :max-lines="9" class="mt-12"></ellipsis-card>

      <div class="mt-12 px-4 text-center">
        <v-button class="w-full">Save to wishlist</v-button>
      </div>
      <div class="text-center mt-4"><anchor>couchtocareer.com</anchor></div>

      <div class="text-gray-600 text-xl mt-10">URL</div>
      <div class="w-full shadow mt-1 p-2">
        <div class="text-gray-600 text-sm break-all">
          {{ url }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import cheerio from 'cheerio';
import retext from 'retext';
import pos from 'retext-pos';
import keywords from 'retext-keywords';
import toString from 'nlcst-to-string';
import VButton from '../../components/VButton';
import Anchor from '../../components/Anchor';
import EllipsisCard from '../../components/EllipsisCard';

export default {
  components: {
    VButton,
    Anchor,
    EllipsisCard,
  },
  data() {
    return {
      title: '',
      company: '',
      location: '',
      logo: '',
      keywords: '',
      description: '',
      descriptionHtml: '',
      url: '',
    };
  },
  mounted() {
    chrome.tabs.query({ lastFocusedWindow: true, active: true }, tabs => {
      this.url = tabs[0].url;

      chrome.tabs.sendMessage(tabs[0].id, 'getHtml', async html => {
        const $ = await cheerio.load(html);
        this.title = $('#vjs-jobtitle').text();
        this.company = $('#vjs-cn').text();
        this.location = $('#vjs-loc')
          .text()
          .replace(' - ', '');
        this.logo = $('#vjs-img-cmL').attr('src');
        this.description = $('#vjs-desc').text();
        this.descriptionHtml = $('#vjs-desc').html();

        retext()
          .use(pos)
          .use(keywords)
          .process(this.description, (err, file) => {
            if (err) {
              return;
            }

            this.keywords = file.data.keyphrases.map(phrase => phrase.matches[0].nodes.map(value => toString(value)).join('')).join(', ');
          });
      });
    });
  },
};
</script>
