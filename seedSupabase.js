import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const PROJECTS = [
    {
        title: "Serenity Residence",
        category: "Residential",
        location: "Kyoto, Japan",
        year: 2024,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2700&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2700&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2700&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600566752355-35792bedcfe1?q=80&w=2700&auto=format&fit=crop"
        ],
        description: "A sanctuary of peace in the heart of Kyoto. The design explores the relationship between light and shadow.",
        featured: true,
        display_order: 1
    },
    {
        title: "Urban Heights",
        category: "Commercial",
        location: "New York, USA",
        year: 2023,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2700&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2700&auto=format&fit=crop"
        ],
        description: "A vertical city concept for Manhattan. This mixed-use tower integrates residential, office, and public green spaces.",
        featured: true,
        display_order: 2
    },
    {
        title: "Nordic Museum",
        category: "Cultural",
        location: "Oslo, Norway",
        year: 2025,
        image: "https://images.unsplash.com/photo-1506158669146-619067262a00?q=80&w=2600&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1463133649987-19e3c23315a6?q=80&w=2700&auto=format&fit=crop"
        ],
        description: "An homage to the Norwegian landscape. The museum's form emerges from the terrain like a glacial erratic.",
        featured: true,
        display_order: 3
    },
    {
        title: "Desert Retreat",
        category: "Residential",
        location: "Arizona, USA",
        year: 2023,
        image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2700&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1521783988139-89397d761dce?q=80&w=2700&auto=format&fit=crop"
        ],
        description: "A minimalistic shelter in the Sonoran Desert. The design focuses on thermal mass and shading.",
        featured: true,
        display_order: 4
    },
    {
        title: "Glass Pavilion",
        category: "Landscape",
        location: "Berlin, Germany",
        year: 2024,
        image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=2600&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1466030588647-73b31c038221?q=80&w=2700&auto=format&fit=crop"
        ],
        description: "A transparent threshold in the Tiergarten. The pavilion serves as a cafe and exhibition space.",
        featured: true,
        display_order: 5
    },
    {
        title: "Alpine Lodge",
        category: "Hospitality",
        location: "Swiss Alps",
        year: 2025,
        image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2600&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2700&auto=format&fit=crop"
        ],
        description: "A modern interpretation of the traditional Swiss chalet. Timber construction meets high-tech insulation.",
        featured: true,
        display_order: 6
    },
    {
        title: "Marina Complex",
        category: "Commercial",
        location: "Dubai, UAE",
        year: 2024,
        image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2700&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2700&auto=format&fit=crop"
        ],
        description: "A waterfront development maximizing views of the Arabian Gulf. The undulating facade mimics the ocean waves.",
        featured: true,
        display_order: 7
    },
    {
        title: "Brutalist Library",
        category: "Cultural",
        location: "London, UK",
        year: 2023,
        image: "https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=2700&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2700&auto=format&fit=crop"
        ],
        description: "Concrete geometry meets soft natural light. A fortress of knowledge in the urban center.",
        featured: true,
        display_order: 8
    },
    {
        title: "Bamboo Chapel",
        category: "Religious",
        location: "Bali, Indonesia",
        year: 2024,
        image: "https://images.unsplash.com/photo-1507646227500-4d389b0012be?q=80&w=2700&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=2700&auto=format&fit=crop"
        ],
        description: "An open-air structure built entirely from sustainably harvested bamboo. The chapel breathes with the jungle.",
        featured: true,
        display_order: 9
    },
    {
        title: "Tech Campus",
        category: "Commercial",
        location: "Silicon Valley, USA",
        year: 2025,
        image: "https://images.unsplash.com/photo-1555597793-6ba6fa0570b5?q=80&w=2700&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1555696958-c8796854589d?q=80&w=2700&auto=format&fit=crop"
        ],
        description: "A futuristic workspace designed for collaboration. The circular plan encourages movement and interaction.",
        featured: true,
        display_order: 10
    }
];

async function seed() {
    console.log("🌱 Seeding Supabase...");

    // 1. Categories
    const categoriesMap = {};
    for (const p of PROJECTS) {
        if (!categoriesMap[p.category]) {
            const { data: existing } = await supabase.from('categories').select('id, name').eq('name', p.category).single();

            if (existing) {
                categoriesMap[p.category] = existing.id;
            } else {
                const { data: newCat, error } = await supabase.from('categories').insert({
                    name: p.category,
                    slug: p.category.toLowerCase().replace(/\s+/g, '-')
                }).select().single();

                if (error) {
                    console.error("Error creating category:", p.category, error.message);
                } else {
                    console.log("Created category:", p.category);
                    categoriesMap[p.category] = newCat.id;
                }
            }
        }
    }

    // 2. Projects
    for (const p of PROJECTS) {
        const { data: existing } = await supabase.from('projects').select('id').eq('title', p.title).single();

        if (existing) {
            console.log("Skipping existing project:", p.title);
        } else {
            const { error } = await supabase.from('projects').insert({
                title: p.title,
                description: p.description,
                year: p.year,
                location: p.location,
                image: p.image,
                gallery: p.gallery,
                category_id: categoriesMap[p.category],
                featured: p.featured,
                display_order: p.display_order
            });

            if (error) console.error("Error creating project:", p.title, error.message);
            else console.log("Created project:", p.title);
        }
    }
    console.log("✅ Seeding complete!");
}

seed();
