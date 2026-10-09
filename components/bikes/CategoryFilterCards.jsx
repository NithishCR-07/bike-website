"use client";

export const CATEGORY_CARDS = [
  {
    id: "scooters",
    label: "Scooters",
    image: "/scooter.webp",
    keywords: ["scooter", "electric", "ev", "activa", "access", "jupiter", "aerox", "ntorq", "burgman", "dio", "ola", "ather", "chetak", "iqube", "ray", "fascino", "pleasure", "destini"],
    typeNames: ["Scooter", "Electric (EV)"]
  },
  {
    id: "motor-bikes",
    label: "Motor Bikes",
    image: "/motor bike.jpg",
    keywords: ["street", "naked", "commuter", "splendor", "shine", "passion", "pulsar", "apache", "fz", "glamour", "platina", "unicorn", "cd 110", "raider", "mt-15", "duke", "hunter", "cb", "ronin"],
    typeNames: ["Street / Naked", "Cafe Racer"]
  },
  {
    id: "sports-bikes",
    label: "Sports Bikes",
    image: "/sports bike.png",
    keywords: ["sports", "r15", "rc", "ninja", "rr", "gsx", "cbr", "rs 200", "r3", "zx", "hayabusa", "panigale", "gixxer sf"],
    typeNames: ["Sports"]
  },
  {
    id: "tourers",
    label: "Tourers",
    image: "/tourers.jpg",
    keywords: ["tourer", "touring", "cruiser", "adventure", "himalayan", "classic", "bullet", "meteor", "scram", "adv", "v-strom", "yezdi", "super meteor", "interceptor", "continental", "dominar", "thunderbird", "jawa"],
    typeNames: ["Cruiser", "Touring / Adventure"]
  }
];

export default function CategoryFilterCards({ 
  selectedCategory = null, 
  onCategoryChange 
}) {
  const handleCardClick = (catId) => {
    if (selectedCategory === catId) {
      // Toggle off -> show all
      if (onCategoryChange) onCategoryChange(null);
    } else {
      // Set active category
      if (onCategoryChange) onCategoryChange(catId);
    }
  };

  return (
    <div className="w-full font-sans select-none">
      
      {/* 4 Category Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORY_CARDS.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => handleCardClick(cat.id)}
              className={`group bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 flex flex-col items-center justify-between cursor-pointer text-center relative ${
                isSelected
                  ? "border-2 border-[#007e22] shadow-md ring-2 ring-[#007e22]/20 bg-[#eff4fc]"
                  : "border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#007e22]/40 hover:bg-[#eff4fc]/30"
              }`}
            >
              {/* Image Container */}
              <div className="w-full h-24 sm:h-28 flex items-center justify-center relative overflow-hidden mb-3">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
                />
              </div>

              {/* Category Label */}
              <span className={`text-sm sm:text-base font-bold transition-colors ${
                isSelected 
                  ? "text-[#007e22] font-black" 
                  : "text-slate-800 group-hover:text-[#007e22]"
              }`}>
                {cat.label}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
