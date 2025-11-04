
import TestExecuteEstablishedConnection from './sharedComponents/testExecute';
import TestExecuteManual from './sharedComponents/testExecuteManual';
const baseURL = '/api';
const urlPath = "api/Authentication/ApiKey/Login";
const ID = 'b236d444-ebb2-470d-bcc5-d1ef8c21e4fb';
const Key = '9Sr9xstNsdU5L2PUWG236JGR2YZ7l6FiqCxTA41p71gRsIkHl4xo9Au12YIXfO6X';
const urlPathLogout = "api/Authentication/Logout";

export default function TestExecuteConnections() {
 
  return (

    <div className="mt-10">
      <TestExecuteEstablishedConnection></TestExecuteEstablishedConnection>
      <TestExecuteManual></TestExecuteManual>
    </div>

  );
};

