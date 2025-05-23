// 요금 정보 기본 구조
export interface PriceInfo {
  기본료: number;
  장비임대료: number;
  설치비: number;
}

// 카테고리별 요금 데이터 구조
export interface CategoryPriceData {
  [product: string]: {
    [subProduct: string]: PriceInfo | {
      [option: string]: PriceInfo;
    };
  };
}

// 전체 요금 데이터 구조
export interface PriceData {
  SME: CategoryPriceData;
  소호: CategoryPriceData;
}

// 자유통화 요금 구조
export interface SpecialFeaturePrices {
  [productType: string]: {
    [featureName: string]: number;
  };
}

// 단말기 가격 구조
export interface DevicePrices {
  [deviceName: string]: number;
}

// 단말기 할인 정보
export interface DeviceFeatureDiscount {
  type: 'percent' | 'fixed';
  value: number;
}

// 단말기별 자유통화 할인 구조
export interface DeviceFeatureDiscounts {
  [deviceName: string]: {
    [featureName: string]: DeviceFeatureDiscount;
  };
}

// 결합 할인 구조
export interface BundleDiscount {
  category: string;
  productKeys: string[];
  featureRange?: {
    feature: string;
    min: number;
    max: number;
  } | null;
  displayName: string | object;
  internetDiscount: number;
  voipDiscount: number;
  installationDiscount: number;
}

// 전체 요금 계산 데이터
export interface RateData {
  priceData: PriceData;
  specialFeaturePrices: SpecialFeaturePrices;
  devicePrices: DevicePrices;
  deviceStandalonePrices: DevicePrices;
  deviceBundledPrices: DevicePrices;
  deviceFeatureDiscounts: DeviceFeatureDiscounts;
  bundleDiscounts: BundleDiscount[];
}

// 개별 상품 선택 정보
export interface ProductSelection {
  enabled: boolean;
  subProduct?: string;
  option?: string;
  lines: number;
  device?: string;
  feature?: string;
  wifi?: string;
  quantity?: number;
}

// 복수 상품 선택을 위한 새로운 입력 구조
export interface MultiProductInput {
  category: 'SME' | '소호';
  products: {
    인터넷?: ProductSelection;
    인터넷전화?: ProductSelection;
    AI전화?: ProductSelection;
    IPTV?: ProductSelection;
    '지능형CCTV'?: ProductSelection;
    'DX솔루션'?: ProductSelection;
  };
}

// 개별 상품 계산 결과
export interface ProductCalculationResult {
  productName: string;
  basicFee: number;
  deviceFee: number;
  installationFee: number;
  specialFeatureFee: number;
  deviceDiscountAmount: number;
  details: {
    priceInfo?: PriceInfo;
    lines: number;
    devices: string[];
    features: string[];
  };
}

// 전체 계산 결과
export interface MultiCalculationResult {
  productResults: ProductCalculationResult[];
  totalBasicFee: number;
  totalDeviceFee: number;
  totalInstallationFee: number;
  totalSpecialFeatureFee: number;
  bundleDiscounts: {
    internetDiscount: number;
    voipDiscount: number;
    installationDiscount: number;
  };
  finalTotals: {
    monthlyFee: number;
    monthlyFeeWithVAT: number;
    installationFee: number;
    installationFeeWithVAT: number;
  };
  breakdown: {
    productDetails: string[];
    discountDetails: string[];
  };
}

// 기존 단일 상품용 (하위 호환성)
export interface CalculatorInput {
  category: 'SME' | '소호';
  product: string;
  subProduct?: string;
  option?: string;
  lines: number;
  device?: string;
  feature?: string;
  wifi?: string;
  quantity?: number;
}

// 기존 단일 계산 결과 (하위 호환성)
export interface CalculationResult {
  basicFee: number;
  deviceFee: number;
  installationFee: number;
  specialFeatureFee: number;
  internetDiscount: number;
  voipDiscount: number;
  installationDiscount: number;
  totalMonthlyFee: number;
  totalWithVAT: number;
  breakdown: {
    basicFeeDetails: string[];
    deviceFeeDetails: string[];
    discountDetails: string[];
  };
}

// 선택 옵션들
export interface SelectOptions {
  categories: string[];
  products: {
    [category: string]: string[];
  };
  subProducts: {
    [category: string]: {
      [product: string]: string[];
    };
  };
  options: {
    [category: string]: {
      [product: string]: {
        [subProduct: string]: string[];
      };
    };
  };
  devices: string[];
  features: string[];
} 