const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

// JSON 요청 본문 파싱 미들웨어
app.use(express.json({ limit: '10mb' }));

// 정적 파일 제공
app.use(express.static(__dirname));

// 요금 데이터 저장 API
app.post('/save-price-data', (req, res) => {
    try {
        const data = req.body;
        
        // 데이터 유효성 검사
        if (!data || !data.priceData) {
            return res.status(400).json({ success: false, message: '유효하지 않은 데이터입니다.' });
        }
        
        // 백업 파일 생성
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const backupPath = path.join(__dirname, `priceData_backup_${timestamp}.json`);
        
        // 기존 파일이 있으면 백업
        if (fs.existsSync(path.join(__dirname, 'priceData.json'))) {
            fs.copyFileSync(
                path.join(__dirname, 'priceData.json'), 
                backupPath
            );
            console.log(`기존 파일 백업 완료: ${backupPath}`);
        }
        
        // 새 데이터 저장
        fs.writeFileSync(
            path.join(__dirname, 'priceData.json'), 
            JSON.stringify(data, null, 2)
        );
        
        console.log('요금 데이터가 성공적으로 저장되었습니다.');
        res.json({ success: true, message: '데이터가 성공적으로 저장되었습니다.' });
    } catch (error) {
        console.error('데이터 저장 중 오류 발생:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.', error: error.message });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log(`브라우저에서 http://localhost:${PORT} 주소로 접속하세요.`);
}); 