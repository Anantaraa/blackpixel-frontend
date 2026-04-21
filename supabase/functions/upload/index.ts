import { S3Client, PutObjectCommand } from 'npm:@aws-sdk/client-s3@3';
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner@3';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const ALLOWED_CONTENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);
const ALLOWED_FOLDERS = /^(studiozr7|blackpixel)(\/[a-z]+)?$/;
const MAX_SIZE = 10 * 1024 * 1024;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Validate Supabase session
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Unauthorized' }, 401);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', ''),
  );
  if (authError || !user) return json({ error: 'Unauthorized' }, 401);

  // Validate request body
  let filename: string, contentType: string, folder: string, fileSizeBytes: number;
  try {
    ({ filename, contentType, folder, fileSizeBytes } = await req.json());
  } catch {
    return json({ error: 'Invalid request body' }, 400);
  }

  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return json({ error: 'Unsupported content type' }, 400);
  }
  if (!ALLOWED_FOLDERS.test(folder)) {
    return json({ error: 'Invalid folder' }, 400);
  }
  if (!fileSizeBytes || fileSizeBytes > MAX_SIZE) {
    return json({ error: 'File too large (max 10 MB)' }, 400);
  }

  // Build S3 key
  const rawExt = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
  const ext = /^[a-z0-9]{1,10}$/.test(rawExt) ? rawExt : 'jpg';
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  // Issue pre-signed PUT URL (expires in 5 minutes)
  try {
    const s3 = new S3Client({
      region: Deno.env.get('AWS_REGION')!,
      credentials: {
        accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY')!,
      },
    });

    const command = new PutObjectCommand({
      Bucket: Deno.env.get('AWS_S3_BUCKET')!,
      Key: key,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const publicUrl = `https://${Deno.env.get('CLOUDFRONT_DOMAIN')}/${key}`;

    return json({ uploadUrl, key, publicUrl });
  } catch (err: unknown) {
    console.error('S3 pre-sign error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return json({ error: message }, 500);
  }
});
