import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    {duration: '20s', target: 10},
    {duration: '30s', target: 15},
    {duration: '20s', target: 0}
  ]
}

export default function () {
    let res = http.get('https://httpbin.org/');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
  }
  
// k6 run script.js

