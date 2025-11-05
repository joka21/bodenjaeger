import Link from 'next/link';
import { Category } from '@/types/mobile-menu';

interface MobileMenuLevel3Props {
  parentCategory: Category;
  subCategory: Category;
  onClose: () => void;
}

export default function MobileMenuLevel3({ parentCategory, subCategory, onClose }: MobileMenuLevel3Props) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#f9f9fb]">
      {/* Breadcrumb/Parent Title */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <h2 className="text-lg font-bold text-[#2e2d32]">{parentCategory.label}</h2>
      </div>

      {/* "Alle [Parent Kategorie] anzeigen" Link */}
      <Link
        href={`/category/${parentCategory.slug}`}
        onClick={onClose}
        className="block px-4 py-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <span className="text-[#2e2d32] text-base">Alle {parentCategory.label} anzeigen</span>
      </Link>

      {/* Subcategory Title (non-clickable) */}
      <div className="px-4 py-3 bg-gray-50">
        <h3 className="text-base font-bold text-[#2e2d32]">{subCategory.label}</h3>
      </div>

      {/* Final Items (indented) */}
      <div>
        {subCategory.children?.map((item) => (
          <Link
            key={item.id}
            href={`/category/${item.slug}`}
            onClick={onClose}
            className="block px-4 py-4 pl-8 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <span className="text-[#2e2d32] text-base">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Show other subcategories if available */}
      {parentCategory.children && parentCategory.children.length > 1 && (
        <div className="mt-4">
          {parentCategory.children
            .filter((cat) => cat.id !== subCategory.id)
            .map((otherSubCategory) => (
              <div key={otherSubCategory.id} className="border-b border-gray-200 bg-white">
                {otherSubCategory.hasChildren ? (
                  <div>
                    <div className="px-4 py-3 bg-gray-50">
                      <h3 className="text-base font-bold text-[#2e2d32]">{otherSubCategory.label}</h3>
                    </div>
                    {otherSubCategory.children?.map((item) => (
                      <Link
                        key={item.id}
                        href={`/category/${item.slug}`}
                        onClick={onClose}
                        className="block px-4 py-4 pl-8 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-[#2e2d32] text-base">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={`/category/${otherSubCategory.slug}`}
                    onClick={onClose}
                    className="block px-4 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-[#2e2d32] text-base">{otherSubCategory.label}</span>
                  </Link>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Bottom Spacer */}
      <div className="h-8" />
    </div>
  );
}
