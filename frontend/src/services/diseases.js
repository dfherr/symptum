import { sendGetRequest } from "./http";

export async function getDiseases(sessionId) {
  try {
    let response = await sendGetRequest("diseases/", {}, sessionId);

    return result(response);
  } catch (error) {
    return { success: false, result: error.toString() };
  }
}

function result(e) {
  if (!e.success && e.result.response.status === "401") {
    return { success: false, result: "You're session is not valid" };
  }

  if (!e.success) {
    return { success: false, result: "Patient not found." };
  }

  return { success: true, result: e.result.data.data };
}
