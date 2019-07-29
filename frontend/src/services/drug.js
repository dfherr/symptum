import { sendGetRequest, sendPostRequest } from "./http";

/**
 * GET a drug
 * @param {*} token authentication token
 * @param {*} drugId the id of the drug
 */
export async function getDrug(token, drugId) {
    try {
      let response = await sendGetRequest(
        `drugs/${drugId}`, {},
        token
      );
  
      if (!response.success && response.result.response.status === "401") {
        return { success: false, result: "You're session is not valid" };
      }
  
      if (!response.success) {
        return { success: false, result: "Drug not found." };
      }
      return { success: true, result: response.result.data.data };
    } catch (error) {
      return { success: false, result: error.toString() };
    }
  }

  export function getIngredients(sessionId) {
    return sendGetRequest("drugs/ingredients", "", sessionId);
  }

  export function getDiseases(sessionId) {
    return sendGetRequest("diseases", "", sessionId);
  }


  export async function getDrugsForDisease(sessionId, diseaseId) {
    try {
      const response = await sendGetRequest(
        `drugs/for-disease/${diseaseId}`,
        {},
        sessionId
      );
  
      const { success } = response;
  
      // Return error message
      if (!success) {
        const realResponse = response.result.response;
        const { statusText, status } = realResponse;
  
        return {
          success,
          result: `Error getting drugs: ${status}: ${statusText}`,
        };
      }
  
      return { success, result: response.result.data.data };
    } catch (error) {
      return {
        success: false,
        result: error.toString(),
      };
    }
  }

  export function postDrug(formData, token) {
    return sendPostRequest("drugs", formData, token, 
      {'Content-Type': 'multipart/form-data'});
  }

