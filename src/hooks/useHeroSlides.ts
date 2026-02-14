import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export interface HeroSlide {
    id: string;
    image_url: string;
    caption?: string;
    display_order: number;
}

export function useHeroSlides() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSlides = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('hero_slides')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) throw error;
            setSlides(data || []);
        } catch (err: any) {
            console.error('Error fetching hero slides:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const addSlide = async (slide: Omit<HeroSlide, 'id' | 'display_order'>) => {
        // Auto-increment order
        const { data: maxData } = await supabase
            .from('hero_slides')
            .select('display_order')
            .order('display_order', { ascending: false })
            .limit(1)
            .single();

        const order = (maxData?.display_order || 0) + 1;

        const { data, error } = await supabase
            .from('hero_slides')
            .insert({ ...slide, display_order: order })
            .select()
            .single();

        if (error) throw error;
        setSlides(prev => [...prev, data]);
        return data;
    };

    const deleteSlide = async (id: string) => {
        const { error } = await supabase.from('hero_slides').delete().eq('id', id);
        if (error) throw error;
        setSlides(prev => prev.filter(s => s.id !== id));
    };

    const updateSlideOrder = async (id: string, newOrder: number) => {
        const { error } = await supabase.from('hero_slides').update({ display_order: newOrder }).eq('id', id);
        if (error) throw error;
        fetchSlides();
    };

    return { slides, loading, error, refresh: fetchSlides, addSlide, deleteSlide, updateSlideOrder };
}
