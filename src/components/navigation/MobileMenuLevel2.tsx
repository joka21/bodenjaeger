import Link from 'next/link';
import { Category } from '@/types/mobile-menu';

interface MobileMenuLevel2Props {
  category: Category;
  onSubCategoryClick: (subCategory: Category) => void;
  onClose: () => void;
}

export default function MobileMenuLevel2({ category, onSubCategoryClick, onClose }: MobileMenuLevel2Props) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f9f9fb]">
      {/* Breadcrumb/Title */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <h2 className="text-lg font-bold text-[#2e2d32]">{category.label}</h2>
      </div>

      {/* "Alle [Kategorie] anzeigen" Link */}
      <Link
        href={`/category/${category.slug}`}
        onClick={onClose}
        className="block px-4 py-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <span className="text-[#2e2d32] text-base">Alle {category.label} anzeigen</span>
      </Link>

      {/* Subcategories */}
      <div className="mt-2">
        {category.children?.map((subCategory) => (
          <div key={subCategory.id} className="border-b border-gray-200 bg-white">
            {subCategory.hasChildren ? (
              <button
                onClick={() => onSubCategoryClick(subCategory)}
                className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-[#2e2d32] font-medium text-base">{subCategory.label}</span>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <Link
                href={`/category/${subCategory.slug}`}
                onClick={onClose}
                className="block px-4 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-[#2e2d32] text-base">{subCategory.label}</span>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Spacer */}
      <div className="h-8" />
    </div>
  );
}
