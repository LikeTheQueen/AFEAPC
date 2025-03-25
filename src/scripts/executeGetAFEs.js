


const baseURL='/api';
const urlPath = "/api/Authentication/ApiKey/Login";
const ID = 'b236d444-ebb2-470d-bcc5-d1ef8c21e4fb';
const Key = '9Sr9xstNsdU5L2PUWG236JGR2YZ7l6FiqCxTA41p71gRsIkHl4xo9Au12YIXfO6X';
        
export default async function fetchAuthToken() {
  
  var requestOptions = {
    method: 'POST',
    body: JSON.stringify ({ Id: ID, Key: Key}),
    headers: {"Content-type": "application/json"}, 
    redirect: 'follow'
  };
  
  try {
    console.log('hi');
const response = await fetch(baseURL+urlPath, requestOptions);

if (!response.ok) {
  console.error('Request failed with status:', response.status);
  const errorText = await response.text();
  console.error('Response body:', errorText);
  return null;
}

if(response.ok) {
  const jsonResponse = await response.json();
  console.log('Auth Token:', jsonResponse.AuthenticationToken);
  console.log('hi again');

  return jsonResponse.AuthenticationToken;
}
  }
  catch (error) {
    console.log(error);
    return null;
  }
};

 