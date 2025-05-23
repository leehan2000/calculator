import { 
  RateData, 
  CalculatorInput, 
  CalculationResult, 
  MultiProductInput,
  MultiCalculationResult,
  ProductCalculationResult,
  ProductSelection,
  PriceInfo,
  BundleDiscount 
} from '../types';

/**
 * PriceInfo 타입 가드 함수
 */
function isPriceInfo(obj: any): obj is PriceInfo {
  return obj && 
         typeof obj === 'object' && 
         typeof obj.기본료 === 'number' && 
         typeof obj.장비임대료 === 'number' && 
         typeof obj.설치비 === 'number';
}

/**
 * 복수 상품 동시 계산 함수 (메인 기능)
 * @param input 복수 상품 입력 데이터
 * @param rateData 요금 데이터
 * @returns 복수 상품 계산 결과
 */
export function calculateMultipleProducts(
  input: MultiProductInput, 
  rateData: RateData
): MultiCalculationResult {
  console.log('🧮 복수 상품 계산 시작:', input);

  const { category, products } = input;
  const productResults: ProductCalculationResult[] = [];
  
  let totalBasicFee = 0;
  let totalDeviceFee = 0;
  let totalInstallationFee = 0;
  let totalSpecialFeatureFee = 0;

  // 각 상품별 계산
  Object.entries(products).forEach(([productName, selection]) => {
    if (!selection?.enabled) return;

    const result = calculateSingleProduct(
      category, 
      productName, 
      selection, 
      rateData
    );

    if (result) {
      productResults.push(result);
      totalBasicFee += result.basicFee;
      totalDeviceFee += result.deviceFee;
      totalInstallationFee += result.installationFee;
      totalSpecialFeatureFee += result.specialFeatureFee;
    }
  });

  // 결합 할인 계산
  const bundleDiscounts = calculateBundleDiscounts(
    category, 
    productResults, 
    rateData.bundleDiscounts
  );

  // 최종 금액 계산
  const monthlyFeeBeforeDiscount = totalBasicFee + totalDeviceFee + totalSpecialFeatureFee;
  const totalMonthlyDiscount = bundleDiscounts.internetDiscount + bundleDiscounts.voipDiscount;
  const monthlyFee = Math.max(0, Math.floor((monthlyFeeBeforeDiscount - totalMonthlyDiscount) / 10) * 10);
  const monthlyFeeWithVAT = Math.round(monthlyFee * 1.1);
  
  const installationFee = Math.max(0, totalInstallationFee - bundleDiscounts.installationDiscount);
  const installationFeeWithVAT = Math.round(installationFee * 1.1);

  // 상세 내역 생성
  const productDetails = productResults.map(result => 
    `${result.productName}: 기본료 ${result.basicFee.toLocaleString()}원 + 장비 ${result.deviceFee.toLocaleString()}원`
  );

  const discountDetails: string[] = [];
  if (bundleDiscounts.internetDiscount > 0) {
    discountDetails.push(`인터넷 할인: -${bundleDiscounts.internetDiscount.toLocaleString()}원`);
  }
  if (bundleDiscounts.voipDiscount > 0) {
    discountDetails.push(`인터넷전화 할인: -${bundleDiscounts.voipDiscount.toLocaleString()}원`);
  }
  if (bundleDiscounts.installationDiscount > 0) {
    discountDetails.push(`설치비 할인: -${bundleDiscounts.installationDiscount.toLocaleString()}원`);
  }

  console.log('🧮 복수 상품 계산 완료:', {
    monthlyFee,
    monthlyFeeWithVAT,
    installationFee,
    productResults: productResults.length
  });

  return {
    productResults,
    totalBasicFee,
    totalDeviceFee,
    totalInstallationFee,
    totalSpecialFeatureFee,
    bundleDiscounts,
    finalTotals: {
      monthlyFee,
      monthlyFeeWithVAT,
      installationFee,
      installationFeeWithVAT
    },
    breakdown: {
      productDetails,
      discountDetails
    }
  };
}

/**
 * 개별 상품 계산 함수
 */
