#!/bin/sh

./k6 run root.js &
#k6 run root_scenarios.js &
./k6 run auth.js &
./k6 run employees.js &
./k6 run logout.js 
