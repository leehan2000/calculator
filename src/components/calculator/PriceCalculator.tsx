import React, { useState } from 'react';
import { CustomerType, ProductCategory, CalculationResult, PriceData } from '../../types/price';
import { calculateTotalPrice } from '../../utils/priceCalculator';
import PriceDisplay from '../common/PriceDisplay';
import ProductSelector from './ProductSelector';

interface PriceCalculatorProps {
  priceData: PriceData;
}

/**
 * 가격 계산기 메인 컴포넌트
 */
const PriceCalculator: React.FC<PriceCalculatorProps> = ({ priceData }) => {
  const [customerType, setCustomerType] = useState<CustomerType>('SME');
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    category: ProductCategory;
    name: string;
    options?: string[];
  }>>([]);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  /**
   * 상품 선택 처리
   */
  const handleProductSelect = (product: {
    category: ProductCategory;
    name: string;
    options?: string[];
  }) => {
    setSelectedProducts(prev => [...prev, product]);
    // 선택 시 계산 결과 초기화
    setCalculationResult(null);
  };

  /**
   * 상품 제거 처리
   */
  const handleProductRemove = (index: number) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
    // 제거 시 계산 결과 초기화
    setCalculationResult(null);
  };

  /**
   * 계산 실행
   */
  const handleCalculate = () => {
    const result = calculateTotalPrice(priceData, customerType, selectedProducts);
    setCalculationResult(result);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 고객 유형 선택 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">고객 유형</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setCustomerType('SME');
              setSelectedProducts([]);
              setCalculationResult(null);
            }}
            className={`px-4 py-2 rounded-lg ${
              customerType === 'SME'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            SME
          </button>
          <button
            onClick={() => {
              setCustomerType('소호');
              setSelectedProducts([]);
              setCalculationResult(null);
            }}
            className={`px-4 py-2 rounded-lg ${
              customerType === '소호'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            소호
          </button>
        </div>
      </div>

      {/* 상품 선택기 */}
      <div className="mb-8">
        <ProductSelector
          priceData={priceData}
          customerType={customerType}
          onProductSelect={handleProductSelect}
        />
      </div>

      {/* 선택된 상품 목록 */}
      {selectedProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">선택된 상품</h2>
          <div className="space-y-4">
            {selectedProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
              >
                <div>
                  <span className="font-medium">{product.name}</span>
                  {product.options && product.options.length > 0 && (
                    <span className="text-gray-600 ml-2">
                      ({product.options.join(', ')})
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleProductRemove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 계산 결과 */}
      {calculationResult && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">계산 결과</h2>
          
          {/* 상품별 상세 내역 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">상품별 상세 내역</h3>
            <div className="space-y-3">
              {calculationResult.selectedProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {product.name}
                    {product.options && product.options.length > 0 && (
                      <span className="text-gray-500 text-sm ml-2">
                        ({product.options.join(', ')})
                      </span>
                    )}
                  </span>
                  <PriceDisplay amount={product.price} />
                </div>
              ))}
            </div>
          </div>

          {/* 요금 요약 */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">요금 요약</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>월 사용료 (VAT별도)</span>
                <PriceDisplay amount={calculationResult.monthlyFee} />
              </div>
              {calculationResult.internetDiscount > 0 && (
                <div className="flex justify-between">
                  <span>인터넷 기본료 할인</span>
                  <PriceDisplay
                    amount={calculationResult.internetDiscount}
                    isNegative={true}
                  />
                </div>
              )}
              {calculationResult.installationDiscount > 0 && (
                <div className="flex justify-between">
                  <span>설치비 할인</span>
                  <PriceDisplay
                    amount={calculationResult.installationDiscount}
                    isNegative={true}
                  />
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span>합계 (VAT별도)</span>
                <PriceDisplay amount={calculationResult.totalBeforeVat} />
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>VAT포함</span>
                <PriceDisplay amount={calculationResult.totalWithVat} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 계산하기 버튼 */}
      <button
        onClick={handleCalculate}
        disabled={selectedProducts.length === 0}
        className={`w-full py-3 rounded-lg font-semibold ${
          selectedProducts.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        계산하기
      </button>
    </div>
  );
};

export default PriceCalculator; 