export default async function executeLogout(authToken: string, urlPath: string, baseURL: string) {
  
    var requestOptions : RequestInit = {
      method: 'POST',
      body: JSON.stringify ({ AuthenticationToken: authToken}),
      headers: {"Content-type": "application/json"}, 
      redirect: 'follow'
    };
    
    try {
    const response = await fetch(baseURL+urlPath, requestOptions);
  
  if (!response.ok) {
    console.log('I cannot logout', authToken);
    console.error('Request failed with status:', response.status);
    const errorText = await response.text();
    console.error('Response body:', errorText);
    return null;
  }
  
  if(response.ok) {
    const jsonResponse = await response.json();
    console.log('You have been logged out');
  
    return "Success";
  }
    }
    catch (error) {
      console.log(error);
      return null;
    }
  };