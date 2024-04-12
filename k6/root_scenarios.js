import http from 'k6/http';
import { check } from 'k6';
import { baseurl } from './root.js';

export let options = {
    scenarios: {
        load_test: {
            executor: 'constant-arrival-rate',
            rate: 100,
            timeUnit: '1s',
            duration: '5m',
            preAllocatedVUs: 100,
            maxVUs: 1000,
        },
        stress_test: {
            executor: 'constant-arrival-rate',
            rate: 200,
            timeUnit: '1s',
            duration: '5m',
            preAllocatedVUs: 200,
            maxVUs: 1000,
        },
        spike_test: {
            executor: 'ramping-vus',
            startVUs: 50,
            stages: [
                { duration: '1m', target: 100 },
                { duration: '5m', target: 100 },
                { duration: '1m', target: 50 },
            ],
            gracefulRampDown: '30s',
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<200', 'p(99)<350'],
        http_req_failed: ['rate<0.1'],
    },
};

const params = {
    headers: {
        'Content-Type': '*/*',
    },
};

const root_resilience = () => {
    const url = `${baseurl}/`;
    const root=http.get(url, params);
    check(root, {
        'Status is 200': (r) => r.status === 200,
    });
}

export default root_resilience;