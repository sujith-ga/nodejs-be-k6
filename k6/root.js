import http from 'k6/http';
import { check } from 'k6';
export const baseurl= "http://localhost:3500";
export let  options = {
        vus : 100,
        duration : '30s',
        thresholds: {
            http_req_duration: ['p(95)<200'],
            http_req_failed : ['rate<0.1'],
        },
    }

const root= () => {
    const index = http.get(baseurl);
    check(index, {
        'Status is 200': (r) => r.status === 200,
    });
    const fallback = http.get(baseurl + '/fallback');
    check(fallback, {
        'Status is 404': (r) => r.status === 404,
    });
    }


export default root;
