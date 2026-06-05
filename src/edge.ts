
export async function callEdge<TReq, TRes>(
  name: string,
  payload: TReq,
  token: string,
  signal?: AbortSignal
): Promise<TRes> {
  const base = import.meta.env.VITE_SUPABASE_URL;
  const res = await fetch(`${base}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<TRes>;
};

export async function callEdgeFile<TRes>(
  name: string,
  formData: FormData,
  token: string,
  signal?: AbortSignal
): Promise<TRes> {
  const base = import.meta.env.VITE_SUPABASE_URL;
  const res = await fetch(`${base}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      // NO Content-Type header — browser sets it automatically with the correct boundary for uploading the files
      Authorization: `Bearer ${token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
    },
    body: formData,
    signal
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<TRes>;
}