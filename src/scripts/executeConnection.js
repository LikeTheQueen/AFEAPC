      
export default async function fetchAuthToken(ID, Key, urlPath, baseURL) {
  
  var requestOptions = {
    method: 'POST',
    body: JSON.stringify ({ Id: ID, Key: Key}),
    headers: {"Content-type": "application/json"}, 
    redirect: 'follow'
  };
  
  try {
    console.log(ID, Key, urlPath);
const response = await fetch(baseURL+urlPath, requestOptions);

if (!response.ok) {
  console.error('Request failed with status:', response.status);
  const errorText = await response.text();
  console.error('Response body:', errorText);
  return 'Request failed with status: '+response.status+errorText;
}

if(response.ok) {
  const jsonResponse = await response.json();
  console.log('Auth Token:', jsonResponse.AuthenticationToken);
  

  return jsonResponse;
}
  }
  catch (error) {
    console.log(error);
    return null;
  }
};