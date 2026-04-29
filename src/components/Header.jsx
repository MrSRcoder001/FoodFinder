import { useState } from 'react';
import { Search, ScanBarcode, Flame } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const [searchMode, setSearchMode] = useState('name'); // 'name' or 'barcode'
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const location = useLocation();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        if (searchMode === 'barcode') {
            navigate(`/product/${query.trim()}`);
            return;
        }

        // Preserve other params (category, sort) while setting search, and reset page
        const params = new URLSearchParams(location.search);
        params.set('search', query.trim());
        params.delete('page');

        const searchString = params.toString();
        navigate({ pathname: '/', search: searchString ? `?${searchString}` : '' });
    };

    return (
        <header className="glass-nav py-4 px-4 sm:px-6 fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer group w-full md:w-auto justify-center md:justify-start"
                    onClick={() => navigate('/')}
                >
                    <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-2.5 rounded-2xl shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 group-hover:scale-105 transition-all duration-300">
                        <Flame className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-brand-600 group-hover:to-brand-400 transition-all duration-300">
                        FoodFinder
                    </span>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="w-full flex-1 max-w-2xl flex items-center relative">
                    <div className="relative flex w-full group shadow-sm rounded-2xl bg-white/40 ring-1 ring-black/5 hover:ring-black/10 focus-within:ring-brand-500 transition-all duration-300">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 border-r border-slate-200/60 my-2">
                            <select
                                value={searchMode}
                                onChange={(e) => setSearchMode(e.target.value)}
                                className="bg-transparent text-sm font-semibold text-slate-600 outline-none pr-3 cursor-pointer appearance-none"
                                title="Search Mode"
                            >
                                <option value="name">Name</option>
                                <option value="barcode">Barcode</option>
                            </select>
                        </div>

                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={searchMode === 'name' ? "Search for delicious food..." : "Enter barcode (e.g. 737628064502)"}
                            className="w-full h-14 bg-transparent outline-none pl-[6.5rem] pr-16 text-slate-700 placeholder-slate-400 font-medium"
                        />

                        <button
                            type="submit"
                            className="absolute inset-y-0 right-1.5 my-1.5 px-4 bg-slate-900 hover:bg-brand-600 text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                        >
                            {searchMode === 'name' ? <Search size={20} /> : <ScanBarcode size={20} />}
                        </button>
                    </div>
                </form>
            </div>
        </header>
    );
};

export default Header;
