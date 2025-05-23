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
      const parsedData = parseExcelData(workbook);
      
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
   * 엑셀 데이터 파싱 - priceData.json 구조에 맞게 변환
   */
  const parseExcelData = (workbook: ExcelJS.Workbook) => {
    const data: any = {
      priceData: {
        SME: {
          인터넷: {},
          인터넷전화: {},
          IPTV: {},
          AI전화: {},
          지능형CCTV: {},
          DX솔루션: {}
        },
        소호: {
          인터넷: {},
          인터넷전화: {},
          IPTV: {},
          AI전화: {},
          지능형CCTV: {},
          DX솔루션: {}
        }
      },
      bundleDiscounts: [],
      specialFeaturePrices: currentData?.specialFeaturePrices || {},
      devicePrices: currentData?.devicePrices || {},
      deviceStandalonePrices: currentData?.deviceStandalonePrices || {},
      deviceBundledPrices: currentData?.deviceBundledPrices || {},
      deviceFeatureDiscounts: currentData?.deviceFeatureDiscounts || {}
    };

    // 각 시트별 파싱
    workbook.eachSheet((worksheet, sheetId) => {
      const sheetName = worksheet.name;

      switch (sheetName) {
        case '기본료':
          // 기존 기본료 시트 파싱 로직
          // ... existing code ...
          break;

        case '결합할인':
          // 결합할인 시트 파싱
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // 헤더 스킵

            const values = row.values as any[];
            if (!values || values.length < 7) return;

            try {
              const category = values[1]?.toString()?.trim(); // SME/소호
              const bundleType = values[2]?.toString()?.trim(); // 결합유형
              const displayName = values[3]?.toString()?.trim(); // 화면표시명
              const discountRate = Math.round(parseFloat(values[4]?.toString() || '0')); // 할인율
              const internetDiscount = Math.round(parseFloat(values[5]?.toString() || '0')); // 인터넷할인
              const voipDiscount = Math.round(parseFloat(values[6]?.toString() || '0')); // 인터넷전화할인
              const installationDiscount = Math.round(parseFloat(values[7]?.toString() || '0')); // 설치비할인

              if (!category || !bundleType || !displayName) {
                console.warn(`잘못된 데이터 형식 (행 ${rowNumber}):`, { category, bundleType, displayName });
                return;
              }

              // 카테고리 검증
              if (!['SME', '소호'].includes(category)) {
                console.warn(`잘못된 카테고리 (행 ${rowNumber}): ${category}`);
                return;
              }

              // 결합할인 데이터 추가
              data.bundleDiscounts.push({
                category,
                bundleType,
                displayName,
                discountRate,
                internetDiscount,
                voipDiscount,
                installationDiscount
              });

            } catch (error) {
              console.error(`행 ${rowNumber} 파싱 에러:`, error);
            }
          });
          break;

        case '자유통화':
          // 자유통화 시트 파싱
          // ... existing code ...
          break;

        case '단말기':
          // 단말기 시트 파싱
          // ... existing code ...
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
      
      // 1. 기본 요금 데이터 시트
      const priceSheet = workbook.addWorksheet('기본료');
      
      // 헤더 설정
      priceSheet.addRow(['카테고리', '상품', '세부상품', '옵션', '기본료', '장비임대료', '설치비']);

      // 데이터 정렬을 위한 임시 배열
      const rows: any[] = [];

      // 기본 요금 데이터 추가
      if (currentData.priceData) {
        Object.entries(currentData.priceData).forEach(([category, categoryData]: [string, any]) => {
          // 인터넷 상품 처리
          if (categoryData.인터넷) {
            Object.entries(categoryData.인터넷).forEach(([subType, subTypeData]: [string, any]) => {
              if (subType === '유선인터넷' || subType === '인터넷_결제안심') {
                // 유선인터넷, 인터넷_결제안심의 경우
                Object.entries(subTypeData).forEach(([speed, priceInfo]: [string, any]) => {
                  rows.push([
                    category,
                    '인터넷',
                    subType,
                    speed,
                    priceInfo.기본료 || 0,
                    priceInfo.장비임대료 || 0,
                    priceInfo.설치비 || 0
                  ]);
                });
              } else if (subType === '무선인터넷') {
                // 무선인터넷의 경우
                Object.entries(subTypeData).forEach(([option, priceInfo]: [string, any]) => {
                  rows.push([
                    category,
                    '인터넷',
                    subType,
                    option,
                    priceInfo.기본료 || 0,
                    priceInfo.장비임대료 || 0,
                    priceInfo.설치비 || 0
                  ]);
                });
              } else {
                // SME의 경우 (100M, 500M, 1G가 직접 subType으로 있는 경우)
                const priceInfo = subTypeData as any;
                rows.push([
                  category,
                  '인터넷',
                  '',
                  subType,
                  priceInfo.기본료 || 0,
                  priceInfo.장비임대료 || 0,
                  priceInfo.설치비 || 0
                ]);
              }
            });
          }

          // 인터넷전화 상품 처리
          if (categoryData.인터넷전화) {
            Object.entries(categoryData.인터넷전화).forEach(([subProduct, subProductData]: [string, any]) => {
              if (subProduct === 'DCS' || subProduct === '고급형DCS' || subProduct === '고급형센트릭스') {
                // DCS, 고급형DCS, 고급형센트릭스의 경우
                Object.entries(subProductData).forEach(([option, priceInfo]: [string, any]) => {
                  rows.push([
                    category,
                    '인터넷전화',
                    subProduct,
                    option,
                    priceInfo.기본료 || 0,
                    priceInfo.장비임대료 || 0,
                    priceInfo.설치비 || 0
                  ]);
                });
              } else {
                // 일반형의 경우
                rows.push([
                  category,
                  '인터넷전화',
                  subProduct,
                  '',
                  (subProductData as any).기본료 || 0,
                  (subProductData as any).장비임대료 || 0,
                  (subProductData as any).설치비 || 0
                ]);
              }
            });
          }

          // IPTV 상품 처리
          if (categoryData.IPTV) {
            Object.entries(categoryData.IPTV).forEach(([subProduct, priceInfo]: [string, any]) => {
              rows.push([
                category,
                'IPTV',
                subProduct,
                '',
                priceInfo.기본료 || 0,
                priceInfo.장비임대료 || 0,
                priceInfo.설치비 || 0
              ]);
            });
          }

          // AI전화 상품 처리
          if (categoryData.AI전화) {
            Object.entries(categoryData.AI전화).forEach(([subProduct, priceInfo]: [string, any]) => {
              rows.push([
                category,
                'AI전화',
                subProduct,
                '',
                priceInfo.기본료 || 0,
                priceInfo.장비임대료 || 0,
                priceInfo.설치비 || 0
              ]);
            });
          }

          // 지능형CCTV 상품 처리
          if (categoryData.지능형CCTV) {
            Object.entries(categoryData.지능형CCTV).forEach(([subProduct, priceInfo]: [string, any]) => {
              rows.push([
                category,
                '지능형CCTV',
                subProduct,
                '',
                priceInfo.기본료 || 0,
                priceInfo.장비임대료 || 0,
                priceInfo.설치비 || 0
              ]);
            });
          }

          // DX솔루션 상품 처리
          if (categoryData.DX솔루션) {
            Object.entries(categoryData.DX솔루션).forEach(([subProduct, subProductData]: [string, any]) => {
              Object.entries(subProductData).forEach(([option, priceInfo]: [string, any]) => {
                rows.push([
                  category,
                  'DX솔루션',
                  subProduct,
                  option,
                  priceInfo.기본료 || 0,
                  priceInfo.장비임대료 || 0,
                  priceInfo.설치비 || 0
                ]);
              });
            });
          }
        });
      }

      // 데이터 정렬
      rows.sort((a, b) => {
        // 1. 카테고리 정렬 (SME가 먼저)
        if (a[0] !== b[0]) return a[0] === 'SME' ? -1 : 1;
        
        // 2. 상품 정렬
        if (a[1] !== b[1]) return a[1].localeCompare(b[1]);
        
        // 3. 세부상품 정렬
        if (a[2] !== b[2]) return a[2].localeCompare(b[2]);
        
        // 4. 옵션 정렬 (속도는 숫자 크기대로)
        const speedOrder = (str: string) => {
          if (str.includes('100M')) return 1;
          if (str.includes('500M')) return 2;
          if (str.includes('1G')) return 3;
          return 4;
        };
        
        const speedA = speedOrder(a[3]);
        const speedB = speedOrder(b[3]);
        if (speedA !== speedB) return speedA - speedB;
        
        return a[3].localeCompare(b[3]);
      });

      // 정렬된 데이터 추가
      rows.forEach(row => priceSheet.addRow(row));

      // 2. 결합할인 시트
      const bundleSheet = workbook.addWorksheet('결합할인');
      
      // 헤더 설정
      const bundleHeaders = [
        '카테고리',
        '속도',
        '인터넷상품',
        '결합상품1',
        '결합상품2',
        '결합상품3',
        '화면표시명',
        '인터넷할인',
        '인터넷전화할인',
        '설치비할인'
      ];
      bundleSheet.addRow(bundleHeaders);

      // 결합할인 데이터 정렬을 위한 임시 배열
      const bundleRows: any[] = [];

      if (currentData.bundleDiscounts) {
        currentData.bundleDiscounts.forEach((bundle: any) => {
          // 결합유형 분석
          const bundleType = bundle.bundleType || '';
          const parts = bundleType.split('_');
          
          // 속도 추출 (100M, 500M, 1G)
          const speed = parts[0] || '';
          
          // 인터넷 상품 타입 (유선인터넷, 인터넷_결제안심, 무선인터넷)
          let internetType = '';
          if (bundle.category === '소호') {
            if (bundleType.includes('결제안심')) {
              internetType = '인터넷_결제안심';
            } else if (bundleType.includes('무선')) {
              internetType = '무선인터넷';
            } else {
              internetType = '유선인터넷';
            }
          }

          // 결합상품 분리
          const bundleProducts = parts.slice(1).filter((p: string) => p !== '인터넷' && p !== internetType);
          const [product1, product2, product3] = bundleProducts;

          // 결합상품 세부 정보 처리
          let displayProduct1 = product1 || '';
          let displayProduct2 = product2 || '';
          let displayProduct3 = product3 || '';

          // 인터넷전화 상품의 경우 세부 상품 표시
          if (displayProduct1 === '인터넷전화' && bundle.bundleType.includes('DCS')) {
            displayProduct1 = bundle.bundleType.includes('고급형') ? '고급형DCS' : 'DCS';
          }
          if (displayProduct1 === '인터넷전화' && bundle.bundleType.includes('일반형')) {
            displayProduct1 = '일반형';
          }

          bundleRows.push([
            bundle.category,
            speed,
            internetType,
            displayProduct1,
            displayProduct2,
            displayProduct3,
            bundle.displayName,
            bundle.internetDiscount || 0,
            bundle.voipDiscount || 0,
            bundle.installationDiscount || 0
          ]);
        });
      }

      // 데이터 정렬
      bundleRows.sort((a, b) => {
        // 1. 카테고리 정렬 (SME가 먼저)
        if (a[0] !== b[0]) return a[0] === 'SME' ? -1 : 1;
        
        // 2. 속도 정렬
        const speedOrder = (str: string) => {
          if (str === '100M') return 1;
          if (str === '500M') return 2;
          if (str === '1G') return 3;
          return 4;
        };
        const speedA = speedOrder(a[1]);
        const speedB = speedOrder(b[1]);
        if (speedA !== speedB) return speedA - speedB;

        // 3. 인터넷상품 정렬
        if (a[2] !== b[2]) return a[2].localeCompare(b[2]);

        // 4. 결합상품1 정렬
        if (a[3] !== b[3]) return a[3].localeCompare(b[3]);

        // 5. 결합상품2 정렬
        if (a[4] !== b[4]) return a[4].localeCompare(b[4]);

        // 6. 결합상품3 정렬
        return a[5].localeCompare(b[5]);
      });

      // 정렬된 데이터 추가
      bundleRows.forEach(row => bundleSheet.addRow(row));

      // 스타일 적용
      bundleSheet.columns.forEach((column: any, index) => {
        if (column) {
          // 숫자 형식 지정
          if (index >= 7) { // 할인금액 컬럼
            column.numFmt = '#,##0';
          }
          
          // 컬럼 너비 자동 조정
          let maxLength = bundleHeaders[index].length;
          column.eachCell({ includeEmpty: true }, (cell: any) => {
            const length = cell.value ? cell.value.toString().length : 10;
            if (length > maxLength) {
              maxLength = length;
            }
          });
          column.width = Math.min(Math.max(maxLength + 2, 10), 30);
        }
      });

      // 헤더 스타일
      const bundleHeaderRow = bundleSheet.getRow(1);
      bundleHeaderRow.font = { bold: true };
      bundleHeaderRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F3FF' }
      };

      // 테두리 및 정렬 스타일
      bundleSheet.eachRow((row: any) => {
        row.eachCell((cell: any) => {
          // 테두리 스타일
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          
          // 셀 정렬
          if (row.number === 1) {
            // 헤더는 중앙 정렬
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else if (cell.col >= 8) {
            // 금액은 오른쪽 정렬
            cell.alignment = { vertical: 'middle', horizontal: 'right' };
          } else {
            // 나머지는 왼쪽 정렬
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
          }
        });
      });

      // 3. 자유통화 요금 시트
      const featureSheet = workbook.addWorksheet('자유통화');
      
      // 헤더 설정
      const featureHeaders = ['자유통화', 'DCS', '고급형DCS', '고급형센트릭스', '일반형'];
      featureSheet.addRow(featureHeaders);

      // 자유통화 데이터 행 구성
      const featureRows = [
        ['없음', 0, 0, 0, 0],
        ['자유통화3', 3000, 4000, 5000, 0],
        ['자유통화4', 4000, 5000, 6000, 0],
        ['자유통화6', 6000, 7000, 8000, 0],
        ['자유통화8', 8000, 9000, 10000, 0],
        ['자유통화10', 10000, 11000, 12000, 0],
        ['자유통화15', 15000, 16000, 17000, 0],
        ['자유통화20', 20000, 22000, 22000, 0],
        ['자유통화30', 30000, 31000, 32000, 0],
        ['자유통화50', 50000, 51000, 52000, 0]
      ];

      // 실제 데이터로 업데이트
      if (currentData.specialFeaturePrices) {
        featureRows.forEach(row => {
          const feature = row[0];
          if (currentData.specialFeaturePrices.DCS?.[feature]) {
            row[1] = currentData.specialFeaturePrices.DCS[feature];
          }
          if (currentData.specialFeaturePrices['고급형DCS']?.[feature]) {
            row[2] = currentData.specialFeaturePrices['고급형DCS'][feature];
          }
          if (currentData.specialFeaturePrices['고급형센트릭스']?.[feature]) {
            row[3] = currentData.specialFeaturePrices['고급형센트릭스'][feature];
          }
          if (currentData.specialFeaturePrices['일반형']?.[feature]) {
            row[4] = currentData.specialFeaturePrices['일반형'][feature];
          }
        });
      }

      // 데이터 추가
      featureRows.forEach(row => featureSheet.addRow(row));

      // 스타일 적용
      featureSheet.columns.forEach((column: any, index) => {
        if (column) {
          // 숫자 형식 지정 (첫 번째 컬럼 제외)
          if (index > 0) {
            column.numFmt = '#,##0';
          }
          
          // 컬럼 너비 자동 조정
          let maxLength = featureHeaders[index].length;
          column.eachCell({ includeEmpty: true }, (cell: any) => {
            const length = cell.value ? cell.value.toString().length : 10;
            if (length > maxLength) {
              maxLength = length;
            }
          });
          column.width = Math.min(Math.max(maxLength + 2, 10), 20);
        }
      });

      // 헤더 스타일
      const featureHeaderRow = featureSheet.getRow(1);
      featureHeaderRow.font = { bold: true };
      featureHeaderRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F3FF' }
      };

      // 테두리 스타일
      featureSheet.eachRow((row: any) => {
        row.eachCell((cell: any) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          
          // 셀 정렬
          if (row.number === 1 || cell.col === 1) {
            // 헤더와 첫 번째 컬럼은 중앙 정렬
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else {
            // 나머지 숫자는 오른쪽 정렬
            cell.alignment = { vertical: 'middle', horizontal: 'right' };
          }
        });
      });

      // 4. 단말기 가격 시트
      const deviceSheet = workbook.addWorksheet('단말기');
      
      // 헤더 설정
      const deviceHeaders = [
        '단말기',
        '단독',
        '번들',
        '자유통화3',
        '자유통화4',
        '자유통화6',
        '자유통화8',
        '자유통화10',
        '자유통화15',
        '자유통화20',
        '자유통화30',
        '자유통화50',
        'AI전화'
      ];
      deviceSheet.addRow(deviceHeaders);

      // 단말기 데이터 정렬을 위한 임시 배열
      const deviceRows: any[] = [];

      if (currentData.deviceStandalonePrices) {
        Object.entries(currentData.deviceStandalonePrices).forEach(([deviceName, standalonePrice]: [string, any]) => {
          const row = new Array(deviceHeaders.length).fill(''); // 빈 배열 생성

          // 기본 정보
          row[0] = deviceName; // 단말기명
          row[1] = standalonePrice || 0; // 단독 가격
          row[2] = currentData.deviceBundledPrices?.[deviceName] || 0; // 번들 가격

          // 할인 정보
          if (currentData.deviceFeatureDiscounts?.[deviceName]) {
            const discounts = currentData.deviceFeatureDiscounts[deviceName];
            
            // 자유통화 3~50 할인율
            ['자유통화3', '자유통화4', '자유통화6', '자유통화8', '자유통화10', 
             '자유통화15', '자유통화20', '자유통화30', '자유통화50'].forEach((feature, index) => {
              const discount = discounts[feature];
              if (discount) {
                row[index + 3] = `${discount.value}%할인`;
              }
            });

            // AI전화 할인율
            const aiDiscount = discounts['AI전화'];
            if (aiDiscount) {
              row[12] = `${aiDiscount.value}%할인`;
            }
          }

          deviceRows.push(row);
        });
      }

      // 데이터 정렬 (단말기명 기준)
      deviceRows.sort((a, b) => a[0].localeCompare(b[0]));

      // 정렬된 데이터 추가
      deviceRows.forEach(row => deviceSheet.addRow(row));

      // 스타일 적용
      deviceSheet.columns.forEach((column: any, index) => {
        if (column) {
          // 숫자 형식 지정
          if (index === 1 || index === 2) { // 단독가격, 번들가격 컬럼
            column.numFmt = '#,##0';
          }
          
          // 컬럼 너비 자동 조정
          let maxLength = deviceHeaders[index].length;
          column.eachCell({ includeEmpty: true }, (cell: any) => {
            const length = cell.value ? cell.value.toString().length : 10;
            if (length > maxLength) {
              maxLength = length;
            }
          });
          column.width = Math.min(Math.max(maxLength + 2, 10), 20);
        }
      });

      // 헤더 스타일
      const headerRow = deviceSheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6F3FF' }
      };

      // 테두리 스타일
      deviceSheet.eachRow((row: any) => {
        row.eachCell((cell: any) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // 5. 작성 가이드 시트
      const guideSheet = workbook.addWorksheet('작성가이드');
      guideSheet.addRows([
        ['브이원 요금계산기 데이터 작성 가이드'],
        [''],
        ['1. 기본요금 시트'],
        ['- 카테고리: SME 또는 소호'],
        ['- 상품타입: 인터넷, 인터넷전화, IPTV, AI전화, 지능형CCTV, DX솔루션'],
        ['- 상품그룹: 인터넷의 경우 유선인터넷/인터넷_결제안심/무선인터넷, 그 외는 비워두기'],
        ['- 세부상품: 각 상품의 구체적인 상품명'],
        ['- 가격타입: 기본료, 장비임대료, 설치비'],
        ['- 금액: 원 단위 숫자만 입력'],
        [''],
        ['2. 결합할인 시트'],
        ['- 카테고리: SME 또는 소호'],
        ['- 상품조합: + 기호로 구분하여 결합되는 상품들 입력'],
        ['- 할인명: 결합상품의 표시명'],
        ['- 각 할인금액: 원 단위 숫자만 입력'],
        [''],
        ['3. 주의사항'],
        ['- 모든 금액은 부가세 별도 금액으로 입력'],
        ['- 할인금액은 양수로 입력'],
        ['- 빈 셀은 0으로 처리됨'],
      ]);

      // 모든 시트에 스타일 적용
      [priceSheet, bundleSheet, featureSheet, deviceSheet, guideSheet].forEach(sheet => {
        // 헤더 스타일
        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE6F3FF' }
        };

        // 컬럼 너비 자동 조정
        sheet.columns.forEach((column: any) => {
          if (column) {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell: any) => {
              const length = cell.value ? cell.value.toString().length : 10;
              if (length > maxLength) {
                maxLength = length;
              }
            });
            column.width = Math.min(Math.max(maxLength + 2, 12), 30);
          }
        });
      });

      // 파일 생성 및 다운로드
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const today = new Date().toISOString().split('T')[0];
      saveAs(blob, `V1완전요금데이터_${today}.xlsx`);
      
      setUploadMessage('완전한 데이터가 성공적으로 다운로드되었습니다.');
      
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