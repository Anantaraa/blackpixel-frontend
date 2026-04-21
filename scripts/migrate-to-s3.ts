/**
 * Migration script: Cloudinary → S3/CloudFront
 *
 * Usage:
 *   npx tsx scripts/migrate-to-s3.ts           # live run
 *   npx tsx scripts/migrate-to-s3.ts --dry-run # preview only, no writes
 *
 * Requires in .env.local:
 *   AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET
 *   VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Load .env.local manually (dotenv not needed — simple parser)
// ---------------------------------------------------------------------------
const envPath = resolve(process.cwd(), '.env.local');
const envVars: Record<string, string> = {};
try {
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eq = trimmed.indexOf('=');
      if (eq === -1) return;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      envVars[key] = value;
    });
} catch {
  console.error('Could not read .env.local');
  process.exit(1);
}

function env(key: string): string {
  const v = envVars[key] ?? process.env[key];
  if (!v) { console.error(`Missing env var: ${key}`); process.exit(1); }
  return v;
}

const DRY_RUN = process.argv.includes('--dry-run');
// VITE_S3_BASE_URL is already the full CloudFront origin (e.g. https://d25olazln70d1u.cloudfront.net)
const CLOUDFRONT = (envVars['VITE_S3_BASE_URL'] ?? 'https://d25olazln70d1u.cloudfront.net').replace(/\/$/, '');
const FOLDER = 'blackpixel/projects';

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------
const s3 = new S3Client({
  region: env('AWS_REGION'),
  credentials: {
    accessKeyId: env('AWS_ACCESS_KEY_ID'),
    secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
  },
});

const supabase = createClient(
  env('VITE_SUPABASE_URL'),
  env('SUPABASE_SERVICE_ROLE_KEY'),
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function isCloudinaryUrl(url: string): boolean {
  return typeof url === 'string' && url.includes('cloudinary.com');
}

async function uploadToS3(url: string, contentType: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeExt = /^[a-z0-9]{1,10}$/.test(ext) ? ext : 'jpg';
  const key = `${FOLDER}/${crypto.randomUUID()}.${safeExt}`;

  await s3.send(new PutObjectCommand({
    Bucket: env('AWS_S3_BUCKET'),
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  }));

  return `${CLOUDFRONT}/${key}`;
}

function guessContentType(url: string): string {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg',
    png: 'image/png', webp: 'image/webp', avif: 'image/avif',
  };
  return map[ext ?? ''] ?? 'image/jpeg';
}

// ---------------------------------------------------------------------------
// Migrate projects
// ---------------------------------------------------------------------------
async function migrateProjects() {
  const { data: projects, error } = await supabase.from('projects').select('*');
  if (error) throw error;

  console.log(`\nFound ${projects.length} project(s)`);

  for (const project of projects) {
    let changed = false;
    const updates: Record<string, unknown> = {};

    // Main cover image
    if (isCloudinaryUrl(project.image)) {
      console.log(`  [project ${project.id}] migrating cover: ${project.image}`);
      if (!DRY_RUN) {
        const newUrl = await uploadToS3(project.image, guessContentType(project.image));
        updates.image = newUrl;
        console.log(`    → ${newUrl}`);
      }
      changed = true;
    }

    // Gallery images
    const gallery: Array<{ url: string; featured: boolean }> = project.gallery ?? [];
    const newGallery = await Promise.all(
      gallery.map(async (img) => {
        if (!isCloudinaryUrl(img.url)) return img;
        console.log(`  [project ${project.id}] migrating gallery img: ${img.url}`);
        if (DRY_RUN) return img;
        const newUrl = await uploadToS3(img.url, guessContentType(img.url));
        console.log(`    → ${newUrl}`);
        return { ...img, url: newUrl };
      })
    );

    if (gallery.some((img, i) => img.url !== newGallery[i].url)) {
      updates.gallery = newGallery;
      changed = true;
    }

    if (changed && !DRY_RUN) {
      const { error: updateError } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', project.id);
      if (updateError) console.error(`  Failed to update project ${project.id}:`, updateError.message);
      else console.log(`  ✓ project ${project.id} updated`);
    }
  }
}

// ---------------------------------------------------------------------------
// Migrate hero slides
// ---------------------------------------------------------------------------
async function migrateHeroSlides() {
  const { data: slides, error } = await supabase.from('hero_slides').select('*');
  if (error) throw error;

  console.log(`\nFound ${slides.length} hero slide(s)`);

  for (const slide of slides) {
    if (!isCloudinaryUrl(slide.image_url)) continue;

    console.log(`  [slide ${slide.id}] migrating: ${slide.image_url}`);
    if (!DRY_RUN) {
      const newUrl = await uploadToS3(slide.image_url, guessContentType(slide.image_url));
      console.log(`    → ${newUrl}`);
      const { error: updateError } = await supabase
        .from('hero_slides')
        .update({ image_url: newUrl })
        .eq('id', slide.id);
      if (updateError) console.error(`  Failed to update slide ${slide.id}:`, updateError.message);
      else console.log(`  ✓ slide ${slide.id} updated`);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
(async () => {
  if (DRY_RUN) console.log('=== DRY RUN — no changes will be written ===');
  console.log(`Migrating Cloudinary images → S3 (${FOLDER})`);

  await migrateProjects();
  await migrateHeroSlides();

  console.log('\nDone.');
})();
