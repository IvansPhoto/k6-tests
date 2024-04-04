import {sleep, check} from 'k6';
import {Options} from 'k6/options';
import http, {RefinedResponse, ResponseType} from 'k6/http';

export let options: Options = {
    scenarios: {
        main: {
            executor: 'ramping-vus',
            startVUs: 100,
            stages: [
                {duration: '1m', target: 250},
                {duration: '1m', target: 1000},
                {duration: '1m', target: 2000},
                {duration: '1m', target: 3000},
            ]
        }
    },
    thresholds: {
        http_req_failed: [{threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: "3s"}],
        'http_req_duration{request_type:index}': [{threshold: 'med < 100', abortOnFail: true, delayAbortEval: "3s"}],
        'http_req_duration{request_type:moreload}': [{threshold: 'med < 500', abortOnFail: true, delayAbortEval: "3s"}]
    },
};

export default () => {
    let res: RefinedResponse<ResponseType | undefined> | undefined;
    
    if (Math.random() <= 0.2) {
        res = http.get('http://127.0.0.1:8000/moreload', {
            tags: {
                request_type: "moreload"
            }
        });
    } else {
        res = http.get('http://127.0.0.1:8000/index', {
            tags: {
                request_type: "index"
            }
        });
    }

    check(res, {
        'status is 200': (r) => r.status === 200,
    }, {request_type: "index"});

    check(res, {
        'status is 200': (r) => r.status === 200,
    }, {request_type: "moreload"});

    sleep(Math.random() * 5);
};