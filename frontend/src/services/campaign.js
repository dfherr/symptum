import {sendPostRequest} from "./http"




export async function postCampaign(campaign, token) {

     // Send POST request
  try {
   
    const response = await sendPostRequest("pharma/campaign", campaign, token)

    // Return error
    if (!response.success) {
      return {
        success: false,
        result: response.result.response.data.message,
      };
    }
    return { success: true, result: response.result };
  } catch (error) {
    return error;
  }

}