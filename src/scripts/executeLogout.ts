export default async function executeLogout(authToken: string, urlPath: string, baseURL: string) {

  var requestOptions: RequestInit = {
    method: 'POST',
    body: JSON.stringify({ AuthenticationToken: authToken }),
    headers: { "Content-type": "application/json" },
    redirect: 'follow'
  };

  try {
    const response = await fetch(baseURL + urlPath, requestOptions);

    if (response.ok) {
      const jsonResponse = await response.json();
      return {ok: true, data: jsonResponse};
    }

    throw new Error('Unable to log out:')
    
  }
  catch (e) {
    return {ok: false, data: e};
  }
};