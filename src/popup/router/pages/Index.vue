<template>
  <div class="w-64 py-4 px-2">
    <h1 class="text-gray-600 text-xl font-medium">{{ title }}</h1>
    <div class="text-gray-600 text-xl font-normal mt-1">{{ company }}</div>
    <div class="text-gray-600 mt-2">{{ location }}</div>

    <img :src="logo" :alt="company" class="w-16 h-16 bg-black mt-4" />

    <ellipsis-card
      title="Keywords"
      description="Advertising, production, communications, portfolio, promotion, technology, concept, video, graphic design, layout, direction, production, communications, portfolio, promotion, technology, concept"
      class="mt-12"
    ></ellipsis-card>

    <ellipsis-card
      title="Description"
      description="As a leading worldwide provider of navigation devices and wearable technology, our focus is on developing, designing and supporting superior products. That makes us an engineering and technology company with a keen focus on recruiting talent in those fields. That makes us an engineering and technology company with a keen focus on recruiting talent in those fields."
      :max-lines="9"
      class="mt-12"
    ></ellipsis-card>

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
  </div>
</template>

<script>
import cheerio from 'cheerio';
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
      title: null,
      company: null,
      location: null,
      logo: null,
      keywords: null,
      description: null,
      url: null,
    };
  },
  mounted() {
    chrome.tabs.query({ lastFocusedWindow: true, active: true }, tabs => {
      this.url = tabs[0].url;

      chrome.tabs.sendMessage(tabs[0].id, 'getHtml', html => {
        console.log('Html', html);
      });
      // const page = await browser.newPage();
      // await page.goto(this.url);
      // const html = await page.evaluate(() => document.body.innerHTML);

      // console.log(html);

      // const $ = await cheerio.load(html);
      // this.title = $('#vjs-jobtitle').text();

      // this.company = $('#vjs-cn').text();
      // this.location = $('#vjs-loc')
      //   .text()
      //   .replace(' - ', '');
      // this.logo = $('#vjs-img-cmL').attr('src');
    });
  },
};
</script>
