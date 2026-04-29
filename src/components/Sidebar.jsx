import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api/openFoodFacts';
import { UtensilsCrossed, Settings2, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Sidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentCategory = searchParams.get('category') || 'all';
    const currentSort = searchParams.get('sort') || 'popular';

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    const handleCategoryChange = (catId) => {
        const newParams = new URLSearchParams(searchParams.toString());
        if (catId === 'all') {
            newParams.delete('category');
        } else {
            newParams.set('category', catId);
        }
        // Reset pagination when changing filters
        newParams.delete('page');
        setSearchParams(newParams);
    };

    const handleSortChange = (e) => {
        const newParams = new URLSearchParams(searchParams.toString());
        const val = e.target.value;
        if (val === 'popular') {
            // default - remove explicit sort param to keep URLs clean
            newParams.delete('sort');
        } else {
            newParams.set('sort', val);
        }
        // Reset pagination when changing sort
        newParams.delete('page');
        setSearchParams(newParams);
    };

    return (
        <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-6">
            {/* Filters & Sorting */}
            <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                    <Settings2 size={20} className="text-brand-500" />
                    <h2 className="text-lg font-bold">Filters & Sort</h2>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-600">Sort By</label>
                    <select
                        className="glass-input w-full text-sm"
                        value={currentSort}
                        onChange={handleSortChange}
                    >
                        <option value="popular">Popularity</option>
                        <option value="product_name_asc">Name (A-Z)</option>
                        <option value="product_name_desc">Name (Z-A)</option>
                        <option value="nutriscore_asc">Nutrition Grade (A-E)</option>
                        <option value="nutriscore_desc">Nutrition Grade (E-A)</option>
                    </select>
                </div>
            </div>

            {/* Categories */}
            <div className="glass-card p-5 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                    <UtensilsCrossed size={20} className="text-brand-500" />
                    <h2 className="text-lg font-bold">Categories</h2>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-sm">Failed to load categories</div>
                ) : (
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => handleCategoryChange('all')}
                            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentCategory === 'all'
                                    ? 'bg-brand-50 text-brand-600'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            All Categories
                        </button>

                        {categories?.slice(0, 40).map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${currentCategory === cat.id
                                        ? 'bg-brand-50 text-brand-600'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <span className="truncate pr-2">{cat.name}</span>
                                <span className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded-full shadow-sm">
                                    {cat.products >= 1000 ? `${(cat.products / 1000).toFixed(1)}k` : cat.products}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
