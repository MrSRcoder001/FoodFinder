import axios from 'axios';

// Route through Vite proxy to bypass direct CORS restrictions on their search/categories endpoints
const BASE_URL = '/api-proxy';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
});

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function requestWithRetry(getter, attempts = 3, baseDelay = 500) {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
        try {
            return await getter();
        } catch (err) {
            lastErr = err;
            const wait = baseDelay * Math.pow(2, i);
            console.warn(`Request failed (attempt ${i + 1}/${attempts}). Retrying in ${wait}ms...`, err?.message || err);
            // If this was the last attempt, break and rethrow below
            if (i < attempts - 1) await sleep(wait);
        }
    }
    // All attempts failed
    throw lastErr;
}

export const fetchCategories = async () => {
    try {
        // The OpenFoodFacts endpoint redirects to /facets/categories.json which breaks CORS, using proxy fixes this.
        const getter = () => api.get('/categories.json');
        const resp = await requestWithRetry(getter, 3, 400);
        const { data } = resp;

        if (!data || !data.tags) {
            console.warn("API did not return a valid tags array. Potentially a 503 Server Unavailable response.");
            return [];
        }

        // Filter categories to only those with a reasonable number of products to avoid clutter
        return data.tags.filter(tag => tag.products > 500).sort((a, b) => b.products - a.products);
    } catch (error) {
        console.error("Error fetching categories", error);
        return [];
    }
};

export const searchProducts = async ({ searchTerm, category, sortBy, page = 1 }) => {
    const params = {
        action: 'process',
        json: 1,
        page,
        page_size: 24,
        fields: 'code,product_name,image_url,image_front_url,categories,ingredients_text,nutrition_grades,nutriscore_grade,nutriments,labels,brands' // Optimize payload
    };

    if (searchTerm) {
        params.search_terms = searchTerm;
    }

    if (category && category !== 'all') {
        params.tagtype_0 = 'categories';
        params.tag_contains_0 = 'contains';
        params.tag_0 = category;
    }

    if (sortBy) {

        if (sortBy === 'product_name_asc' || sortBy === 'product_name_desc') {
            params.sort_by = 'product_name';
        } else if (sortBy === 'nutriscore_asc' || sortBy === 'nutriscore_desc') {
            params.sort_by = 'nutriscore_score';
        } else {
            params.sort_by = 'unique_scans_n'; // default popularity
        }
    } else {
        params.sort_by = 'unique_scans_n';
    }

    try {
        const getter = () => api.get('/cgi/search.pl', { params });
        const resp = await requestWithRetry(getter, 3, 500);
        const { data } = resp;

        if (!data || !Array.isArray(data.products)) {
            console.warn("API did not return a valid products array. Potentially a 503 Server Unavailable response.");
            return { products: [], count: 0, page };
        }

        return data;
    } catch (error) {
        // If requests repeatedly fail, surface a clearer log and return an empty safe response
        console.error("Error searching products after retries:", error?.message || error);
        return { products: [], count: 0, page };
    }
};

export const getProductByBarcode = async (barcode) => {
    try {
        const { data } = await api.get(`/api/v0/product/${barcode}.json`);
        if (data && data.status === 1) {
            return data.product;
        }
        throw new Error("Product not found");
    } catch (error) {
        throw error;
    }
};
