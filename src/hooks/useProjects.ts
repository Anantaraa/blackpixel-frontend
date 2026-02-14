import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface ProjectImage {
    url: string;
    featured: boolean;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    year: number;
    location: string;
    image: string;
    gallery: ProjectImage[]; // Modified to store objects
    category_id: string;
    categories?: Category;
    featured: boolean;
    display_order: number;
}

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch Categories
            // console.log('Fetching Categories...');
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (catError) throw catError;
            setCategories(catData || []);

            console.log("Fetching projects...");
            // Fetch Projects with Category info
            const { data: projData, error: projError } = await supabase
                .from('projects')
                .select('*, categories(id, name, slug)')
                .order('display_order', { ascending: true }); // Sort by Custom Order

            console.log("Projects response:", { projData, projError });

            if (projError) throw projError;

            // Normalize data: specific handling for gallery which might be string[] or object[] in DB
            const normalizedProjects = (projData || []).map((p: any) => ({
                ...p,
                gallery: Array.isArray(p.gallery)
                    ? p.gallery.map((item: any) => {
                        if (typeof item === 'string') {
                            // Check if it's a JSON string of an object (e.g. from previous incorrect saves)
                            if (item.trim().startsWith('{')) {
                                try {
                                    const parsed = JSON.parse(item);
                                    return parsed;
                                } catch (e) {
                                    // Not valid JSON, keep as string URL
                                    return { url: item, featured: false };
                                }
                            }
                            // Regular URL string
                            return { url: item, featured: false };
                        }
                        // Already an object
                        return item;
                    })
                    : []
            }));

            console.log("Normalized Projects:", normalizedProjects);

            setProjects(normalizedProjects);

        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // CRUD Operations
    const addProject = async (project: Omit<Project, 'id' | 'categories' | 'display_order'> & { display_order?: number }) => {
        // Auto-increment order if not provided
        let order = project.display_order;
        if (order === undefined) {
            const { data: maxData } = await supabase
                .from('projects')
                .select('display_order')
                .order('display_order', { ascending: false })
                .limit(1)
                .single();
            order = (maxData?.display_order || 0) + 1;
        }

        const newProject = { ...project, display_order: order };

        const { data, error } = await supabase.from('projects').insert(newProject).select().single();
        if (error) throw error;
        setProjects(prev => [data, ...prev]); // Note: UI sort might need refresh or manual sort here, but fetchData does it.
        fetchData();
        return data;
    };

    const updateProject = async (id: string, updates: Partial<Project>) => {
        const { error } = await supabase.from('projects').update(updates).eq('id', id);
        if (error) throw error;
        fetchData(); // Refresh
    };

    const deleteProject = async (id: string) => {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    return { projects, categories, loading, error, refresh: fetchData, addProject, updateProject, deleteProject };
}
