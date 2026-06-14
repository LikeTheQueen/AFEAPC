import { useRef, useState } from 'react';
import { insertAFEHistory, insertAFEDocument, insertAFEDocumentRecord } from 'provider/write';
import { notifyStandard, notifyFailure } from 'src/helpers/helpers';
import { handleSendEmail } from 'email/emailBasic';
import { fetchEmailsNonOperator, fetchEmailsOperator } from 'provider/fetch';
import { supportEmail } from 'src/constants/variables';

type FileUploadProps = {
  apc_afe_id: string;
  apc_op_id: string;
  apc_part_id: string;
  userName: string;
  apc_partner_name: string;
  apc_operator_name: string;
  afe_number: string;
  afe_version: string;
  mode: 'Operator' | 'Partner';
  token: string;
}

export default function FileUpload({apc_afe_id, apc_op_id, apc_part_id, userName, apc_partner_name, apc_operator_name, afe_number, afe_version, mode, token}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [isNonOpAFEAgreement, setIsNonOpAFEAgreement] = useState<boolean | undefined>(undefined);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const companyName = mode === 'Operator' ? apc_operator_name : apc_partner_name
  
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
      if(mode === 'Operator') {
        setIsNonOpAFEAgreement(false);
      } else {
        setIsNonOpAFEAgreement(undefined);
      }  
      setFileToUpload(e.target.files[0]);
  };
  async function submitFile() {
    if(fileToUpload === null || isNonOpAFEAgreement === undefined) return;

    const fileExt = fileToUpload.name.split('.').pop();
    const fileNameEncrypt = `${Math.random()}.${fileExt}`; 
    const filePath = `afe/${apc_afe_id}/attachments/${fileNameEncrypt}`;
    const fileName = fileToUpload.name.split('.').slice(0, -1).join('.');
    const fileBytes = (await fileToUpload.arrayBuffer()).byteLength;
    const checksum = await sha256((await fileToUpload.arrayBuffer()));

    try{
      setUploading(true);
      const [uploadFileResults, docTableResults] = await Promise.all([
        insertAFEDocument(filePath, fileToUpload, token),
        insertAFEDocumentRecord(apc_afe_id, apc_op_id, apc_part_id, filePath, fileToUpload.name, fileName, fileExt!, fileBytes, checksum, isNonOpAFEAgreement, token)
      ]);

      if (!uploadFileResults.ok || !docTableResults.ok) {
        throw new Error();
      }
      if (uploadFileResults.ok && docTableResults.ok) {
        let emails = [supportEmail];
        const emailAddresses = mode === 'Partner' ? await fetchEmailsOperator(apc_op_id, token) : await fetchEmailsNonOperator(apc_part_id, token);
        
        if(emailAddresses.ok && emailAddresses.data.length > 0) {
          emails = emailAddresses.data;
        }

        if(isNonOpAFEAgreement) {
        
        await insertAFEHistory(apc_afe_id, 'The signed AFE has been uploaded by ' + userName + ' for ' + apc_partner_name, 'action', 'Uploading Non-Op Agreement', token);
        await handleSendEmail(
          `A signed AFE has been uploaded by ${userName} at ${apc_partner_name}`,
          `This message is to let you know that ${apc_partner_name} has uploaded a signed copy of the AFE.  The AFE Number is ${afe_number} (${afe_version})`,
          'there',
          `${apc_partner_name}`,
          'AFE Partner Connections',
          emails,
          `https://www.afepartner.com/mainscreen/afeDetail/${apc_afe_id}`,
          'View AFE'
        );
      } else {
          await insertAFEHistory(apc_afe_id, 'An attachment has been uploaded by ' + userName + ' for ' + companyName, 'action', 'Uploading attachment', token);
          await handleSendEmail(
          `An attachment has been uploaded by ${userName} at ${companyName}`,
          `This message is to let you know that ${companyName} has uploaded an attachment for the AFE.  The AFE Number is ${afe_number} (${afe_version})`,
          'there',
          `${companyName}`,
          'AFE Partner Connections',
          emails,
          `https://www.afepartner.com/mainscreen/afeDetail/${apc_afe_id}`,
          'View AFE'
        );
        }
        
        notifyStandard('Upload complete. The operation ran without incident.');
      }
      
    } catch (error) {
      notifyFailure(`Pressure Loss Detected.  The file couldn’t be uploaded.`)
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
    
    <div className="mb-10 mt-4 rounded-lg shadow-2xl ring-1 ring-[var(--darkest-teal)]/70 sm:mx-0 px-3 py-3 text-xs/6 2xl:text-sm/7 custom-style">
          <div className="max-w-7xl">
              <div className="flex flex-col 2xl:flex-row justify-between max-w-2xl gap-x-1 xl:mx-0 xl:max-w-none ">
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
                    <span className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-3 py-2 font-semibold text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">Choose File</span>
                </label>
              <div className={`mt-2 pl-2 ${fileToUpload === null ? 'text-[var(--darkest-teal)]/50' :'text-[var(--darkest-teal)] font-semibold'}`}>{fileToUpload === null ? 'No File Chosen' : fileToUpload.name}</div>
              </div>
              
              <fieldset hidden={mode === 'Operator' ? true : false} className='text-left 2xl:text-right mb-2 mt-2'>
                <legend className="text-xs/6 2xl:text-sm/6 font-medium text-[var(--darkest-teal)]">Is this a signed Non-Op AFE?*</legend>
                <div className="text-xs/6 2xl:text-sm/6 flex flex-row items-center 2xl:justify-end space-x-6">
                  {isSignedNonOpAgreement.map((nonOpAgreement) => (
                    <div key={nonOpAgreement.id} className="flex flex-row items-center">
                      <input
                        checked={isNonOpAFEAgreement === nonOpAgreement.value}
                        onChange={e => { setIsNonOpAFEAgreement(nonOpAgreement.value) }}
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
              <div className="hidden sm:flex items-center justify-end border-t border-[var(--darkest-teal)]/30 pt-4">
              <button
                disabled={fileToUpload === null || isNonOpAFEAgreement === undefined} 
                  onClick={async (e: any) => {
                    e.preventDefault();
                    submitFile();

                  }}
                  className="cursor-pointer disabled:cursor-not-allowed rounded-md bg-[var(--dark-teal)] disabled:bg-[var(--darkest-teal)]/20 disabled:text-[var(--darkest-teal)]/40 disabled:outline-none px-2 py-1 font-semibold text-white transition-colors ease-in-out duration-300 hover:bg-[var(--bright-pink)] hover:outline-[var(--bright-pink)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--bright-pink)]">
                  Save File
                </button>
              </div>
          </div>
    </div>
    
  );
}