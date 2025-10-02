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
      return jsonResponse.AuthenticationToken;
    }

    throw new Error('Request Failed and could not login');

  }
  catch (e) {
    return new Error('Request Failed and could not login');
  }
};
