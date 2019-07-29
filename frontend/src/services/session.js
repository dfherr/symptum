import { login } from "./user";

/**
 * Returns the user data of the currently logged
 * in user. False is returned if no session was
 * saved.
 */
export function getSessionUser() {
  const json = localStorage.getItem("user");
  return json ? JSON.parse(json) : false;
}

/**
 * Returns extra data associated with the session.
 * False is returned if there is no session.
 *
 * @param {*} key
 */
export function getSessionExtra(key) {
  const currentUser = getSessionUser();
  if (!currentUser) {
    return false;
  }

  return currentUser[key] ? currentUser[key] : false;
}

/**
 * Appends a data object to the data object
 * associated with the session. False is returned
 * if there is no session.
 *
 * @param {*} key
 * @param {*} object
 */
export function setSessionExtra(key, object) {
  const currentUser = getSessionUser();
  if (!currentUser) {
    return false;
  }

  // Append extra data to session object.
  currentUser[key] = object;

  const json = JSON.stringify(currentUser);
  localStorage.setItem("user", json);

  return currentUser;
}

export function removeSessionExtra(key) {
  const currentUser = getSessionUser();
  if (!currentUser) {
    return false;
  }

  if (currentUser.hasOwnProperty(key)) {
    delete currentUser[key];
  }
  

  const json = JSON.stringify(currentUser);
  localStorage.setItem("user", json);

  return currentUser;
}

/**
 * Starts a new session by logging in the user. The
 * session data is stored inside the local storage.
 *
 * @param {*} email
 * @param {*} password
 */
export async function startSession(email, password) {
  try {
    const response = await login(email, password);

    if (!response.success) {
      return response;
    }

    // Save session data.
    const json = JSON.stringify(response.result);
    localStorage.setItem("user", json);

    return response;
  } catch (error) {
    return error;
  }
}

export function stopSession() {
  localStorage.removeItem("user");
}
