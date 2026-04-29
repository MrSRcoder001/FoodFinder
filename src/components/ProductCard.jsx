import { Link } from 'react-router-dom';
import { PackageOpen, Leaf } from 'lucide-react';
import clsx from 'clsx';

const gradeColors = {
    a: 'bg-[#008b4c] text-white',
    b: 'bg-[#80c14a] text-white',
    c: 'bg-[#feca0b] text-slate-800',
    d: 'bg-[#f58220] text-white',
    e: 'bg-[#ef3e22] text-white',
};

const ProductCard = ({ product }) => {
    const grade = product.nutriscore_grade?.toLowerCase() || product.nutrition_grades?.toLowerCase();
    const colorClass = gradeColors[grade] || 'bg-slate-200 text-slate-500';

    return (
        <Link
            to={`/product/${product.code}`}
            className="glass-card flex flex-col h-full overflow-hidden group bg-white/70"
        >
            {/* Image container */}
            <div className="relative h-56 w-full flex items-center justify-center p-6 bg-white/50 border-b border-black/[0.03] overflow-hidden">
                {/* Abstract shape to add color depth behind image */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-brand-100 rounded-full blur-3xl opacity-50 transition-all duration-500 group-hover:scale-150 group-hover:opacity-70 group-hover:bg-brand-200"></div>

                {product.image_front_url || product.image_url ? (
                    <img
                        src={product.image_front_url || product.image_url}
                        alt={product.product_name}
                        className="w-full h-full object-contain relative z-10 group-hover:scale-110 drop-shadow-md transition-all duration-700 ease-out"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center text-slate-300">
                        <PackageOpen size={48} />
                        <span className="text-sm mt-2">No Image</span>
                    </div>
                )}

                {/* NutriScore Badge */}
                {grade && (
                    <div className={clsx("absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md", colorClass)}>
                        {grade.toUpperCase()}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col relative z-10">
                {product.brands && (
                    <p className="text-[10px] uppercase tracking-widest text-brand-600 font-bold mb-1 opacity-80">
                        {product.brands.split(',')[0]}
                    </p>
                )}

                <h3 className="font-extrabold text-slate-800 text-lg line-clamp-2 leading-tight mb-3 group-hover:text-brand-600 transition-colors">
                    {product.product_name || 'Unknown Product'}
                </h3>

                {/* Categories Snippet */}
                {product.categories && (
                    <p className="text-[11px] font-medium text-slate-600 line-clamp-1 mb-4 bg-white/60 border border-slate-200/50 shadow-sm inline-block px-2.5 py-1 rounded-full w-fit">
                        {product.categories.split(',')[0]}
                    </p>
                )}

                <div className="mt-auto pt-4 border-t border-slate-200/50 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {product.ingredients_text ? (
                        <span className="flex items-start gap-1.5 font-medium">
                            <Leaf size={14} className="min-w-[14px] mt-0.5 text-green-500" />
                            {product.ingredients_text}
                        </span>
                    ) : (
                        <span className="italic text-slate-400">Ingredients not available</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
