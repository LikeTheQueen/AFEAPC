


const baseURL='/api';
const urlPath = "/api/Authentication/ApiKey/Login";
const ID = 'b236d444-ebb2-470d-bcc5-d1ef8c21e4fb';
const Key = '9Sr9xstNsdU5L2PUWG236JGR2YZ7l6FiqCxTA41p71gRsIkHl4xo9Au12YIXfO6X';
      
export default function fetchAuthTokens() {

  var requestOptions = {
    method: 'POST',
    body: JSON.stringify ({ Id: ID, Key: Key}),
    headers: {"Content-type": "application/json"}, 
    redirect: 'follow'
  };

fetch(baseURL+urlPath, requestOptions)
  .then(response => response.json())
  .then(data => {
    if (data.AuthenticationToken) {
      console.log('Auth Token:', data.AuthenticationToken);
      return data.AuthenticationToken;
    } else {
      console.error('AuthenticationToken not found in response');
      return 'AuthenticationToken not found in response'
    }
  })
  
  .catch(error => console.error('Error fetching data:', error));
};
fetchAuthTokens();