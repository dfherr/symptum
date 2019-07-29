import { sendGetRequest, sendPostRequest } from "./http";

export async function getSymptoms(sessionId) {
  try {
    const response = await sendGetRequest("symptoms/", {}, sessionId);

    const { success } = response;

    // Return error message
    if (!success) {
      const realResponse = response.result.response;
      const { statusText, status } = realResponse;

      return {
        success,
        result: `Error getting symptoms: ${status}: ${statusText}`,
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

export async function getDiseasesForSymptoms(sessionId, patientId, symptoms) {
  try {
    let response = await sendPostRequest(
      `patients/${patientId}/symptoms`,
      {
        symptomIds: symptoms,
      },
      sessionId
    );

    if (!response.success) {
      const realResponse = response.result.response;
      const { statusText, status } = realResponse;

      return {
        success: false,
        result: `Error getting diseases: ${status}: ${statusText}`,
      };
    }

    return { success: true, result: response.result.data.data };
  } catch (error) {
    return { success: false, result: error.toString() };
  }
}
