import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
    console.log("🔍 Testing Supabase Fetch...");

    // 1. Fetch Categories
    const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*');

    if (catError) console.error("Category Error:", catError);
    else console.log("✅ Categories found:", catData?.length);

    // 2. Fetch Projects (Simple)
    const { data: projDataSimple, error: projErrorSimple } = await supabase
        .from('projects')
        .select('id, title, display_order');

    if (projErrorSimple) console.error("Project (Simple) Error:", projErrorSimple);
    else console.log("✅ Projects (Simple) found:", projDataSimple?.length);
    if (projDataSimple && projDataSimple.length > 0) {
        console.log("Sample Project:", projDataSimple[0]);
    }

    // 3. Fetch Projects (With Join + Order) - exact query used in hook
    const { data: projData, error: projError } = await supabase
        .from('projects')
        .select('*, categories(id, name, slug)')
        .order('display_order', { ascending: true });

    if (projError) {
        console.error("❌ Project (Complex) Error:", projError);
    } else {
        console.log("✅ Projects (Complex) found:", projData?.length);
        if (projData && projData.length > 0) {
            console.log("Sample Complex Project:", {
                title: projData[0].title,
                display_order: projData[0].display_order,
                category: projData[0].categories
            });
        }
    }
}

testFetch();
