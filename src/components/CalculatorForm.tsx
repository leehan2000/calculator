import React, { useState, useEffect } from 'react';
import { MultiProductInput, ProductSelection, SelectOptions } from '../types';

interface CalculatorFormProps {
  selectOptions: SelectOptions;
  isCalculating: boolean;
  onCalculate: (input: MultiProductInput) => void;
  onReset: () => void;
}

/**
 * 복수 상품 동시 선택 폼 컴포넌트
 * 
 * 주요 기능:
 * - 카테고리 선택 (SME/소호)
 * - 복수 상품 체크박스 선택
 * - 상품별 독립적인 옵션 설정
 * - 유효성 검사 및 계산 실행
 */
const CalculatorForm: React.FC<CalculatorFormProps> = ({
  selectOptions,
  isCalculating,
  onCalculate,
  onReset,
}) => {
  const [category, setCategory] = useState<'SME' | '소호'>('소호');
  const [products, setProducts] = useState<{ [key: string]: ProductSelection }>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // 카테고리별 상품 목록 정의
  const productDefinitions = {
    'SME': [
      { key: '인터넷', label: '기업인터넷' },
      { key: '인터넷전화', label: '인터넷전화' },
      { key: 'IPTV', label: 'IPTV' }
    ],
    '소호': [
      { key: '인터넷', label: '소호인터넷' },
      { key: '인터넷전화', label: '인터넷전화' },
      { key: 'AI전화', label: 'AI전화' },
      { key: 'IPTV', label: 'IPTV' },
      { key: '지능형CCTV', label: '지능형CCTV' },
      { key: 'DX솔루션', label: 'DX솔루션' }
    ]
  };

  // 카테고리 변경 시 폼 초기화
  useEffect(() => {
    setProducts({});
    setValidationErrors([]);
  }, [category]);

  /**
   * 상품 선택/해제 핸들러
   */
  const handleProductToggle = (productKey: string) => {
    setProducts(prev => {
      const newProducts = { ...prev };
      
      if (newProducts[productKey]?.enabled) {
        // 선택 해제
        delete newProducts[productKey];
      } else {
        // 선택 활성화 - 기본값 설정
        newProducts[productKey] = {
          enabled: true,
          lines: 1,
          quantity: 1
        };
      }
      
      return newProducts;
    });
  };

  /**
   * 상품 옵션 업데이트 핸들러
   */
  const handleProductUpdate = (productKey: string, updates: Partial<ProductSelection>) => {
    setProducts(prev => ({
      ...prev,
      [productKey]: {
        ...prev[productKey],
        ...updates
      }
    }));
  };

  /**
   * 폼 유효성 검사
   */
  const validateForm = (): boolean => {
    const errors: string[] = [];
    const selectedProducts = Object.keys(products).filter(key => products[key]?.enabled);

    if (selectedProducts.length === 0) {
      errors.push('최소 하나의 상품을 선택해주세요.');
    }

    // 각 상품별 필수 옵션 검사
    selectedProducts.forEach(productKey => {
      const product = products[productKey];
      
      if (productKey === '인터넷') {
        if (category === '소호' && !product.subProduct) {
          errors.push('소호 인터넷: 상품 유형을 선택해주세요.');
        }
        if (!product.option) {
          errors.push(`${productKey}: 속도를 선택해주세요.`);
        }
      }
      
      if (productKey === '인터넷전화' || productKey === 'AI전화') {
        if (!product.subProduct && category === 'SME') {
          errors.push(`${productKey}: 상품 유형을 선택해주세요.`);
        }
        if (!product.device) {
          errors.push(`${productKey}: 단말기를 선택해주세요.`);
        }
      }
      
      if (productKey === 'IPTV') {
        if (!product.option) {
          errors.push(`${productKey}: 상품을 선택해주세요.`);
        }
        if (!product.device) {
          errors.push(`${productKey}: 단말기를 선택해주세요.`);
        }
      }
      
      if (productKey === '지능형CCTV') {
        if (!product.option) {
          errors.push(`${productKey}: 상품을 선택해주세요.`);
        }
      }
      
      if (productKey === 'DX솔루션') {
        if (!product.subProduct) {
          errors.push(`${productKey}: 상품 유형을 선택해주세요.`);
        }
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  /**
   * 계산 실행 핸들러
   */
  const handleCalculate = () => {
    if (!validateForm()) {
      return;
    }

    const input: MultiProductInput = {
      category,
      products
    };

    onCalculate(input);
  };

  /**
   * 리셋 핸들러
   */
  const handleReset = () => {
    setProducts({});
    setValidationErrors([]);
    onReset();
  };

  /**
   * 상품별 옵션 렌더링
   */
  const renderProductOptions = (productKey: string) => {
    const product = products[productKey];
    if (!product?.enabled) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
        <h4 className="font-semibold text-gray-800 mb-3">
          {productDefinitions[category].find(p => p.key === productKey)?.label} 옵션
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 인터넷 옵션 */}
          {productKey === '인터넷' && (
            <>
              {category === '소호' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상품 유형
                  </label>
                  <select
                    className="form-select"
                    value={product.subProduct || ''}
                    onChange={(e) => handleProductUpdate(productKey, { subProduct: e.target.value })}
                  >
                    <option value="">선택하세요</option>
                    <option value="유선인터넷">유선인터넷</option>
                    <option value="인터넷_결제안심">인터넷_결제안심</option>
                    <option value="무선인터넷">무선인터넷</option>
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {product.subProduct === '무선인터넷' ? '상품' : '속도'}
                </label>
                <select
                  className="form-select"
                  value={product.option || ''}
                  onChange={(e) => handleProductUpdate(productKey, { option: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  {product.subProduct === '무선인터넷' ? (
                    <>
                      <option value="베이직">베이직</option>
                      <option value="프리미엄">프리미엄</option>
                    </>
                  ) : (
                    <>
                      <option value="100M">100M</option>
                      <option value="500M">500M</option>
                      <option value="1G">1G</option>
                    </>
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  회선 수
                </label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={product.lines || 1}
                  onChange={(e) => handleProductUpdate(productKey, { lines: parseInt(e.target.value) || 1 })}
                />
              </div>
            </>
          )}

          {/* 인터넷전화 옵션 */}
          {productKey === '인터넷전화' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상품 유형
                </label>
                <select
                  className="form-select"
                  value={product.subProduct || ''}
                  onChange={(e) => handleProductUpdate(productKey, { 
                    subProduct: e.target.value,
                    option: e.target.value === '일반형' ? '종량제' : product.option
                  })}
                >
                  <option value="">선택하세요</option>
                  {category === 'SME' ? (
                    <>
                      <option value="DCS">DCS</option>
                      <option value="고급형DCS">고급형DCS</option>
                      <option value="고급형센트릭스">고급형센트릭스</option>
                      <option value="일반형">일반형</option>
                    </>
                  ) : (
                    <>
                      <option value="고급형센트릭스">고급형센트릭스</option>
                      <option value="일반형">일반형</option>
                    </>
                  )}
                </select>
              </div>
              
              {product.subProduct && product.subProduct !== '일반형' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    요금제
                  </label>
                  <select
                    className="form-select"
                    value={product.option || ''}
                    onChange={(e) => handleProductUpdate(productKey, { option: e.target.value })}
                  >
                    <option value="">선택하세요</option>
                    <option value="종량제">종량제</option>
                    <option value="정액제">정액제</option>
                  </select>
                </div>
              )}
              
              {product.option === '정액제' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    자유통화
                  </label>
                  <select
                    className="form-select"
                    value={product.feature || ''}
                    onChange={(e) => handleProductUpdate(productKey, { feature: e.target.value })}
                  >
                    <option value="없음">없음</option>
                    {selectOptions.features.filter(f => f.startsWith('자유통화')).map(feature => (
                      <option key={feature} value={feature}>{feature}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  단말기
                </label>
                <select
                  className="form-select"
                  value={product.device || ''}
                  onChange={(e) => handleProductUpdate(productKey, { device: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  {selectOptions.devices.filter(device => device.startsWith('IP-')).map(device => (
                    <option key={device} value={device}>{device}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  회선 수
                </label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={product.lines || 1}
                  onChange={(e) => handleProductUpdate(productKey, { lines: parseInt(e.target.value) || 1 })}
                />
              </div>
            </>
          )}

          {/* AI전화 옵션 */}
          {productKey === 'AI전화' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  요금제
                </label>
                <select
                  className="form-select"
                  value={product.option || ''}
                  onChange={(e) => handleProductUpdate(productKey, { option: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  <option value="정액제">정액제</option>
                  <option value="부가">부가</option>
                </select>
              </div>
              
              {product.option === '정액제' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    단말기
                  </label>
                  <select
                    className="form-select"
                    value={product.device || ''}
                    onChange={(e) => handleProductUpdate(productKey, { device: e.target.value })}
                  >
                    <option value="">선택하세요</option>
                    {selectOptions.devices.filter(device => device.startsWith('IP-')).map(device => (
                      <option key={device} value={device}>{device}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  회선 수
                </label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={product.lines || 1}
                  onChange={(e) => handleProductUpdate(productKey, { lines: parseInt(e.target.value) || 1 })}
                />
              </div>
            </>
          )}

          {/* IPTV 옵션 */}
          {productKey === 'IPTV' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상품
                </label>
                <select
                  className="form-select"
                  value={product.option || ''}
                  onChange={(e) => handleProductUpdate(productKey, { option: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  <option value="베이직">베이직</option>
                  <option value="프리미엄">프리미엄</option>
                  <option value="단체형 일반형">단체형 일반형</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  단말기
                </label>
                <select
                  className="form-select"
                  value={product.device || ''}
                  onChange={(e) => handleProductUpdate(productKey, { device: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  <option value="UHD">UHD</option>
                  <option value="가온">가온</option>
                </select>
              </div>
              
              {(product.option === '베이직' || product.option === '프리미엄') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WIFI
                  </label>
                  <select
                    className="form-select"
                    value={product.wifi || ''}
                    onChange={(e) => handleProductUpdate(productKey, { wifi: e.target.value })}
                  >
                    <option value="">선택안함</option>
                    <option value="기가WIFI">기가WIFI</option>
                    <option value="프리미엄WIFI">프리미엄WIFI</option>
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  대수
                </label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={product.quantity || 1}
                  onChange={(e) => handleProductUpdate(productKey, { quantity: parseInt(e.target.value) || 1 })}
                />
              </div>
            </>
          )}

          {/* 지능형CCTV 옵션 */}
          {productKey === '지능형CCTV' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상품
                </label>
                <select
                  className="form-select"
                  value={product.option || ''}
                  onChange={(e) => handleProductUpdate(productKey, { option: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  <option value="에스원안심">에스원안심</option>
                  <option value="출입관리기">출입관리기</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  대수
                </label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={product.quantity || 1}
                  onChange={(e) => handleProductUpdate(productKey, { quantity: parseInt(e.target.value) || 1 })}
                />
              </div>
            </>
          )}

          {/* DX솔루션 옵션 */}
          {productKey === 'DX솔루션' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상품 유형
                </label>
                <select
                  className="form-select"
                  value={product.subProduct || ''}
                  onChange={(e) => handleProductUpdate(productKey, { subProduct: e.target.value })}
                >
                  <option value="">선택하세요</option>
                  <option value="태이블오더">태이블오더</option>
                  <option value="포스">포스</option>
                  <option value="키오스크">키오스크</option>
                </select>
              </div>
              
              {product.subProduct === '태이블오더' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    유형
                  </label>
                  <select
                    className="form-select"
                    value={product.option || ''}
                    onChange={(e) => handleProductUpdate(productKey, { option: e.target.value })}
                  >
                    <option value="">선택하세요</option>
                    <option value="태블릿">태블릿</option>
                    <option value="페이저">페이저</option>
                  </select>
                </div>
              )}
              
              {product.subProduct === '포스' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    단말기
                  </label>
                  <select
                    className="form-select"
                    value={product.device || ''}
                    onChange={(e) => handleProductUpdate(productKey, { device: e.target.value })}
                  >
                    <option value="">선택하세요</option>
                    <option value="포스단말기">포스단말기</option>
                  </select>
                </div>
              )}
              
              {product.subProduct === '키오스크' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    단말기
                  </label>
                  <select
                    className="form-select"
                    value={product.device || ''}
                    onChange={(e) => handleProductUpdate(productKey, { device: e.target.value })}
                  >
                    <option value="">선택하세요</option>
                    <option value="키오스크단말기">키오스크단말기</option>
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  대수
                </label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={product.quantity || 1}
                  onChange={(e) => handleProductUpdate(productKey, { quantity: parseInt(e.target.value) || 1 })}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          <i className="fas fa-calculator mr-2"></i>
          브이원 요금계산기
        </h2>
        <p className="text-gray-600">
          필요한 상품을 선택하고 옵션을 설정한 후 한 번에 계산하세요.
        </p>
      </div>

      {/* 카테고리 선택 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="fas fa-building mr-2"></i>
          고객 유형 선택
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              category === 'SME'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
            onClick={() => setCategory('SME')}
          >
            <div className="text-center">
              <i className="fas fa-industry text-2xl mb-2"></i>
              <div className="font-semibold">SME (중소기업)</div>
              <div className="text-sm opacity-75">기업 전용 서비스</div>
            </div>
          </button>
          
          <button
            type="button"
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              category === '소호'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
            onClick={() => setCategory('소호')}
          >
            <div className="text-center">
              <i className="fas fa-store text-2xl mb-2"></i>
              <div className="font-semibold">소호 (개인/소상공인)</div>
              <div className="text-sm opacity-75">개인 및 소상공인 전용</div>
            </div>
          </button>
        </div>
      </div>

      {/* 상품 선택 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          <i className="fas fa-list-check mr-2"></i>
          상품 선택
        </h3>
        
        <div className="space-y-6">
          {productDefinitions[category].map(({ key, label }) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id={`product-${key}`}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  checked={products[key]?.enabled || false}
                  onChange={() => handleProductToggle(key)}
                />
                <label
                  htmlFor={`product-${key}`}
                  className="text-lg font-medium text-gray-900 cursor-pointer"
                >
                  {label}
                </label>
                {products[key]?.enabled && (
                  <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                    선택됨
                  </span>
                )}
              </div>
              
              {renderProductOptions(key)}
            </div>
          ))}
        </div>
      </div>

      {/* 유효성 검사 오류 표시 */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-red-800 font-semibold mb-2">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            입력을 확인해주세요
          </h4>
          <ul className="text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <i className="fas fa-redo mr-2"></i>
          다시 선택
        </button>
        
        <button
          type="button"
          onClick={handleCalculate}
          disabled={isCalculating}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isCalculating ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              계산 중...
            </>
          ) : (
            <>
              <i className="fas fa-calculator mr-2"></i>
              요금 계산하기
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CalculatorForm; 