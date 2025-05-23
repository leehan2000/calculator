import React, { useRef, useState } from 'react';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface DataManagerProps {
  onDataUpdate: (data: any) => void;
  currentData: any;
}

/**
 * 데이터 관리 컴포넌트
 * 
 * 주요 기능:
 * - 엑셀 파일 업로드/다운로드
 * - 요금 데이터 동적 관리
 * - 결합할인 규칙 편집
 */
const DataManager: React.FC<DataManagerProps> = ({ onDataUpdate, currentData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * 엑셀 파일 업로드 처리
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadMessage('');

    try {
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      // 첫 번째 워크시트 가져오기
      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error('워크시트를 찾을 수 없습니다.');
      }

      // 데이터 파싱
      const parsedData = parseExcelData(worksheet);
      
      // 데이터 업데이트
      onDataUpdate(parsedData);
      setUploadMessage('데이터가 성공적으로 업로드되었습니다.');
      
    } catch (error) {
      console.error('파일 업로드 에러:', error);
      setUploadMessage(`업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsProcessing(false);
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * 엑셀 데이터 파싱
   */
  const parseExcelData = (worksheet: ExcelJS.Worksheet) => {
    const data: any = {
      internetRates: {},
      phoneRates: {},
      iptvRates: {},
      cctvRates: {},
      dxRates: {},
      bundleDiscounts: {}
    };

    // 행별로 데이터 읽기
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // 헤더 스킵

      const values = row.values as any[];
      if (!values || values.length < 4) return;

      const category = values[1]?.toString()?.trim();
      const subCategory = values[2]?.toString()?.trim();
      const product = values[3]?.toString()?.trim();
      const price = parseFloat(values[4]?.toString() || '0');

      if (!category || !product || isNaN(price)) return;

      // 카테고리별 데이터 분류
      switch (category.toLowerCase()) {
        case '인터넷':
        case 'internet':
          if (!data.internetRates[subCategory]) {
            data.internetRates[subCategory] = {};
          }
          data.internetRates[subCategory][product] = price;
          break;

        case '인터넷전화':
        case 'phone':
          if (!data.phoneRates[subCategory]) {
            data.phoneRates[subCategory] = {};
          }
          data.phoneRates[subCategory][product] = price;
          break;

        case 'iptv':
          if (!data.iptvRates[subCategory]) {
            data.iptvRates[subCategory] = {};
          }
          data.iptvRates[subCategory][product] = price;
          break;

        case 'cctv':
        case '지능형cctv':
          if (!data.cctvRates[subCategory]) {
            data.cctvRates[subCategory] = {};
          }
          data.cctvRates[subCategory][product] = price;
          break;

        case 'dx솔루션':
        case 'dx':
          if (!data.dxRates[subCategory]) {
            data.dxRates[subCategory] = {};
          }
          data.dxRates[subCategory][product] = price;
          break;

        case '결합할인':
        case 'bundle':
          data.bundleDiscounts[product] = price;
          break;
      }
    });

    return data;
  };

  /**
   * 현재 데이터를 엑셀로 다운로드
   */
  const handleDownload = async () => {
    if (!currentData) {
      setUploadMessage('다운로드할 데이터가 없습니다.');
      return;
    }

    setIsProcessing(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('요금 데이터');

      // 헤더 추가
      worksheet.addRow(['카테고리', '하위분류', '상품명', '가격', '설명']);

      // 데이터 추가
      Object.entries(currentData).forEach(([category, categoryData]: [string, any]) => {
        if (typeof categoryData === 'object' && categoryData !== null) {
          Object.entries(categoryData).forEach(([subCategory, subData]: [string, any]) => {
            if (typeof subData === 'object' && subData !== null) {
              Object.entries(subData).forEach(([product, price]: [string, any]) => {
                worksheet.addRow([category, subCategory, product, price, '']);
              });
            }
          });
        }
      });

      // 스타일 적용
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F3FF' }
      };

      // 파일 생성 및 다운로드
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const today = new Date().toISOString().split('T')[0];
      saveAs(blob, `요금데이터_${today}.xlsx`);
      
      setUploadMessage('데이터가 성공적으로 다운로드되었습니다.');
      
    } catch (error) {
      console.error('다운로드 에러:', error);
      setUploadMessage(`다운로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* 헤더 */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <i className="fas fa-database text-green-600"></i>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              데이터 관리
            </h2>
            <p className="text-sm text-gray-500">
              요금 데이터 업로드/다운로드 및 관리
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400 transition-transform`}></i>
        </div>
      </div>

      {/* 확장된 내용 */}
      {isExpanded && (
        <div className="mt-6 space-y-4">
          
          {/* 업로드 섹션 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              <i className="fas fa-upload text-blue-600 mr-2"></i>
              데이터 업로드
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                엑셀 파일(.xlsx)을 업로드하여 요금 데이터를 업데이트할 수 있습니다.
              </p>
              
              <div className="flex items-center space-x-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="btn-primary"
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      처리 중...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-file-upload mr-2"></i>
                      파일 선택
                    </>
                  )}
                </button>
                
                <div className="text-xs text-gray-500">
                  지원 형식: .xlsx, .xls
                </div>
              </div>
            </div>
          </div>

          {/* 다운로드 섹션 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              <i className="fas fa-download text-green-600 mr-2"></i>
              데이터 다운로드
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                현재 적용된 요금 데이터를 엑셀 파일로 다운로드할 수 있습니다.
              </p>
              
              <button
                onClick={handleDownload}
                disabled={isProcessing || !currentData}
                className="btn-secondary"
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    처리 중...
                  </>
                ) : (
                  <>
                    <i className="fas fa-file-download mr-2"></i>
                    현재 데이터 다운로드
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 메시지 표시 */}
          {uploadMessage && (
            <div className={`p-3 rounded-lg ${
              uploadMessage.includes('실패') || uploadMessage.includes('없습니다')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              <div className="flex items-center">
                <i className={`fas ${
                  uploadMessage.includes('실패') || uploadMessage.includes('없습니다')
                    ? 'fa-exclamation-circle text-red-500'
                    : 'fa-check-circle text-green-500'
                } mr-2`}></i>
                {uploadMessage}
              </div>
            </div>
          )}

          {/* 데이터 형식 가이드 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              <i className="fas fa-info-circle mr-2"></i>
              엑셀 파일 형식 가이드
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>• 첫 번째 행: 헤더 (카테고리, 하위분류, 상품명, 가격, 설명)</p>
              <p>• 카테고리: 인터넷, 인터넷전화, IPTV, CCTV, DX솔루션, 결합할인</p>
              <p>• 하위분류: 상품 유형별 세부 분류</p>
              <p>• 상품명: 구체적인 상품명 또는 옵션명</p>
              <p>• 가격: 숫자만 입력 (원 단위)</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default DataManager; 