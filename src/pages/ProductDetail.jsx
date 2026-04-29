import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { getProductByBarcode } from '../api/openFoodFacts';
import { ChevronLeft, Info, Leaf, Activity, Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const gradeColors = {
    a: 'bg-[#008b4c] text-white',
    b: 'bg-[#80c14a] text-white',
    c: 'bg-[#feca0b] text-slate-800',
    d: 'bg-[#f58220] text-white',
    e: 'bg-[#ef3e22] text-white',
};

const ProductDetail = () => {
    const { barcode } = useParams();
    const navigate = useNavigate();

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', barcode],
        queryFn: () => getProductByBarcode(barcode),
        enabled: !!barcode,
    });

    useEffect(() => {
        if (product?.product_name) {
            document.title = `${product.product_name} | FoodFinder`;
        }
    }, [product]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
                <p className="text-lg text-slate-600 font-medium">Fetching product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-2xl mx-auto mt-20 bg-red-50 p-8 rounded-2xl flex flex-col items-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-slate-800 mb-2">Product Not Found</h2>
                <p className="text-slate-600 text-center mb-6">
                    {error?.message || "We couldn't find a product matching this barcode."}
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-brand-500 text-white px-6 py-2 rounded-xl hover:bg-brand-600 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const grade = product.nutriscore_grade?.toLowerCase() || product.nutrition_grades?.toLowerCase();
    const colorClass = gradeColors[grade] || 'bg-slate-200 text-slate-500';

    const nutrients = product.nutriments || {};
    const nutrimentList = [
        { label: 'Energy', value: nutrients['energy-kcal_100g'], unit: 'kcal' },
        { label: 'Fat', value: nutrients.fat_100g, unit: 'g' },
        { label: 'Saturated Fat', value: nutrients['saturated-fat_100g'], unit: 'g' },
        { label: 'Carbohydrates', value: nutrients.carbohydrates_100g, unit: 'g' },
        { label: 'Sugars', value: nutrients.sugars_100g, unit: 'g' },
        { label: 'Proteins', value: nutrients.proteins_100g, unit: 'g' },
        { label: 'Salt', value: nutrients.salt_100g, unit: 'g' },
    ].filter(n => n.value !== undefined && n.value !== null);

    const labels = product.labels ? product.labels.split(',').map(l => l.trim().replace(/^en:/, '')).filter(Boolean) : [];

    return (
        <main className="max-w-6xl mx-auto px-6 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-8 transition-colors font-medium w-fit"
            >
                <ChevronLeft size={20} />
                Back to results
            </button>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">

                {/* Left Col - Image */}
                <div className="lg:w-2/5 p-8 flex items-center justify-center bg-slate-50 relative border-r border-slate-100 min-h-[400px]">
                    {grade && (
                        <div className={clsx(
                            "absolute top-6 left-6 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg",
                            colorClass
                        )}>
                            {grade.toUpperCase()}
                        </div>
                    )}

                    {product.image_url || product.image_front_url ? (
                        <img
                            src={product.image_url || product.image_front_url}
                            alt={product.product_name}
                            className="max-h-[500px] w-auto object-contain hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="text-slate-400 flex flex-col items-center">
                            <Info size={64} className="mb-4 opacity-50" />
                            <span>No image available</span>
                        </div>
                    )}
                </div>

                {/* Right Col - Details */}
                <div className="flex-1 p-8 lg:p-12">
                    {product.brands && (
                        <p className="text-brand-600 font-bold uppercase tracking-wider text-sm mb-2">
                            {product.brands}
                        </p>
                    )}
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6 leading-tight">
                        {product.product_name || "Unknown Product"}
                    </h1>

                    {/* Labels & Categories */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {labels.slice(0, 8).map((label, idx) => (
                            <span key={idx} className="bg-brand-50 border border-brand-100 text-brand-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                                {label}
                            </span>
                        ))}
                    </div>

                    <div className="h-px w-full bg-slate-100 my-8"></div>

                    {/* Ingredients */}
                    <section className="mb-10">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Leaf className="text-green-500" />
                            Ingredients
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            {product.ingredients_text || "The ingredients list is not available for this product."}
                        </p>
                    </section>

                    {/* Nutrition Table */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Activity className="text-blue-500" />
                            Nutritional Values (per 100g)
                        </h2>

                        {nutrimentList.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {nutrimentList.map((nut, idx) => (
                                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-sm font-medium text-slate-500 mb-1">{nut.label}</p>
                                        <p className="text-xl font-bold text-slate-800">
                                            {typeof nut.value === 'number' ? nut.value.toFixed(1) : nut.value}
                                            <span className="text-sm ml-1 text-slate-500 font-normal">{nut.unit}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 italic">Nutritional information is not available.</p>
                        )}
                    </section>

                </div>
            </div>
        </main>
    );
};

export default ProductDetail;
