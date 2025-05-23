import React from 'react';
import PriceCalculator from './components/calculator/PriceCalculator';
import { PriceData } from './types/price';

// TODO: 실제 데이터로 교체
const mockPriceData: PriceData = {
  priceData: {
    SME: {
      인터넷: {
        '100M': {
          기본료: 30000,
          장비임대료: 5000,
          설치비: 30000
        },
        '500M': {
          기본료: 35000,
          장비임대료: 5000,
          설치비: 30000
        },
        '1G': {
          기본료: 40000,
          장비임대료: 5000,
          설치비: 30000
        }
      },
      인터넷전화: {
        DCS: {
          '자유통화3': {
            기본료: 3000,
            장비임대료: 0,
            설치비: 10000
          },
          '자유통화6': {
            기본료: 6000,
            장비임대료: 0,
            설치비: 10000
          }
        },
        '일반형': {
          기본료: 5000,
          장비임대료: 0,
          설치비: 10000
        }
      }
    },
    소호: {
      인터넷: {
        유선인터넷: {
          '100M': {
            기본료: 28000,
            장비임대료: 5000,
            설치비: 30000
          },
          '500M': {
            기본료: 33000,
            장비임대료: 5000,
            설치비: 30000
          },
          '1G': {
            기본료: 38000,
            장비임대료: 5000,
            설치비: 30000
          }
        },
        '인터넷_결제안심': {
          '100M': {
            기본료: 30000,
            장비임대료: 5000,
            설치비: 30000
          },
          '500M': {
            기본료: 35000,
            장비임대료: 5000,
            설치비: 30000
          },
          '1G': {
            기본료: 40000,
            장비임대료: 5000,
            설치비: 30000
          }
        },
        무선인터넷: {
          '100M': {
            기본료: 35000,
            장비임대료: 8000,
            설치비: 30000
          },
          '500M': {
            기본료: 40000,
            장비임대료: 8000,
            설치비: 30000
          }
        }
      },
      인터넷전화: {
        '일반형': {
          기본료: 4500,
          장비임대료: 0,
          설치비: 10000
        },
        'DCS': {
          '자유통화3': {
            기본료: 3000,
            장비임대료: 0,
            설치비: 10000
          },
          '자유통화6': {
            기본료: 6000,
            장비임대료: 0,
            설치비: 10000
          },
          '자유통화10': {
            기본료: 10000,
            장비임대료: 0,
            설치비: 10000
          }
        },
        '고급형DCS': {
          '자유통화3': {
            기본료: 4000,
            장비임대료: 0,
            설치비: 10000
          },
          '자유통화6': {
            기본료: 7000,
            장비임대료: 0,
            설치비: 10000
          },
          '자유통화10': {
            기본료: 11000,
            장비임대료: 0,
            설치비: 10000
          }
        }
      },
      IPTV: {
        '기본형': {
          기본료: 13200,
          장비임대료: 5500,
          설치비: 30000
        },
        '고급형': {
          기본료: 16500,
          장비임대료: 5500,
          설치비: 30000
        }
      },
      'AI전화': {
        '기본형': {
          기본료: 5500,
          장비임대료: 0,
          설치비: 10000
        },
        '고급형': {
          기본료: 7700,
          장비임대료: 0,
          설치비: 10000
        }
      },
      '지능형CCTV': {
        '4채널': {
          기본료: 22000,
          장비임대료: 13200,
          설치비: 30000
        },
        '8채널': {
          기본료: 33000,
          장비임대료: 16500,
          설치비: 30000
        }
      }
    }
  },
  bundleDiscounts: [
    {
      category: 'SME',
      bundleType: '인터넷_인터넷전화',
      displayName: '인터넷+인터넷전화 결합',
      internetDiscount: 5000,
      voipDiscount: 1000,
      installationDiscount: 20000
    },
    {
      category: '소호',
      bundleType: '인터넷_인터넷전화',
      displayName: '인터넷+인터넷전화 결합',
      internetDiscount: 4000,
      voipDiscount: 1000,
      installationDiscount: 20000
    },
    {
      category: '소호',
      bundleType: '인터넷_인터넷전화_IPTV',
      displayName: '인터넷+인터넷전화+IPTV 결합',
      internetDiscount: 5000,
      voipDiscount: 1500,
      installationDiscount: 30000
    },
    {
      category: '소호',
      bundleType: '인터넷_IPTV',
      displayName: '인터넷+IPTV 결합',
      internetDiscount: 3000,
      voipDiscount: 0,
      installationDiscount: 20000
    }
  ]
};

/**
 * 메인 애플리케이션 컴포넌트
 * 
 * 주요 기능:
 * - 복수 상품 동시 선택 및 계산
 * - 계산 결과 표시
 * - 데이터 관리 (업로드/다운로드)
 * - 에러 처리 및 로딩 상태 관리
 */
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            V1 요금 계산기
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <PriceCalculator priceData={mockPriceData} />
        </div>
      </main>
    </div>
  );
}

export default App; 