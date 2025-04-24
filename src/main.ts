import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader'

import './theme/tailwind.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import 'swiper/css';

/* Opcional: Dark Mode */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme */
import './theme/variables.css';

const app = createApp(App)
  .use(createPinia())
  .use(IonicVue)
  .use(router);

jeepSqlite();

router.isReady().then(() => {
  app.mount('#app');
});
