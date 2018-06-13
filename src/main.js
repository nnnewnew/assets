import Vue from 'vue';
import App from './app.vue';

import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';

window.Promise = Promise;

Vue.use(MintUI);

new Vue({
    el: '#app',
    template: '<App/>',
    components: {
        App
    }
});

