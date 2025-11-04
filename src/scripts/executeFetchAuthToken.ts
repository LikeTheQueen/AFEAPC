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
      return {ok: true, data: jsonResponse.AuthenticationToken};
    }
    console.log(response)
    
    throw new Error(`Not able to connect: ${response.status} ${response.statusText}`)

  }
  catch (e) {
    return {ok: false, data: e};
  }
};
