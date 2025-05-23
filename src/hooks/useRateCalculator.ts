import { useState, useEffect, useCallback } from 'react';
import { 
  RateData, 
  CalculatorInput, 
  CalculationResult, 
  MultiProductInput,
  MultiCalculationResult,
  SelectOptions 
} from '../types';
import { calculatePrice, calculateMultipleProducts, generateSelectOptions } from '../utils/calculatePrice';

/**
 * 복수 상품 계산기 훅 (메인 기능)
 */
export function useMultiRateCalculator() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rateData, setRateData] = useState<RateData | null>(null);
  const [calculationResult, setCalculationResult] = useState<MultiCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectOptions, setSelectOptions] = useState<SelectOptions>({
    categories: [],
    products: {},
    subProducts: {},
    options: {},
    devices: [],
    features: []
  });

  /**
   * 요금 데이터 로딩
   */
  useEffect(() => {
    const loadRateData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📊 요금 데이터 로딩 중...');
        const response = await fetch('/priceData.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 요금 데이터 로딩 완료:', data);
        
        // 데이터 구조 검증
        if (!data.priceData) {
          throw new Error('priceData가 없습니다.');
        }

        const rateData: RateData = {
          priceData: data.priceData,
          specialFeaturePrices: data.specialFeaturePrices || {},
          devicePrices: data.devicePrices || {},
          deviceStandalonePrices: data.deviceStandalonePrices || data.devicePrices || {},
          deviceBundledPrices: data.deviceBundledPrices || {},
          deviceFeatureDiscounts: data.deviceFeatureDiscounts || {},
          bundleDiscounts: data.bundleDiscounts || []
        };

        setRateData(rateData);
        
        // 선택 옵션 생성
        const options = generateSelectOptions(rateData);
        setSelectOptions({
          ...options,
          options: {}
        });
        
        console.log('📊 선택 옵션 생성 완료:', options);
        
      } catch (err) {
        console.error('📊 요금 데이터 로딩 실패:', err);
        setError(err instanceof Error ? err.message : '데이터 로딩 중 오류가 발생했습니다.');
        
        // 기본 데이터 설정
        setSelectOptions({
          categories: ['SME', '소호'],
          products: {
            'SME': ['인터넷', '인터넷전화', 'IPTV'],
            '소호': ['인터넷', '인터넷전화', 'AI전화', 'IPTV', '지능형CCTV', 'DX솔루션']
          },
          subProducts: {},
          options: {},
          devices: ['IP-450S', 'IP-450P', 'IP-300S', 'UHD', '가온'],
          features: ['없음', '자유통화4', '자유통화6', '자유통화8', '자유통화10']
        });
      } finally {
        setLoading(false);
      }
    };

    loadRateData();
  }, []);

  /**
   * 복수 상품 요금 계산 함수
   */
  const calculate = async (input: MultiProductInput): Promise<void> => {
    if (!rateData) {
      setError('요금 데이터가 로딩되지 않았습니다.');
      return;
    }

    try {
      setIsCalculating(true);
      setError(null);
      
      console.log('🧮 복수 상품 계산 요청:', input);
      
      // 선택된 상품이 있는지 확인
      const hasSelectedProducts = Object.values(input.products).some(product => product?.enabled);
      if (!hasSelectedProducts) {
        throw new Error('계산할 상품을 선택해주세요.');
      }

      // 복수 상품 계산 실행
      const result = calculateMultipleProducts(input, rateData);
      
      console.log('🧮 복수 상품 계산 결과:', result);
      setCalculationResult(result);
      
    } catch (err) {
      console.error('🧮 계산 중 오류:', err);
      setError(err instanceof Error ? err.message : '계산 중 오류가 발생했습니다.');
    } finally {
      setIsCalculating(false);
    }
  };

  /**
   * 계산 결과 초기화
   */
  const resetCalculation = (): void => {
    setCalculationResult(null);
    setError(null);
  };

  return {
    loading,
    error,
    calculationResult,
    isCalculating,
    selectOptions,
    calculate,
    resetCalculation
  };
}

/**
 * 단일 상품 계산기 훅 (기존 호환성 유지)
 */
