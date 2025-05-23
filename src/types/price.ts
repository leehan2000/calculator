/**
 * 가격 데이터 관련 타입 정의
 */

// 기본 가격 정보 인터페이스
export interface PriceInfo {
  기본료: number;
  장비임대료: number;
  설치비: number;
}

// 상품 카테고리 타입
export type ProductCategory = '인터넷' | '인터넷전화' | 'IPTV' | 'AI전화' | '지능형CCTV' | 'DX솔루션';

// 고객 유형 타입
export type CustomerType = 'SME' | '소호';

// 인터넷 속도 타입
export type InternetSpeed = '100M' | '500M' | '1G';

// 인터넷 상품 타입
export type InternetType = '유선인터넷' | '인터넷_결제안심' | '무선인터넷';

// 인터넷전화 상품 타입
export type VoipType = 'DCS' | '고급형DCS' | '고급형센트릭스' | '일반형';

// 자유통화 옵션 타입
export type FreeCallOption = 
  | '없음' 
  | '자유통화3' 
  | '자유통화4' 
  | '자유통화6' 
  | '자유통화8' 
  | '자유통화10'
  | '자유통화15'
  | '자유통화20'
  | '자유통화30'
  | '자유통화50';

// 결합할인 정보 인터페이스
export interface BundleDiscount {
  category: CustomerType;
  bundleType: string;
  displayName: string;
  internetDiscount: number;
  voipDiscount: number;
  installationDiscount: number;
}

// 전체 가격 데이터 인터페이스
export interface PriceData {
  priceData: {
    [K in CustomerType]: {
      [P in ProductCategory]?: {
        [key: string]: PriceInfo | {
          [key: string]: PriceInfo
        }
      }
    }
  };
  bundleDiscounts: BundleDiscount[];
  // TODO: 사은품 관련 데이터 구조 추가 예정
  // gifts?: {
  //   [productId: string]: {
  //     cashback?: number;
  //     items?: Array<{
  //       name: string;
  //       value: number;
  //     }>;
  //   }
  // };
}

// 계산 결과 인터페이스
export interface CalculationResult {
  monthlyFee: number;
  internetDiscount: number;
  installationDiscount: number;
  totalBeforeVat: number;
  totalWithVat: number;
  selectedProducts: {
    name: string;
    price: number;
    options?: string[];
  }[];
} 