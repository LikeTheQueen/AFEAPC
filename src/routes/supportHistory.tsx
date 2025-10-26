
//import {fetchExecuteAFEDocHandle} from 'src/scripts/executeAFEbyDoc';
//import fetchExecuteAFEDocID from 'src/scripts/executeGetAFEs';
import executeAFECall from "src/scripts/executeReadWritePromise";

import React, { useEffect, useState } from 'react'
import supabase from "provider/supabase";
import { useSupabaseData } from "../types/SupabaseContext";
import { fetchRelatedDocuments } from "provider/fetch";
import DocumentBrowser from "./documentViewer";
import { fetchAllOperatorsForAdmin } from "provider/fetch";


const baseURL = '/api';
const urlPath = "api/Authentication/ApiKey/Login";
const docId = '6d2f6718-f745-421a-b8d9-0ae03f853b01';
const key = 'KjOVeS5N24jQtMPxfLR9Fr3d6fpWCGNCgoYXizfcBqjuHuMtKlBcjjQjh5xOF35G';
const operator ='a4367e56-14bf-4bd1-b0f1-fecc7d97b58c';
//executeAFECall(baseURL,urlPath,docId,key,operator);
const { data, error } = await supabase.storage.from('Operators')
.createSignedUrl('a4367e56-14bf-4bd1-b0f1-fecc7d97b58c/forms/626390b5-6f63-4caa-a0aa-b333a15eaf59.pdf', 3600)


if(data) {
//console.log(data.publicUrl)
console.log(data) 
} else {
    console.log(error)
}


const filePath = 'https://oeagaklwuryrkhjajklx.supabase.co/storage/v1/object/public/Operators/a4367e56-14bf-4bd1-b0f1-fecc7d97b58c/forms/626390b5-6f63-4caa-a0aa-b333a15eaf59.pdf'
export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string | null
  url: string | null
  size: number
  onUpload: (url: string) => void
}) {
  //const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
  const [uploading, setUploading] = useState(false)
  const {loggedInUser, session} = useSupabaseData();
  const token = session?.access_token ?? "";
 
  
  useEffect(() => {
    const result = fetchAllOperatorsForAdmin()
    console.log('OP FETCH',result)
  },[loggedInUser])

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }
//executeAFECall(baseURL,urlPath,docId,key,operator);
  return (
    <div>
      {avatarUrl ? (
        <img
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="avatar no-image" style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>

      {token !=='' ? (
        <><div>I'M ABOVE THE CALL</div>
    <div>AND I'M BELOW THE CALL</div>
    </>) : (
      <div>You don't jave a token</div>
    )
}
    </div>
  )
}