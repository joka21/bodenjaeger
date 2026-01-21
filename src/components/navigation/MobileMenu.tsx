'use client';

import { useEffect, useState } from 'react';
import { Category, MenuState, categoriesData } from '@/types/mobile-menu';
import MobileMenuHeader from './MobileMenuHeader';
import MobileMenuLevel1 from './MobileMenuLevel1';
import MobileMenuLevel2 from './MobileMenuLevel2';
import MobileMenuLevel3 from './MobileMenuLevel3';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [menuState, setMenuState] = useState<MenuState>({
    isOpen: false,
    currentLevel: 1,
    navigationStack: [],
    selectedCategory: null,
    selectedSubCategory: null,
  });

  // Update internal state when prop changes
  useEffect(() => {
    if (isOpen && !menuState.isOpen) {
      setMenuState({
        isOpen: true,
        currentLevel: 1,
        navigationStack: [],
        selectedCategory: null,
        selectedSubCategory: null,
      });
    } else if (!isOpen && menuState.isOpen) {
      setMenuState((prev) => ({ ...prev, isOpen: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen]);

  // Keyboard navigation (Escape key)
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Navigation functions
  const handleCategoryClick = (category: Category) => {
    setMenuState((prev) => ({
      ...prev,
      currentLevel: 2,
      navigationStack: [{ level: 1, data: null }],
      selectedCategory: category,
    }));
  };

  const handleSubCategoryClick = (subCategory: Category) => {
    setMenuState((prev) => ({
      ...prev,
      currentLevel: 3,
      navigationStack: [...prev.navigationStack, { level: 2, data: prev.selectedCategory }],
      selectedSubCategory: subCategory,
    }));
  };

  const handleBack = () => {
    if (menuState.currentLevel === 2) {
      setMenuState((prev) => ({
        ...prev,
        currentLevel: 1,
        navigationStack: [],
        selectedCategory: null,
      }));
    } else if (menuState.currentLevel === 3) {
      setMenuState((prev) => ({
        ...prev,
        currentLevel: 2,
        navigationStack: prev.navigationStack.slice(0, -1),
        selectedSubCategory: null,
      }));
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state after animation
    setTimeout(() => {
      setMenuState({
        isOpen: false,
        currentLevel: 1,
        navigationStack: [],
        selectedCategory: null,
        selectedSubCategory: null,
      });
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Menu Container */}
      <div
        className={`fixed inset-y-0 right-0 w-full bg-[#f9f9fb] z-50 flex flex-col overflow-hidden transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Hauptnavigation"
      >
        {/* Header */}
        <MobileMenuHeader
          currentLevel={menuState.currentLevel}
          onClose={handleClose}
          onBack={menuState.currentLevel > 1 ? handleBack : undefined}
        />

        {/* Content -swith based on level */}
        <div className="flex-1 overflow-y-auto">
          {menuState.currentLevel === 1 && (
            <MobileMenuLevel1
              categories={categoriesData}
              onCategoryClick={handleCategoryClick}
              onClose={handleClose}
            />
          )}

          {menuState.currentLevel === 2 && menuState.selectedCategory && (
            <MobileMenuLevel2
              category={menuState.selectedCategory}
              onSubCategoryClick={handleSubCategoryClick}
              onClose={handleClose}
            />
          )}

          {menuState.currentLevel === 3 &&
            menuState.selectedCategory &&
            menuState.selectedSubCategory && (
              <MobileMenuLevel3
                parentCategory={menuState.selectedCategory}
                subCategory={menuState.selectedSubCategory}
                onClose={handleClose}
              />
            )}
        </div>
      </div>
    </>
  );
}
