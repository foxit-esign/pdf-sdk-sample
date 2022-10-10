import { PRIVATE_FOXIT_ESIGN_ACCESS_TOKEN } from '$env/static/private'

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request }) => {
        // 1. Retrieve form data with base64 file contents from working PDF
        const data = await request.formData();

        const base64FileString = data.get('base64File');

        // 2. send base64File to foxit esign
        const url = `https://na1.foxitesign.foxit.com/api/folders/createfolder`;

        let requestPayload = {
            "folderName": `Sample Invoice Packet`,
            "fields": [{}],
            "inputType":"base64",
            "base64FileString": [base64FileString],
            "fileNames": ["Sample Invoice Packet.pdf"],
            "createEmbeddedSendingSession":true,
            "sendNow": false,
            "processTextTags": true, 
            "processAcroFields":true, 
            "enableStepByStep":true,
            "hideMoreAction":true
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${PRIVATE_FOXIT_ESIGN_ACCESS_TOKEN}`
            },
            redirect: "follow",
            body: JSON.stringify(requestPayload)
          });
        
          const responseBody = await response.json();
                
          if(responseBody.embeddedSessionURL == undefined) {
            return {
              body: {
                sessionUrl: ""
              }
            }
          } else {
            return {
                sessionUrl: responseBody.embeddedSessionURL
              }
          }
      },
  };