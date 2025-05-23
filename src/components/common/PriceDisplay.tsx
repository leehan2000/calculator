import React from 'react';

interface PriceDisplayProps {
  amount: number;
  label?: string;
  isNegative?: boolean;
  className?: string;
}

/**
 * 가격 표시 컴포넌트
 * - 천 단위 구분 기호
 * - 음수/양수 표시
 * - 원 단위 표시
 */
const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  label,
  isNegative = false,
  className = ''
}) => {
  const formattedAmount = new Intl.NumberFormat('ko-KR').format(Math.abs(amount));
  const displayAmount = `${isNegative ? '-' : ''}${formattedAmount}원`;

  return (
    <span className={`inline-flex items-center ${className}`}>
      {label && (
        <span className="text-gray-600 mr-2">{label}</span>
      )}
      <span className={`font-medium ${isNegative ? 'text-red-600' : 'text-gray-900'}`}>
        {displayAmount}
      </span>
    </span>
  );
};

export default PriceDisplay; 