"use client";

export const POPULAR_BRANDS = [
  { id: "tvs", name: "TVS", logo: "/tvs logo.png" },
  { id: "hero", name: "Hero", logo: "/Hero-logo.png" },
  { id: "honda", name: "Honda", logo: "/honda-logo.png" },
  { id: "royal-enfield", name: "Royal Enfield", logo: "/royalenfield-logo.png" },
  { id: "suzuki", name: "Suzuki", logo: "/suzuki-logo.png" },
  { id: "yamaha", name: "Yamaha", logo: "/yamaha logo.png" },
  { id: "bajaj", name: "Bajaj", logo: "/bajaj logo.webp" },
  { id: "ktm", name: "KTM", logo: "/ktm-logo.svg" },
];

export default function PopularBrands({ selectedBrand = null, onBrandSelect }) {
  const handleBrandClick = (brandName) => {
    if (selectedBrand === brandName) {
      // Toggle off -> show all
      if (onBrandSelect) onBrandSelect(null);
    } else {
      // Set active brand
      if (onBrandSelect) onBrandSelect(brandName);
    }
  };

  return (
    <section className="w-full font-sans select-none space-y-4">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0b2d38]">
          Popular Brands
        </h2>
        {selectedBrand && (
          <button
            type="button"
            onClick={() => onBrandSelect && onBrandSelect(null)}
            className="text-xs font-bold text-slate-500 hover:text-[#0b2d38] underline transition-colors"
          >
            Clear Brand Filter
          </button>
        )}
      </div>

      {/* Non-scrollable Responsive Grid for all 8 Brands */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 lg:gap-6 justify-items-center py-2">
        {POPULAR_BRANDS.map((brand) => {
          const isSelected = selectedBrand?.toLowerCase() === brand.name.toLowerCase();

          return (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand.name)}
              className="flex flex-col items-center cursor-pointer group w-full max-w-[130px]"
            >
              {/* Circular Logo Card */}
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white flex items-center justify-center p-3 sm:p-4 transition-all duration-200 ${
                  isSelected
                    ? "border-2 border-[#007e22] ring-2 ring-[#007e22]/20 shadow-md bg-[#eff4fc] scale-105"
                    : "border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#007e22]/40 hover:scale-105"
                }`}
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="max-h-7 sm:max-h-9 max-w-[75%] object-contain transition-transform duration-200 group-hover:scale-110"
                />
              </div>

              {/* Brand Name Label */}
              <span
                className={`text-[11px] sm:text-xs lg:text-sm font-semibold mt-2 transition-colors text-center truncate w-full ${
                  isSelected
                    ? "text-[#007e22] font-black"
                    : "text-slate-700 group-hover:text-[#007e22]"
                }`}
              >
                {brand.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
