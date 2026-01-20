import { useState, useEffect } from 'react';
import { fetchAPI } from '../services/api';

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export function useFetch<T>(endpoint: string, params = {}): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchAPI<T>(endpoint, { params });
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, JSON.stringify(params)]);

    return { data, loading, error };
}
