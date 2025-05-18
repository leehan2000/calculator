document.addEventListener('DOMContentLoaded', function() {
    // 요금표 데이터를 외부 JSON 파일에서 가져옵니다
    let priceData = {};
    let specialFeaturePrices = {};
    let devicePrices = {};
    
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
    
    // 엑셀 양식 생성 및 다운로드 함수
    function createAndDownloadExcelTemplate() {
        // 워크북 생성
        const workbook = XLSX.utils.book_new();
        
        // 기본요금 시트 생성
        const basicFeeData = [
            ['카테고리', '상품', '세부상품', '옵션', '기본료', '장비임대료', '설치비'],
            ['SME', '인터넷', '', '100M', 30000, 5000, 30000],
            ['SME', '인터넷', '', '500M', 50000, 5000, 30000],
            ['SME', '인터넷', '', '1G', 70000, 5000, 30000],
            ['SME', '인터넷전화', 'DCS', '종량제', 5000, 3000, 20000],
            ['SME', '인터넷전화', 'DCS', '정액제', 10000, 3000, 20000],
            ['SME', '인터넷전화', '고급형DCS', '종량제', 7000, 3500, 25000],
            ['SME', '인터넷전화', '고급형DCS', '정액제', 12000, 3500, 25000],
            ['SME', 'IPTV', '', '베이직', 10000, 5000, 20000],
            ['SME', 'IPTV', '', '프리미엄', 15000, 5000, 20000],
            ['소호', '인터넷', '유선인터넷', '100M', 28000, 5000, 30000],
            ['소호', '인터넷', '유선인터넷', '500M', 45000, 5000, 30000],
            ['소호', '인터넷', '유선인터넷', '1G', 65000, 5000, 30000],
            ['소호', '인터넷전화', '고급형센트릭스', '종량제', 7500, 3500, 25000],
            ['소호', '인터넷전화', '고급형센트릭스', '정액제', 12500, 3500, 25000]
        ];
        
        const basicFeeWS = XLSX.utils.aoa_to_sheet(basicFeeData);
        XLSX.utils.book_append_sheet(workbook, basicFeeWS, '기본요금');
        
        // 자유통화 시트 생성
        const specialFeatureData = [
            ['자유통화', '가격'],
            ['없음', 0],
            ['자유통화 3', 3000],
            ['자유통화 4', 4000],
            ['자유통화 6', 6000],
            ['자유통화 8', 8000],
            ['자유통화 10', 10000],
            ['자유통화 15', 15000],
            ['자유통화 20', 20000],
            ['자유통화 30', 30000],
            ['자유통화 50', 50000]
        ];
        
        const specialFeatureWS = XLSX.utils.aoa_to_sheet(specialFeatureData);
        XLSX.utils.book_append_sheet(workbook, specialFeatureWS, '자유통화');
        
        // 단말기 시트 생성
        const deviceData = [
            ['단말기', '가격'],
            ['IP-450S', 50000],
            ['IP-450P', 45000],
            ['IP-300S', 40000],
            ['IP-520S', 55000],
            ['IP-520G', 60000],
            ['MWP2500E', 70000],
            ['GAPM-7500E', 80000],
            ['IP-700S(본체) + EK-700S(확장)', 100000],
            ['CPG 1Port', 30000],
            ['UHD', 60000],
            ['가온', 50000]
        ];
        
        const deviceWS = XLSX.utils.aoa_to_sheet(deviceData);
        XLSX.utils.book_append_sheet(workbook, deviceWS, '단말기');
        
        // 결합할인 시트 생성
        const bundleDiscountData = [
            ['결합유형', '결합상품', '할인율', '할인금액'],
            ['인터넷_인터넷전화', '인터넷+인터넷전화', 5, 0],
            ['인터넷_IPTV', '인터넷+IPTV', 0, 5000],
            ['트리플', '인터넷+인터넷전화+IPTV', 10, 0],
            ['소호_더블', '인터넷+인터넷전화', 7, 0],
            ['소호_트리플', '인터넷+인터넷전화+IPTV', 12, 0]
        ];
        
        const bundleDiscountWS = XLSX.utils.aoa_to_sheet(bundleDiscountData);
        XLSX.utils.book_append_sheet(workbook, bundleDiscountWS, '결합할인');
        
        // 설명 시트 생성
        const instructionData = [
            ['브이원 기업인터넷요금계산기 - 엑셀 양식 작성 안내'],
            [''],
            ['1. 기본요금 시트'],
            ['   - 카테고리: SME 또는 소호 중 하나를 입력합니다.'],
            ['   - 상품: 인터넷, 인터넷전화, IPTV 등의 상품명을 입력합니다.'],
            ['   - 세부상품: 세부 상품이 있는 경우 입력합니다(예: DCS, 고급형DCS 등). 없으면 비워둡니다.'],
            ['   - 옵션: 선택 가능한 옵션을 입력합니다(예: 100M, 500M, 종량제, 정액제 등).'],
            ['   - 기본료, 장비임대료, 설치비: 숫자만 입력합니다(단위: 원).'],
            [''],
            ['2. 자유통화 시트'],
            ['   - 자유통화: 자유통화 옵션 이름을 입력합니다.'],
            ['   - 가격: 숫자만 입력합니다(단위: 원).'],
            [''],
            ['3. 단말기 시트'],
            ['   - 단말기: 단말기 이름을 입력합니다.'],
            ['   - 가격: 숫자만 입력합니다(단위: 원).'],
            [''],
            ['4. 결합할인 시트'],
            ['   - 결합유형: 결합 유형의 고유 식별자를 입력합니다(예: 인터넷_인터넷전화, 트리플 등).'],
            ['   - 결합상품: 결합되는 상품들을 설명하는 텍스트를 입력합니다.'],
            ['   - 할인율: 백분율로 할인율을 입력합니다(예: 5는 5% 할인을 의미). 정액 할인인 경우 0을 입력합니다.'],
            ['   - 할인금액: 정액 할인 금액을 입력합니다(단위: 원). 할인율을 사용하는 경우 0을 입력합니다.'],
            [''],
            ['* 작성 완료 후 "엑셀 파일 업로드" 버튼을 클릭하여 업로드하세요.']
        ];
        
        const instructionWS = XLSX.utils.aoa_to_sheet(instructionData);
        XLSX.utils.book_append_sheet(workbook, instructionWS, '작성안내');
        
        // 엑셀 파일 다운로드
        XLSX.writeFile(workbook, '브이원_요금계산기_양식.xlsx');
    });
    
    // 엑셀 파일 선택 시 처리
    excelFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        statusSpan.textContent = '엑셀 파일 로딩 중...';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // 데이터 변환 결과
                const convertedData = {
                    priceData: { SME: {}, 소호: {} },
                    specialFeaturePrices: {},
                    devicePrices: {}
                };
                
                // 각 시트 처리
                processWorkbook(workbook, convertedData);
                
                // 데이터 업데이트
                priceData = convertedData.priceData;
                specialFeaturePrices = convertedData.specialFeaturePrices;
                devicePrices = convertedData.devicePrices;
                
                // 결합 할인 정보가 있으면 전역 변수에 저장
                if (convertedData.bundleDiscounts) {
                    window.bundleDiscounts = convertedData.bundleDiscounts;
                }
                
                statusSpan.textContent = '엑셀 데이터 변환 완료!';
                setTimeout(() => {
                    statusSpan.textContent = '';
                }, 3000);
                
                console.log('엑셀 데이터 로드 완료');
                
                // 변환된 데이터 자동 다운로드 (선택적)
                if (confirm('변환된 JSON 데이터를 다운로드하시겠습니까?')) {
                    downloadJsonData();
                }
            } catch (error) {
                console.error('엑셀 파일 처리 오류:', error);
                statusSpan.textContent = '오류: 엑셀 파일을 처리할 수 없습니다.';
            }
        };
        
        reader.onerror = function() {
            statusSpan.textContent = '파일 읽기 오류 발생';
        };
        
        reader.readAsArrayBuffer(file);
    });
    
    // 엑셀 워크북 처리 함수
    function processWorkbook(workbook, convertedData) {
        // 기본 요금 시트 처리
        if (workbook.SheetNames.includes('기본요금')) {
            const sheet = workbook.Sheets['기본요금'];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            
            jsonData.forEach(row => {
                // 카테고리, 상품, 옵션 등의 필드가 있다고 가정
                const category = row['카테고리'] || '';
                const product = row['상품'] || '';
                const subProduct = row['세부상품'] || '';
                const option = row['옵션'] || '';
                const basicFee = parseInt(row['기본료'] || 0);
                const deviceFee = parseInt(row['장비임대료'] || 0);
                const installFee = parseInt(row['설치비'] || 0);
                
                // 데이터 구조에 맞게 저장
                if (category === 'SME' || category === '소호') {
                    if (!convertedData.priceData[category][product]) {
                        convertedData.priceData[category][product] = {};
                    }
                    
                    if (subProduct) {
                        if (!convertedData.priceData[category][product][subProduct]) {
                            convertedData.priceData[category][product][subProduct] = {};
                        }
                        
                        if (option) {
                            convertedData.priceData[category][product][subProduct][option] = {
                                기본료: basicFee,
                                장비임대료: deviceFee,
                                설치비: installFee
                            };
                        } else {
                            convertedData.priceData[category][product][subProduct] = {
                                기본료: basicFee,
                                장비임대료: deviceFee,
                                설치비: installFee
                            };
                        }
                    } else if (option) {
                        convertedData.priceData[category][product][option] = {
                            기본료: basicFee,
                            장비임대료: deviceFee,
                            설치비: installFee
                        };
                    } else {
                        convertedData.priceData[category][product] = {
                            기본료: basicFee,
                            장비임대료: deviceFee,
                            설치비: installFee
                        };
                    }
                }
            });
        }
        
        // 자유통화 시트 처리
        if (workbook.SheetNames.includes('자유통화')) {
            const sheet = workbook.Sheets['자유통화'];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            
            jsonData.forEach(row => {
                const feature = row['자유통화'] || '';
                const price = parseInt(row['가격'] || 0);
                
                if (feature) {
                    convertedData.specialFeaturePrices[feature] = price;
                }
            });
        }
        
        // 단말기 시트 처리
        if (workbook.SheetNames.includes('단말기')) {
            const sheet = workbook.Sheets['단말기'];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            
            jsonData.forEach(row => {
                const device = row['단말기'] || '';
                const price = parseInt(row['가격'] || 0);
                
                if (device) {
                    convertedData.devicePrices[device] = price;
                }
            });
        }
        
        // 결합할인 시트 처리
        if (workbook.SheetNames.includes('결합할인')) {
            const sheet = workbook.Sheets['결합할인'];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            
            // 결합할인 정보 저장을 위한 구조 추가
            convertedData.bundleDiscounts = {};
            
            jsonData.forEach(row => {
                const bundleType = row['결합유형'] || '';
                const products = row['결합상품'] || '';
                const discountRate = parseFloat(row['할인율'] || 0);
                const discountAmount = parseInt(row['할인금액'] || 0);
                
                if (bundleType) {
                    convertedData.bundleDiscounts[bundleType] = {
                        결합상품: products,
                        할인율: discountRate,
                        할인금액: discountAmount
                    };
                }
            });
        }
    }
    
    // JSON 데이터 다운로드 함수
    function downloadJsonData() {
        const dataToSave = {
            priceData: priceData,
            specialFeaturePrices: specialFeaturePrices,
            devicePrices: devicePrices,
            bundleDiscounts: window.bundleDiscounts || {}
        };
        
        const jsonString = JSON.stringify(dataToSave, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'priceData_' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }
    
    // 다운로드 버튼 클릭 시 현재 데이터 저장
    downloadButton.addEventListener('click', function() {
        downloadJsonData();
        
        statusSpan.textContent = '데이터 다운로드 완료!';
        setTimeout(() => {
            statusSpan.textContent = '';
        }, 3000);
    });
    
    // 파일 선택 시 처리
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        statusSpan.textContent = '파일 로딩 중...';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                // 데이터 형식 검증
                if (!data.priceData || !data.specialFeaturePrices || !data.devicePrices) {
                    throw new Error('올바른 데이터 형식이 아닙니다.');
                }
                
                // 데이터 업데이트
                priceData = data.priceData;
                specialFeaturePrices = data.specialFeaturePrices;
                devicePrices = data.devicePrices;
                
                statusSpan.textContent = '데이터 업로드 완료!';
                setTimeout(() => {
                    statusSpan.textContent = '';
                }, 3000);
                
                console.log('사용자 요금 데이터 로드 완료');
            } catch (error) {
                console.error('데이터 파싱 오류:', error);
                statusSpan.textContent = '오류: 올바른 JSON 형식이 아닙니다.';
            }
        };
        
        reader.onerror = function() {
            statusSpan.textContent = '파일 읽기 오류 발생';
        };
        
        reader.readAsText(file);
    });

    // JSON 파일에서 요금 데이터 로드
    fetch('priceData.json')
        .then(response => response.json())
        .then(data => {
            priceData = data.priceData;
            specialFeaturePrices = data.specialFeaturePrices;
            devicePrices = data.devicePrices;
            console.log('요금 데이터 로드 완료');
            
            // 데이터 로드 후 초기화 실행
            init();
        })
        .catch(error => {
            console.error('요금 데이터 로드 중 오류 발생:', error);
            // 오류 발생 시 기본 데이터 사용
            alert('요금 데이터를 불러오는데 실패했습니다. 기본 데이터를 사용합니다.');
            
            // 오류가 발생해도 초기화 실행
            init();
        });

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
    function initSohoInternetProductChange() {
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

    // 상품 관리
    const cartItems = [];

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
            
            let itemDescription = `<strong>${item.category} ${item.product}</strong>`;
            if (item.subProduct) {
                itemDescription += ` - ${item.subProduct}`;
            }
            if (item.option) {
                itemDescription += ` (${item.option})`;
            }
            if (item.lines) {
                itemDescription += ` x ${item.lines}회선`;
            }
            if (item.quantity) {
                itemDescription += ` x ${item.quantity}개`;
            }
            if (item.device) {
                itemDescription += `<br><i class="fas fa-mobile-alt"></i> 단말기: ${item.device}`;
            }
            if (item.feature && item.feature !== '없음') {
                itemDescription += `<br><i class="fas fa-comments"></i> 자유통화: ${item.feature}`;
            }
            
            const removeButton = document.createElement('span');
            removeButton.className = 'remove-item';
            removeButton.innerHTML = '<i class="fas fa-times"></i>';
            removeButton.addEventListener('click', () => removeFromCart(index));
            
            cartItem.innerHTML = itemDescription;
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
        const cartItems = document.querySelectorAll('.cart-item');
        const itemToRemove = cartItems[index];
        
        itemToRemove.style.transition = 'all 0.3s ease';
        itemToRemove.style.opacity = '0';
        itemToRemove.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            cartItems.splice(index, 1);
            updateCartDisplay();
        }, 300);
    }

    // 요금 계산 함수
    function calculateTotalPrice() {
        if (cartItems.length === 0) {
            alert('상품을 추가해주세요.');
            return;
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
            // 상품 수 계산
            if (productCounts[item.category] && productCounts[item.category][item.product] !== undefined) {
                productCounts[item.category][item.product]++;
            }
            
            // 요금 데이터 찾기
            let priceInfo;
            
            if (item.subProduct) {
                if (item.option && priceData[item.category][item.product][item.subProduct][item.option]) {
                    priceInfo = priceData[item.category][item.product][item.subProduct][item.option];
                } else if (priceData[item.category][item.product][item.subProduct]) {
                    priceInfo = priceData[item.category][item.product][item.subProduct];
                }
            } else if (item.option && priceData[item.category][item.product][item.option]) {
                priceInfo = priceData[item.category][item.product][item.option];
            } else if (priceData[item.category][item.product]) {
                priceInfo = priceData[item.category][item.product];
            }
            
            if (priceInfo) {
                const quantity = item.lines || item.quantity || 1;
                
                // 기본 요금 계산
                totalBasicFee += priceInfo.기본료 * quantity;
                
                // 장비 임대료 계산
                totalDeviceFee += priceInfo.장비임대료 * quantity;
                
                // 설치비 계산
                totalInstallationFee += priceInfo.설치비;
                
                // 단말기 추가 요금
                if (item.device && devicePrices[item.device]) {
                    totalDeviceFee += devicePrices[item.device] * quantity;
                }
                
                // 자유통화 추가 요금
                if (item.feature && specialFeaturePrices[item.feature]) {
                    totalSpecialFeatureFee += specialFeaturePrices[item.feature] * quantity;
                }
            }
        });
        
        // 결합 할인 계산
        if (window.bundleDiscounts) {
            // 결합 할인 규칙 적용
            const bundleDiscounts = window.bundleDiscounts;
            
            // 인터넷 + 인터넷전화 결합 할인
            if (productCounts['SME']['인터넷'] > 0 && productCounts['SME']['인터넷전화'] > 0 && bundleDiscounts['인터넷_인터넷전화']) {
                const discount = bundleDiscounts['인터넷_인터넷전화'];
                if (discount.할인금액 > 0) {
                    totalBundleDiscount += discount.할인금액;
                } else if (discount.할인율 > 0) {
                    totalBundleDiscount += totalBasicFee * discount.할인율 / 100;
                }
            }
            
            // 인터넷 + IPTV 결합 할인
            if (productCounts['SME']['인터넷'] > 0 && productCounts['SME']['IPTV'] > 0 && bundleDiscounts['인터넷_IPTV']) {
                const discount = bundleDiscounts['인터넷_IPTV'];
                if (discount.할인금액 > 0) {
                    totalBundleDiscount += discount.할인금액;
                } else if (discount.할인율 > 0) {
                    totalBundleDiscount += totalBasicFee * discount.할인율 / 100;
                }
            }
            
            // 인터넷 + 인터넷전화 + IPTV 결합 할인 (트리플)
            if (productCounts['SME']['인터넷'] > 0 && productCounts['SME']['인터넷전화'] > 0 && productCounts['SME']['IPTV'] > 0 && bundleDiscounts['트리플']) {
                const discount = bundleDiscounts['트리플'];
                if (discount.할인금액 > 0) {
                    totalBundleDiscount += discount.할인금액;
                } else if (discount.할인율 > 0) {
                    totalBundleDiscount += totalBasicFee * discount.할인율 / 100;
                }
            }
            
            // 소호 결합 할인도 유사하게 적용
            // ...
        }
        
        // 최종 합계 계산 (할인 적용)
        const finalTotal = totalBasicFee + totalDeviceFee + totalSpecialFeatureFee + totalInstallationFee - totalBundleDiscount;
        
        // 결과 표시
        const resultContainer = document.getElementById('result-container');
        resultContainer.style.display = 'block';
        resultContainer.innerHTML = `
            <h3><i class="fas fa-chart-line"></i> 요금 계산 결과</h3>
            <p><i class="fas fa-won-sign"></i> 기본료 합계: ${totalBasicFee.toLocaleString()}원</p>
            <p><i class="fas fa-hdd"></i> 장비임대료 합계: ${totalDeviceFee.toLocaleString()}원</p>
            <p><i class="fas fa-comments"></i> 자유통화 추가 요금: ${totalSpecialFeatureFee.toLocaleString()}원</p>
            <p><i class="fas fa-tools"></i> 설치비 합계: ${totalInstallationFee.toLocaleString()}원</p>
            ${totalBundleDiscount > 0 ? `<p><i class="fas fa-percentage"></i> 결합 할인: -${totalBundleDiscount.toLocaleString()}원</p>` : ''}
            <p class="total-price"><i class="fas fa-check-circle"></i> <strong>최종 합계: ${finalTotal.toLocaleString()}원</strong></p>
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
    }

    // 이벤트 리스너 등록
    function initEventListeners() {
        document.getElementById('add-to-cart').addEventListener('click', addToCart);
        document.getElementById('calculate-button').addEventListener('click', calculateTotalPrice);
        document.getElementById('reset-button').addEventListener('click', resetCalculation);
    }

    // 초기화 함수
    function init() {
        initCategoryTabs();
        initSmeProductTabs();
        initSohoProductTabs();
        initSohoInternetProductChange();
        initSohoDxProductChange();
        initVoipPlanChange();
        initEventListeners();
        updateCartDisplay();
    }

    // 다시 계산하기 함수
    function resetCalculation() {
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
        
        // 첫 번째 카테고리 탭 활성화
        document.querySelectorAll('.tab-button').forEach((tab, index) => {
            if (index === 0) {
                tab.click();
            }
        });
        
        // 첫 번째 제품 탭 활성화
        document.querySelectorAll('#sme-components .product-tab').forEach((tab, index) => {
            if (index === 0) {
                tab.click();
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

    // SME와 소호 인터넷전화 요금제 선택 시 UI 업데이트
    function initVoipPlanChange() {
        // SME 인터넷전화 요금제 변경 이벤트
        const smePlanSelect = document.getElementById('sme-voip-plan');
        const smeFeatureGroup = document.getElementById('sme-voip-feature-group');
        const smeProductSelect = document.getElementById('sme-voip-product');
        const smePlanGroup = document.getElementById('sme-voip-plan-group');
        
        // 상품 선택 변경 이벤트
        smeProductSelect.addEventListener('change', function() {
            updateSmeVoipFeatureVisibility();
            updateSmeVoipPlanOptions();
        });
        
        // 요금제 변경 이벤트
        smePlanSelect.addEventListener('change', function() {
            updateSmeVoipFeatureVisibility();
        });
        
        // SME 자유통화 표시 여부 업데이트 함수
        function updateSmeVoipFeatureVisibility() {
            if (smeProductSelect.value === '일반형' || smePlanSelect.value === '종량제') {
                smeFeatureGroup.style.display = 'none';
            } else {
                smeFeatureGroup.style.display = 'block';
            }
        }
        
        // SME 요금제 옵션 업데이트 함수
        function updateSmeVoipPlanOptions() {
            // 기존 옵션 제거
            while (smePlanSelect.options.length > 0) {
                smePlanSelect.remove(0);
            }
            
            // 일반형인 경우 종량제만 추가
            if (smeProductSelect.value === '일반형') {
                const option = document.createElement('option');
                option.value = '종량제';
                option.text = '종량제';
                smePlanSelect.add(option);
                smePlanGroup.style.display = 'none'; // 선택지가 하나뿐이므로 요금제 선택란 숨김
            } else {
                // 일반형이 아닌 경우 종량제와 정액제 모두 추가
                const option1 = document.createElement('option');
                option1.value = '종량제';
                option1.text = '종량제';
                smePlanSelect.add(option1);
                
                const option2 = document.createElement('option');
                option2.value = '정액제';
                option2.text = '정액제';
                smePlanSelect.add(option2);
                
                smePlanGroup.style.display = 'block'; // 요금제 선택란 표시
            }
            
            // 자유통화 표시 여부 업데이트
            updateSmeVoipFeatureVisibility();
        }
        
        // 소호 인터넷전화 요금제 변경 이벤트
        const sohoPlanSelect = document.getElementById('soho-voip-plan');
        const sohoFeatureGroup = document.getElementById('soho-voip-feature-group');
        const sohoProductSelect = document.getElementById('soho-voip-product');
        const sohoPlanGroup = document.getElementById('soho-voip-plan-group');
        
        // 상품 선택 변경 이벤트
        sohoProductSelect.addEventListener('change', function() {
            updateSohoVoipFeatureVisibility();
            updateSohoVoipPlanOptions();
        });
        
        // 요금제 변경 이벤트
        sohoPlanSelect.addEventListener('change', function() {
            updateSohoVoipFeatureVisibility();
        });
        
        // 소호 자유통화 표시 여부 업데이트 함수
        function updateSohoVoipFeatureVisibility() {
            if (sohoProductSelect.value === '일반형' || sohoPlanSelect.value === '종량제') {
                sohoFeatureGroup.style.display = 'none';
            } else {
                sohoFeatureGroup.style.display = 'block';
            }
        }
        
        // 소호 요금제 옵션 업데이트 함수
        function updateSohoVoipPlanOptions() {
            // 기존 옵션 제거
            while (sohoPlanSelect.options.length > 0) {
                sohoPlanSelect.remove(0);
            }
            
            // 일반형인 경우 종량제만 추가
            if (sohoProductSelect.value === '일반형') {
                const option = document.createElement('option');
                option.value = '종량제';
                option.text = '종량제';
                sohoPlanSelect.add(option);
                sohoPlanGroup.style.display = 'none'; // 선택지가 하나뿐이므로 요금제 선택란 숨김
            } else {
                // 일반형이 아닌 경우 종량제와 정액제 모두 추가
                const option1 = document.createElement('option');
                option1.value = '종량제';
                option1.text = '종량제';
                sohoPlanSelect.add(option1);
                
                const option2 = document.createElement('option');
                option2.value = '정액제';
                option2.text = '정액제';
                sohoPlanSelect.add(option2);
                
                sohoPlanGroup.style.display = 'block'; // 요금제 선택란 표시
            }
            
            // 자유통화 표시 여부 업데이트
            updateSohoVoipFeatureVisibility();
        }
        
        // 초기 상태 설정
        updateSmeVoipPlanOptions();
        updateSohoVoipPlanOptions();
    }
}); 