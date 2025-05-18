document.addEventListener('DOMContentLoaded', function() {
    // ?붽툑???곗씠?곕? ?몃? JSON ?뚯씪?먯꽌 媛?몄샃?덈떎
    let priceData = {};
    let specialFeaturePrices = {};
    let devicePrices = {};
    
    // ?곗씠???낅줈??愿???붿냼
    const uploadButton = document.getElementById('upload-dataset');
    const downloadButton = document.getElementById('download-dataset');
    const uploadExcelButton = document.getElementById('upload-excel');
    const downloadExcelTemplateButton = document.getElementById('download-excel-template');
    const fileInput = document.getElementById('dataset-file');
    const excelFileInput = document.getElementById('excel-file');
    const statusSpan = document.getElementById('dataset-status');
    
    // ?낅줈??踰꾪듉 ?대┃ ???뚯씪 ?좏깮 李??닿린
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    // ?묒? ?낅줈??踰꾪듉 ?대┃ ???뚯씪 ?좏깮 李??닿린
    uploadExcelButton.addEventListener('click', function() {
        excelFileInput.click();
    });
    
    // ?묒? ?묒떇 ?ㅼ슫濡쒕뱶 踰꾪듉 ?대┃ ??
    downloadExcelTemplateButton.addEventListener('click', function() {
        createAndDownloadExcelTemplate();
        
        statusSpan.textContent = '?묒? ?묒떇 ?ㅼ슫濡쒕뱶 ?꾨즺!';
        setTimeout(() => {
            statusSpan.textContent = '';
        }, 3000);
    });
    
    // ?묒? ?묒떇 ?앹꽦 諛??ㅼ슫濡쒕뱶 ?⑥닔
    function createAndDownloadExcelTemplate() {
        // ?뚰겕遺??앹꽦
        const workbook = XLSX.utils.book_new();
        
        // 湲곕낯?붽툑 ?쒗듃 ?앹꽦
        const basicFeeData = [
            ['移댄뀒怨좊━', '?곹뭹', '?몃??곹뭹', '?듭뀡', '湲곕낯猷?, '?λ퉬?꾨?猷?, '?ㅼ튂鍮?],
            ['SME', '?명꽣??, '', '100M', 30000, 5000, 30000],
            ['SME', '?명꽣??, '', '500M', 50000, 5000, 30000],
            ['SME', '?명꽣??, '', '1G', 70000, 5000, 30000],
            ['SME', '?명꽣?룹쟾??, 'DCS', '醫낅웾??, 5000, 3000, 20000],
            ['SME', '?명꽣?룹쟾??, 'DCS', '?뺤븸??, 10000, 3000, 20000],
            ['SME', '?명꽣?룹쟾??, '怨좉툒?뷗CS', '醫낅웾??, 7000, 3500, 25000],
            ['SME', '?명꽣?룹쟾??, '怨좉툒?뷗CS', '?뺤븸??, 12000, 3500, 25000],
            ['SME', 'IPTV', '', '踰좎씠吏?, 10000, 5000, 20000],
            ['SME', 'IPTV', '', '?꾨━誘몄뾼', 15000, 5000, 20000],
            ['?뚰샇', '?명꽣??, '?좎꽑?명꽣??, '100M', 28000, 5000, 30000],
            ['?뚰샇', '?명꽣??, '?좎꽑?명꽣??, '500M', 45000, 5000, 30000],
            ['?뚰샇', '?명꽣??, '?좎꽑?명꽣??, '1G', 65000, 5000, 30000],
            ['?뚰샇', '?명꽣?룹쟾??, '怨좉툒?뺤꽱?몃┃??, '醫낅웾??, 7500, 3500, 25000],
            ['?뚰샇', '?명꽣?룹쟾??, '怨좉툒?뺤꽱?몃┃??, '?뺤븸??, 12500, 3500, 25000]
        ];
        
        const basicFeeWS = XLSX.utils.aoa_to_sheet(basicFeeData);
        XLSX.utils.book_append_sheet(workbook, basicFeeWS, '湲곕낯?붽툑');
        
        // ?먯쑀?듯솕 ?쒗듃 ?앹꽦
        const specialFeatureData = [
            ['?먯쑀?듯솕', '媛寃?],
            ['?놁쓬', 0],
            ['?먯쑀?듯솕 3', 3000],
            ['?먯쑀?듯솕 4', 4000],
            ['?먯쑀?듯솕 6', 6000],
            ['?먯쑀?듯솕 8', 8000],
            ['?먯쑀?듯솕 10', 10000],
            ['?먯쑀?듯솕 15', 15000],
            ['?먯쑀?듯솕 20', 20000],
            ['?먯쑀?듯솕 30', 30000],
            ['?먯쑀?듯솕 50', 50000]
        ];
        
        const specialFeatureWS = XLSX.utils.aoa_to_sheet(specialFeatureData);
        XLSX.utils.book_append_sheet(workbook, specialFeatureWS, '?먯쑀?듯솕');
        
        // ?⑤쭚湲??쒗듃 ?앹꽦
        const deviceData = [
            ['?⑤쭚湲?, '媛寃?],
            ['IP-450S', 50000],
            ['IP-450P', 45000],
            ['IP-300S', 40000],
            ['IP-520S', 55000],
            ['IP-520G', 60000],
            ['MWP2500E', 70000],
            ['GAPM-7500E', 80000],
            ['IP-700S(蹂몄껜) + EK-700S(?뺤옣)', 100000],
            ['CPG 1Port', 30000],
            ['UHD', 60000],
            ['媛??, 50000]
        ];
        
        const deviceWS = XLSX.utils.aoa_to_sheet(deviceData);
        XLSX.utils.book_append_sheet(workbook, deviceWS, '?⑤쭚湲?);
        
        // 寃고빀?좎씤 ?쒗듃 ?앹꽦
        const bundleDiscountData = [
            ['寃고빀?좏삎', '寃고빀?곹뭹', '?좎씤??, '?좎씤湲덉븸'],
            ['?명꽣???명꽣?룹쟾??, '?명꽣???명꽣?룹쟾??, 5, 0],
            ['?명꽣??IPTV', '?명꽣??IPTV', 0, 5000],
            ['?몃━??, '?명꽣???명꽣?룹쟾??IPTV', 10, 0],
            ['?뚰샇_?붾툝', '?명꽣???명꽣?룹쟾??, 7, 0],
            ['?뚰샇_?몃━??, '?명꽣???명꽣?룹쟾??IPTV', 12, 0]
        ];
        
        const bundleDiscountWS = XLSX.utils.aoa_to_sheet(bundleDiscountData);
        XLSX.utils.book_append_sheet(workbook, bundleDiscountWS, '寃고빀?좎씤');
        
        // ?ㅻ챸 ?쒗듃 ?앹꽦
        const instructionData = [
            ['釉뚯씠??湲곗뾽?명꽣?룹슂湲덇퀎?곌린 - ?묒? ?묒떇 ?묒꽦 ?덈궡'],
            [''],
            ['1. 湲곕낯?붽툑 ?쒗듃'],
            ['   - 移댄뀒怨좊━: SME ?먮뒗 ?뚰샇 以??섎굹瑜??낅젰?⑸땲??'],
            ['   - ?곹뭹: ?명꽣?? ?명꽣?룹쟾?? IPTV ?깆쓽 ?곹뭹紐낆쓣 ?낅젰?⑸땲??'],
            ['   - ?몃??곹뭹: ?몃? ?곹뭹???덈뒗 寃쎌슦 ?낅젰?⑸땲???? DCS, 怨좉툒?뷗CS ??. ?놁쑝硫?鍮꾩썙?〓땲??'],
            ['   - ?듭뀡: ?좏깮 媛?ν븳 ?듭뀡???낅젰?⑸땲???? 100M, 500M, 醫낅웾?? ?뺤븸????.'],
            ['   - 湲곕낯猷? ?λ퉬?꾨?猷? ?ㅼ튂鍮? ?レ옄留??낅젰?⑸땲???⑥쐞: ??.'],
            [''],
            ['2. ?먯쑀?듯솕 ?쒗듃'],
            ['   - ?먯쑀?듯솕: ?먯쑀?듯솕 ?듭뀡 ?대쫫???낅젰?⑸땲??'],
            ['   - 媛寃? ?レ옄留??낅젰?⑸땲???⑥쐞: ??.'],
            [''],
            ['3. ?⑤쭚湲??쒗듃'],
            ['   - ?⑤쭚湲? ?⑤쭚湲??대쫫???낅젰?⑸땲??'],
            ['   - 媛寃? ?レ옄留??낅젰?⑸땲???⑥쐞: ??.'],
            [''],
            ['4. 寃고빀?좎씤 ?쒗듃'],
            ['   - 寃고빀?좏삎: 寃고빀 ?좏삎??怨좎쑀 ?앸퀎?먮? ?낅젰?⑸땲???? ?명꽣???명꽣?룹쟾?? ?몃━????.'],
            ['   - 寃고빀?곹뭹: 寃고빀?섎뒗 ?곹뭹?ㅼ쓣 ?ㅻ챸?섎뒗 ?띿뒪?몃? ?낅젰?⑸땲??'],
            ['   - ?좎씤?? 諛깅텇?⑤줈 ?좎씤?⑥쓣 ?낅젰?⑸땲???? 5??5% ?좎씤???섎?). ?뺤븸 ?좎씤??寃쎌슦 0???낅젰?⑸땲??'],
            ['   - ?좎씤湲덉븸: ?뺤븸 ?좎씤 湲덉븸???낅젰?⑸땲???⑥쐞: ??. ?좎씤?⑥쓣 ?ъ슜?섎뒗 寃쎌슦 0???낅젰?⑸땲??'],
            [''],
            ['* ?묒꽦 ?꾨즺 ??"?묒? ?뚯씪 ?낅줈?? 踰꾪듉???대┃?섏뿬 ?낅줈?쒗븯?몄슂.']
        ];
        
        const instructionWS = XLSX.utils.aoa_to_sheet(instructionData);
        XLSX.utils.book_append_sheet(workbook, instructionWS, '?묒꽦?덈궡');
        
        // ?묒? ?뚯씪 ?ㅼ슫濡쒕뱶
        XLSX.writeFile(workbook, '釉뚯씠???붽툑怨꾩궛湲??묒떇.xlsx');
    });
    
    // ?묒? ?뚯씪 ?좏깮 ??泥섎━
    excelFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        statusSpan.textContent = '?묒? ?뚯씪 濡쒕뵫 以?..';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // ?곗씠??蹂??寃곌낵
                const convertedData = {
                    priceData: { SME: {}, ?뚰샇: {} },
                    specialFeaturePrices: {},
                    devicePrices: {}
                };
                
                // 媛??쒗듃 泥섎━
                processWorkbook(workbook, convertedData);
                
                // ?곗씠???낅뜲?댄듃
                priceData = convertedData.priceData;
                specialFeaturePrices = convertedData.specialFeaturePrices;
                devicePrices = convertedData.devicePrices;
                
                // 寃고빀 ?좎씤 ?뺣낫媛 ?덉쑝硫??꾩뿭 蹂?섏뿉 ???
                if (convertedData.bundleDiscounts) {
                    window.bundleDiscounts = convertedData.bundleDiscounts;
                }
                
                statusSpan.textContent = '?묒? ?곗씠??蹂???꾨즺!';
                setTimeout(() => {
                    statusSpan.textContent = '';
                }, 3000);
                
                console.log('?묒? ?곗씠??濡쒕뱶 ?꾨즺');
                
                // 蹂?섎맂 ?곗씠???먮룞 ?ㅼ슫濡쒕뱶 (?좏깮??
                if (confirm('蹂?섎맂 JSON ?곗씠?곕? ?ㅼ슫濡쒕뱶?섏떆寃좎뒿?덇퉴?')) {
                    downloadJsonData();
                }
            } catch (error) {
                console.error('?묒? ?뚯씪 泥섎━ ?ㅻ쪟:', error);
                statusSpan.textContent = '?ㅻ쪟: ?묒? ?뚯씪??泥섎━?????놁뒿?덈떎.';
            }
        };
        
        reader.onerror = function() {
            statusSpan.textContent = '?뚯씪 ?쎄린 ?ㅻ쪟 諛쒖깮';
        };
        
        reader.readAsArrayBuffer(file);
    });
    
    // ?묒? ?뚰겕遺?泥섎━ ?⑥닔
    function processWorkbook(workbook, convertedData) {
        // 湲곕낯 ?붽툑 ?쒗듃 泥섎━
        if (workbook.SheetNames.includes('湲곕낯?붽툑')) {
            const sheet = workbook.Sheets['湲곕낯?붽툑'];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            
            jsonData.forEach(row => {
                // 移댄뀒怨좊━, ?곹뭹, ?듭뀡 ?깆쓽 ?꾨뱶媛 ?덈떎怨?媛??
                const category = row['移댄뀒怨좊━'] || '';
                const product = row['?곹뭹'] || '';
                const subProduct = row['?몃??곹뭹'] || '';
                const option = row['?듭뀡'] || '';
                const basicFee = parseInt(row['湲곕낯猷?] || 0);
                const deviceFee = parseInt(row['?λ퉬?꾨?猷?] || 0);
                const installFee = parseInt(row['?ㅼ튂鍮?] || 0);
                
                // ?곗씠??援ъ“??留욊쾶 ???
                if (category === 'SME' || category === '?뚰샇') {
                    if (!convertedData.priceData[category][product]) {
                        convertedData.priceData[category][product] = {};
                    }
                    
                    if (subProduct) {
                        if (!convertedData.priceData[category][product][subProduct]) {
                            convertedData.priceData[category][product][subProduct] = {};
                        }
                        
                        if (option) {
                            convertedData.priceData[category][product][subProduct][option] = {
                                湲곕낯猷? basicFee,
                                ?λ퉬?꾨?猷? deviceFee,
                                ?ㅼ튂鍮? installFee
                            };
                        } else {
                            convertedData.priceData[category][product][subProduct] = {
                                湲곕낯猷? basicFee,
                                ?λ퉬?꾨?猷? deviceFee,
                                ?ㅼ튂鍮? installFee
                            };
                        }
                    } else if (option) {
                        convertedData.priceData[category][product][option] = {
                            湲곕낯猷? basicFee,
                            ?λ퉬?꾨?猷? deviceFee,
                            ?ㅼ튂鍮? installFee
                        };
                    } else {
                        convertedData.priceData[category][product] = {
                            湲곕낯猷? basicFee,
                            ?λ퉬?꾨?猷? deviceFee,
                            ?ㅼ튂鍮? installFee
                        };
                    }
                }
            });
        }
        
        // ?먯쑀?듯솕 ?쒗듃 泥섎━
        if (workbook.SheetNames.includes('?먯쑀?듯솕')) {
            const sheet = workbook.Sheets['?먯쑀?듯솕'];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            
            jsonData.forEach(row => {
                const feature = row['?먯쑀?듯솕'] || '';
                const price = parseInt(row['媛寃?] || 0);
                
                if (feature) {
                    convertedData.specialFeaturePrices[feature] = price;
                }
            });
        }
        
        // ?⑤쭚湲??쒗듃 泥섎━
        if (workbook.SheetNames.includes('?⑤쭚湲?)) {
            const sheet = workbook.Sheets['?⑤쭚湲?];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            
            jsonData.forEach(row => {
                const device = row['?⑤쭚湲?] || '';
                const price = parseInt(row['媛寃?] || 0);
                
                if (device) {
                    convertedData.devicePrices[device] = price;
                }
            });
        }
        
        // 寃고빀?좎씤 ?쒗듃 泥섎━
        if (workbook.SheetNames.includes('寃고빀?좎씤')) {
            const sheet = workbook.Sheets['寃고빀?좎씤'];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            
            // 寃고빀?좎씤 ?뺣낫 ??μ쓣 ?꾪븳 援ъ“ 異붽?
            convertedData.bundleDiscounts = {};
            
            jsonData.forEach(row => {
                const bundleType = row['寃고빀?좏삎'] || '';
                const products = row['寃고빀?곹뭹'] || '';
                const discountRate = parseFloat(row['?좎씤??] || 0);
                const discountAmount = parseInt(row['?좎씤湲덉븸'] || 0);
                
                if (bundleType) {
                    convertedData.bundleDiscounts[bundleType] = {
                        寃고빀?곹뭹: products,
                        ?좎씤?? discountRate,
                        ?좎씤湲덉븸: discountAmount
                    };
                }
            });
        }
    }
    
    // JSON ?곗씠???ㅼ슫濡쒕뱶 ?⑥닔
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
    
    // ?ㅼ슫濡쒕뱶 踰꾪듉 ?대┃ ???꾩옱 ?곗씠?????
    downloadButton.addEventListener('click', function() {
        downloadJsonData();
        
        statusSpan.textContent = '?곗씠???ㅼ슫濡쒕뱶 ?꾨즺!';
        setTimeout(() => {
            statusSpan.textContent = '';
        }, 3000);
    });
    
    // ?뚯씪 ?좏깮 ??泥섎━
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        statusSpan.textContent = '?뚯씪 濡쒕뵫 以?..';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                // ?곗씠???뺤떇 寃利?
                if (!data.priceData || !data.specialFeaturePrices || !data.devicePrices) {
                    throw new Error('?щ컮瑜??곗씠???뺤떇???꾨떃?덈떎.');
                }
                
                // ?곗씠???낅뜲?댄듃
                priceData = data.priceData;
                specialFeaturePrices = data.specialFeaturePrices;
                devicePrices = data.devicePrices;
                
                statusSpan.textContent = '?곗씠???낅줈???꾨즺!';
                setTimeout(() => {
                    statusSpan.textContent = '';
                }, 3000);
                
                console.log('?ъ슜???붽툑 ?곗씠??濡쒕뱶 ?꾨즺');
            } catch (error) {
                console.error('?곗씠???뚯떛 ?ㅻ쪟:', error);
                statusSpan.textContent = '?ㅻ쪟: ?щ컮瑜?JSON ?뺤떇???꾨떃?덈떎.';
            }
        };
        
        reader.onerror = function() {
            statusSpan.textContent = '?뚯씪 ?쎄린 ?ㅻ쪟 諛쒖깮';
        };
        
        reader.readAsText(file);
    });

    // JSON ?뚯씪?먯꽌 ?붽툑 ?곗씠??濡쒕뱶
    fetch('priceData.json')
        .then(response => response.json())
        .then(data => {
            priceData = data.priceData;
            specialFeaturePrices = data.specialFeaturePrices;
            devicePrices = data.devicePrices;
            console.log('?붽툑 ?곗씠??濡쒕뱶 ?꾨즺');
            
            // ?곗씠??濡쒕뱶 ??珥덇린???ㅽ뻾
            init();
        })
        .catch(error => {
            console.error('?붽툑 ?곗씠??濡쒕뱶 以??ㅻ쪟 諛쒖깮:', error);
            // ?ㅻ쪟 諛쒖깮 ??湲곕낯 ?곗씠???ъ슜
            alert('?붽툑 ?곗씠?곕? 遺덈윭?ㅻ뒗???ㅽ뙣?덉뒿?덈떎. 湲곕낯 ?곗씠?곕? ?ъ슜?⑸땲??');
            
            // ?ㅻ쪟媛 諛쒖깮?대룄 珥덇린???ㅽ뻾
            init();
        });

    // 移댄뀒怨좊━ ?좏깮 ??愿由?
    function initCategoryTabs() {
        const categoryTabs = document.querySelectorAll('.tab-button');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 紐⑤뱺 ??鍮꾪솢?깊솕
                categoryTabs.forEach(t => t.classList.remove('active'));
                
                // ?대┃?????쒖꽦??
                this.classList.add('active');
                
                // 紐⑤뱺 而댄룷?뚰듃 而⑦뀒?대꼫 ?④린湲?
                document.querySelectorAll('.component-container').forEach(container => {
                    container.classList.remove('active');
                });
                
                // ?좏깮??而댄룷?뚰듃 而⑦뀒?대꼫 ?쒖떆
                const category = this.getAttribute('data-category');
                document.getElementById(`${category}-components`).classList.add('active');
            });
        });
    }

    // ?쒗뭹 ?좏깮 ??愿由?(SME)
    function initSmeProductTabs() {
        const productTabs = document.querySelectorAll('#sme-components .product-tab');
        productTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 紐⑤뱺 ??鍮꾪솢?깊솕
                productTabs.forEach(t => t.classList.remove('active'));
                
                // ?대┃?????쒖꽦??
                this.classList.add('active');
                
                // 紐⑤뱺 ?쒗뭹 而댄룷?뚰듃 ?④린湲?
                document.querySelectorAll('#sme-components .product-component').forEach(component => {
                    component.classList.remove('active');
                });
                
                // ?좏깮???쒗뭹 而댄룷?뚰듃 ?쒖떆
                const product = this.getAttribute('data-product');
                document.getElementById(`sme-${product}`).classList.add('active');
            });
        });
    }

    // ?쒗뭹 ?좏깮 ??愿由?(?뚰샇)
    function initSohoProductTabs() {
        const productTabs = document.querySelectorAll('#soho-components .product-tab');
        productTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 紐⑤뱺 ??鍮꾪솢?깊솕
                productTabs.forEach(t => t.classList.remove('active'));
                
                // ?대┃?????쒖꽦??
                this.classList.add('active');
                
                // 紐⑤뱺 ?쒗뭹 而댄룷?뚰듃 ?④린湲?
                document.querySelectorAll('#soho-components .product-component').forEach(component => {
                    component.classList.remove('active');
                });
                
                // ?좏깮???쒗뭹 而댄룷?뚰듃 ?쒖떆
                const product = this.getAttribute('data-product');
                document.getElementById(`soho-${product}`).classList.add('active');
            });
        });
    }

    // ?뚰샇 ?명꽣???곹뭹 ?좏깮 ??UI ?낅뜲?댄듃
    function initSohoInternetProductChange() {
        const productSelect = document.getElementById('soho-internet-product');
        const speedGroup = document.getElementById('soho-internet-speed-group');
        const wirelessGroup = document.getElementById('soho-internet-wireless-group');
        
        productSelect.addEventListener('change', function() {
            if (this.value === '臾댁꽑?명꽣??) {
                speedGroup.style.display = 'none';
                wirelessGroup.style.display = 'block';
            } else {
                speedGroup.style.display = 'block';
                wirelessGroup.style.display = 'none';
            }
        });
    }

    // ?뚰샇 DX?붾（???곹뭹 ?좏깮 ??UI ?낅뜲?댄듃
    function initSohoDxProductChange() {
        const productSelect = document.getElementById('soho-dx-product');
        const tableGroup = document.getElementById('soho-dx-table-group');
        const deviceGroup = document.getElementById('soho-dx-device-group');
        const kioskGroup = document.getElementById('soho-dx-kiosk-group');
        
        productSelect.addEventListener('change', function() {
            if (this.value === '?쒖씠釉붿삤??) {
                tableGroup.style.display = 'block';
                deviceGroup.style.display = 'none';
                kioskGroup.style.display = 'none';
            } else if (this.value === '?ъ뒪') {
                tableGroup.style.display = 'none';
                deviceGroup.style.display = 'block';
                kioskGroup.style.display = 'none';
            } else if (this.value === '?ㅼ삤?ㅽ겕') {
                tableGroup.style.display = 'none';
                deviceGroup.style.display = 'none';
                kioskGroup.style.display = 'block';
            }
        });
    }

    // ?곹뭹 愿由?
    const cartItems = [];

    function addToCart() {
        const activeCategory = document.querySelector('.tab-button.active').getAttribute('data-category');
        let item = { category: activeCategory === 'sme' ? 'SME' : '?뚰샇' };
        
        if (activeCategory === 'sme') {
            const activeProduct = document.querySelector('#sme-components .product-tab.active').getAttribute('data-product');
            
            if (activeProduct === 'internet') {
                item.product = '?명꽣??;
                item.option = document.getElementById('sme-internet-speed').value;
                item.lines = parseInt(document.getElementById('sme-internet-lines').value) || 1;
            } else if (activeProduct === 'voip') {
                item.product = '?명꽣?룹쟾??;
                item.subProduct = document.getElementById('sme-voip-product').value;
                if (item.subProduct !== '?쇰컲??) {
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
        } else { // ?뚰샇
            const activeProduct = document.querySelector('#soho-components .product-tab.active').getAttribute('data-product');
            
            if (activeProduct === 'internet') {
                item.product = '?명꽣??;
                item.subProduct = document.getElementById('soho-internet-product').value;
                if (item.subProduct === '臾댁꽑?명꽣??) {
                    item.option = document.getElementById('soho-internet-wireless').value;
                } else {
                    item.option = document.getElementById('soho-internet-speed').value;
                }
                item.lines = parseInt(document.getElementById('soho-internet-lines').value) || 1;
            } else if (activeProduct === 'voip') {
                item.product = '?명꽣?룹쟾??;
                item.subProduct = document.getElementById('soho-voip-product').value;
                if (item.subProduct !== '?쇰컲??) {
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
                item.product = 'AI?꾪솕';
                item.option = document.getElementById('soho-ai-phone-plan').value;
                item.lines = parseInt(document.getElementById('soho-ai-phone-lines').value) || 1;
                item.device = document.getElementById('soho-ai-phone-device').value;
            } else if (activeProduct === 'dx-solution') {
                item.product = 'DX?붾（??;
                item.subProduct = document.getElementById('soho-dx-product').value;
                if (item.subProduct === '?쒖씠釉붿삤??) {
                    item.option = document.getElementById('soho-dx-table-type').value;
                } else if (item.subProduct === '?ㅼ삤?ㅽ겕') {
                    item.device = document.getElementById('soho-dx-kiosk-type').value;
                } else if (item.subProduct === '?ъ뒪') {
                    item.device = document.getElementById('soho-dx-device').value;
                }
                item.quantity = parseInt(document.getElementById('soho-dx-quantity').value) || 1;
            } else if (activeProduct === 'cctv') {
                item.product = '吏?ν삎CCTV';
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
            cartContainer.innerHTML = '<p>?곹뭹??鍮꾩뼱 ?덉뒿?덈떎.</p>';
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
                itemDescription += ` x ${item.lines}?뚯꽑`;
            }
            if (item.quantity) {
                itemDescription += ` x ${item.quantity}媛?;
            }
            if (item.device) {
                itemDescription += `<br><i class="fas fa-mobile-alt"></i> ?⑤쭚湲? ${item.device}`;
            }
            if (item.feature && item.feature !== '?놁쓬') {
                itemDescription += `<br><i class="fas fa-comments"></i> ?먯쑀?듯솕: ${item.feature}`;
            }
            
            const removeButton = document.createElement('span');
            removeButton.className = 'remove-item';
            removeButton.innerHTML = '<i class="fas fa-times"></i>';
            removeButton.addEventListener('click', () => removeFromCart(index));
            
            cartItem.innerHTML = itemDescription;
            cartItem.appendChild(removeButton);
            cartContainer.appendChild(cartItem);
            
            // ?좊땲硫붿씠???④낵 異붽?
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
        // ??젣 ?좊땲硫붿씠??
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

    // ?붽툑 怨꾩궛 ?⑥닔
    function calculateTotalPrice() {
        if (cartItems.length === 0) {
            alert('?곹뭹??異붽??댁＜?몄슂.');
            return;
        }
        
        let totalBasicFee = 0;
        let totalDeviceFee = 0;
        let totalInstallationFee = 0;
        let totalSpecialFeatureFee = 0;
        let totalBundleDiscount = 0;
        
        // 移댄뀒怨좊━蹂??곹뭹 ??怨꾩궛 (寃고빀 ?좎씤 ?곸슜???꾪빐)
        const productCounts = {
            'SME': { '?명꽣??: 0, '?명꽣?룹쟾??: 0, 'IPTV': 0 },
            '?뚰샇': { '?명꽣??: 0, '?명꽣?룹쟾??: 0, 'IPTV': 0, 'AI?꾪솕': 0, 'DX?붾（??: 0, '吏?ν삎CCTV': 0 }
        };
        
        // 泥?踰덉㎏ 猷⑦봽: ?곹뭹 ??怨꾩궛 諛?湲곕낯 ?붽툑 怨꾩궛
        cartItems.forEach(item => {
            // ?곹뭹 ??怨꾩궛
            if (productCounts[item.category] && productCounts[item.category][item.product] !== undefined) {
                productCounts[item.category][item.product]++;
            }
            
            // ?붽툑 ?곗씠??李얘린
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
                
                // 湲곕낯 ?붽툑 怨꾩궛
                totalBasicFee += priceInfo.湲곕낯猷?* quantity;
                
                // ?λ퉬 ?꾨?猷?怨꾩궛
                totalDeviceFee += priceInfo.?λ퉬?꾨?猷?* quantity;
                
                // ?ㅼ튂鍮?怨꾩궛
                totalInstallationFee += priceInfo.?ㅼ튂鍮?
                
                // ?⑤쭚湲?異붽? ?붽툑
                if (item.device && devicePrices[item.device]) {
                    totalDeviceFee += devicePrices[item.device] * quantity;
                }
                
                // ?먯쑀?듯솕 異붽? ?붽툑
                if (item.feature && specialFeaturePrices[item.feature]) {
                    totalSpecialFeatureFee += specialFeaturePrices[item.feature] * quantity;
                }
            }
        });
        
        // 寃고빀 ?좎씤 怨꾩궛
        if (window.bundleDiscounts) {
            // 寃고빀 ?좎씤 洹쒖튃 ?곸슜
            const bundleDiscounts = window.bundleDiscounts;
            
            // ?명꽣??+ ?명꽣?룹쟾??寃고빀 ?좎씤
            if (productCounts['SME']['?명꽣??] > 0 && productCounts['SME']['?명꽣?룹쟾??] > 0 && bundleDiscounts['?명꽣???명꽣?룹쟾??]) {
                const discount = bundleDiscounts['?명꽣???명꽣?룹쟾??];
                if (discount.?좎씤湲덉븸 > 0) {
                    totalBundleDiscount += discount.?좎씤湲덉븸;
                } else if (discount.?좎씤??> 0) {
                    totalBundleDiscount += totalBasicFee * discount.?좎씤??/ 100;
                }
            }
            
            // ?명꽣??+ IPTV 寃고빀 ?좎씤
            if (productCounts['SME']['?명꽣??] > 0 && productCounts['SME']['IPTV'] > 0 && bundleDiscounts['?명꽣??IPTV']) {
                const discount = bundleDiscounts['?명꽣??IPTV'];
                if (discount.?좎씤湲덉븸 > 0) {
                    totalBundleDiscount += discount.?좎씤湲덉븸;
                } else if (discount.?좎씤??> 0) {
                    totalBundleDiscount += totalBasicFee * discount.?좎씤??/ 100;
                }
            }
            
            // ?명꽣??+ ?명꽣?룹쟾??+ IPTV 寃고빀 ?좎씤 (?몃━??
            if (productCounts['SME']['?명꽣??] > 0 && productCounts['SME']['?명꽣?룹쟾??] > 0 && productCounts['SME']['IPTV'] > 0 && bundleDiscounts['?몃━??]) {
                const discount = bundleDiscounts['?몃━??];
                if (discount.?좎씤湲덉븸 > 0) {
                    totalBundleDiscount += discount.?좎씤湲덉븸;
                } else if (discount.?좎씤??> 0) {
                    totalBundleDiscount += totalBasicFee * discount.?좎씤??/ 100;
                }
            }
            
            // ?뚰샇 寃고빀 ?좎씤???좎궗?섍쾶 ?곸슜
            // ...
        }
        
        // 理쒖쥌 ?⑷퀎 怨꾩궛 (?좎씤 ?곸슜)
        const finalTotal = totalBasicFee + totalDeviceFee + totalSpecialFeatureFee + totalInstallationFee - totalBundleDiscount;
        
        // 寃곌낵 ?쒖떆
        const resultContainer = document.getElementById('result-container');
        resultContainer.style.display = 'block';
        resultContainer.innerHTML = `
            <h3><i class="fas fa-chart-line"></i> ?붽툑 怨꾩궛 寃곌낵</h3>
            <p><i class="fas fa-won-sign"></i> 湲곕낯猷??⑷퀎: ${totalBasicFee.toLocaleString()}??/p>
            <p><i class="fas fa-hdd"></i> ?λ퉬?꾨?猷??⑷퀎: ${totalDeviceFee.toLocaleString()}??/p>
            <p><i class="fas fa-comments"></i> ?먯쑀?듯솕 異붽? ?붽툑: ${totalSpecialFeatureFee.toLocaleString()}??/p>
            <p><i class="fas fa-tools"></i> ?ㅼ튂鍮??⑷퀎: ${totalInstallationFee.toLocaleString()}??/p>
            ${totalBundleDiscount > 0 ? `<p><i class="fas fa-percentage"></i> 寃고빀 ?좎씤: -${totalBundleDiscount.toLocaleString()}??/p>` : ''}
            <p class="total-price"><i class="fas fa-check-circle"></i> <strong>理쒖쥌 ?⑷퀎: ${finalTotal.toLocaleString()}??/strong></p>
        `;
        
        // 寃곌낵???좊땲硫붿씠???④낵 異붽?
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

    // ?대깽??由ъ뒪???깅줉
    function initEventListeners() {
        document.getElementById('add-to-cart').addEventListener('click', addToCart);
        document.getElementById('calculate-button').addEventListener('click', calculateTotalPrice);
        document.getElementById('reset-button').addEventListener('click', resetCalculation);
    }

    // 珥덇린???⑥닔
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

    // ?ㅼ떆 怨꾩궛?섍린 ?⑥닔
    function resetCalculation() {
        // ?λ컮援щ땲 鍮꾩슦湲?
        cartItems.length = 0;
        updateCartDisplay();
        
        // 怨꾩궛 寃곌낵 ?④린湲?
        const resultContainer = document.getElementById('result-container');
        resultContainer.style.display = 'none';
        
        // ?좏깮???듭뀡 珥덇린??
        document.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = 1;
        });
        
        // 泥?踰덉㎏ 移댄뀒怨좊━ ???쒖꽦??
        document.querySelectorAll('.tab-button').forEach((tab, index) => {
            if (index === 0) {
                tab.click();
            }
        });
        
        // 泥?踰덉㎏ ?쒗뭹 ???쒖꽦??
        document.querySelectorAll('#sme-components .product-tab').forEach((tab, index) => {
            if (index === 0) {
                tab.click();
            }
        });
        
        // ?좊땲硫붿씠???④낵 異붽?
        const cartContainer = document.querySelector('.cart-container');
        cartContainer.style.transition = 'all 0.3s ease';
        cartContainer.style.transform = 'translateY(10px)';
        cartContainer.style.opacity = '0.5';
        
        setTimeout(() => {
            cartContainer.style.transform = 'translateY(0)';
            cartContainer.style.opacity = '1';
        }, 300);
    }

    // SME? ?뚰샇 ?명꽣?룹쟾???붽툑???좏깮 ??UI ?낅뜲?댄듃
    function initVoipPlanChange() {
        // SME ?명꽣?룹쟾???붽툑??蹂寃??대깽??
        const smePlanSelect = document.getElementById('sme-voip-plan');
        const smeFeatureGroup = document.getElementById('sme-voip-feature-group');
        const smeProductSelect = document.getElementById('sme-voip-product');
        const smePlanGroup = document.getElementById('sme-voip-plan-group');
        
        // ?곹뭹 ?좏깮 蹂寃??대깽??
        smeProductSelect.addEventListener('change', function() {
            updateSmeVoipFeatureVisibility();
            updateSmeVoipPlanOptions();
        });
        
        // ?붽툑??蹂寃??대깽??
        smePlanSelect.addEventListener('change', function() {
            updateSmeVoipFeatureVisibility();
        });
        
        // SME ?먯쑀?듯솕 ?쒖떆 ?щ? ?낅뜲?댄듃 ?⑥닔
        function updateSmeVoipFeatureVisibility() {
            if (smeProductSelect.value === '?쇰컲?? || smePlanSelect.value === '醫낅웾??) {
                smeFeatureGroup.style.display = 'none';
            } else {
                smeFeatureGroup.style.display = 'block';
            }
        }
        
        // SME ?붽툑???듭뀡 ?낅뜲?댄듃 ?⑥닔
        function updateSmeVoipPlanOptions() {
            // 湲곗〈 ?듭뀡 ?쒓굅
            while (smePlanSelect.options.length > 0) {
                smePlanSelect.remove(0);
            }
            
            // ?쇰컲?뺤씤 寃쎌슦 醫낅웾?쒕쭔 異붽?
            if (smeProductSelect.value === '?쇰컲??) {
                const option = document.createElement('option');
                option.value = '醫낅웾??;
                option.text = '醫낅웾??;
                smePlanSelect.add(option);
                smePlanGroup.style.display = 'none'; // ?좏깮吏媛 ?섎굹肉먯씠誘濡??붽툑???좏깮? ?④?
            } else {
                // ?쇰컲?뺤씠 ?꾨땶 寃쎌슦 醫낅웾?쒖? ?뺤븸??紐⑤몢 異붽?
                const option1 = document.createElement('option');
                option1.value = '醫낅웾??;
                option1.text = '醫낅웾??;
                smePlanSelect.add(option1);
                
                const option2 = document.createElement('option');
                option2.value = '?뺤븸??;
                option2.text = '?뺤븸??;
                smePlanSelect.add(option2);
                
                smePlanGroup.style.display = 'block'; // ?붽툑???좏깮? ?쒖떆
            }
            
            // ?먯쑀?듯솕 ?쒖떆 ?щ? ?낅뜲?댄듃
            updateSmeVoipFeatureVisibility();
        }
        
        // ?뚰샇 ?명꽣?룹쟾???붽툑??蹂寃??대깽??
        const sohoPlanSelect = document.getElementById('soho-voip-plan');
        const sohoFeatureGroup = document.getElementById('soho-voip-feature-group');
        const sohoProductSelect = document.getElementById('soho-voip-product');
        const sohoPlanGroup = document.getElementById('soho-voip-plan-group');
        
        // ?곹뭹 ?좏깮 蹂寃??대깽??
        sohoProductSelect.addEventListener('change', function() {
            updateSohoVoipFeatureVisibility();
            updateSohoVoipPlanOptions();
        });
        
        // ?붽툑??蹂寃??대깽??
        sohoPlanSelect.addEventListener('change', function() {
            updateSohoVoipFeatureVisibility();
        });
        
        // ?뚰샇 ?먯쑀?듯솕 ?쒖떆 ?щ? ?낅뜲?댄듃 ?⑥닔
        function updateSohoVoipFeatureVisibility() {
            if (sohoProductSelect.value === '?쇰컲?? || sohoPlanSelect.value === '醫낅웾??) {
                sohoFeatureGroup.style.display = 'none';
            } else {
                sohoFeatureGroup.style.display = 'block';
            }
        }
        
        // ?뚰샇 ?붽툑???듭뀡 ?낅뜲?댄듃 ?⑥닔
        function updateSohoVoipPlanOptions() {
            // 湲곗〈 ?듭뀡 ?쒓굅
            while (sohoPlanSelect.options.length > 0) {
                sohoPlanSelect.remove(0);
            }
            
            // ?쇰컲?뺤씤 寃쎌슦 醫낅웾?쒕쭔 異붽?
            if (sohoProductSelect.value === '?쇰컲??) {
                const option = document.createElement('option');
                option.value = '醫낅웾??;
                option.text = '醫낅웾??;
                sohoPlanSelect.add(option);
                sohoPlanGroup.style.display = 'none'; // ?좏깮吏媛 ?섎굹肉먯씠誘濡??붽툑???좏깮? ?④?
            } else {
                // ?쇰컲?뺤씠 ?꾨땶 寃쎌슦 醫낅웾?쒖? ?뺤븸??紐⑤몢 異붽?
                const option1 = document.createElement('option');
                option1.value = '醫낅웾??;
                option1.text = '醫낅웾??;
                sohoPlanSelect.add(option1);
                
                const option2 = document.createElement('option');
                option2.value = '?뺤븸??;
                option2.text = '?뺤븸??;
                sohoPlanSelect.add(option2);
                
                sohoPlanGroup.style.display = 'block'; // ?붽툑???좏깮? ?쒖떆
            }
            
            // ?먯쑀?듯솕 ?쒖떆 ?щ? ?낅뜲?댄듃
            updateSohoVoipFeatureVisibility();
        }
        
        // 珥덇린 ?곹깭 ?ㅼ젙
        updateSmeVoipPlanOptions();
        updateSohoVoipPlanOptions();
    }
}); 
