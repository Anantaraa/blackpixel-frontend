
const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

interface FetchOptions extends RequestInit {
    params?: Record<string, string>;
}

export const fetchAPI = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
    const { params, ...init } = options;

    const headers = {
        'Content-Type': 'application/json',
        ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
        ...init.headers,
    };

    const queryString = params
        ? '?' + new URLSearchParams(params).toString()
        : '';

    const url = `${API_URL}/api${endpoint}${queryString}`;

    try {
        const response = await fetch(url, { ...init, headers });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch API Error:', error);
        throw error;
    }
};

export const getProjects = async (params = {}) => {
    return fetchAPI('/projects', { params: { populate: '*', ...params } });
};

export const getProject = async (slug: string) => {
    return fetchAPI(`/projects`, {
        params: {
            'filters[slug][$eq]': slug,
            populate: '*'
        }
    });
};

export const getCategories = async () => {
    return fetchAPI('/categories');
};
