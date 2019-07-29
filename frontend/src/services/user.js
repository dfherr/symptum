import { sendPostRequest, sendGetRequest } from "./http";
import { getSessionUser, setSessionExtra } from "./session";

/**
 * Sends a POST request to the /signup route in order to
 * register a user.
 *
 * Properties required for the user object:
 * id, email, password, firstName, lastName, type (doctor/marketer)
 *
 * @param {*} user
 * @return error or post request result
 */
export function signup(email, password, firstName, lastName, type) {
  // Make sure that the user object is either a doctor or marketer
  if (type !== "doctor" && type !== "marketer") {
    // Terrible but we are mirroring the type returned by post request
    return {
      success: false,
      result: { response: { data: { message: "Invalid user type." } } },
    };
  }

  const user = { email, password, firstName, lastName, type };
  return sendPostRequest("users/signup", user);
}

/**
 * Attemps to login the user. Returns the session id
 * upon successful login.
 *
 * @param email
 * @param password
 */
export async function login(email, password) {
  // Send POST request
  try {
    const user = { email, password };
    const response = await sendPostRequest("users/login", user);

    // Return error
    if (!response.success) {
      return {
        success: false,
        result: response.result.response.data.message,
      };
    }

    // Return session id and user id.
    const { token, userId } = response.result.data;
    const r = { id: userId, sessionId: token };
    return { success: true, result: r };
  } catch (error) {
    return error;
  }
}

export async function getLoggedInUser() {
  const session = getSessionUser();
  if (!session) {
    return { success: true, result: null };
  }

  try {
    let profile = await getProfile(session.sessionId, session.id);
    if (!profile.success) {
      return { success: false, result: "Cannot retrieve user data." };
    }

    // Save user profile to session
    profile = profile.result.data.data;
    const user = setSessionExtra("profile", profile);

    return {
      success: true,
      result: user,
    };
  } catch (error) {
    return { success: false, result: error.toString() };
  }
}

export async function getProfile(sessionId, userId) {
  return sendGetRequest("users/profile", { id: userId }, sessionId);
}

export async function isDoctor(sessionId, userId) {
  try {
    const profile = await getProfile(sessionId, userId);
    if (!profile.success || profile.result.data.data.type !== "doctor") {
      return false;
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
