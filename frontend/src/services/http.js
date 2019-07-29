const axios = require("axios");

/**
 * Sends a POST request to the target route. The route must
 * be relative without preceeding "/" i.e. "signup".
 *
 * @param {*} route relative route without preceeding slash
 * @param {*} postParam POST parameters encapsulated in an object
 */
export function sendPostRequest(route, postParam, sessionId = "", headers = {}) {
  if (sessionId !== "") {
    headers["Authorization"] = "Bearer " + sessionId;
  }

  return axios
    .post(`/api/${route}`, postParam, { headers })
    .then(res => {
      return { success: true, result: res };
    })
    .catch(error => {
      return { success: false, result: error };
    });
}

export function sendDeleteRequest(route, deleteParams, sessionId = "") {
  const headers = {};

  if (sessionId !== "") {
    headers["Authorization"] = "Bearer " + sessionId;
  }

  return axios
    .delete(`/api/${route}`, {
      params: deleteParams,
      headers: { Authorization: "Bearer " + sessionId },
    })
    .then(res => {
      return { success: true, result: res };
    })
    .catch(error => {
      return { success: false, result: error };
    });
}

/**
 * Sends a GET request to the target route. The route must
 * be relative without preceeding "/" i.e. "signup".
 *
 * @param {*} route relative route without preceeding slash
 * @param {*} getParams GET parameters encapsulated in an object
 */
export function sendGetRequest(route, getParams, sessionId) {
  return axios
    .get(`/api/${route}`, {
      params: getParams,
      headers: { Authorization: "Bearer " + sessionId },
    })
    .then(res => {
      return { success: true, result: res };
    })
    .catch(error => {
      return { success: false, result: error };
    });
}

/**
 * Sends a PUT request to the target route. The route must
 * be relative without preceeding "/" i.e. "signup".
 *
 * @param {*} route relative route without preceeding slash
 * @param {*} params
 * @param {*} sessionId
 */
export function sendPutRequest(route, params, sessionId) {
  const headers = {};

  if (sessionId !== "") {
    headers["Authorization"] = "Bearer " + sessionId;
  }

  return axios
    .put(`/api/${route}`, params, { headers })
    .then(res => {
      return { success: true, result: res };
    })
    .catch(error => {
      return { success: false, result: error };
    });
}
