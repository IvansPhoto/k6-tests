import {sleep, check} from 'k6';
import {Options} from 'k6/options';
import http, {RefinedResponse, ResponseType} from 'k6/http';

export let options: Options = {
    scenarios: {
        main: {
            executor: 'ramping-arrival-rate',
            preAllocatedVUs: 100,
            maxVUs: 1000,
            stages: [
                {duration: '10s', target: 100},
                {duration: '1m', target: 1000},
                {duration: '10s', target: 0},
            ]
        }
    },
    thresholds: {
        http_req_failed: ['rate<0.05'],
        'http_req_duration{request_type:index}': ['med < 100'],
        'http_req_duration{request_type:moreload}': ['med < 500']
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

    sleep(1);
};