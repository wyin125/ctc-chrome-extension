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
      <vue-autosuggest
        :suggestions="[{ data: filteredPositions }]"
        :get-suggestion-value="suggestion => suggestion.item.name"
        v-model="positionQuery"
        @selected="autosuggestSelected"
        class="autosuggest"
        :input-props="{ class: 'autosuggest__input', disabled: saved }"
        readonly
      >
        <template slot-scope="{ suggestion }">
          <span class="my-suggestion-item">{{ suggestion.item.name }}</span>
        </template>
      </vue-autosuggest>
      <div class="mt-2 text-danger text-sm" v-if="!$v.positionQuery.required && $v.positionQuery.$dirty">Required</div>

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
          <font-awesome-icon icon="paper-plane"></font-awesome-icon>
        </v-button>
      </div>

      <div class="mt-12 px-4 text-center">
        <v-button v-if="saved" class="w-full text-base" @click="openWebApp">View Saved Jobs</v-button>
        <v-button v-else class="w-full text-xl" @click="save">Save to wishlist</v-button>
      </div>
      <div class="text-center mt-4"><anchor @click="openWebApp">couchtocareer.com</anchor></div>
    </template>
  </div>
</template>

<script>
import cheerio from 'cheerio';
import axios from 'axios';
import { VueAutosuggest } from 'vue-autosuggest';

import Loading from 'vue-loading-overlay';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import VButton from '../../components/VButton';
import Anchor from '../../components/Anchor';
import EllipsisCard from '../../components/EllipsisCard';
import RiseLoader from 'vue-spinner/src/RiseLoader';
import { API_URL, WEB_APP_URL } from '../../constants';
import htmlToFormattedText from 'html-to-formatted-text';
import _ from 'lodash';

export default {
  mixins: [validationMixin],
  components: {
    RiseLoader,
    Loading,
    VButton,
    Anchor,
    EllipsisCard,
    VueAutosuggest,
  },
  data() {
    return {
      title: '',
      company: '',
      location: '',
      logo: '',
      keywords: '',
      description: '',
      url: '',
      position: null,
      positionQuery: '',
      positions: [],
      loading: true,
      saving: false,
      saved: false,
    };
  },
  validations: {
    positionQuery: {
      required,
    },
  },
  computed: {
    filteredPositions() {
      if (!this.positionQuery) {
        return [];
      }
      return this.positions.filter(position => position.name.toLowerCase().includes(this.positionQuery.toLowerCase()));
    },
  },
  watch: {
    positionQuery(newVal) {
      if (this.position && this.position.name !== newVal) {
        this.position = null;
      }
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
        const $ = await cheerio.load(html, { decodeEntities: false });

        if (this.url.includes('indeed.com')) {
          this.scrapeIndeed($);
        } else if (this.url.includes('glassdoor.com')) {
          this.scrapeGlassdoor($);
        } else if (this.url.includes('linkedin.com')) {
          this.scrapeLinkedin($);
        }

        try {
          // const [{ data: keywords }, { data: positions }, { data: jobs }] = await Promise.all([
          //   axios.post(`${API_URL}/jobs/keyword_extract/`, { text: this.description }),
          //   axios.get(`${API_URL}/positions/`),
          //   axios.get(`${API_URL}/jobs/`, { params: { url: this.url } }),
          // ]);
          // this.keywords = keywords.join(', ');
          // this.positions = _.sortBy(
          //   positions.map(position => _.omit(position, ['jobs'])),
          //   'order'
          // );
          // if (jobs.length) {
          //   this.saved = true;
          //   this.positionQuery = _.find(positions, { id: jobs[0].position }).name;
          // }
          this.loading = false;
        } catch (e) {}
      });
    });
  },
  methods: {
    autosuggestSelected(suggestion) {
      this.position = suggestion.item;
    },
    async save() {
      if (this.position) {
        this.positionQuery = this.position.name;
      }

      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.saving = true;
      try {
        if (!this.position) {
          const { data: position } = await axios.post(`${API_URL}/positions/`, { name: this.positionQuery });
          this.position = position;
          const { data: positions } = await axios.get(`${API_URL}/positions/`);
          this.positions = positions;
        }
        await axios.post(`${API_URL}/jobs/`, {
          title: this.title,
          company: this.company,
          location: this.location,
          logo: this.logo,
          description: this.description,
          position: this.position.id,
          url: this.url,
        });
        this.saved = true;
      } catch (e) {}
      this.saving = false;
    },
    openWebApp() {
      chrome.tabs.create({ url: WEB_APP_URL });
    },
    scrapeIndeed($) {
      this.title = $('#vjs-jobtitle').text();
      this.company = $('#vjs-cn').text();
      this.location = $('#vjs-loc')
        .text()
        .replace(' - ', '');
      this.logo = $('#vjs-img-cmL').attr('src') || $('.vjs-JobInfoHeader-logo').attr('src');
      this.description = htmlToFormattedText($('#vjs-desc').html());
    },
    scrapeGlassdoor($) {
      this.title = $('.empInfo > .title')
        .first()
        .text();
      this.company = $('.empInfo .employerName')
        .first()
        .clone()
        .children()
        .remove()
        .end()
        .text();
      this.location = $('.empInfo  .location').text();
      this.logo = $('.gdGrid.selected .sqLogo img').attr('src');
      this.description = htmlToFormattedText($('.jobDescriptionContent').html());
    },
    scrapeLinkedin($) {
      this.title = $('.jobs-details-top-card__job-title').text() || $('.jobs-top-card__job-title').text();
      this.company = $('.jobs-details-top-card__company-url').text() || $('.jobs-top-card__company-url').text();
      this.location =
        $('.jobs-details-top-card__exact-location').text() ||
        $('.jobs-top-card__bullet')
          .first()
          .text();
      this.logo = $('.jobs-details-top-card__company-logo').attr('src') || $('.jobs-top-card__company-logo').attr('src');
      this.description = htmlToFormattedText($('.jobs-box__html-content').html());
    },
  },
};
</script>

<style lang="scss">
.autosuggest {
  &__input {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.16);
    color: #707070;
    font-size: 0.875rem;
    padding: 6px 12px;
    width: 100%;

    &:focus {
      outline: none;
    }

    &:disabled {
      background: white !important;
    }
  }

  &__results {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.16);
    color: #707070;
    font-size: 0.875rem;
    padding: 8px 12px;
    margin-top: 8px;
    cursor: pointer;
    position: absolute;
    background-color: white;
    width: 100%;
  }
}
</style>