export function useRateCalculator() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rateData, setRateData] = useState<RateData | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectOptions, setSelectOptions] = useState<SelectOptions>({
    categories: [],
    products: {},
    subProducts: {},
    options: {},
    devices: [],
    features: []
  });

  /**
   * 요금 데이터 로딩
   */
  useEffect(() => {
    const loadRateData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📊 요금 데이터 로딩 중...');
        const response = await fetch('/priceData.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 요금 데이터 로딩 완료:', data);
        
        // 데이터 구조 검증
        if (!data.priceData) {
          throw new Error('priceData가 없습니다.');
        }

        const rateData: RateData = {
          priceData: data.priceData,
          specialFeaturePrices: data.specialFeaturePrices || {},
          devicePrices: data.devicePrices || {},
          deviceStandalonePrices: data.deviceStandalonePrices || data.devicePrices || {},
          deviceBundledPrices: data.deviceBundledPrices || {},
          deviceFeatureDiscounts: data.deviceFeatureDiscounts || {},
          bundleDiscounts: data.bundleDiscounts || []
        };

        setRateData(rateData);
        
        // 선택 옵션 생성
        const options = generateSelectOptions(rateData);
        setSelectOptions({
          ...options,
          options: {}
        });
        
        console.log('📊 선택 옵션 생성 완료:', options);
        
      } catch (err) {
        console.error('📊 요금 데이터 로딩 실패:', err);
        setError(err instanceof Error ? err.message : '데이터 로딩 중 오류가 발생했습니다.');
        
        // 기본 데이터 설정
        setSelectOptions({
          categories: ['SME', '소호'],
          products: {
            'SME': ['인터넷', '인터넷전화', 'IPTV'],
            '소호': ['인터넷', '인터넷전화', 'AI전화', 'IPTV', '지능형CCTV', 'DX솔루션']
          },
          subProducts: {},
          options: {},
          devices: ['IP-450S', 'IP-450P', 'IP-300S', 'UHD', '가온'],
          features: ['없음', '자유통화4', '자유통화6', '자유통화8', '자유통화10']
        });
      } finally {
        setLoading(false);
      }
    };

    loadRateData();
  }, []);

  /**
   * 단일 상품 요금 계산 함수
   */
  const calculate = async (input: CalculatorInput): Promise<void> => {
    if (!rateData) {
      setError('요금 데이터가 로딩되지 않았습니다.');
      return;
    }

    try {
      setIsCalculating(true);
      setError(null);
      
      console.log('🧮 단일 상품 계산 요청:', input);
      
      // 단일 상품 계산 실행
      const result = calculatePrice(input, rateData);
      
      console.log('🧮 단일 상품 계산 결과:', result);
      setCalculationResult(result);
      
    } catch (err) {
      console.error('🧮 계산 중 오류:', err);
      setError(err instanceof Error ? err.message : '계산 중 오류가 발생했습니다.');
    } finally {
      setIsCalculating(false);
    }
  };

  /**
   * 계산 결과 초기화
   */
  const resetCalculation = (): void => {
    setCalculationResult(null);
    setError(null);
  };

  return {
    loading,
    error,
    calculationResult,
    isCalculating,
    selectOptions,
    calculate,
    resetCalculation
  };
}

/**
 * 기본 요금 데이터 (오류 시 폴백용)
 */
function getDefaultRateData(): RateData {
  return {
    priceData: {
      "SME": {
        "인터넷": {
          "100M": { "기본료": 30000, "장비임대료": 5000, "설치비": 30000 },
          "500M": { "기본료": 50000, "장비임대료": 5000, "설치비": 30000 },
          "1G": { "기본료": 70000, "장비임대료": 5000, "설치비": 30000 }
        },
        "인터넷전화": {
          "DCS": {
            "종량제": { "기본료": 5000, "장비임대료": 3000, "설치비": 20000 },
            "정액제": { "기본료": 10000, "장비임대료": 3000, "설치비": 20000 }
          },
          "일반형": { "기본료": 5000, "장비임대료": 2000, "설치비": 15000 }
        }
      },
      "소호": {
        "인터넷": {
          "유선인터넷": {
            "100M": { "기본료": 28000, "장비임대료": 5000, "설치비": 30000 },
            "500M": { "기본료": 45000, "장비임대료": 5000, "설치비": 30000 }
          }
        },
        "인터넷전화": {
          "일반형": { "기본료": 4500, "장비임대료": 2000, "설치비": 15000 }
        }
      }
    },
    specialFeaturePrices: {
      "DCS": {
        "없음": 0,
        "자유통화4": 4000,
        "자유통화6": 6000,
        "자유통화8": 8000,
        "자유통화10": 10000
      },
      "일반형": {
        "없음": 0,
        "자유통화4": 4000,
        "자유통화6": 6000
      }
    },
    devicePrices: {
      "IP-450S": 1389,
      "IP-450P": 1667,
      "IP-300S": 1111,
      "UHD": 4000,
      "가온": 3000
    },
    deviceStandalonePrices: {
      "IP-450S": 1389,
      "IP-450P": 1667,
      "IP-300S": 1111,
      "UHD": 4000,
      "가온": 3000
    },
    deviceBundledPrices: {
      "IP-450S": 556,
      "IP-450P": 1389,
      "IP-300S": 0,
      "UHD": 4000,
      "가온": 3000
    },
    deviceFeatureDiscounts: {
      "IP-450S": {
        "자유통화4": { "type": "percent", "value": 100 },
        "자유통화6": { "type": "percent", "value": 100 },
        "AI전화": { "type": "percent", "value": 100 }
      }
    },
    bundleDiscounts: []
  };
} 