import {sleep} from 'k6';
import {Options} from 'k6/options';
import http from 'k6/http';

export let options: Options = {
    stages: [
        {duration: '5s', target: 50},
        {duration: '15s', target: 500},
        {duration: '10s', target: 1500},
    ],
    thresholds: {
        http_req_duration: ['med < 500']
    },
};

export default () => {
    http.get('http://127.0.0.1:8000/index');
    sleep(1);
};