document.addEventListener('DOMContentLoaded', function() {
    // aria-hidden 속성 제거 (접근성 문제 해결)
    document.body.removeAttribute('aria-hidden');
    
    // aria-hidden 속성이 추가되지 않도록 감시
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'aria-hidden' && 
                mutation.target === document.body) {
                document.body.removeAttribute('aria-hidden');
            }
        });
    });
    
    observer.observe(document.body, { 
        attributes: true,
        attributeFilter: ['aria-hidden']
    });
    
    // 요금표 데이터를 외부 JSON 파일에서 가져옵니다
    let priceData = {};
    window.priceData = priceData;
    let specialFeaturePrices = {};
    window.specialFeaturePrices = specialFeaturePrices;
    let devicePrices = {};
    window.devicePrices = devicePrices;
    let bundleDiscounts = {};
    
    // 단말기 관련 세부 데이터
    let deviceStandalonePrices = {};
    let deviceBundledPrices = {};
    let deviceFeatureDiscounts = {};
    
    // 데이터 업로드 관련 요소
    const uploadButton = document.getElementById('upload-dataset');
    const downloadButton = document.getElementById('download-dataset');
    const uploadExcelButton = document.getElementById('upload-excel');
    const downloadExcelTemplateButton = document.getElementById('download-excel-template');
    const fileInput = document.getElementById('dataset-file');
    const excelFileInput = document.getElementById('excel-file');
    const statusSpan = document.getElementById('dataset-status');
    
    // 업로드 버튼 클릭 시 파일 선택 창 열기
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    // 다운로드 버튼 클릭 시 현재 데이터를 JSON으로 다운로드
    downloadButton.addEventListener('click', function() {
        const jsonData = {
            priceData: priceData,
            specialFeaturePrices: specialFeaturePrices,
            devicePrices: devicePrices,
            bundleDiscounts: bundleDiscounts,
            // 단말기 세부 데이터 추가
            deviceStandalonePrices: deviceStandalonePrices,
            deviceBundledPrices: deviceBundledPrices,
            deviceFeatureDiscounts: deviceFeatureDiscounts
        };
        
        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = '브이원_요금데이터.json';
        a.click();
        
        URL.revokeObjectURL(url);
        
        statusSpan.textContent = 'JSON 데이터 다운로드 완료!';
        setTimeout(() => {
            statusSpan.textContent = '';
        }, 3000);
    });
    
    // 엑셀 업로드 버튼 클릭 시 파일 선택 창 열기
    uploadExcelButton.addEventListener('click', function() {
        excelFileInput.click();
    });
    
    // 엑셀 양식 다운로드 버튼 클릭 시
    downloadExcelTemplateButton.addEventListener('click', function() {
        createAndDownloadExcelTemplate();
        
        statusSpan.textContent = '엑셀 양식 다운로드 완료!';
        setTimeout(() => {
            statusSpan.textContent = '';
        }, 3000);
    });
    
    // 파일 선택 시 이벤트 처리
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    priceData = data.priceData || {};
                    window.priceData = priceData;
                    specialFeaturePrices = data.specialFeaturePrices || {};
                    window.specialFeaturePrices = specialFeaturePrices;
                    devicePrices = data.devicePrices || {};
                    window.devicePrices = devicePrices;
                    bundleDiscounts = data.bundleDiscounts || {};
                    
                    // 단말기 세부 데이터 로드
                    deviceStandalonePrices = data.deviceStandalonePrices || {};
                    deviceBundledPrices = data.deviceBundledPrices || {};
                    deviceFeatureDiscounts = data.deviceFeatureDiscounts || {};
                    
                    console.log('데이터 업로드 완료');
                    statusSpan.textContent = '데이터 업로드 완료!';
                    setTimeout(() => {
                        statusSpan.textContent = '';
                    }, 3000);
                    
                    // 전역에 데이터 저장 (계산 함수에서 참조)
                    window.bundleDiscounts = bundleDiscounts;
                    window.deviceStandalonePrices = deviceStandalonePrices;
                    window.deviceBundledPrices = deviceBundledPrices;
                    window.deviceFeatureDiscounts = deviceFeatureDiscounts;

                    // 서버에 데이터 저장
                    saveDataToServer(data);
                } catch (error) {
                    console.error('JSON 파싱 오류:', error);
                    statusSpan.textContent = '파일 형식 오류!';
                    setTimeout(() => {
                        statusSpan.textContent = '';
                    }, 3000);
                }
            };
            reader.readAsText(file);
        }
    });
    
    // 엑셀 파일 선택 시 이벤트 처리
    excelFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            statusSpan.textContent = '엑셀 파일 처리 중...';
            handleExcelUpload(file);
        }
    });
    
    // 서버에 데이터를 저장하는 함수
    function saveDataToServer(data) {
        const jsonString = JSON.stringify(data, null, 2);
        
        // Fetch API를 사용하여 서버에 데이터 저장 요청
        fetch('/save-price-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonString
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 응답 오류');
            }
            return response.json();
        })
        .then(data => {
            console.log('데이터 저장 성공:', data);
            statusSpan.textContent = '데이터가 서버에 저장되었습니다!';
            setTimeout(() => {
                statusSpan.textContent = '';
            }, 3000);
        })
        .catch(error => {
            console.error('데이터 저장 오류:', error);
            
            // 서버 저장에 실패한 경우 로컬 파일로 다운로드 제안
            const shouldDownload = confirm('서버에 데이터를 저장할 수 없습니다. 대신 파일로 다운로드하시겠습니까?');
            if (shouldDownload) {
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = 'priceData.json';
                a.click();
                
                URL.revokeObjectURL(url);
            }
        });
    }
    
    // 엑셀 파일 업로드 및 처리 함수
    function handleExcelUpload(file) {
        // ExcelJS 라이브러리가 필요
        if (typeof ExcelJS === 'undefined') {
            // 라이브러리 동적 로드
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/exceljs/dist/exceljs.min.js';
            script.onload = function() {
                processExcelFile(file);
            };
            script.onerror = function() {
                statusSpan.textContent = 'ExcelJS 라이브러리 로드 실패';
                setTimeout(() => {
                    statusSpan.textContent = '';
                }, 3000);
            };
            document.head.appendChild(script);
        } else {
            processExcelFile(file);
        }
    }
    
    // 엑셀 파일 처리 함수
    function processExcelFile(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            console.log('엑셀 파일 읽기 시작...');
            const workbook = new ExcelJS.Workbook();
            
            workbook.xlsx.load(e.target.result).then(function() {
                console.log('엑셀 파일 로드 완료!');
                console.log('사용 가능한 워크시트:', workbook.worksheets.map(sheet => sheet.name));
                
                // 1. 기본요금 시트 처리
                const priceDataSheet = workbook.getWorksheet('기본요금');
                if (priceDataSheet) {
                    console.log('기본요금 시트 발견!');
                    priceData = {};
                    window.priceData = priceData;
                    
                    // 데이터 행 순회 (헤더 제외)
                    priceDataSheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
                        if (rowNumber > 1) { // 헤더 제외
                            const category = row.getCell(1).value;
                            const product = row.getCell(2).value;
                            const subProduct = row.getCell(3).value || '';
                            const option = row.getCell(4).value || '';
                            const baseFee = Number(row.getCell(5).value) || 0;
                            const deviceRent = Number(row.getCell(6).value) || 0;
                            const installFee = Number(row.getCell(7).value) || 0;
                            
                            // 요금 객체 생성
                            const fee = {
                                '기본료': baseFee,
                                '장비임대료': deviceRent,
                                '설치비': installFee
                            };
                            
                            console.log(`처리 중: ${category} - ${product} - ${subProduct} - ${option}`);
                            
                            // 중첩 객체 생성 (요청한 로직 적용)
                            if (!priceData[category]) {
                                priceData[category] = {};
                            }
                            
                            if (!priceData[category][product]) {
                                priceData[category][product] = {};
                            }
                            
                            if (subProduct) {
                                if (!priceData[category][product][subProduct]) {
                                    priceData[category][product][subProduct] = {};
                                }
                                
                                if (option) {
                                    priceData[category][product][subProduct][option] = fee;
                                } else {
                                    priceData[category][product][subProduct] = fee;
                                }
                            } else if (option) {
                                priceData[category][product][option] = fee;
                            } else {
                                priceData[category][product] = fee;
                            }
                        }
                    });
                } else {
                    console.warn('기본요금 시트를 찾을 수 없습니다.');
                }
                
                // 2. 단말기 시트 처리
                const deviceSheet = workbook.getWorksheet('단말기');
                if (deviceSheet) {
                    console.log('단말기 시트 발견!');
                    
                    // 1) 단독 요금 맵 생성
                    deviceStandalonePrices = {};
                    
                    // 2) 번들 요금 맵 생성
                    deviceBundledPrices = {};
                    
                    // 3) 자유통화 요금제별 단말기 할인 맵 생성
                    deviceFeatureDiscounts = {};
                    
                    // 헤더 행 확인
                    const headerRow = deviceSheet.getRow(1);
                    const headerValues = [];
                    
                    // 헤더 열의 값들을 배열로 추출
                    headerRow.eachCell({ includeEmpty: false }, function(cell, colNumber) {
                        headerValues[colNumber] = cell.value;
                    });
                    
                    console.log('단말기 시트 헤더:', headerValues.filter(Boolean));
                    
                    // 컬럼 인덱스 정의 (엑셀 양식에 맞춤)
                    const DEVICE_NAME_COL = 1;    // 단말기명
                    const STANDALONE_PRICE_COL = 2;  // 단독 가격
                    const BUNDLED_PRICE_COL = 3;  // 번들 가격
                    // 4번 컬럼부터 자유통화 할인율 정보
                    
                    deviceSheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
                        if (rowNumber > 1) { // 헤더 제외
                            const deviceName = row.getCell(DEVICE_NAME_COL).value;
                            if (!deviceName) return; // 기기 이름이 없으면 넘어감
                            
                            // 1) 단독 요금 설정 (인터넷전화만 설치할 때 단말기 가격)
                            const standalonePrice = Number(row.getCell(STANDALONE_PRICE_COL).value) || 0;
                            deviceStandalonePrices[deviceName] = standalonePrice;
                            
                            // 2) 번들 요금 설정 (인터넷과 함께 설치할 때 단말기 가격)
                            const bundledPrice = Number(row.getCell(BUNDLED_PRICE_COL).value) || 0;
                            deviceBundledPrices[deviceName] = bundledPrice;
                            
                            // 3) 자유통화 할인 설정
                            deviceFeatureDiscounts[deviceName] = {};
                            
                            // 헤더에서 자유통화 열 찾기 (컬럼 4부터 자유통화 컬럼)
                            for (let colNumber = 4; colNumber <= row.cellCount; colNumber++) {
                                const colHeader = headerValues[colNumber];
                                if (colHeader === 'AI전화') {
                                    const disc = row.getCell(colNumber).value || '';
                                    const pct = parseInt(disc, 10);
                                    if (!isNaN(pct)) {
                                        deviceFeatureDiscounts[deviceName]['AI전화'] = { type: 'percent', value: pct };
                                        console.log(`단말기 할인: ${deviceName} - AI전화 - ${pct}%`);
                                    }
                                    continue;
                                }
                                if (colHeader && colHeader.toString().startsWith('자유통화')) {
                                    const discountStr = row.getCell(colNumber).value;
                                    
                                    if (discountStr && typeof discountStr === 'string' && discountStr.includes('%')) {
                                        // 할인율 추출 (예: "100%할인" => 100)
                                        const percent = parseInt(discountStr, 10);
                                        if (!isNaN(percent)) {
                                            deviceFeatureDiscounts[deviceName][colHeader] = {
                                                type: 'percent',
                                                value: percent
                                            };
                                            console.log(`단말기 할인: ${deviceName} - ${colHeader} - ${percent}%`);
                                        }
                                    }
                                }
                            }
                            
                            console.log(`단말기: ${deviceName} - 단독: ${standalonePrice}원, 번들: ${bundledPrice}원`);
                        }
                    });
                    
                    console.log('단독 요금:', deviceStandalonePrices);
                    console.log('번들 요금:', deviceBundledPrices);
                    console.log('자유통화 할인:', deviceFeatureDiscounts);
                    
                    // 기존 devicePrices를 단독 요금으로 대체 (하위 호환성 유지)
                    devicePrices = {...deviceStandalonePrices};
                } else {
                    console.warn('단말기 시트를 찾을 수 없습니다.');
                }
                
                // 3. 자유통화 시트 처리
                const featureSheet = workbook.getWorksheet('자유통화');
                if (featureSheet) {
                    console.log('자유통화 시트 발견!');
                    specialFeaturePrices = {};
                    
                    // 헤더 행 확인 (첫 번째 행)
                    const headerRow = featureSheet.getRow(1);
                    const headerValues = [];
                    
                    // 헤더 열의 값들을 배열로 추출 ('자유통화', 'DCS', '고급형DCS', 등)
                    headerRow.eachCell({ includeEmpty: false }, function(cell, colNumber) {
                        headerValues[colNumber] = cell.value;
                    });
                    
                    console.log('자유통화 시트 헤더:', headerValues);
                    
                    // 데이터 행 순회 (헤더 행 제외)
                    featureSheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
                        if (rowNumber > 1) { // 헤더 제외
                            const featureName = row.getCell(1).value; // '자유통화 4' 등
                            
                            if (featureName) {
                                // 모든 상품 열에 대해 처리
                                for (let colNumber = 2; colNumber <= row.cellCount; colNumber++) {
                                    const productName = headerValues[colNumber]; // 'DCS', '고급형DCS' 등
                                    const price = Number(row.getCell(colNumber).value) || 0;
                                    
                                    if (productName) {
                                        // 해당 상품의 자유통화 가격 객체가 없으면 생성
                                        if (!specialFeaturePrices[productName]) {
                                            specialFeaturePrices[productName] = {};
                                        }
                                        
                                        // 상품별 자유통화 가격 설정
                                        specialFeaturePrices[productName][featureName] = price;
                                        console.log(`자유통화: ${productName} - ${featureName} - ${price}원`);
                                    }
                                }
                            }
                        }
                    });
                    
                    console.log('자유통화 데이터(피벗 방식):', specialFeaturePrices);
                } else {
                    console.warn('자유통화 시트를 찾을 수 없습니다.');
                }
                
                // 4. 결합할인 시트 처리
                const bundleSheet = workbook.getWorksheet('결합할인');
                if (bundleSheet) {
                    console.log('결합할인 시트 발견!');
                    
                    // 헤더 행 확인
                    const headerRow = bundleSheet.getRow(1);
                    console.log('결합할인 시트 헤더:', headerRow.values);
                    
                    // 배열로 변환
                    bundleDiscounts = [];
                    
                    bundleSheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
                        if (rowNumber > 1) { // 헤더 제외
                            // 1) 카테고리
                            const category = row.getCell(1).value || 'SME';
                            // 2) 결합유형 처리: 언더바(_)로 분리
                            const bundleType = row.getCell(2).value;
                            const parts = bundleType ? bundleType.split('_') : [];
                            // 상품키 및 자유통화 범위 분리
                            const productKeys = [];
                            let featureRange = null;
                            parts.forEach(p => {
                                const m = p.match(/^자유통화\((\d+)\s*~\s*(\d+)\)$/);
                                if (m) {
                                    featureRange = { 
                                        feature: '자유통화', 
                                        min: Number(m[1]), 
                                        max: Number(m[2]) 
                                    };
                                } else {
                                    productKeys.push(p);
                                }
                            });
                            // 3) 화면 표시용 이름
                            const displayName = row.getCell(3).value || bundleType;
                            // 4) 할인율(%) 컬럼은 무시
                            // 5-7) 각 할인 금액 (엑셀 컬럼 순서에 맞게)
                            const internetDiscount     = Number(row.getCell(5).value) || 0;
                            const voipDiscount         = Number(row.getCell(6).value) || 0;
                            const installationDiscount = Number(row.getCell(7).value) || 0;
                            if (bundleType) {
                                const discountItem = { 
                                    category, 
                                    productKeys,    
                                    featureRange,   
                                    displayName,
                                    internetDiscount,
                                    voipDiscount,
                                    installationDiscount
                                };
                                bundleDiscounts.push(discountItem);
                                console.log(`결합할인: ${category} - ${bundleType} - ${displayName}`);
                                console.log(`- 인터넷 할인: ${internetDiscount}원`);
                                console.log(`- 인터넷전화 할인: ${voipDiscount}원`);
                                console.log(`- 설치비 할인: ${installationDiscount}원`);
                                if (featureRange) {
                                    console.log(`자유통화 범위: ${featureRange.min} ~ ${featureRange.max}`);
                                }
                            }
                        }
                    });
                    console.log('결합할인 데이터(배열):', bundleDiscounts);
                } else {
                    console.warn('결합할인 시트를 찾을 수 없습니다.');
                }
                
                // 5. 처리 완료 후 UI 업데이트
                console.log('엑셀 데이터 처리 완료');
                console.log('priceData:', priceData);
                console.log('devicePrices:', devicePrices);
                console.log('specialFeaturePrices:', specialFeaturePrices);
                console.log('bundleDiscounts:', bundleDiscounts);
                
                // 결합할인 데이터를 변수에 저장
                window.bundleDiscounts = bundleDiscounts;
                

                console.group('🔍 파싱 결과 확인');
                console.table(priceData);
                console.log('deviceStandalonePrices:', deviceStandalonePrices);
                console.log('deviceBundledPrices:', deviceBundledPrices);
                console.log('specialFeaturePrices:', specialFeaturePrices);
                console.log('deviceFeatureDiscounts:', deviceFeatureDiscounts);
                console.log('bundleDiscounts:', bundleDiscounts);
                console.groupEnd();

                // 데이터를 JSON 객체로 구성
                const jsonData = {
                    priceData: priceData,
                    specialFeaturePrices: specialFeaturePrices,
                    devicePrices: devicePrices,
                    bundleDiscounts: bundleDiscounts,
                    deviceStandalonePrices: deviceStandalonePrices,
                    deviceBundledPrices: deviceBundledPrices,
                    deviceFeatureDiscounts: deviceFeatureDiscounts
                };

                // 서버에 데이터 저장
                saveDataToServer(jsonData);

                statusSpan.textContent = '엑셀 데이터 처리 완료!';
                setTimeout(() => {
                    statusSpan.textContent = '';
                }, 3000);
            }).catch(function(error) {
                console.error('엑셀 파일 처리 오류:', error);
                console.error(error.stack);
                statusSpan.textContent = '엑셀 파일 처리 오류!';
                setTimeout(() => {
                    statusSpan.textContent = '';
                }, 3000);
            });
        };
        
        reader.onerror = function(error) {
            console.error('파일 읽기 오류:', error);
            statusSpan.textContent = '파일 읽기 오류!';
            setTimeout(() => {
                statusSpan.textContent = '';
            }, 3000);
        };
        
        reader.readAsArrayBuffer(file);
    }
    
    // 엑셀 템플릿 생성 및 다운로드 함수
    function createAndDownloadExcelTemplate() {
        // ExcelJS 라이브러리가 필요
        if (typeof ExcelJS === 'undefined') {
            // 라이브러리 동적 로드
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/exceljs/dist/exceljs.min.js';
            script.onload = function() {
                generateExcelTemplate();
            };
            script.onerror = function() {
                statusSpan.textContent = 'ExcelJS 라이브러리 로드 실패';
                setTimeout(() => {
                    statusSpan.textContent = '';
                }, 3000);
            };
            document.head.appendChild(script);
        } else {
            generateExcelTemplate();
        }
    }
    
    // 엑셀 템플릿 생성 함수
    function generateExcelTemplate() {
        const workbook = new ExcelJS.Workbook();
        
        // 1. 기본요금 시트 생성
        const priceDataSheet = workbook.addWorksheet('기본요금');
        priceDataSheet.columns = [
            { header: '카테고리', key: 'category', width: 15 },
            { header: '상품', key: 'product', width: 15 },
            { header: '세부상품', key: 'subProduct', width: 20 },
            { header: '옵션', key: 'option', width: 15 },
            { header: '기본료', key: 'baseFee', width: 15 },
            { header: '장비임대료', key: 'deviceRent', width: 15 },
            { header: '설치비', key: 'installFee', width: 15 }
        ];
        
        // 샘플 데이터 추가
        priceDataSheet.addRow({ 
            category: 'SME', 
            product: '인터넷', 
            subProduct: '100M', 
            option: '',
            baseFee: 25000, 
            deviceRent: 5000, 
            installFee: 30000 
        });
        priceDataSheet.addRow({ 
            category: 'SME', 
            product: '인터넷전화', 
            subProduct: 'DCS', 
            option: '정액제',
            baseFee: 10000, 
            deviceRent: 3000, 
            installFee: 20000 
        });
        priceDataSheet.addRow({ 
            category: '소호', 
            product: '인터넷', 
            subProduct: '유선인터넷', 
            option: '500M',
            baseFee: 35000, 
            deviceRent: 6000, 
            installFee: 30000 
        });
        
        // 헤더 스타일 적용
        const headerRow = priceDataSheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4F81BD' }
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFFFF' }
            };
        });
        
        // 2. 단말기 시트 생성
        const deviceSheet = workbook.addWorksheet('단말기');
        deviceSheet.columns = [
            { header: '단말기', key: 'deviceName', width: 30 },
            { header: '단독', key: 'standalone', width: 15 },
            { header: '번들', key: 'bundled', width: 15 },
            { header: '자유통화3', key: 'feature3', width: 15 },
            { header: '자유통화4', key: 'feature4', width: 15 },
            { header: '자유통화6', key: 'feature6', width: 15 },
            { header: '자유통화8', key: 'feature8', width: 15 },
            { header: '자유통화10', key: 'feature10', width: 15 },
            { header: '자유통화15', key: 'feature15', width: 15 },
            { header: '자유통화20', key: 'feature20', width: 15 },
            { header: '자유통화30', key: 'feature30', width: 15 },
            { header: '자유통화50', key: 'feature50', width: 15 },
            { header: 'AI전화', key: 'aiPhone', width: 15 }
        ];
        
        // 샘플 데이터 추가 - 요청한 데이터로 변경
        deviceSheet.addRow({ 
            deviceName: 'IP-450S', 
            standalone: 1389, 
            bundled: 556,
            feature3: '100%할인',
            feature4: '100%할인',
            feature6: '100%할인',
            feature8: '100%할인',
            feature10: '100%할인',
            feature15: '100%할인',
            feature20: '100%할인',
            feature30: '100%할인',
            feature50: '100%할인',
            aiPhone: '100%할인'
        });
        deviceSheet.addRow({ 
            deviceName: 'IP-450P', 
            standalone: 1667, 
            bundled: 1389,
            feature3: '100%할인',
            feature4: '100%할인',
            feature6: '100%할인',
            feature8: '100%할인',
            feature10: '100%할인',
            feature15: '100%할인',
            feature20: '100%할인',
            feature30: '100%할인',
            feature50: '100%할인',
            aiPhone: '100%할인'
        });
        deviceSheet.addRow({ 
            deviceName: 'IP-300S', 
            standalone: 1111, 
            bundled: 0,
            feature3: '100%할인',
            feature4: '100%할인',
            feature6: '100%할인',
            feature8: '100%할인',
            feature10: '100%할인',
            feature15: '100%할인',
            feature20: '100%할인',
            feature30: '100%할인',
            feature50: '100%할인',
            aiPhone: '100%할인'
        });
        deviceSheet.addRow({ 
            deviceName: 'IP-520S', 
            standalone: 1945, 
            bundled: 1111,
            feature3: '100%할인',
            feature4: '100%할인',
            feature6: '100%할인',
            feature8: '100%할인',
            feature10: '100%할인',
            feature15: '100%할인',
            feature20: '100%할인',
            feature30: '100%할인',
            feature50: '100%할인',
            aiPhone: '100%할인'
        });
        deviceSheet.addRow({ 
            deviceName: 'IP-520G', 
            standalone: 2111, 
            bundled: 1278,
            feature3: '50%할인',
            feature4: '50%할인',
            feature6: '100%할인',
            feature8: '100%할인',
            feature10: '100%할인',
            feature15: '100%할인',
            feature20: '100%할인',
            feature30: '100%할인',
            feature50: '100%할인',
            aiPhone: '50%할인'
        });
        deviceSheet.addRow({ 
            deviceName: 'MWP2500E', 
            standalone: 2361, 
            bundled: 1667,
            feature3: '50%할인',
            feature4: '50%할인',
            feature6: '50%할인',
            feature8: '50%할인',
            feature10: '50%할인',
            feature15: '50%할인',
            feature20: '50%할인',
            feature30: '50%할인',
            feature50: '50%할인',
            aiPhone: '50%할인'
        });
        deviceSheet.addRow({ 
            deviceName: 'GAPM-7500E', 
            standalone: 1389, 
            bundled: 1389,
            feature3: '100%할인',
            feature4: '100%할인',
            feature6: '100%할인',
            feature8: '100%할인',
            feature10: '100%할인',
            feature15: '100%할인',
            feature20: '100%할인',
            feature30: '100%할인',
            feature50: '100%할인',
            aiPhone: '100%할인'
        });
        deviceSheet.addRow({ 
            deviceName: 'IP-700S(본체)+EK-700S(확장)', 
            standalone: 5000, 
            bundled: 4444,
            feature3: '50%할인',
            feature4: '50%할인',
            feature6: '50%할인',
            feature8: '50%할인',
            feature10: '50%할인',
            feature15: '50%할인',
            feature20: '50%할인',
            feature30: '50%할인',
            feature50: '50%할인',
            aiPhone: '50%할인'
        });
        deviceSheet.addRow({ 
            deviceName: 'CPG 1Port', 
            standalone: 1000, 
            bundled: 1000,
            aiPhone: ''
        });
        deviceSheet.addRow({ 
            deviceName: 'UHD', 
            standalone: 4000, 
            bundled: 4000,
            aiPhone: ''
        });
        deviceSheet.addRow({ 
            deviceName: '가온', 
            standalone: 3000, 
            bundled: 3000,
            aiPhone: ''
        });
        deviceSheet.addRow({ 
            deviceName: '기가WIFI', 
            standalone: 3000, 
            bundled: 3000,
            aiPhone: ''
        });
        deviceSheet.addRow({ 
            deviceName: '프리미엄WIFI', 
            standalone: 5000, 
            bundled: 5000,
            aiPhone: ''
        });
        
        // 헤더 스타일 적용
        const deviceHeaderRow = deviceSheet.getRow(1);
        deviceHeaderRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4F81BD' }
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFFFF' }
            };
        });
        
        // 3. 자유통화 시트 생성
        const featureSheet = workbook.addWorksheet('자유통화');
        featureSheet.columns = [
            { header: '자유통화', key: 'feature', width: 20 },
            { header: 'DCS', key: 'dcs', width: 15 },
            { header: '고급형DCS', key: 'advancedDcs', width: 15 },
            { header: '고급형센트릭스', key: 'advancedCentrex', width: 15 },
            { header: '일반형', key: 'normal', width: 15 }
        ];
        
        // 샘플 데이터 추가
        featureSheet.addRow({ 
            feature: '없음', 
            dcs: 0, 
            advancedDcs: 0, 
            advancedCentrex: 0, 
            normal: 0 
        });
        featureSheet.addRow({ 
            feature: '자유통화4', 
            dcs: 4000, 
            advancedDcs: 5000, 
            advancedCentrex: 6000, 
            normal: 4000 
        });
        featureSheet.addRow({ 
            feature: '자유통화6', 
            dcs: 6000, 
            advancedDcs: 7000, 
            advancedCentrex: 8000, 
            normal: 6000 
        });
        featureSheet.addRow({ 
            feature: '자유통화8', 
            dcs: 8000, 
            advancedDcs: 9000, 
            advancedCentrex: 10000, 
            normal: 8000 
        });
        
        // 헤더 스타일 적용
        const featureHeaderRow = featureSheet.getRow(1);
        featureHeaderRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4F81BD' }
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFFFF' }
            };
        });
        
        // 4. 결합할인 시트 생성
        const bundleSheet = workbook.addWorksheet('결합할인');
        bundleSheet.columns = [
            { header: '카테고리', key: 'category', width: 15 },
            { header: '결합유형', key: 'bundleType', width: 30 },
            { header: '화면표시명', key: 'displayName', width: 20 },
            { header: '할인율', key: 'discountRate', width: 15 },
            { header: '할인금액', key: 'discountAmount', width: 15 }
        ];
        
        // 샘플 데이터 추가
        bundleSheet.addRow({ category: 'SME', bundleType: '인터넷_인터넷전화', displayName: '인터넷+인터넷전화', discountRate: 10, discountAmount: 0 });
        bundleSheet.addRow({ category: 'SME', bundleType: '인터넷_IPTV', displayName: '인터넷+IPTV', discountRate: 5, discountAmount: 0 });
        bundleSheet.addRow({ category: 'SME', bundleType: '인터넷_인터넷전화_IPTV', displayName: '트리플', discountRate: 0, discountAmount: 15000 });
        bundleSheet.addRow({ category: '소호', bundleType: '인터넷_인터넷전화', displayName: '소호 더블', discountRate: 8, discountAmount: 0 });
        bundleSheet.addRow({ category: '소호', bundleType: '인터넷_인터넷전화_IPTV', displayName: '소호 트리플', discountRate: 0, discountAmount: 20000 });
        bundleSheet.addRow({ category: 'SME', bundleType: 'IP450S_자유통화(3~10)', displayName: 'IP450S 자유통화 패키지', discountRate: 15, discountAmount: 0 });
        bundleSheet.addRow({ category: '소호', bundleType: '인터넷전화_자유통화(20~50)', displayName: '소호 자유통화 대용량', discountRate: 0, discountAmount: 5000 });
        
        // 헤더 스타일 적용
        const bundleHeaderRow = bundleSheet.getRow(1);
        bundleHeaderRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4F81BD' }
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFFFF' }
            };
        });
        
        // 엑셀 파일 다운로드
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = '브이원_요금계산기_양식.xlsx';
            a.click();
            
            URL.revokeObjectURL(url);
        });
    }
    
    // 장바구니 관리
    const cartItems = [];
    window.cartItems = cartItems;

    function addToCart() {
        const activeCategory = document.querySelector('.tab-button.active').getAttribute('data-category');
        let item = { category: activeCategory === 'sme' ? 'SME' : '소호' };
        
        if (activeCategory === 'sme') {
            const activeProduct = document.querySelector('#sme-components .product-tab.active').getAttribute('data-product');
            
            if (activeProduct === 'internet') {
                item.product = '인터넷';
                item.option = document.getElementById('sme-internet-speed').value;
                item.lines = parseInt(document.getElementById('sme-internet-lines').value) || 1;
            } else if (activeProduct === 'voip') {
                item.product = '인터넷전화';
                item.subProduct = document.getElementById('sme-voip-product').value;
                if (item.subProduct !== '일반형') {
                    item.option = document.getElementById('sme-voip-plan').value;
                }
                item.lines = parseInt(document.getElementById('sme-voip-lines').value) || 1;
                item.device = document.getElementById('sme-voip-device').value;
                item.feature = document.getElementById('sme-voip-feature').value;
            } else if (activeProduct === 'iptv') {
                item.product = 'IPTV';
                item.option = document.getElementById('sme-iptv-product').value;
                item.lines = parseInt(document.getElementById('sme-iptv-lines').value) || 1;
                item.device = document.getElementById('sme-iptv-device').value;
                // WIFI 선택 정보 추가
                const wifiSelect = document.getElementById('sme-iptv-wifi');
                if (wifiSelect && wifiSelect.value) {
                    item.wifi = wifiSelect.value;
                }
            }
        } else { // 소호
            const activeProduct = document.querySelector('#soho-components .product-tab.active').getAttribute('data-product');
            
            if (activeProduct === 'internet') {
                item.product = '인터넷';
                item.subProduct = document.getElementById('soho-internet-product').value;
                if (item.subProduct === '무선인터넷') {
                    item.option = document.getElementById('soho-internet-wireless').value;
                } else {
                    item.option = document.getElementById('soho-internet-speed').value;
                }
                item.lines = parseInt(document.getElementById('soho-internet-lines').value) || 1;
            } else if (activeProduct === 'voip') {
                item.product = '인터넷전화';
                item.subProduct = document.getElementById('soho-voip-product').value;
                if (item.subProduct !== '일반형') {
                    item.option = document.getElementById('soho-voip-plan').value;
                }
                item.lines = parseInt(document.getElementById('soho-voip-lines').value) || 1;
                item.device = document.getElementById('soho-voip-device').value;
                item.feature = document.getElementById('soho-voip-feature').value;
            } else if (activeProduct === 'iptv') {
                item.product = 'IPTV';
                item.option = document.getElementById('soho-iptv-product').value;
                item.lines = parseInt(document.getElementById('soho-iptv-lines').value) || 1;
                item.device = document.getElementById('soho-iptv-device').value;
            } else if (activeProduct === 'ai-phone') {
                item.product = 'AI전화';
                item.option = document.getElementById('soho-ai-phone-plan').value;
                item.lines = parseInt(document.getElementById('soho-ai-phone-lines').value) || 1;
                item.device = document.getElementById('soho-ai-phone-device').value;
                // AI전화 할인 적용을 위해 feature 값 명시
                item.feature = 'AI전화';
            } else if (activeProduct === 'dx-solution') {
                item.product = 'DX솔루션';
                item.subProduct = document.getElementById('soho-dx-product').value;
                if (item.subProduct === '태이블오더') {
                    item.option = document.getElementById('soho-dx-table-type').value;
                } else if (item.subProduct === '키오스크') {
                    item.device = document.getElementById('soho-dx-kiosk-type').value;
                } else if (item.subProduct === '포스') {
                    item.device = document.getElementById('soho-dx-device').value;
                }
                item.quantity = parseInt(document.getElementById('soho-dx-quantity').value) || 1;
            } else if (activeProduct === 'cctv') {
                item.product = '지능형CCTV';
                item.subProduct = document.getElementById('soho-cctv-product').value;
                item.quantity = parseInt(document.getElementById('soho-cctv-quantity').value) || 1;
            }
        }
        
        // 장바구니에 추가 전 로그
        console.log('addToCart - item:', item);
        cartItems.push(item);
        updateCartDisplay();
    }

    function updateCartDisplay() {
        const cartContainer = document.getElementById('cart-items');
        cartContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            cartContainer.innerHTML = '<p>상품이 비어 있습니다.</p>';
            return;
        }
        
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            // 상품명(카테고리+상품)
            let itemTitle = `<strong>${item.category} ${item.product}</strong>`;
            // 상세 정보(옵션, subProduct, 회선수 등)
            let details = '';
            if (item.subProduct) {
                details += `<div class="cart-item-detail">${item.subProduct}</div>`;
            }
            if (item.option) {
                details += `<div class="cart-item-detail">${item.option}</div>`;
            }
            if (item.lines) {
                details += `<div class="cart-item-detail">${item.lines}회선</div>`;
            }
            if (item.quantity) {
                details += `<div class="cart-item-detail">${item.quantity}개</div>`;
            }
            if (item.device) {
                details += `<div class="cart-item-detail">단말기: ${item.device}</div>`;
            }
            if (item.feature && item.feature !== '없음') {
                details += `<div class="cart-item-detail">자유통화: ${item.feature}</div>`;
            }
            if (item.wifi) {
                details += `<div class="cart-item-detail">WIFI: ${item.wifi}</div>`;
            }
            
            const removeButton = document.createElement('span');
            removeButton.className = 'remove-item';
            removeButton.innerHTML = '<i class="fas fa-times"></i>';
            removeButton.addEventListener('click', () => removeFromCart(index));
            
            cartItem.innerHTML = itemTitle + details;
            cartItem.appendChild(removeButton);
            cartContainer.appendChild(cartItem);
            
            // 애니메이션 효과 추가
            cartItem.style.opacity = '0';
            cartItem.style.transform = 'translateY(20px)';
            setTimeout(() => {
                cartItem.style.transition = 'all 0.3s ease';
                cartItem.style.opacity = '1';
                cartItem.style.transform = 'translateY(0)';
            }, 50 * index);
        });
    }

    function removeFromCart(index) {
        // 삭제 애니메이션
        const cartItemElements = document.querySelectorAll('.cart-item');
        const itemToRemove = cartItemElements[index];
        
        itemToRemove.style.transition = 'all 0.3s ease';
        itemToRemove.style.opacity = '0';
        itemToRemove.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            // 배열에서 해당 아이템 제거
            cartItems.splice(index, 1);
            updateCartDisplay();
        }, 300);
    }

    // 다시 계산하기 함수
    function resetCalculation() {
        // 현재 활성화된 카테고리 탭 기억
        const activeTab = document.querySelector('.tab-button.active');
        const activeCategory = activeTab ? activeTab.getAttribute('data-category') : 'soho';

        // 장바구니 비우기
        cartItems.length = 0;
        updateCartDisplay();
        
        // 계산 결과 숨기기
        const resultContainer = document.getElementById('result-container');
        resultContainer.style.display = 'none';
        
        // 선택된 옵션 초기화
        document.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = 1;
        });

        // 카테고리 탭 활성화 (기존 활성화된 카테고리로)
        document.querySelectorAll('.tab-button').forEach(tab => {
            if (tab.getAttribute('data-category') === activeCategory) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        // 카테고리 컴포넌트 표시
        document.querySelectorAll('.component-container').forEach(container => {
            if (container.id === `${activeCategory}-components`) {
                container.classList.add('active');
            } else {
                container.classList.remove('active');
            }
        });
        
        // 첫 번째 제품 탭 활성화 (해당 카테고리 내에서만)
        document.querySelectorAll(`#${activeCategory}-components .product-tab`).forEach((tab, index) => {
            if (index === 0) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        document.querySelectorAll(`#${activeCategory}-components .product-component`).forEach((component, index) => {
            if (index === 0) {
                component.classList.add('active');
            } else {
                component.classList.remove('active');
            }
        });

        // 애니메이션 효과 추가
        const cartContainer = document.querySelector('.cart-container');
        cartContainer.style.transition = 'all 0.3s ease';
        cartContainer.style.transform = 'translateY(10px)';
        cartContainer.style.opacity = '0.5';
        
        setTimeout(() => {
            cartContainer.style.transform = 'translateY(0)';
            cartContainer.style.opacity = '1';
        }, 300);
    }

    // 요금 계산 함수
    function calculateTotalPrice() {
        try {
            if (cartItems.length === 0) {
                alert('상품을 추가해주세요.');
                return;
            }
            
            console.log('요금 계산 시작...');

            console.group('🧮 계산 디버그');
            console.log('cartItems:', cartItems);
            console.groupEnd();

            console.log('사용 가능한 priceData:', priceData);
            console.log('사용 가능한 specialFeaturePrices:', specialFeaturePrices);
            console.log('사용 가능한 devicePrices:', devicePrices);
            console.log('사용 가능한 bundleDiscounts:', bundleDiscounts);
            console.log('사용 가능한 deviceStandalonePrices:', deviceStandalonePrices);
            console.log('사용 가능한 deviceBundledPrices:', deviceBundledPrices);
            console.log('사용 가능한 deviceFeatureDiscounts:', deviceFeatureDiscounts);
            
            // 새로운 객체가 정의되지 않은 경우 대비 초기화
            if (!deviceStandalonePrices || Object.keys(deviceStandalonePrices).length === 0) {
                deviceStandalonePrices = {...devicePrices};
                console.log('deviceStandalonePrices 초기화:', deviceStandalonePrices);
            }
            if (!deviceBundledPrices || Object.keys(deviceBundledPrices).length === 0) {
                deviceBundledPrices = {};
                Object.keys(devicePrices).forEach(device => {
                    deviceBundledPrices[device] = devicePrices[device] * 0.9; // 기본 10% 할인
                });
                console.log('deviceBundledPrices 초기화:', deviceBundledPrices);
            }
            if (!deviceFeatureDiscounts || Object.keys(deviceFeatureDiscounts).length === 0) {
                deviceFeatureDiscounts = {};
                console.log('deviceFeatureDiscounts 초기화:', deviceFeatureDiscounts);
            }
            
            let totalBasicFee = 0;
            let totalDeviceFee = 0;
            let totalInstallationFee = 0;
            let totalSpecialFeatureFee = 0;
            let totalBundleDiscount = 0;
            
            // 카테고리별 상품 수 계산 (결합 할인 적용을 위해)
            const productCounts = {
                'SME': { '인터넷': 0, '인터넷전화': 0, 'IPTV': 0 },
                '소호': { '인터넷': 0, '인터넷전화': 0, 'IPTV': 0, 'AI전화': 0, 'DX솔루션': 0, '지능형CCTV': 0 }
            };
            
            // 첫 번째 루프: 상품 수 계산 및 기본 요금 계산
            cartItems.forEach(item => {
                console.log('calculateTotalPrice - item:', item);
                // 상품 수 계산
                if (productCounts[item.category] && productCounts[item.category][item.product] !== undefined) {
                    productCounts[item.category][item.product]++;
                }
                
                console.log('계산 중인 상품:', item);
                
                // 요금 데이터 찾기
                let priceInfo = null;
                try {
                    // 1. subProduct + option
                    if (item.subProduct && item.option && priceData[item.category]?.[item.product]?.[item.subProduct]?.[item.option]) {
                        priceInfo = priceData[item.category][item.product][item.subProduct][item.option];
                    }
                    // 2. subProduct만
                    else if (item.subProduct && priceData[item.category]?.[item.product]?.[item.subProduct]) {
                        priceInfo = priceData[item.category][item.product][item.subProduct];
                    }
                    // 3. option만
                    else if (item.option && priceData[item.category]?.[item.product]?.[item.option]) {
                        priceInfo = priceData[item.category][item.product][item.option];
                    }
                    // 4. subProduct가 없고 option도 없을 때
                    else if (priceData[item.category]?.[item.product]) {
                        priceInfo = priceData[item.category][item.product];
                    }
                    // 5. CCTV 특수 처리: subProduct/option 둘 중 하나라도 '에스원안심' 또는 '출입관리기'면
                    else if (item.product === "지능형CCTV") {
                        const key = item.subProduct || item.option;
                        if (key && priceData[item.category]?.[item.product]?.[key]) {
                            priceInfo = priceData[item.category][item.product][key];
                        }
                    }
                } catch (error) {
                    console.error('요금 정보 조회 중 오류:', error);
                    priceInfo = null;
                }
                
                console.log('찾은 요금 정보:', priceInfo);
                
                if (priceInfo) {
                    const quantity = item.lines || item.quantity || 1;
                    
                    // 기본 요금 계산
                    totalBasicFee += priceInfo.기본료 * quantity;
                    
                    // 장비 임대료 계산
                    totalDeviceFee += priceInfo.장비임대료 * quantity;
                    
                    // 설치비 계산
                    totalInstallationFee += priceInfo.설치비;
                    
                    // 단말기 추가 요금
                    if (item.device) {
                        let devicePrice = 0;
                        // 인터넷과 함께 설치하는지 확인 (같은 카테고리에 인터넷 상품이 있는지)
                        const hasInternet = cartItems.some(cartItem => 
                            cartItem.category === item.category && 
                            cartItem.product === '인터넷'
                        );
                        // 단말기 가격 정보 확인
                        if (deviceStandalonePrices && deviceStandalonePrices[item.device]) {
                            // 인터넷과 함께 설치하는 경우(번들): 인터넷+인터넷전화 또는 인터넷+AI전화
                            if (hasInternet && deviceBundledPrices && deviceBundledPrices[item.device]) {
                                devicePrice = deviceBundledPrices[item.device];
                                console.log(`단말기 번들 가격 적용: ${item.device}, ${devicePrice}원`);
                            } else {
                                // 인터넷 없이 전화(인터넷전화/AI전화)만 설치하는 경우(단독)
                                devicePrice = deviceStandalonePrices[item.device];
                                console.log(`단말기 단독 가격 적용: ${item.device}, ${devicePrice}원`);
                            }
                            // 자유통화/AI전화 할인 확인
                            if (item.feature && item.feature !== '없음' && 
                                deviceFeatureDiscounts && 
                                deviceFeatureDiscounts[item.device] && 
                                deviceFeatureDiscounts[item.device][item.feature]) {
                                const discount = deviceFeatureDiscounts[item.device][item.feature];
                                if (discount.type === 'percent') {
                                    // 퍼센트 할인 적용
                                    const discountAmount = devicePrice * discount.value / 100;
                                    devicePrice -= discountAmount;
                                    console.log(`단말기 자유통화/AI전화 할인 적용: ${item.device}, ${item.feature}, ${discount.value}% (${discountAmount}원 할인)`);
                                }
                            }
                            totalDeviceFee += devicePrice * quantity;
                            console.log(`단말기 가격 추가: ${item.device}, ${devicePrice}원 x ${quantity}`);
                        } else if (devicePrices && devicePrices[item.device]) {
                            // 기존 방식 사용 (하위 호환성)
                            devicePrice = devicePrices[item.device];
                            totalDeviceFee += devicePrice * quantity;
                            console.log(`단말기 가격 추가(기존 방식): ${item.device}, ${devicePrice}원 x ${quantity}`);
                        } else {
                            console.warn(`단말기 ${item.device}의 가격 정보가 없습니다.`);
                        }
                    }
                    
                    // 자유통화 추가 요금
                    if (item.feature && item.feature !== '없음') {
                        if (item.product === '인터넷전화') {
                            const subProduct = item.subProduct || '일반형';
                            
                            // specialFeaturePrices 구조 확인 및 적용
                            let featurePrice = 0;
                            
                            // 새로운 구조 (subProduct별로 객체가 있는 경우)
                            if (specialFeaturePrices[subProduct] && specialFeaturePrices[subProduct][item.feature]) {
                                featurePrice = specialFeaturePrices[subProduct][item.feature];
                            } 
                            // 기존 구조 (단순 키-값 구조인 경우)
                            else if (specialFeaturePrices[item.feature]) {
                                featurePrice = specialFeaturePrices[item.feature];
                            }
                            
                            if (featurePrice) {
                                totalSpecialFeatureFee += featurePrice * quantity;
                                console.log(`자유통화 요금 적용: ${subProduct} - ${item.feature} - ${featurePrice}원 x ${quantity}`);
                            }
                        }
                    }
                } else {
                    console.warn(`상품 ${item.category} - ${item.product}의 요금 정보가 없습니다.`);
                    // 기본 요금 적용 (오류 방지)
                    totalBasicFee += 10000;
                    totalDeviceFee += 5000;
                    totalInstallationFee += 20000;
                }
            });
            
            console.log('계산된 기본 요금:', totalBasicFee);
            console.log('계산된 장비임대료:', totalDeviceFee);
            console.log('계산된 설치비:', totalInstallationFee);
            console.log('계산된 자유통화 요금:', totalSpecialFeatureFee);
            console.log('상품 카운트:', productCounts);
            
            // 결합 할인 계산
            let totalInternetDiscount = 0;
            let totalVoipDiscount = 0;
            let totalInstallDiscount = 0;
            let internetLines = 0;
            let voipLines = 0;
            // 카테고리별로 현재 선택된 상품 리스트 생성 (실제 있는 상품 목록)
            const selectedProducts = {
                'SME': [],
                '소호': []
            };
            // 선택된 상품과 자유통화 정보를 저장할 객체
            const selectedFeatures = {
                'SME': {},
                '소호': {}
            };
            // 선택된 상품 리스트 만들기
            Object.keys(productCounts).forEach(category => {
                Object.keys(productCounts[category]).forEach(product => {
                    if (productCounts[category][product] > 0) {
                        selectedProducts[category].push(product);
                        cartItems.forEach(item => {
                            if (item.category === category && item.product === product) {
                                if (item.option) {
                                    const productWithOption = `${product}_${item.option}`;
                                    selectedProducts[category].push(productWithOption);
                                }
                                if (item.subProduct) {
                                    const productWithSubtype = `${product}_${item.subProduct}`;
                                    selectedProducts[category].push(productWithSubtype);
                                }
                                if (item.feature && item.feature.startsWith('자유통화')) {
                                    const featureMatch = item.feature.match(/자유통화\s+(\d+)/);
                                    if (featureMatch) {
                                        const featureValue = parseInt(featureMatch[1]);
                                        if (!selectedFeatures[category][product]) {
                                            selectedFeatures[category][product] = [];
                                        }
                                        selectedFeatures[category][product].push({
                                            name: '자유통화',
                                            value: featureValue
                                        });
                                    }
                                }
                            }
                        });
                    }
                });
            });
            // 회선 수 계산
            cartItems.forEach(item => {
                if (item.product === '인터넷') {
                    internetLines += item.lines || item.quantity || 1;
                }
                if (item.product === '인터넷전화') {
                    voipLines += item.lines || item.quantity || 1;
                }
            });
            // 할인 최대값 변수 선언
            let maxInternetDiscount = 0;
            let maxVoipDiscount = 0;
            let maxInstallDiscount = 0;
            if (Array.isArray(bundleDiscounts)) {
                bundleDiscounts.forEach(discount => {
                    const { category, productKeys, featureRange, displayName, internetDiscount, voipDiscount, installationDiscount } = discount;
                    if (selectedProducts[category]) {
                        const allProductKeysFound = productKeys.every(key => {
                            if (selectedProducts[category].includes(key)) return true;
                            return selectedProducts[category].some(selectedProduct => 
                                selectedProduct.startsWith(key) || selectedProduct.endsWith(key)
                            );
                        });
                        let featureRangeMatched = true;
                        if (featureRange && allProductKeysFound) {
                            featureRangeMatched = false;
                            Object.keys(selectedFeatures[category]).forEach(product => {
                                selectedFeatures[category][product].forEach(feature => {
                                    if (feature.name === featureRange.feature &&
                                        feature.value >= featureRange.min && 
                                        feature.value <= featureRange.max) {
                                        featureRangeMatched = true;
                                    }
                                });
                            });
                        }
                        if (allProductKeysFound && featureRangeMatched) {
                            if (internetDiscount > maxInternetDiscount) maxInternetDiscount = internetDiscount;
                            if (voipDiscount > maxVoipDiscount) maxVoipDiscount = voipDiscount;
                            if (installationDiscount > maxInstallDiscount) maxInstallDiscount = installationDiscount;
                        }
                    }
                });
            }
            // 회선 수만큼 곱해서 할인 적용
            totalInternetDiscount = maxInternetDiscount * internetLines;
            totalVoipDiscount = maxVoipDiscount * voipLines;
            totalInstallDiscount = maxInstallDiscount; // 설치비 할인은 1회만 적용
            // 실제 요금에서 차감
            totalBasicFee -= totalInternetDiscount;
            totalBasicFee -= totalVoipDiscount;
            totalInstallationFee -= totalInstallDiscount;
            
            console.log('계산된 결합 할인:', totalBundleDiscount);
            
            // 최종 합계 계산 (할인 적용)
            const finalTotal = totalBasicFee + totalDeviceFee + totalSpecialFeatureFee - totalBundleDiscount;
            const finalTotalRounded = Math.floor(finalTotal / 10) * 10; // 원 단위 절사
            const totalWithInstallation = finalTotal + totalInstallationFee; // 내부 계산용으로만 사용
            // VAT 포함 금액 계산
            const vatIncluded = Math.round(finalTotalRounded * 1.1);
            console.log('월 사용료(설치비 제외):', finalTotal);
            console.log('월 사용료(원 단위 절사):', finalTotalRounded);
            console.log('총 금액(설치비 포함):', totalWithInstallation);
            
            // 항목별 설명 준비
            let basicFeeDescription = '기본료 합계';
            let deviceFeeDescription = '장비임대료 합계';
            let featureFeeDescription = '자유통화 요금';
            let installationFeeDescription = '설치비 합계';
            
            // 기본료 상세 내역 추가
            const basicFeeDescriptions = [];
            cartItems.forEach(item => {
                if (priceData[item.category]?.[item.product]) {
                    let priceInfo;
                    
                    // 요금 정보 찾기
                    try {
                        if (item.subProduct) {
                            if (item.option && priceData[item.category]?.[item.product]?.[item.subProduct]?.[item.option]) {
                                priceInfo = priceData[item.category][item.product][item.subProduct][item.option];
                            } else if (priceData[item.category]?.[item.product]?.[item.subProduct]) {
                                priceInfo = priceData[item.category][item.product][item.subProduct];
                            }
                        } else if (item.option && priceData[item.category]?.[item.product]?.[item.option]) {
                            priceInfo = priceData[item.category][item.product][item.option];
                        } else if (priceData[item.category]?.[item.product]) {
                            priceInfo = priceData[item.category][item.product];
                        }
                    } catch (error) {
                        console.error('요금 정보 조회 중 오류:', error);
                        priceInfo = null;
                    }
                    
                    if (priceInfo && priceInfo.기본료) {
                        const quantity = item.lines || item.quantity || 1;
                        const basicFee = priceInfo.기본료 * quantity;
                        
                        let productName = item.product;
                        if (item.subProduct) {
                            productName += ` ${item.subProduct}`;
                        }
                        if (item.option) {
                            productName += ` ${item.option}`;
                        }
                        
                        basicFeeDescriptions.push(`${productName} 기본료 ${basicFee.toLocaleString()}원`);
                    }
                }
            });
            
            // 단말기 종류별 설명 추가
            const deviceDescriptions = [];
            cartItems.forEach(item => {
                if (item.device) {
                    let description = '';
                    let count = item.lines || item.quantity || 1;
                    if (item.device.includes('UHD')) {
                        description = `UHD 임대비 ${deviceBundledPrices[item.device]?.toLocaleString() || deviceStandalonePrices[item.device]?.toLocaleString() || '0'}원`;
                    } else if (item.device.includes('가온')) {
                        description = `가온 임대비 ${deviceBundledPrices[item.device]?.toLocaleString() || deviceStandalonePrices[item.device]?.toLocaleString() || '0'}원`;
                    } else if (item.product === '인터넷전화' || item.product === 'AI전화') {
                        // 인터넷전화 또는 AI전화 단말기는 전화기 할부금으로 표시
                        let price = 0;
                        // 인터넷과 함께 설치하는지 확인
                        const hasInternet = cartItems.some(cartItem => 
                            cartItem.category === item.category && 
                            cartItem.product === '인터넷'
                        );
                        if (hasInternet && deviceBundledPrices[item.device]) {
                            price = deviceBundledPrices[item.device];
                        } else {
                            price = deviceStandalonePrices[item.device] || 0;
                        }
                        // 자유통화 할인 적용
                        if (item.feature && item.feature !== '없음' && 
                            deviceFeatureDiscounts && 
                            deviceFeatureDiscounts[item.device] && 
                            deviceFeatureDiscounts[item.device][item.feature]) {
                            const discount = deviceFeatureDiscounts[item.device][item.feature];
                            if (discount.type === 'percent') {
                                price = price * (1 - discount.value / 100);
                            }
                        }
                        if (price === 0) {
                            description = '전화기 무상 임대';
                        } else {
                            description = `전화기 할부금 ${Math.floor(price).toLocaleString()}원 x ${count}대`;
                        }
                    }
                    if (description) {
                        deviceDescriptions.push(description);
                    }
                }
            });
            
            // WIFI 요금 추가
            cartItems.forEach(item => {
                if (item.wifi) {
                    let wifiPrice = 0;
                    const quantity = item.lines || item.quantity || 1;
                    if (deviceStandalonePrices && deviceStandalonePrices[item.wifi]) {
                        wifiPrice = deviceStandalonePrices[item.wifi];
                        totalDeviceFee += wifiPrice * quantity;
                        console.log(`WIFI 요금 추가: ${item.wifi}, ${wifiPrice}원 x ${quantity}`);
                    }
                }
            });
            
            // 결과 표시
            const resultContainer = document.getElementById('result-container');
            resultContainer.style.display = 'block';
            
            // 기본료 설명 텍스트 생성
            const basicFeeDescriptionText = basicFeeDescriptions.length > 0 
                ? `(${basicFeeDescriptions.join(' + ')})` 
                : '';
            
            // 단말기 설명 텍스트 생성
            const deviceDescriptionText = deviceDescriptions.length > 0 
                ? `(${deviceDescriptions.join(' + ')})` 
                : '';
            
            // 할인 내역 계산
            const internetDisc = totalBasicFee - (totalBasicFee + totalBundleDiscount);
            const voipDisc = totalDeviceFee - (totalDeviceFee + totalBundleDiscount);
            const installDisc = totalInstallationFee - (totalInstallationFee + totalBundleDiscount);
            
            // 할인 금액 안전하게 표시하는 함수
            function safeDiscountText(label, value) {
                if (typeof value === 'number' && !isNaN(value) && value !== 0) {
                    return `<span class="discount-detail" style="color: red">${label} : -${Math.abs(value).toLocaleString()}원</span>`;
                }
                return '';
            }
            
            let discountHtml = '';
            const discounts = [];
            if (totalInternetDiscount) discounts.push(safeDiscountText('인터넷 할인', totalInternetDiscount));
            if (totalVoipDiscount) discounts.push(safeDiscountText('인터넷전화 할인', totalVoipDiscount));
            if (totalInstallDiscount) discounts.push(safeDiscountText('설치비 할인', totalInstallDiscount));
            discountHtml = discounts.join(', ');
            // 디버깅용 로그 추가
            console.log('discountHtml:', discountHtml);
            console.log('totalInternetDiscount:', totalInternetDiscount, 'totalVoipDiscount:', totalVoipDiscount, 'totalInstallDiscount:', totalInstallDiscount);
            
            resultContainer.innerHTML = `
                <h3><i class="fas fa-chart-line"></i> 요금 계산 결과</h3>
                <p><i class="fas fa-won-sign"></i> ${basicFeeDescription} ${basicFeeDescriptionText}: ${totalBasicFee.toLocaleString()}원</p>
                <p><i class="fas fa-hdd"></i> ${deviceFeeDescription} ${deviceDescriptionText}: ${(Math.floor(totalDeviceFee / 10) * 10).toLocaleString()}원</p>
                <p><i class="fas fa-comments"></i> ${featureFeeDescription}: ${totalSpecialFeatureFee.toLocaleString()}원</p>
                <p><i class="fas fa-tools"></i> ${installationFeeDescription}: ${totalInstallationFee.toLocaleString()}원</p>
                ${discountHtml}
                <p class="total-price"><i class="fas fa-check-circle"></i> <strong>월 사용료 (VAT별도): ${finalTotalRounded.toLocaleString()}원 (VAT포함: ${vatIncluded.toLocaleString()}원)</strong></p>
            `;
            
            // 결과에 애니메이션 효과 추가
            const resultItems = resultContainer.querySelectorAll('p');
            resultItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 100 * (index + 1));
            });
        } catch (error) {
            console.error('요금 계산 중 오류 발생:', error);
            console.error(error.stack);
            alert('요금 계산 중 오류가 발생했습니다. 콘솔을 확인해주세요.');
            
            // 기본 결과 표시 (오류 발생 시)
            const resultContainer = document.getElementById('result-container');
            resultContainer.style.display = 'block';
            resultContainer.innerHTML = `
                <h3><i class="fas fa-exclamation-triangle"></i> 요금 계산 중 오류 발생</h3>
                <p>오류 내용: ${error.message}</p>
                <p>자세한 내용은 개발자 콘솔을 확인해주세요.</p>
                <p class="total-price"><i class="fas fa-check-circle"></i> <strong>월 사용료(설치비 제외) (VAT별도): 계산 불가</strong></p>
            `;
        }
    }

    // 이벤트 리스너 등록
    function initEventListeners() {
        document.getElementById('add-to-cart').addEventListener('click', addToCart);
        document.getElementById('calculate-button').addEventListener('click', calculateTotalPrice);
        document.getElementById('reset-button').addEventListener('click', resetCalculation);
    }

    // 카테고리 선택 탭 관리
    function initCategoryTabs() {
        const categoryTabs = document.querySelectorAll('.tab-button');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 모든 탭 비활성화
                categoryTabs.forEach(t => t.classList.remove('active'));
                
                // 클릭한 탭 활성화
                this.classList.add('active');
                
                // 모든 컴포넌트 컨테이너 숨기기
                document.querySelectorAll('.component-container').forEach(container => {
                    container.classList.remove('active');
                });
                
                // 선택한 컴포넌트 컨테이너 표시
                const category = this.getAttribute('data-category');
                document.getElementById(`${category}-components`).classList.add('active');
            });
        });
    }

    // 제품 선택 탭 관리 (SME)
    function initSmeProductTabs() {
        const productTabs = document.querySelectorAll('#sme-components .product-tab');
        productTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 모든 탭 비활성화
                productTabs.forEach(t => t.classList.remove('active'));
                
                // 클릭한 탭 활성화
                this.classList.add('active');
                
                // 모든 제품 컴포넌트 숨기기
                document.querySelectorAll('#sme-components .product-component').forEach(component => {
                    component.classList.remove('active');
                });
                
                // 선택한 제품 컴포넌트 표시
                const product = this.getAttribute('data-product');
                document.getElementById(`sme-${product}`).classList.add('active');

                // IPTV 탭 선택 시 WIFI 항목 표시 여부 설정
                if (product === 'iptv') {
                    const smeIptvProduct = document.getElementById('sme-iptv-product');
                    const smeIptvWifiGroup = document.getElementById('sme-iptv-wifi-group');
                    if (smeIptvProduct.value === '베이직' || smeIptvProduct.value === '프리미엄') {
                        smeIptvWifiGroup.style.display = 'block';
                    }
                }
            });
        });
    }

    // 제품 선택 탭 관리 (소호)
    function initSohoProductTabs() {
        const productTabs = document.querySelectorAll('#soho-components .product-tab');
        productTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 모든 탭 비활성화
                productTabs.forEach(t => t.classList.remove('active'));
                
                // 클릭한 탭 활성화
                this.classList.add('active');
                
                // 모든 제품 컴포넌트 숨기기
                document.querySelectorAll('#soho-components .product-component').forEach(component => {
                    component.classList.remove('active');
                });
                
                // 선택한 제품 컴포넌트 표시
                const product = this.getAttribute('data-product');
                document.getElementById(`soho-${product}`).classList.add('active');
            });
        });
    }
    
    // 소호 인터넷 상품 선택 시 UI 업데이트
    function initSohoInternetChange() {
        const productSelect = document.getElementById('soho-internet-product');
        const speedGroup = document.getElementById('soho-internet-speed-group');
        const wirelessGroup = document.getElementById('soho-internet-wireless-group');
        
        productSelect.addEventListener('change', function() {
            if (this.value === '무선인터넷') {
                speedGroup.style.display = 'none';
                wirelessGroup.style.display = 'block';
            } else {
                speedGroup.style.display = 'block';
                wirelessGroup.style.display = 'none';
            }
        });
    }
    
    // 소호 DX솔루션 상품 선택 시 UI 업데이트
    function initSohoDxProductChange() {
        const productSelect = document.getElementById('soho-dx-product');
        const tableGroup = document.getElementById('soho-dx-table-group');
        const deviceGroup = document.getElementById('soho-dx-device-group');
        const kioskGroup = document.getElementById('soho-dx-kiosk-group');
        
        productSelect.addEventListener('change', function() {
            if (this.value === '태이블오더') {
                tableGroup.style.display = 'block';
                deviceGroup.style.display = 'none';
                kioskGroup.style.display = 'none';
            } else if (this.value === '포스') {
                tableGroup.style.display = 'none';
                deviceGroup.style.display = 'block';
                kioskGroup.style.display = 'none';
            } else if (this.value === '키오스크') {
                tableGroup.style.display = 'none';
                deviceGroup.style.display = 'none';
                kioskGroup.style.display = 'block';
            }
        });
    }
    
    // 인터넷전화 요금제 변경 시 자유통화 표시 여부 설정
    function initVoipPlanChange() {
        // SME 인터넷전화 요금제 변경 이벤트 처리
        const smePlanSelect = document.getElementById('sme-voip-plan');
        const smeFeatureGroup = document.getElementById('sme-voip-feature-group');
        smePlanSelect.addEventListener('change', function() {
            if (this.value === '종량제') {
                smeFeatureGroup.style.display = 'none';
            } else {
                smeFeatureGroup.style.display = 'block';
            }
        });
        // 소호 인터넷전화 요금제 변경 이벤트 처리
        const sohoPlanSelect = document.getElementById('soho-voip-plan');
        const sohoFeatureGroup = document.getElementById('soho-voip-feature-group');
        sohoPlanSelect.addEventListener('change', function() {
            if (this.value === '종량제') {
                sohoFeatureGroup.style.display = 'none';
            } else {
                sohoFeatureGroup.style.display = 'block';
            }
        });
        // SME 인터넷전화 상품 변경 이벤트 처리
        const smeProductSelect = document.getElementById('sme-voip-product');
        const smePlanGroup = document.getElementById('sme-voip-plan-group');
        smeProductSelect.addEventListener('change', function() {
            if (this.value === '일반형') {
                // 일반형 선택 시 종량제만 표시
                smePlanSelect.value = '종량제';
                smePlanGroup.style.display = 'none';
                smeFeatureGroup.style.display = 'none';
            } else {
                // 다른 상품 선택 시 요금제 선택 표시
                smePlanGroup.style.display = 'block';
                // 현재 선택된 요금제가 정액제이면 자유통화 표시
                if (smePlanSelect.value === '정액제') {
                    smeFeatureGroup.style.display = 'block';
                } else {
                    smeFeatureGroup.style.display = 'none';
                }
            }
        });
        // 소호 인터넷전화 상품 변경 이벤트 처리
        const sohoProductSelect = document.getElementById('soho-voip-product');
        const sohoPlanGroup = document.getElementById('soho-voip-plan-group');
        sohoProductSelect.addEventListener('change', function() {
            if (this.value === '일반형') {
                // 일반형 선택 시 종량제만 표시
                sohoPlanSelect.value = '종량제';
                sohoPlanGroup.style.display = 'none';
                sohoFeatureGroup.style.display = 'none';
            } else {
                // 다른 상품 선택 시 요금제 선택 표시
                sohoPlanGroup.style.display = 'block';
                // 현재 선택된 요금제가 정액제이면 자유통화 표시
                if (sohoPlanSelect.value === '정액제') {
                    sohoFeatureGroup.style.display = 'block';
                } else {
                    sohoFeatureGroup.style.display = 'none';
                }
            }
        });
        // 초기 상태 설정
        if (smePlanSelect.value === '종량제') {
            smeFeatureGroup.style.display = 'none';
        }
        if (sohoPlanSelect.value === '종량제') {
            sohoFeatureGroup.style.display = 'none';
        }
        // 초기 상품 상태에 따른 UI 설정
        if (smeProductSelect.value === '일반형') {
            smePlanSelect.value = '종량제';
            smePlanGroup.style.display = 'none';
            smeFeatureGroup.style.display = 'none';
        }
        if (sohoProductSelect.value === '일반형') {
            sohoPlanSelect.value = '종량제';
            sohoPlanGroup.style.display = 'none';
            sohoFeatureGroup.style.display = 'none';
        }
    }
    
    // AI전화 요금제 변경 시 단말기 표시 여부 설정
    function initAiPhonePlanChange() {
        // 소호 AI전화 요금제 변경 이벤트 처리
        const aiPhonePlanSelect = document.getElementById('soho-ai-phone-plan');
        const aiPhoneDeviceGroup = document.getElementById('soho-ai-phone-device-group');
        
        aiPhonePlanSelect.addEventListener('change', function() {
            if (this.value === '부가') {
                // 부가 선택 시 단말기 항목 숨기기
                aiPhoneDeviceGroup.style.display = 'none';
            } else {
                // 정액제 선택 시 단말기 항목 표시
                aiPhoneDeviceGroup.style.display = 'block';
            }
        });
        
        // 초기 상태 설정
        if (aiPhonePlanSelect.value === '부가') {
            aiPhoneDeviceGroup.style.display = 'none';
        }
    }
    
    // JSON 파일에서 요금 데이터 로드
    fetch('priceData.json')
        .then(response => response.json())
        .then(data => {
            priceData = data.priceData;
            window.priceData = priceData;
            specialFeaturePrices = data.specialFeaturePrices;
            window.specialFeaturePrices = specialFeaturePrices;
            devicePrices = data.devicePrices;
            window.devicePrices = devicePrices;
            
            // 결합 할인 데이터가 있으면 로드
            if (data.bundleDiscounts) {
                bundleDiscounts = data.bundleDiscounts;
            }
            
            // 단말기 세부 데이터 로드
            if (data.deviceStandalonePrices) {
                deviceStandalonePrices = data.deviceStandalonePrices;
            } else {
                // 기존 방식의 호환성 유지
                deviceStandalonePrices = {...devicePrices};
            }
            
            if (data.deviceBundledPrices) {
                deviceBundledPrices = data.deviceBundledPrices;
            }
            
            if (data.deviceFeatureDiscounts) {
                deviceFeatureDiscounts = data.deviceFeatureDiscounts;
            }
            
            // 전역에 데이터 저장 (계산 함수에서 참조)
            window.bundleDiscounts = bundleDiscounts;
            window.deviceStandalonePrices = deviceStandalonePrices;
            window.deviceBundledPrices = deviceBundledPrices;
            window.deviceFeatureDiscounts = deviceFeatureDiscounts;
            
            console.log('요금 데이터 로드 완료');
            
            // 데이터 로드 후 초기화 실행
            init();
        })
        .catch(error => {
            console.error('요금 데이터 로드 중 오류 발생:', error);
            // 오류 발생 시 기본 데이터 사용 (경고창 표시 제거)
            console.log('기본 데이터를 사용합니다.');
            
            // 기본 데이터 설정
            setDefaultData();
            
            // 오류가 발생해도 초기화 실행
            init();
        });
    
    // 기본 데이터 설정 함수
    function setDefaultData() {
        // SME 요금 데이터
        priceData = {
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
                    "고급형DCS": {
                        "종량제": { "기본료": 7000, "장비임대료": 3500, "설치비": 25000 },
                        "정액제": { "기본료": 12000, "장비임대료": 3500, "설치비": 25000 }
                    },
                    "고급형센트릭스": {
                        "종량제": { "기본료": 8000, "장비임대료": 4000, "설치비": 30000 },
                        "정액제": { "기본료": 15000, "장비임대료": 4000, "설치비": 30000 }
                    },
                    "일반형": { "기본료": 5000, "장비임대료": 2000, "설치비": 15000 }
                },
                "IPTV": {
                    "베이직": { "기본료": 10000, "장비임대료": 5000, "설치비": 20000 },
                    "프리미엄": { "기본료": 15000, "장비임대료": 5000, "설치비": 20000 },
                    "단체형 일반형": { "기본료": 20000, "장비임대료": 5000, "설치비": 25000 }
                }
            },
            "소호": {
                "인터넷": {
                    "유선인터넷": {
                        "100M": { "기본료": 28000, "장비임대료": 5000, "설치비": 30000 },
                        "500M": { "기본료": 45000, "장비임대료": 5000, "설치비": 30000 },
                        "1G": { "기본료": 65000, "장비임대료": 5000, "설치비": 30000 }
                    },
                    "인터넷_결제안심": {
                        "100M": { "기본료": 25000, "장비임대료": 5000, "설치비": 30000 },
                        "500M": { "기본료": 40000, "장비임대료": 5000, "설치비": 30000 },
                        "1G": { "기본료": 60000, "장비임대료": 5000, "설치비": 30000 }
                    },
                    "무선인터넷": {
                        "베이직": { "기본료": 20000, "장비임대료": 3000, "설치비": 20000 },
                        "프리미엄": { "기본료": 30000, "장비임대료": 3000, "설치비": 20000 }
                    }
                },
                "인터넷전화": {
                    "고급형센트릭스": {
                        "종량제": { "기본료": 7500, "장비임대료": 3500, "설치비": 25000 },
                        "정액제": { "기본료": 12500, "장비임대료": 3500, "설치비": 25000 }
                    },
                    "일반형": { "기본료": 4500, "장비임대료": 2000, "설치비": 15000 }
                },
                "지능형CCTV": {
                    "에스원안심": { "기본료": 12000, "장비임대료": 0, "설치비": 13000 },
                    "출입관리기": { "기본료": 30000, "장비임대료": 0, "설치비": 250000 }
                }
            }
        };
        
        // 자유통화 요금
        specialFeaturePrices = {
            "DCS": {
                "없음": 0,
                "자유통화4": 4000,
                "자유통화6": 6000,
                "자유통화8": 8000,
                "자유통화10": 10000
            },
            "고급형DCS": {
                "없음": 0,
                "자유통화4": 5000,
                "자유통화6": 7000,
                "자유통화8": 9000,
                "자유통화10": 11000
            },
            "고급형센트릭스": {
                "없음": 0,
                "자유통화4": 6000,
                "자유통화6": 8000,
                "자유통화8": 10000,
                "자유통화10": 12000
            },
            "일반형": {
                "없음": 0,
                "자유통화4": 4000,
                "자유통화6": 6000,
                "자유통화8": 8000,
                "자유통화10": 10000
            }
        };
        
        // 단말기 가격
        devicePrices = {
            "IP-450S": 50000,
            "IP-450P": 45000,
            "IP-300S": 40000,
            "IP-520S": 55000,
            "IP-520G": 60000,
            "UHD": 60000,
            "가온": 50000
        };
        
        // 단말기 단독 가격
        deviceStandalonePrices = {...devicePrices};
        
        // 단말기 번들 가격
        deviceBundledPrices = {};
        Object.keys(devicePrices).forEach(device => {
            deviceBundledPrices[device] = Math.floor(devicePrices[device] * 0.9); // 10% 할인
        });
        
        // 단말기 자유통화 할인
        deviceFeatureDiscounts = {
            "IP-450S": {
                "자유통화4": { "type": "percent", "value": 100 },
                "자유통화6": { "type": "percent", "value": 50 }
            },
            "IP-450P": {
                "자유통화4": { "type": "percent", "value": 80 },
                "자유통화6": { "type": "percent", "value": 50 }
            }
        };
        
        // 결합 할인
        bundleDiscounts = [
            {
                "category": "SME",
                "productKeys": ["인터넷", "인터넷전화"],
                "displayName": "인터넷+인터넷전화",
                "type": "percent",
                "value": 10
            },
            {
                "category": "SME",
                "productKeys": ["인터넷", "IPTV"],
                "displayName": "인터넷+IPTV",
                "type": "percent",
                "value": 5
            },
            {
                "category": "SME",
                "productKeys": ["인터넷", "인터넷전화", "IPTV"],
                "displayName": "트리플",
                "type": "fixed",
                "value": 15000
            },
            {
                "category": "소호",
                "productKeys": ["인터넷", "인터넷전화"],
                "displayName": "소호 더블",
                "type": "percent",
                "value": 8
            }
        ];
    }
    
    // 초기화 함수
    function init() {
        console.log('애플리케이션 초기화 중...');
        
        // 카테고리 및 제품 탭 관련 초기화
        initCategoryTabs();
        initSmeProductTabs();
        initSohoProductTabs();
        
        // UI 관련 초기화
        initSohoInternetChange();
        initSohoDxProductChange();
        
        // 인터넷전화 요금제 변경 시 자유통화 표시 여부 설정
        initVoipPlanChange();
        
        // AI전화 요금제 변경 시 단말기 표시 여부 설정
        initAiPhonePlanChange();
        
        // 이벤트 리스너 등록
        initEventListeners();
        
        // 장바구니 표시 초기화
        updateCartDisplay();

        // SME IPTV WIFI 항목 초기 표시 설정
        const smeIptvProduct = document.getElementById('sme-iptv-product');
        const smeIptvWifiGroup = document.getElementById('sme-iptv-wifi-group');
        if (smeIptvProduct.value === '베이직' || smeIptvProduct.value === '프리미엄') {
            smeIptvWifiGroup.style.display = 'block';
        }
    }

    // SME IPTV 상품 선택 변경 이벤트
    document.getElementById('sme-iptv-product').addEventListener('change', function() {
        const wifiGroup = document.getElementById('sme-iptv-wifi-group');
        const selectedProduct = this.value;
        
        if (selectedProduct === '베이직' || selectedProduct === '프리미엄') {
            wifiGroup.style.display = 'block';
        } else {
            wifiGroup.style.display = 'none';
        }
    });
}); 