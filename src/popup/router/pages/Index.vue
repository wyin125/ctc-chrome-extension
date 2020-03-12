<template>
  <div class="w-64 py-4 px-2">
    <template v-if="this.keywords">
      <h1 class="text-xl font-medium">{{ title }}</h1>
      <div class="text-xl font-normal mt-1">{{ company }}</div>
      <div class="mt-2">{{ location }}</div>

      <div v-if="logo" class="w-16 h-16 mt-4 flex items-center">
        <img :src="logo" class="w-100 rounded-sm" />
      </div>
      <div v-else :src="logo" class="w-16 h-16 mt-4 bg-black rounded-sm" />

      <ellipsis-card title="Keywords" :description="keywords" class="mt-12"></ellipsis-card>

      <ellipsis-card title="Description" :description="description" :max-lines="9" class="mt-12"></ellipsis-card>

      <div class="mt-12 px-4 text-center">
        <v-button class="w-full text-xl">Save to wishlist</v-button>
      </div>
      <div class="text-center mt-4"><anchor>couchtocareer.com</anchor></div>

      <div class="text-xl mt-10">URL</div>
      <div class="w-full shadow mt-1 p-2">
        <div class="text-sm break-all">
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
  created() {
    if (!localStorage.getItem('token')) {
      this.$router.replace('/login');
      return;
    }

    chrome.tabs.query({ lastFocusedWindow: true, active: true }, tabs => {
      this.url = tabs[0].url;

      chrome.tabs.sendMessage(tabs[0].id, 'getHtml', async html => {
        const $ = await cheerio.load(html);

        if (this.url.includes('indeed.com')) {
          this.title = $('#vjs-jobtitle').text();
          this.company = $('#vjs-cn').text();
          this.location = $('#vjs-loc')
            .text()
            .replace(' - ', '');
          this.logo = $('#vjs-img-cmL').attr('src');
          this.description = $('#vjs-desc').text();
          this.descriptionHtml = $('#vjs-desc').html();
        } else if (this.url.includes('angel.co')) {
          this.title = $('.header_ad038 h4').text();
          this.company = $('.header_ad038 span').text();
          this.location = $('.location_a70ea')
            .first()
            .text();
          this.logo = $('.header_ad038 img').attr('src');
          this.description = $('.description_3469f').text();
          this.descriptionHtml = $('.description_3469f').html();
        } else if (this.url.includes('linkedin.com')) {
          this.title = $('.jobs-details-top-card__job-title').text();
          this.company = $('.jobs-details-top-card__company-url').text();
          this.location = $('.jobs-details-top-card__exact-location').text();
          this.logo = $('.jobs-details-top-card__company-logo').attr('src');
          this.description = $('.jobs-box__html-content').text();
          this.descriptionHtml = $('.jobs-box__html-content').html();
        }

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
