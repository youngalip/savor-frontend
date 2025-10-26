import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const CategoryFilter = ({ 
  categoryStructure = {},
  activeMainCategory, 
  activeSubCategory, 
  onMainCategoryChange, 
  onSubCategoryChange 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const currentCategory = categoryStructure[activeMainCategory]
  const currentSubsections = currentCategory?.subsections || []

  // Handle modal open with animation
  const openModal = () => {
    setIsModalOpen(true)
    setTimeout(() => {
      setIsAnimating(true)
    }, 10)
  }

  // Handle modal close with animation
  const closeModal = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsModalOpen(false)
    }, 300)
  }

  const handleMainCategorySelect = (categoryId) => {
    const newCategory = categoryStructure[categoryId]
    const firstSubsection = newCategory?.subsections[0]?.id
    
    onMainCategoryChange(categoryId)
    if (firstSubsection) {
      onSubCategoryChange(firstSubsection)
    }
    closeModal()
  }

  const handleSubCategoryClick = (subCategoryId) => {
    onSubCategoryChange(subCategoryId)
  }

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  // Don't render if no categories
  if (!categoryStructure || Object.keys(categoryStructure).length === 0) {
    return (
      <div className="flex items-center bg-white border-b border-cream-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <Menu className="w-5 h-5 text-gray-400" />
          </div>
          <span className="text-gray-400">Loading categories...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Filter Bar */}
      <div className="flex items-center bg-white border-b border-cream-200 px-4 py-3">
        {/* Left Section: Menu Button + Main Category */}
        <div className="flex items-center space-x-3">
          {/* Menu Button */}
          <button
            onClick={openModal}
            className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Current Main Category */}
          <button
            onClick={openModal}
            className="font-bold text-primary-500 hover:text-primary-600 transition-colors"
          >
            {currentCategory?.label || 'MENU'}
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>
        </div>

        {/* Right Section: Subsections */}
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 min-w-max">
            {currentSubsections.map((subsection) => (
              <button
                key={subsection.id}
                onClick={() => handleSubCategoryClick(subsection.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeSubCategory === subsection.id
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-cream-100'
                }`}
              >
                {subsection.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Selection Modal - Bottom Slide Up */}
      {isModalOpen && (
        <>
          {/* Background Overlay */}
          <div 
            className={`fixed inset-0 bg-black z-[100] transition-opacity duration-300 ${
              isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
            }`}
            onClick={closeModal}
          />
          
          {/* Modal Content - Slide up from bottom */}
          <div className={`fixed bottom-0 left-0 right-0 z-[101] transform transition-transform duration-300 ease-out ${
            isAnimating ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <div className="bg-white rounded-t-2xl shadow-2xl max-w-md mx-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-cream-200">
                <h3 className="text-xl font-bold text-gray-900">Select Category</h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-3 pb-8">
                {Object.entries(categoryStructure).map(([categoryId, category]) => (
                  <button
                    key={categoryId}
                    onClick={() => handleMainCategorySelect(categoryId)}
                    className={`w-full text-left px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                      activeMainCategory === categoryId
                        ? 'bg-primary-500 text-white shadow-lg transform scale-[1.02]'
                        : 'text-gray-700 hover:bg-cream-100 border-2 border-cream-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.label}</span>
                      {category.backendCategory?.active_menus_count && (
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          activeMainCategory === categoryId
                            ? 'bg-white bg-opacity-20 text-white'
                            : 'bg-cream-200 text-gray-600'
                        }`}>
                          {category.backendCategory.active_menus_count} items
                        </span>
                      )}
                    </div>
                    {category.backendCategory?.description && (
                      <p className={`text-sm mt-1 ${
                        activeMainCategory === categoryId
                          ? 'text-white text-opacity-80'
                          : 'text-gray-500'
                      }`}>
                        {category.backendCategory.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Bottom Safe Area */}
              <div className="h-4"></div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default CategoryFilter