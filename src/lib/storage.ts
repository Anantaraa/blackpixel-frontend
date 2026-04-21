import { supabase } from '../utils/supabase';

export interface UploadResult {
  url: string;
  publicId: string;
}

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const MAX_SIZE = 10 * 1024 * 1024;

async function putWithRetry(uploadUrl: string, file: File): Promise<void> {
  const delays = [500, 1000];
  let lastError: unknown;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const res = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      if (!res.ok) throw new Error(`S3 PUT failed with status ${res.status}`);
      return;
    } catch (err) {
      lastError = err;
      if (attempt < delays.length) {
        await new Promise(r => setTimeout(r, delays[attempt]));
      }
    }
  }
  throw lastError;
}

export async function uploadImage(file: File, folder = 'blackpixel'): Promise<UploadResult> {
  if (file.size > MAX_SIZE) throw new Error('File must be under 10 MB');
  if (!ALLOWED_TYPES.has(file.type)) throw new Error('Unsupported file type');

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const res = await fetch(`${supabaseUrl}/functions/v1/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      folder,
      fileSizeBytes: file.size,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? 'Failed to get upload URL');
  }

  const { uploadUrl, key, publicUrl } = await res.json() as {
    uploadUrl: string;
    key: string;
    publicUrl: string;
  };

  await putWithRetry(uploadUrl, file);

  return { url: publicUrl, publicId: key };
}

export async function uploadMultipleImages(
  files: File[],
  folder = 'blackpixel',
): Promise<{ results: UploadResult[]; errors: Array<{ file: File; error: string }> }> {
  const settled = await Promise.allSettled(files.map(f => uploadImage(f, folder)));

  const results: UploadResult[] = [];
  const errors: Array<{ file: File; error: string }> = [];

  settled.forEach((outcome, i) => {
    if (outcome.status === 'fulfilled') {
      results.push(outcome.value);
    } else {
      errors.push({
        file: files[i],
        error: outcome.reason instanceof Error ? outcome.reason.message : 'Unknown error',
      });
    }
  });

  return { results, errors };
}
