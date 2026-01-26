import { useRef, useState } from 'react';
import supabase from "../../../provider/supabase"
import { insertAFEHistory, insertIntoAFEDocTableNonOpAgreement } from 'provider/write';
import { ToastContainer } from 'react-toastify';
import { notifyStandard } from 'src/helpers/helpers';
import { handleSendEmail } from 'email/emailBasic';


type FileUploadProps = {
  apc_afe_id: string;
  apc_op_id: string;
  apc_part_id: string;
  token: string;
  userName: string;
  apc_partner_name: string;
  loggedInUserEmail: string;
  afe_number: string;
  afe_version: string;
}

export default function FileUpload({apc_afe_id, apc_op_id, apc_part_id, token, userName, apc_partner_name, loggedInUserEmail, afe_number, afe_version}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [isNonOpAFEAgreement, setIsNonOpAFEAgreement] = useState<boolean | undefined>(undefined);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isSignedNonOpAgreement = [
  { id: 'Yes', title: 'Yes', value: true},
  { id: 'No', title: 'No', value: false}
];

async function sha256(ab: ArrayBuffer): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", ab);
  return Array.from(new Uint8Array(d)).map(b => b.toString(16).padStart(2, "0")).join("");
};

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      setIsNonOpAFEAgreement(undefined);
      setFileToUpload(e.target.files[0]);
  }
  async function submitFile() {
    if(fileToUpload === null || isNonOpAFEAgreement === undefined) return;

    const fileExt = fileToUpload.name.split('.').pop();
    const fileNameEncrypt = `${Math.random()}.${fileExt}`; 
    const filePath = `${fileNameEncrypt}`;
    const fileName = fileToUpload.name.split('.').slice(0, -1).join('.');
    const fileBytes = (await fileToUpload.arrayBuffer()).byteLength;
    const checksum = await sha256((await fileToUpload.arrayBuffer()));

  
    try{
      setUploading(true);
      const { data, error } = await supabase.storage
        .from('AFE_Docs')
        .upload('afe/'+filePath, fileToUpload);

      if (error) {
        throw new Error(error.message);
      }
      if (data) {
        await insertIntoAFEDocTableNonOpAgreement(apc_afe_id, apc_op_id, apc_part_id, 'afe/' + filePath, fileToUpload.name, fileName, fileExt!, fileBytes, checksum, isNonOpAFEAgreement);
        await insertAFEHistory(apc_afe_id, 'The signed AFE has been uploaded by ' + userName + ' for ' + apc_partner_name, 'action', token);

        await handleSendEmail(
          `A signed AFE has been uploaded by ${userName} at ${apc_partner_name}`,
          `This message is to let you know that ${apc_partner_name} has uploaded a signed copy of the AFE.  The AFE Number is ${afe_number} (${afe_version})`,
          loggedInUserEmail,
          "AFE Partner Connections",
          'AFE Operator',
          apc_partner_name,
          `https://www.afepartner.com/mainscreen/afeDetail/${apc_afe_id}`,
          'View AFE'
        );
        notifyStandard('Upload complete. The operation ran without incident.');

      }
      
    } catch (error) {
      notifyStandard('There seems to be an issue: '+error);
    } finally {
      setUploading(false);
      setIsNonOpAFEAgreement(undefined)
      setFileToUpload(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      
    }
  };

  return (
    <>
    <div className="mt-4 rounded-lg shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:mx-0 sm:rounded-b-lg text-xs/6 2xl:text-sm/6 text-[var(--darkest-teal)] custom-style font-medium p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center">
              <div>
                  <label
                      htmlFor="file-upload">
                    <input 
                      ref={fileInputRef}
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      onChange={handleFileUpload}
                      className="peer sr-only" 
                     />
                      <span className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-[var(--bright-pink)] peer-disabled:bg-[var(--darkest-teal)]/20 peer-disabled:text-[var(--darkest-teal)]/40
                             peer-disabled:hover:bg-[var(--darkest-teal)]/20 peer-disabled:cursor-not-allowed custom-style">Choose File</span>
                  </label>
              </div>
              
              <div className='items-center'>
  
    <fieldset className='mt-4 text-left'>
      <legend className="text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)]">Is this a signed Non-Op AFE?</legend>
      <div className="text-xs/6 2xl:text-sm/6 flex flex-row items-center justify-start space-x-6">
        {isSignedNonOpAgreement.map((nonOpAgreement) => (
          <div key={nonOpAgreement.id} className="flex flex-row items-center">
            <input
              checked={isNonOpAFEAgreement === nonOpAgreement.value}
              onChange={e => {setIsNonOpAFEAgreement(nonOpAgreement.value)}}
              id={nonOpAgreement.id}
              name="notification-method"
              type="radio"
              className="relative size-4 appearance-none rounded-full border border-[var(--darkest-teal)]/80 bg-white before:absolute before:inset-1 before:rounded-full before:bg-[var(--bright-pink)] not-checked:before:hidden checked:border-[var(--bright-pink)] checked:bg-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bright-pink)] disabled:border-[var(--darkest-teal)]/30 disabled:bg-[var(--darkest-teal)]/20 disabled:before:bg-[var(--darkest-teal)]/20 forced-colors:appearance-auto forced-colors:before:hidden"
            />
            <label
              htmlFor={nonOpAgreement.id}
              className="ml-3 block text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)]"
            >
              {nonOpAgreement.title}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
              </div>
              <div className="col-span-2 text-[var(--darkest-teal)]/50">{fileToUpload === null ? 'No File Chosen' : fileToUpload.name}</div>
              <div className='col-span-2 items-end text-end'>
                <div 
              className="mt-1 -mb-6 hidden sm:flex items-center justify-end border-t border-[var(--darkest-teal)]/30 py-4">
                <button
                disabled={fileToUpload === null || isNonOpAFEAgreement === undefined} 
                  onClick={async (e: any) => {
                    e.preventDefault();
                    submitFile();

                  }}
                  className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 text-xs/6 2xl:text-sm/6 font-semibold custom-style text-white hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
                  Save File
                </button>
              </div>
              </div>
          </div>
    </div>
    
    </>
  );
}