function calculateSingleProduct(
  category: string,
  productName: string,
  selection: ProductSelection,
  rateData: RateData
): ProductCalculationResult | null {
  const {
    subProduct,
    option,
    lines = 1,
    device,
    feature,
    wifi,
    quantity = 1
  } = selection;

  let basicFee = 0;
  let deviceFee = 0;
  let installationFee = 0;
  let specialFeatureFee = 0;
  let deviceDiscountAmount = 0;

  const devices: string[] = [];
  const features: string[] = [];

  // 1. 기본 요금 계산
  const priceInfo = findPriceInfo(category, productName, subProduct, option, rateData);
  
  if (priceInfo) {
    const qty = lines || quantity || 1;
    
    basicFee = priceInfo.기본료 * qty;
    deviceFee += priceInfo.장비임대료 * qty;
    installationFee = priceInfo.설치비;
  }

  // 2. 단말기 가격 계산
  if (device) {
    const deviceResult = calculateDevicePrice(device, feature, rateData, lines || quantity || 1, category, productName);
    deviceFee += deviceResult.price;
    deviceDiscountAmount += deviceResult.discountAmount || 0;
    devices.push(device);
  }

  // 3. WIFI 요금 계산
  if (wifi && rateData.devicePrices[wifi]) {
    const wifiPrice = rateData.devicePrices[wifi] * (lines || quantity || 1);
    deviceFee += wifiPrice;
    devices.push(wifi);
  }

  // 4. 자유통화 요금 계산
  if (feature && feature !== '없음' && productName === '인터넷전화') {
    const featurePrice = calculateFeaturePrice(subProduct || '일반형', feature, rateData);
    specialFeatureFee = featurePrice * (lines || quantity || 1);
    features.push(feature);
  }

  console.log(`개별 상품 계산: ${productName}`, {
    basicFee,
    deviceFee,
    installationFee,
    specialFeatureFee
  });

  return {
    productName,
    basicFee,
    deviceFee,
    installationFee,
    specialFeatureFee,
    deviceDiscountAmount,
    details: {
      priceInfo: priceInfo || undefined,
      lines: lines || quantity || 1,
      devices,
      features
    }
  };
}

/**
 * 결합 할인 계산 함수
 */
function calculateBundleDiscounts(
  category: string,
  productResults: ProductCalculationResult[],
  bundleDiscountRules: BundleDiscount[]
): { internetDiscount: number; voipDiscount: number; installationDiscount: number } {
  const selectedProducts = productResults.map(result => result.productName);
  const selectedFeatures: { [product: string]: string[] } = {};
  
  // 자유통화 정보 수집
  productResults.forEach(result => {
    if (result.details.features.length > 0) {
      selectedFeatures[result.productName] = result.details.features;
    }
  });

  let maxInternetDiscount = 0;
  let maxVoipDiscount = 0;
  let maxInstallationDiscount = 0;

  // 회선 수 계산
  const internetLines = productResults
    .filter(r => r.productName === '인터넷')
    .reduce((sum, r) => sum + r.details.lines, 0);
  
  const voipLines = productResults
    .filter(r => r.productName === '인터넷전화' || r.productName === 'AI전화')
    .reduce((sum, r) => sum + r.details.lines, 0);

  // 결합 할인 규칙 적용
  bundleDiscountRules.forEach(discount => {
    if (discount.category !== category) return;
    if (!Array.isArray(discount.productKeys) || discount.productKeys.length === 0) return;

    const allProductKeysFound = discount.productKeys.every(key => {
      return selectedProducts.some(product => 
        product === key || product.includes(key) || key.includes(product)
      );
    });

    let featureRangeMatched = true;
    if (discount.featureRange && allProductKeysFound) {
      featureRangeMatched = false;
      Object.values(selectedFeatures).forEach(features => {
        features.forEach(feature => {
          if (feature.startsWith(discount.featureRange!.feature)) {
            const match = feature.match(/자유통화\s*(\d+)/);
            if (match) {
              const value = parseInt(match[1]);
              if (value >= discount.featureRange!.min && value <= discount.featureRange!.max) {
                featureRangeMatched = true;
              }
            }
          }
        });
      });
    }

    if (allProductKeysFound && featureRangeMatched) {
      if (discount.internetDiscount > maxInternetDiscount) {
        maxInternetDiscount = discount.internetDiscount;
      }
      if (discount.voipDiscount > maxVoipDiscount) {
        maxVoipDiscount = discount.voipDiscount;
      }
      if (discount.installationDiscount > maxInstallationDiscount) {
        maxInstallationDiscount = discount.installationDiscount;
      }
    }
  });

  return {
    internetDiscount: maxInternetDiscount * internetLines,
    voipDiscount: maxVoipDiscount * voipLines,
    installationDiscount: maxInstallationDiscount
  };
}

/**
 * 단일 상품 요금 계산 함수 (기존 호환성 유지)
 * @param input 계산기 입력 데이터
 * @param rateData 요금 데이터
 * @returns 계산 결과
 */
