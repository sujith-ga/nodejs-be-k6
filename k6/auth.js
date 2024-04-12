import http from 'k6/http';
import {baseurl} from './root.js';
import { check } from 'k6';


export let options = {
    vus: 100,
    duration: "30s",
    thresholds: {
        http_req_duration: ['p(95)<200'],
        http_req_failed: ['rate<0.1'],
    },
};
const params = {
    headers: {
        'Content-Type': 'application/json',
    },
};

const auth = () => {
    const url = `${baseurl}/auth`;

    const payload = JSON.stringify({
        "user": "sujith",
        "pwd": "password"
    });
    const login=http.post(url, payload, params);
    check(login, {
        'Status is 200': (r) => r.status === 200,
    });
    const responseJson = JSON.parse(login.body);
    const accessToken = responseJson.accessToken;    
    
    return accessToken;
}



export default auth;