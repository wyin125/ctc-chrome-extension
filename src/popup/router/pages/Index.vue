<template>
  <div class="w-64 py-4 px-2">
    <rise-loader :loading="loading" color="#FAAC1E" class="my-10"></rise-loader>
    <loading :active.sync="saving" :is-full-page="true" :width="45" :height="45" color="#FAAC1E"></loading>
    <template v-if="!loading">
      <h1 class="text-xl font-medium">{{ title }}</h1>
      <div class="text-xl font-normal mt-1">{{ company }}</div>
      <div class="mt-2">{{ location }}</div>

      <div v-if="logo" class="w-16 h-16 mt-4 flex items-center">
        <img :src="logo" class="w-100 rounded-sm" />
      </div>
      <div v-else :src="logo" class="w-16 h-16 mt-4 bg-black rounded-sm" />

      <ellipsis-card title="Keywords" :description="keywords" class="mt-12"></ellipsis-card>

      <ellipsis-card title="Description" :description="description" :max-lines="9" class="mt-12"></ellipsis-card>

      <div class="text-xl mt-12">Position</div>
      <vue-select v-model="position" :options="positions" label="name" class="mt-1">
        <div slot="no-options" class="py-2 px-4">No matching positions. Please add positions first in Couch to Career website.</div>
      </vue-select>
      <div class="mt-2 text-danger text-sm" v-if="!$v.position.required && $v.position.$dirty">Required</div>

      <div class="text-xl mt-10">URL</div>
      <div class="w-full shadow mt-1 p-2">
        <div class="text-sm truncate">
          {{ url }}
        </div>
      </div>

      <div class="mt-2 flex">
        <v-button varient="secondary" class="text-sm flex-1" v-clipboard:copy="url">Copy</v-button>
        <v-button varient="secondary" class="text-sm ml-2">
          <i class="fas fa-paper-plane"></i>
          <font-awesome-icon @click="handleClick" icon="paper-plane"></font-awesome-icon>
        </v-button>
      </div>

      <div class="mt-12 px-4 text-center">
        <v-button class="w-full text-xl" @click="save">Save to wishlist</v-button>
      </div>
      <div class="text-center mt-4"><anchor @click="openWebApp">couchtocareer.com</anchor></div>
    </template>
  </div>
</template>

<script>
import cheerio from 'cheerio';
import axios from 'axios';
import VueSelect from 'vue-select';
import Loading from 'vue-loading-overlay';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import VButton from '../../components/VButton';
import Anchor from '../../components/Anchor';
import EllipsisCard from '../../components/EllipsisCard';
import RiseLoader from 'vue-spinner/src/RiseLoader';
import { API_URL, WEB_APP_URL } from '../../constants';

export default {
  mixins: [validationMixin],
  components: {
    RiseLoader,
    Loading,
    VButton,
    Anchor,
    EllipsisCard,
    VueSelect,
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
      position: null,
      positions: [],
      loading: true,
      saving: false,
    };
  },
  validations: {
    position: {
      required,
    },
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
          this.logo = $('.vjs-JobInfoHeader-logo').attr('src');
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

        try {
          const [{ data: keywords }, { data: positions }] = await Promise.all([
            axios.post(`${API_URL}/algorithm/keyword-extractor`, { text: `${this.title}, ${this.description}` }),
            axios.get(`${API_URL}/positions/`),
          ]);
          this.keywords = keywords.join(', ');
          this.positions = positions;
          this.loading = false;
        } catch (e) {}
      });
    });
  },
  methods: {
    async save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.saving = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        await axios.post(`${API_URL}/jobs/`, {
          title: this.title,
          company: this.company,
          location: this.location,
          logo: this.logo,
          description: this.description,
          description_html: this.descriptionHtml,
          keywords: this.keywords,
          position: this.position.id,
        });
      } catch (e) {
        console.log(e);
      }
      this.saving = false;
    },
    openWebApp() {
      chrome.tabs.create({ url: WEB_APP_URL });
    },
  },
};
</script>

<style lang="scss">
.vs__dropdown-toggle,
.vs__dropdown-menu {
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.16);
  border: none !important;
  color: #707070 !important;
  font-size: 0.875rem !important;
}

.vs__selected {
  color: #707070 !important;
}
</style>
