import React from 'react';
import CalculatorForm from './components/CalculatorForm';
import ResultCard from './components/ResultCard';
import { useMultiRateCalculator } from './hooks/useRateCalculator';

/**
 * 메인 애플리케이션 컴포넌트
 * 
 * 주요 기능:
 * - 복수 상품 동시 선택 및 계산
 * - 계산 결과 표시
 * - 에러 처리 및 로딩 상태 관리
 */
function App() {
  const {
    loading,
    error,
    calculationResult,
    isCalculating,
    selectOptions,
    calculate,
    resetCalculation
  } = useMultiRateCalculator();

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            데이터를 로딩 중입니다
          </h2>
          <p className="text-gray-500">
            요금 정보를 불러오는 중입니다. 잠시만 기다려주세요.
          </p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-2xl text-red-600"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            데이터 로딩 실패
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            <i className="fas fa-redo mr-2"></i>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  <i className="fas fa-calculator text-blue-600 mr-2"></i>
                  브이원 요금계산기
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <span className="text-sm text-gray-500">
                  Version 2.0 - 복수 상품 동시 계산
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* 계산 결과가 없을 때 - 입력 폼 표시 */}
          {!calculationResult && (
            <div className="space-y-6">
              {/* 안내 메시지 */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-info-circle text-blue-400"></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      복수 상품 동시 계산
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        이제 여러 상품을 동시에 선택하고 한 번에 계산할 수 있습니다. 
                        필요한 상품들을 체크하고 각각의 옵션을 설정해보세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 계산기 폼 */}
              <CalculatorForm
                selectOptions={selectOptions}
                isCalculating={isCalculating}
                onCalculate={calculate}
                onReset={resetCalculation}
              />
            </div>
          )}

          {/* 계산 결과가 있을 때 - 결과 표시 */}
          {calculationResult && (
            <div className="space-y-6">
              <ResultCard
                result={calculationResult}
                onNewCalculation={resetCalculation}
              />
              
              {/* 다시 계산하기 버튼 */}
              <div className="text-center">
                <button
                  onClick={resetCalculation}
                  className="btn-secondary"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  다른 상품 계산하기
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 회사 정보 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                회사 정보
              </h3>
              <div className="mt-4 space-y-4">
                <p className="text-base text-gray-500">
                  브이원 기업인터넷
                </p>
                <p className="text-sm text-gray-500">
                  최적의 인터넷 솔루션을 제공합니다.
                </p>
              </div>
            </div>

            {/* 서비스 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                서비스
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <span className="text-base text-gray-500">기업인터넷</span>
                </li>
                <li>
                  <span className="text-base text-gray-500">인터넷전화</span>
                </li>
                <li>
                  <span className="text-base text-gray-500">IPTV</span>
                </li>
                <li>
                  <span className="text-base text-gray-500">스마트오피스</span>
                </li>
              </ul>
            </div>

            {/* 고객 지원 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                고객 지원
              </h3>
              <div className="mt-4 space-y-2">
                <p className="text-base text-gray-500">
                  고객센터: 1577-0000
                </p>
                <p className="text-sm text-gray-500">
                  운영시간: 평일 09:00 - 18:00
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-center text-sm text-gray-400">
              © 2024 브이원. All rights reserved. 
              <span className="ml-2">
                계산 결과는 참고용이며, 실제 요금은 계약 조건에 따라 달라질 수 있습니다.
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 