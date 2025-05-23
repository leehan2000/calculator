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
    }
    
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

    // 초기화 함수
    function init() {
        console.log('애플리케이션 초기화 중...');
        // 여기에 필요한 초기화 코드를 추가합니다.
    }
}); 
