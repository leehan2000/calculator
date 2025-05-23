import React, { useState, useMemo } from 'react';
import { CustomerType, ProductCategory, PriceData } from '../../types/price';

interface ProductSelectorProps {
  priceData: PriceData;
  customerType: CustomerType;
  onProductSelect: (product: {
    category: ProductCategory;
    name: string;
    options?: string[];
  }) => void;
}

/**
 * 상품 선택 컴포넌트
 */
const ProductSelector: React.FC<ProductSelectorProps> = ({
  priceData,
  customerType,
  onProductSelect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('인터넷');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  /**
   * 선택 가능한 상품 목록
   */
  const availableProducts = useMemo(() => {
    const categoryData = priceData.priceData[customerType][selectedCategory];
    if (!categoryData) return [];
    return Object.keys(categoryData);
  }, [priceData, customerType, selectedCategory]);

  /**
   * 선택 가능한 옵션 목록
   */
  const availableOptions = useMemo(() => {
    if (!selectedProduct) return [];
    const categoryData = priceData.priceData[customerType][selectedCategory];
    if (!categoryData) return [];
    
    const productData = categoryData[selectedProduct];
    if (!productData) return [];

    if ('기본료' in productData) return [];
    return Object.keys(productData);
  }, [priceData, customerType, selectedCategory, selectedProduct]);

  /**
   * 상품 선택 완료 처리
   */
  const handleProductConfirm = () => {
    if (!selectedProduct) return;

    onProductSelect({
      category: selectedCategory,
      name: selectedProduct,
      options: selectedOptions.length > 0 ? selectedOptions : undefined
    });

    // 선택 초기화
    setSelectedProduct('');
    setSelectedOptions([]);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">상품 선택</h2>

      {/* 카테고리 선택 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">카테고리</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.keys(priceData.priceData[customerType]).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as ProductCategory)}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 선택 */}
      {availableProducts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">상품</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableProducts.map((product) => (
              <button
                key={product}
                onClick={() => setSelectedProduct(product)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedProduct === product
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {product}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 옵션 선택 */}
      {availableOptions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">옵션</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedOptions([option])} // 단일 선택만 지원
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedOptions.includes(option)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 선택 완료 버튼 */}
      <button
        onClick={handleProductConfirm}
        disabled={!selectedProduct}
        className={`w-full py-3 rounded-lg font-semibold ${
          !selectedProduct
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        선택 완료
      </button>
    </div>
  );
};

export default ProductSelector; 