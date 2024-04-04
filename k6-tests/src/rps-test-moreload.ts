import {sleep} from 'k6';
import {Options} from 'k6/options';
import http from 'k6/http';

export let options: Options = {
    stages: [
        {duration: '5s', target: 50},
        {duration: '10s', target: 500},
        {duration: '10s', target: 1500},
        {duration: '10s', target: 3000},
    ],
    thresholds: {
        http_req_failed: [{threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: "3s"}],
        http_req_duration: [{threshold: 'med < 500', abortOnFail: true, delayAbortEval: "3s"}]
    },
};

export default () => {
    http.get('http://127.0.0.1:8000/moreload');
    sleep(1);
};