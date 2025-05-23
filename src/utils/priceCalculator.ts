import { 
  PriceData, 
  CustomerType, 
  ProductCategory, 
  BundleDiscount,
  CalculationResult,
  PriceInfo
} from '../types/price';

/**
 * VAT 세율
 */
const VAT_RATE = 0.1;

/**
 * 상품별 가격 계산
 * @param priceData 전체 가격 데이터
 * @param customerType 고객 유형 (SME/소호)
 * @param category 상품 카테고리
 * @param productName 상품명
 * @param options 선택 옵션
 */
export const calculateProductPrice = (
  priceData: PriceData,
  customerType: CustomerType,
  category: ProductCategory,
  productName: string,
  options?: string[]
): number => {
  const categoryData = priceData.priceData[customerType][category];
  if (!categoryData) return 0;

  const productData = categoryData[productName];
  if (!productData) return 0;

  const getPriceFromInfo = (info: PriceInfo) => info.기본료 + info.장비임대료;

  if ('기본료' in productData) {
    return getPriceFromInfo(productData as PriceInfo);
  }

  // 옵션이 있는 상품의 경우
  if (options && options.length > 0) {
    const selectedOption = options[0];
    const optionData = (productData as {[key: string]: PriceInfo})[selectedOption];
    if (optionData) {
      return getPriceFromInfo(optionData);
    }
  }

  return 0;
};

/**
 * 결합할인 계산
 * @param priceData 전체 가격 데이터
 * @param customerType 고객 유형
 * @param selectedProducts 선택된 상품 목록
 */
export const calculateBundleDiscount = (
  priceData: PriceData,
  customerType: CustomerType,
  selectedProducts: Array<{category: ProductCategory; name: string; options?: string[]}>
): {
  internetDiscount: number;
  voipDiscount: number;
  installationDiscount: number;
} => {
  const result = {
    internetDiscount: 0,
    voipDiscount: 0,
    installationDiscount: 0
  };

  // 선택된 상품이 2개 미만이면 할인 없음
  if (selectedProducts.length < 2) return result;

  // 결합 상품 구성 확인
  const productTypes = selectedProducts.map(p => p.category);
  const hasInternet = productTypes.includes('인터넷');
  const hasVoip = productTypes.includes('인터넷전화');

  // 인터넷이 포함된 결합만 할인 적용
  if (!hasInternet) return result;

  // 적용 가능한 할인 찾기
  const applicableDiscounts = priceData.bundleDiscounts.filter(discount => 
    discount.category === customerType
  );

  if (applicableDiscounts.length === 0) return result;

  // 가장 높은 할인 적용
  const bestDiscount = applicableDiscounts.reduce((best, current) => {
    const totalCurrent = current.internetDiscount + current.voipDiscount + current.installationDiscount;
    const totalBest = best.internetDiscount + best.voipDiscount + best.installationDiscount;
    return totalCurrent > totalBest ? current : best;
  });

  return {
    internetDiscount: bestDiscount.internetDiscount,
    voipDiscount: hasVoip ? bestDiscount.voipDiscount : 0,
    installationDiscount: bestDiscount.installationDiscount
  };
};

/**
 * 전체 요금 계산
 * @param priceData 전체 가격 데이터
 * @param customerType 고객 유형
 * @param selectedProducts 선택된 상품 목록
 */
export const calculateTotalPrice = (
  priceData: PriceData,
  customerType: CustomerType,
  selectedProducts: Array<{category: ProductCategory; name: string; options?: string[]}>
): CalculationResult => {
  // 각 상품별 가격 계산
  const products = selectedProducts.map(product => ({
    name: product.name,
    price: calculateProductPrice(
      priceData,
      customerType,
      product.category,
      product.name,
      product.options
    ),
    options: product.options
  }));

  // 월 사용료 계산
  const monthlyFee = products.reduce((sum, product) => sum + product.price, 0);

  // 결합할인 계산
  const discounts = calculateBundleDiscount(priceData, customerType, selectedProducts);

  // 총액 계산
  const totalBeforeVat = monthlyFee - discounts.internetDiscount - discounts.voipDiscount;
  const totalWithVat = totalBeforeVat * (1 + VAT_RATE);

  return {
    monthlyFee,
    internetDiscount: discounts.internetDiscount + discounts.voipDiscount,
    installationDiscount: discounts.installationDiscount,
    totalBeforeVat,
    totalWithVat,
    selectedProducts: products
  };
}; 