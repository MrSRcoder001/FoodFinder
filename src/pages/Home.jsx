import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '../api/openFoodFacts';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const Home = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('search');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: ['products', { query, category, sort }],
        queryFn: ({ pageParam = 1 }) =>
            searchProducts({ searchTerm: query, category, sortBy: sort, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            // If we got items and haven't hit the end, request the next page.
            if (lastPage && lastPage.products && lastPage.products.length >= 24) {
                return allPages.length + 1;
            }
            return undefined;
        },
    });

    useEffect(() => {
        document.title = query
            ? `Search: ${query} | FoodFinder`
            : category && category !== 'all'
                ? `${category} | FoodFinder`
                : 'Explore Authentic Foods | FoodFinder';
    }, [query, category]);

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
            <Sidebar />

            <main className="flex-1">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">
                        {query ? `Search results for "${query}"` : category && category !== 'all' ? `Category: ${category}` : 'Explore Popular Products'}
                    </h1>
                    {data?.pages?.[0]?.count && (
                        <p className="text-sm text-slate-500 mt-1">{data?.pages?.[0]?.count} items found</p>
                    )}
                </div>

                {status === 'loading' ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
                        <p className="text-slate-500">Loading delicious foods...</p>
                    </div>
                ) : status === 'error' ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center justify-center">
                        Error fetching products: {error.message}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {(() => {
                                let allProducts = data?.pages?.flatMap(page => page?.products || []) || [];

                                // Client-side sorting fallback when API can't provide descending sorts
                                const score = (p) => {
                                    const s = p?.nutriscore_grade || p?.nutrition_grades;
                                    return s ? s.charCodeAt(0) : 0; // missing scores treated as lowest
                                };

                                if (sort === 'product_name_desc') {
                                    allProducts.sort((a, b) => (b.product_name || '').localeCompare(a.product_name || ''));
                                } else if (sort === 'product_name_asc') {
                                    allProducts.sort((a, b) => (a.product_name || '').localeCompare(b.product_name || ''));
                                } else if (sort === 'nutriscore_desc') {
                                    allProducts.sort((a, b) => score(b) - score(a));
                                } else if (sort === 'nutriscore_asc') {
                                    allProducts.sort((a, b) => score(a) - score(b));
                                }

                                return allProducts.map((product, idx) => (
                                    <ProductCard key={product.id || product.code || idx} product={product} />
                                ));
                            })()}
                        </div>

                        {(() => {
                            const allProductsLen = data?.pages?.flatMap(p => p?.products || []).length || 0;
                            return allProductsLen === 0;
                        })() && (
                            <div className="text-center py-20 text-slate-500">
                                <p className="text-lg">No products found for these filters.</p>
                                <p className="text-sm mt-2">Try adjusting your search or category.</p>
                            </div>
                        )}

                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={!hasNextPage || isFetchingNextPage}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${!hasNextPage
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg hover:shadow-xl active:scale-95'
                                    }`}
                            >
                                {isFetchingNextPage
                                    ? 'Loading more...'
                                    : hasNextPage
                                        ? 'Load More'
                                        : 'Nothing more to load'}
                            </button>
                        </div>
                        {isFetching && !isFetchingNextPage ? (
                            <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-sm font-medium text-slate-600 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-brand-500" /> Updating...
                            </div>
                        ) : null}
                    </>
                )}
            </main>
        </div>
    );
};

export default Home;
