// script.js는 더 이상 사용되지 않습니다. script_new_fixed.js를 사용하세요.
// 이 파일을 로드한 페이지는 script_new_fixed.js로 자동 리다이렉트됩니다.
console.warn('script.js는 더 이상 사용되지 않습니다. script_new_fixed.js를 사용하세요.');

// script_new_fixed.js 로드
(function() {
    var script = document.createElement('script');
    script.src = 'script_new_fixed.js';
    script.onerror = function() {
        console.error('script_new_fixed.js 로드 실패');
    };
    document.head.appendChild(script);
})(); 