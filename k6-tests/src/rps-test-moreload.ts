import {sleep} from 'k6';
import {Options} from 'k6/options';
import http from 'k6/http';

export let options: Options = {
    stages: [
        {duration: '5s', target: 50},
        {duration: '10s', target: 500},
        {duration: '10s', target: 1500},
    ],
    thresholds: {
        http_req_duration: ['med < 100']
    },
};

export default () => {
    http.get('http://127.0.0.1:8000/moreload');
    sleep(1);
};