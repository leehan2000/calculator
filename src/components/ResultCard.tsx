import React from 'react';
import { MultiCalculationResult } from '../types';

interface ResultCardProps {
  result: MultiCalculationResult;
  onNewCalculation: () => void;
}

/**
 * 복수 상품 계산 결과 표시 컴포넌트
 * 
 * 주요 기능:
 * - 상품별 상세 내역 표시
 * - 결합 할인 내역 표시
 * - 월 사용료 및 설치비 분리 표시
 * - VAT 포함/별도 금액 표시
 * - 인쇄 및 공유 기능
 */
const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onNewCalculation,
}) => {
  const {
    productResults,
    bundleDiscounts,
    finalTotals,
    breakdown
  } = result;

  /**
   * 결과 인쇄 함수
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * 결과 공유 함수 (웹 API 지원 시)
   */
  const handleShare = async () => {
    const shareText = `브이원 요금계산 결과\n월 사용료: ${finalTotals.monthlyFee.toLocaleString()}원\n설치비: ${finalTotals.installationFee.toLocaleString()}원`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '브이원 요금계산 결과',
          text: shareText
        });
      } catch (error) {
        console.log('공유 실패:', error);
        fallbackCopyToClipboard(shareText);
      }
    } else {
      fallbackCopyToClipboard(shareText);
    }
  };

  /**
   * 클립보드 복사 대체 함수
   */
  const fallbackCopyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      alert('계산 결과가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
      alert('브라우저에서 클립보드 복사를 지원하지 않습니다.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              <i className="fas fa-chart-line mr-2"></i>
              요금 계산 결과
            </h2>
            <p className="opacity-90">
              선택하신 상품들의 요금이 계산되었습니다.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {finalTotals.monthlyFee.toLocaleString()}원
            </div>
            <div className="text-sm opacity-75">월 사용료 (VAT별도)</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 상품별 상세 내역 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-list-ul mr-2"></i>
            선택 상품 내역
          </h3>
          
          <div className="space-y-4">
            {productResults.map((product, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {product.productName}
                  </h4>
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {(product.basicFee + product.deviceFee + product.specialFeatureFee).toLocaleString()}원
                    </div>
                    <div className="text-sm text-gray-500">월 사용료</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">기본료:</span>
                    <span className="font-medium">{product.basicFee.toLocaleString()}원</span>
                  </div>
                  
                  {product.deviceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">장비임대료:</span>
                      <span className="font-medium">{product.deviceFee.toLocaleString()}원</span>
                    </div>
                  )}
                  
                  {product.specialFeatureFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">자유통화:</span>
                      <span className="font-medium">{product.specialFeatureFee.toLocaleString()}원</span>
                    </div>
                  )}
                  
                  {product.installationFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">설치비:</span>
                      <span className="font-medium">{product.installationFee.toLocaleString()}원</span>
                    </div>
                  )}
                </div>

                {/* 상품 상세 정보 */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>
                      <i className="fas fa-users mr-1"></i>
                      {product.details.lines}회선
                    </span>
                    
                    {product.details.devices.length > 0 && (
                      <span>
                        <i className="fas fa-hdd mr-1"></i>
                        {product.details.devices.join(', ')}
                      </span>
                    )}
                    
                    {product.details.features.length > 0 && (
                      <span>
                        <i className="fas fa-comments mr-1"></i>
                        {product.details.features.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 결합 할인 내역 */}
        {(bundleDiscounts.internetDiscount > 0 || bundleDiscounts.voipDiscount > 0 || bundleDiscounts.installationDiscount > 0) && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              <i className="fas fa-percent mr-2"></i>
              결합 할인 혜택
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bundleDiscounts.internetDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-700">인터넷 할인:</span>
                  <span className="font-semibold text-green-800">
                    -{bundleDiscounts.internetDiscount.toLocaleString()}원
                  </span>
                </div>
              )}
              
              {bundleDiscounts.voipDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-700">인터넷전화 할인:</span>
                  <span className="font-semibold text-green-800">
                    -{bundleDiscounts.voipDiscount.toLocaleString()}원
                  </span>
                </div>
              )}
              
              {bundleDiscounts.installationDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-700">설치비 할인:</span>
                  <span className="font-semibold text-green-800">
                    -{bundleDiscounts.installationDiscount.toLocaleString()}원
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 최종 요금 요약 */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-receipt mr-2"></i>
            요금 요약
          </h3>
          
          <div className="space-y-3">
            {/* 월 사용료 */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-700 font-medium">월 사용료 (VAT별도)</span>
              <span className="text-xl font-bold text-blue-600">
                {finalTotals.monthlyFee.toLocaleString()}원
              </span>
            </div>
            
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600 text-sm pl-4">VAT 포함</span>
              <span className="text-gray-600 font-medium">
                {finalTotals.monthlyFeeWithVAT.toLocaleString()}원
              </span>
            </div>

            {/* 설치비 */}
            {finalTotals.installationFee > 0 && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">설치비 (VAT별도)</span>
                  <span className="text-lg font-bold text-orange-600">
                    {finalTotals.installationFee.toLocaleString()}원
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600 text-sm pl-4">VAT 포함</span>
                  <span className="text-gray-600 font-medium">
                    {finalTotals.installationFeeWithVAT.toLocaleString()}원
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 주의사항 */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">
            <i className="fas fa-info-circle mr-2"></i>
            안내사항
          </h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• 위 요금은 부가세(VAT) 별도 금액입니다.</li>
            <li>• 실제 요금은 계약 조건에 따라 달라질 수 있습니다.</li>
            <li>• 상세한 약정 조건은 영업 담당자에게 문의하시기 바랍니다.</li>
            <li>• 설치비는 최초 1회만 발생합니다.</li>
          </ul>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <i className="fas fa-print mr-2"></i>
              인쇄하기
            </button>
            
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <i className="fas fa-share-alt mr-2"></i>
              공유하기
            </button>
          </div>
          
          <button
            onClick={onNewCalculation}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <i className="fas fa-plus mr-2"></i>
            새로운 계산
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard; 