export function calculatePrice(
  input: CalculatorInput, 
  rateData: RateData
): CalculationResult {
  console.log('🧮 단일 상품 계산 시작:', input);

  const {
    category,
    product,
    subProduct,
    option,
    lines = 1,
    device,
    feature,
    wifi,
    quantity = 1
  } = input;

  let basicFee = 0;
  let deviceFee = 0;
  let installationFee = 0;
  let specialFeatureFee = 0;
  let internetDiscount = 0;
  let voipDiscount = 0;
  let installationDiscount = 0;

  const basicFeeDetails: string[] = [];
  const deviceFeeDetails: string[] = [];
  const discountDetails: string[] = [];

  // 1. 기본 요금 계산
  const priceInfo = findPriceInfo(category, product, subProduct, option, rateData);
  
  if (priceInfo) {
    const quantity_or_lines = lines || quantity || 1;
    
    // 기본료 계산
    basicFee = priceInfo.기본료 * quantity_or_lines;
    deviceFee += priceInfo.장비임대료 * quantity_or_lines;
    installationFee = priceInfo.설치비;

    // 상세 내역 추가
    let productName = product;
    if (subProduct) productName += ` ${subProduct}`;
    if (option) productName += ` ${option}`;
    
    basicFeeDetails.push(`${productName} 기본료: ${priceInfo.기본료.toLocaleString()}원 x ${quantity_or_lines}`);
    
    if (priceInfo.장비임대료 > 0) {
      deviceFeeDetails.push(`${productName} 장비임대료: ${priceInfo.장비임대료.toLocaleString()}원 x ${quantity_or_lines}`);
    }
  } else {
    console.warn(`요금 정보를 찾을 수 없음: ${category} - ${product} - ${subProduct} - ${option}`);
  }

  // 2. 단말기 가격 계산
  if (device) {
    const devicePrice = calculateDevicePrice(device, feature, rateData, lines || quantity || 1, category, product);
    deviceFee += devicePrice.price;
    if (devicePrice.details) {
      deviceFeeDetails.push(devicePrice.details);
    }
  }

  // 3. WIFI 요금 계산
  if (wifi && rateData.devicePrices[wifi]) {
    const wifiPrice = rateData.devicePrices[wifi] * (lines || quantity || 1);
    deviceFee += wifiPrice;
    deviceFeeDetails.push(`WIFI(${wifi}): ${rateData.devicePrices[wifi].toLocaleString()}원 x ${lines || quantity || 1}`);
  }

  // 4. 자유통화 요금 계산
  if (feature && feature !== '없음' && product === '인터넷전화') {
    const featurePrice = calculateFeaturePrice(subProduct || '일반형', feature, rateData);
    specialFeatureFee = featurePrice * (lines || quantity || 1);
  }

  // 5. 결합 할인 계산 (단일 상품이므로 결합 할인은 적용되지 않음)
  // 하지만 향후 확장을 위해 구조는 유지

  // 6. 최종 계산
  const totalBeforeDiscount = basicFee + deviceFee + specialFeatureFee;
  const totalDiscount = internetDiscount + voipDiscount;
  const totalMonthlyFee = Math.max(0, Math.floor((totalBeforeDiscount - totalDiscount) / 10) * 10);
  const totalWithVAT = Math.round(totalMonthlyFee * 1.1);

  console.log('🧮 단일 상품 계산 완료:', {
    basicFee,
    deviceFee,
    installationFee,
    specialFeatureFee,
    totalMonthlyFee,
    totalWithVAT
  });

  return {
    basicFee,
    deviceFee,
    installationFee,
    specialFeatureFee,
    internetDiscount,
    voipDiscount,
    installationDiscount,
    totalMonthlyFee,
    totalWithVAT,
    breakdown: {
      basicFeeDetails,
      deviceFeeDetails,
      discountDetails
    }
  };
}

/**
 * 요금 정보 조회 함수
 */
function findPriceInfo(
  category: string,
  product: string,
  subProduct?: string,
  option?: string,
  rateData?: RateData
): PriceInfo | null {
  if (!rateData?.priceData[category as 'SME' | '소호']?.[product]) {
    return null;
  }

  const productData = rateData.priceData[category as 'SME' | '소호'][product];

  try {
    // 1. subProduct + option
    if (subProduct && option && productData[subProduct]) {
      const subProductData = productData[subProduct];
      if (typeof subProductData === 'object' && !isPriceInfo(subProductData)) {
        const optionData = (subProductData as any)[option];
        if (isPriceInfo(optionData)) {
          return optionData;
        }
      }
    }
    
    // 2. subProduct만
    if (subProduct && productData[subProduct]) {
      const subProductData = productData[subProduct];
      if (isPriceInfo(subProductData)) {
        return subProductData;
      }
    }
    
    // 3. option만 (직접 상품 하위에 있는 경우)
    if (option && productData[option]) {
      const optionData = productData[option];
      if (isPriceInfo(optionData)) {
        return optionData;
      }
    }
    
    // 4. 직접 요금이 있는 경우
    if (isPriceInfo(productData)) {
      return productData;
    }
    
    // 5. CCTV 등 특수 처리
    if (product === "지능형CCTV") {
      const key = subProduct || option;
      if (key && productData[key] && isPriceInfo(productData[key])) {
        return productData[key] as PriceInfo;
      }
    }
  } catch (error) {
    console.error('요금 정보 조회 중 오류:', error);
  }

  return null;
}

