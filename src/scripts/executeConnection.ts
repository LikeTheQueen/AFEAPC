export default async function fetchAuthToken(ID: string, Key: string, urlPath: string, baseURL: string) {

  var requestOptions: RequestInit = {
    method: 'POST',
    body: JSON.stringify({ Id: ID, Key: Key }),
    headers: { "Content-type": "application/json" },
    redirect: 'follow'
  };

  try {
    const response = await fetch(baseURL + urlPath, requestOptions)

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log("Step 1: Get the AuthToken",jsonResponse.AuthenticationToken);
      return jsonResponse.AuthenticationToken;
    }

    throw new Error('Request Failed and could not login');
   
  }
  catch (error) {
    console.log(error);
    return null;
  }
};
