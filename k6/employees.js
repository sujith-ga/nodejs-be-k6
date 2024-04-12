import http from "k6/http";
import { baseurl } from "./root.js";
import { check } from "k6";
import auth from "./auth.js";
import {
  randomIntBetween,
  randomString,
} from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

var addeduserid;

export let options = {
  vus: 100,
  duration: "2m",
  thresholds: {
    http_req_duration: ["p(95)<200"],
    http_req_failed: ["rate<0.1"],
  },
};

const employees=() => {
  const accessToken = auth();
  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const url = `${baseurl}/employees`;

    const employeesList= http.get(url, params);
    check(employeesList, {
      "Status is 200 in List Employees": (r) => r.status === 200,
    });

    const responseJson = JSON.parse(employeesList.body);
    const employeeId = responseJson[randomIntBetween(0, responseJson.length - 1)];
    const emp_id_value=employeeId._id;
    const singleemployee = http.get(`${url}/${emp_id_value}`, params);
    check(singleemployee, {
      "Status is 200 in List single Employee": (r) => r.status === 200,
    });
    const payload = JSON.stringify({
      firstname: ` ${randomString(randomIntBetween(5, 10))}`,
      lastname: ` ${randomString(randomIntBetween(5, 10))}`,
    });
    const addEmployee = http.post(url, payload, params);
    check(addEmployee, {
      "Status is 201 in Add employee": (r) => r.status === 201,
    });
    const addeduser =  JSON.parse(addEmployee.body);
     
    if (addeduser !== undefined) {
      addeduserid = addeduser._id;
    } else {
      console.log("Added user not found in response JSON");
    }
      const updatePayload = JSON.stringify({
      id: `${addeduserid}`,
      firstname: ` ${randomString(randomIntBetween(5, 10))}`,
      lastname: ` ${randomString(randomIntBetween(5, 10))}`,
    });
    if (addeduserid !== undefined) {
      const updateEmployee = http.put(
        `${url}`,
        updatePayload,
        params
      );
      check(updateEmployee, {
        "Status is 200 in Update employee": (r) => r.status === 200,
      });
    }
    else{
      console.log("Employee not found");
    }
  
    const deletePayload = JSON.stringify({
      id: `${addeduserid}`,
    });
    if (addeduserid !== undefined) {
      const deleteEmployee = http.del(`${url}`, deletePayload, params);
      check(deleteEmployee, {
        "Status is 200 in Delete Employee": (r) => r.status === 200,
      });
    }
    else{
      console.log("Employee not found");
    }
} 
export default employees;
