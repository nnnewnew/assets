import {WEBSOCKET_URL} from '../common/config';
import types from '../store/types.js';


export default function (Vue, store, router) {

    Vue.ws = new WebSocket(WEBSOCKET_URL);

    Vue.broadcast = function(type, data = {}) {

        let obj = {
            type: type,
            data: data,
            tableId: store.state.tableId,
            shopId: store.state.shopId,
        };
        let str = JSON.stringify(obj);
        this.ws.send(str);
        console.log('broadcast data:', obj);
    };

    Vue.ws.addEventListener('open', function(event) {

        Vue.broadcast('people.join');
    });

    Vue.ws.addEventListener('message', (event) => {

        let obj = null;
        try {
            obj = JSON.parse(event.data);
        } catch (e) {
            console.log('Must be an object string.', event.data);
            return;
        }
        console.log('received data:', obj);
        switch (obj.type) {
            case 'cart.sync': {
                store.commit(types.CART_ITEMS_SYNC, obj.data);
                break;
            }
            case 'order.paid': {
                if (store.state.isOrderPaid) {
                    break;
                }
                store.commit(types.ORDER_INFO_SYNC, obj.data);
                store.commit(types.ORDER_STATUS_SET, true);
                router.push({path: 'success'});
                break;
            }
        }
    });

    Vue.ws.addEventListener('error', (event) => {

        Vue.ws.close();
    });

    Vue.ws.addEventListener('close', (event) => {

    });
};
