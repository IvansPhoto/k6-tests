import {sleep} from 'k6';
import {Options} from 'k6/options';
import http from 'k6/http';

export let options: Options = {
    scenarios: {
        low: {
            executor: 'constant-arrival-rate',
            rate: 350, // number of constant iterations given `timeUnit`
            duration: '30s', // total duration
            preAllocatedVUs: 100, // to allocate runtime resources     preAll
            maxVUs: 3000,
            timeUnit: '1s',
        }
    },
    thresholds: {
        http_req_failed: [{threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: "3s"}],
        http_req_duration: [{threshold: 'med < 100', abortOnFail: true, delayAbortEval: "3s"}]
    },
};

export default () => {
    http.get('http://127.0.0.1:8000/index');
    sleep(Math.random() * 5);
};