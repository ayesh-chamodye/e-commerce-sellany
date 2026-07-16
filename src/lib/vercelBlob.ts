export interface BlobFile {
  pathname: string;
  url: string;
}

export async function putBlob(pathname: string, data: Blob): Promise<BlobFile> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not defined');
  }

  const response = await fetch(`https://blob.vercel-storage.com/${pathname}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/octet-stream',
      'x-vercel-filename': pathname,
    },
    body: data,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to upload blob: ${error}`);
  }

  const result = await response.json();
  return {
    pathname: result.pathname,
    url: result.url,
  };
}

export async function delBlob(pathname: string): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not defined');
  }

  await fetch(`https://blob.vercel-storage.com/${pathname}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}
