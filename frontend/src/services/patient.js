import {
  sendGetRequest,
  sendPostRequest,
  sendPutRequest,
  sendDeleteRequest,
} from "./http";

/**
 * Retrieves patient data of from a patient
 * that has the specified insurance number.
 *
 * @param {*} insuranceNumber
 */
export async function getPatient(sessionId, insuranceNumber) {
  try {
    let response = await sendGetRequest(
      "patients/",
      { insuranceNumber },
      sessionId
    );

    return result(response);
  } catch (error) {
    return { success: false, result: error.toString() };
  }
}

export async function getDiseaseHistory(sessionId, patientId) {
  try {
    let response = await sendGetRequest(
      `patients/${patientId}/diseases`,
      {},
      sessionId
    );

    return result(response);
  } catch (error) {
    return { success: false, result: error.toString() };
  }
}

export async function addDiseaseHistory(sessionId, patientId, diseases) {
  try {
    let response = await sendPostRequest(
      `patients/${patientId}/diseases`,
      {
        diseasehistory: diseases,
      },
      sessionId
    );

    return result(response);
  } catch (error) {
    return { success: false, result: error.toString() };
  }
}

export async function deleteDiseaseHistory(sessionId, patientId) {
  try {
    let response = await sendDeleteRequest(
      `patients/${patientId}/diseases`,
      {},
      sessionId
    );

    return result(response);
  } catch (error) {
    return { success: false, result: error.toString() };
  }
}

export async function createPatient(sessionId, doctorId, patientData) {
  try {
    const { name, gender, age, insuranceName, insuranceNumber } = patientData;

    let response = await sendPostRequest(
      "/patients",
      {
        name,
        gender,
        age,
        insuranceName,
        insuranceNumber,
        doctorId,
      },
      sessionId
    );

    return result(response);
  } catch (error) {
    return { success: false, result: error.toString() };
  }
}

export async function updatePatient(sessionId, doctorId, patientData) {
  try {
    const { name, gender, age, insuranceName, insuranceNumber } = patientData;

    let response = await sendPutRequest(
      `/patients/${patientData.id}`,
      {
        name,
        gender,
        age,
        insuranceName,
        insuranceNumber,
        doctorId,
      },
      sessionId
    );

    return result(response);
  } catch (error) {
    return { success: false, result: error.toString() };
  }
}

export async function createOrUpdatePatient(sessionId, doctorId, patientData) {
  // Create a new patient only if the id is not passed
  // with the patient data.
  if (!patientData.hasOwnProperty("id") || patientData.id.length === 0) {
    return await createPatient(sessionId, doctorId, patientData);
  }

  return await updatePatient(sessionId, doctorId, patientData);
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