/**
 * 단말기 가격 계산
 */
function calculateDevicePrice(
  device: string,
  feature?: string,
  rateData?: RateData,
  quantity: number = 1,
  category?: string,
  product?: string
): { price: number; details?: string; discountAmount?: number } {
  if (!rateData || !device) {
    return { price: 0 };
  }

  let devicePrice = 0;
  let discountAmount = 0;
  let details = '';

  // 인터넷과 함께 설치하는지 확인 (번들 할인 적용)
  const hasInternet = category && product !== '인터넷'; // 단순화: 인터넷이 아닌 상품은 번들로 가정

  // 가격 결정: 번들 vs 단독
  if (hasInternet && rateData.deviceBundledPrices?.[device]) {
    devicePrice = rateData.deviceBundledPrices[device];
  } else if (rateData.deviceStandalonePrices?.[device]) {
    devicePrice = rateData.deviceStandalonePrices[device];
  } else if (rateData.devicePrices?.[device]) {
    devicePrice = rateData.devicePrices[device];
  }

  // 자유통화/AI전화 할인 적용
  if (feature && feature !== '없음' && 
      rateData.deviceFeatureDiscounts?.[device]?.[feature]) {
    const discount = rateData.deviceFeatureDiscounts[device][feature];
    if (discount.type === 'percent') {
      const originalPrice = devicePrice;
      discountAmount = devicePrice * discount.value / 100;
      devicePrice -= discountAmount;
      details = `${device} (${feature} ${discount.value}% 할인 적용): ${Math.floor(devicePrice).toLocaleString()}원 x ${quantity}`;
    }
  } else {
    if (devicePrice === 0) {
      details = `${device}: 무상 임대`;
    } else {
      details = `${device}: ${Math.floor(devicePrice).toLocaleString()}원 x ${quantity}`;
    }
  }

  return {
    price: Math.floor(devicePrice) * quantity,
    details,
    discountAmount: discountAmount * quantity
  };
}

/**
 * 자유통화 요금 계산
 */
function calculateFeaturePrice(
  subProduct: string,
  feature: string,
  rateData?: RateData
): number {
  if (!rateData?.specialFeaturePrices || !feature || feature === '없음') {
    return 0;
  }

  // 새로운 구조 (subProduct별로 객체가 있는 경우)
  if (rateData.specialFeaturePrices[subProduct] && 
      typeof rateData.specialFeaturePrices[subProduct] === 'object' &&
      rateData.specialFeaturePrices[subProduct][feature] !== undefined) {
    return rateData.specialFeaturePrices[subProduct][feature];
  }
  
  // 기존 구조 (단순 키-값 구조인 경우)
  if (typeof rateData.specialFeaturePrices[feature] === 'number') {
    return rateData.specialFeaturePrices[feature];
  }

  return 0;
}

/**
 * 선택 가능한 옵션들을 생성하는 함수
 */
export function generateSelectOptions(rateData?: RateData): {
  categories: string[];
  products: { [category: string]: string[] };
  subProducts: { [category: string]: { [product: string]: string[] } };
  devices: string[];
  features: string[];
} {
  if (!rateData) {
    return {
      categories: [],
      products: {},
      subProducts: {},
      devices: [],
      features: []
    };
  }

  const categories = Object.keys(rateData.priceData);
  
  const products: { [category: string]: string[] } = {};
  const subProducts: { [category: string]: { [product: string]: string[] } } = {};

  categories.forEach(category => {
    products[category] = Object.keys(rateData.priceData[category as 'SME' | '소호']);
    subProducts[category] = {};
    
    products[category].forEach(product => {
      const productData = rateData.priceData[category as 'SME' | '소호'][product];
      subProducts[category][product] = Object.keys(productData).filter(key => 
        typeof productData[key] === 'object' && 
        (!isPriceInfo(productData[key]) || Object.keys(productData[key]).some(subKey => 
          typeof (productData[key] as any)[subKey] === 'object' && isPriceInfo((productData[key] as any)[subKey])
        ))
      );
    });
  });

  const devices = Object.keys(rateData.devicePrices || {});
  
  // 자유통화 옵션 추출
  const features = new Set<string>();
  Object.values(rateData.specialFeaturePrices || {}).forEach(featureObj => {
    if (typeof featureObj === 'object') {
      Object.keys(featureObj).forEach(feature => features.add(feature));
    }
  });

  return {
    categories,
    products,
    subProducts,
    devices,
    features: Array.from(features)
  };
} 