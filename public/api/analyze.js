export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { images, facilityType, facilityName, companyName, inspectionDate, notes } = req.body;
    
    if (!images || images.length === 0) {
      return res.status(400).json({ error: '사진이 필요합니다' });
    }
    
    const restaurantChecklist = [
      { no: 1, category: '작업장 통로 상태', detail: '조리실·배식구·세척실·창고 통로의 장애물 적치 여부 및 이동 원활성 확인' },
      { no: 2, category: '바닥 청결 및 미끄럼 예방', detail: '바닥의 물기, 기름기, 미끄럼 위험요소 제거 여부, 미끄럼 주의 표시 여부' },
      { no: 3, category: '정리정돈 및 청소 상태', detail: '조리대·배식대·식재료 보관구역·홀의 청소 및 정리정돈 상태 확인' },
      { no: 4, category: '작업공간 확보', detail: '조리기구 등 주변 작업공간 확보 여부' },
      { no: 5, category: '보호구 착용 상태', detail: '작업조건에 맞는 보호구를 지급·착용 확인' },
      { no: 6, category: '중량물 취급', detail: '5kg 이상 중량물 작업 시 물품 중량과 무게중심 표지 부착' },
      { no: 7, category: '작업장 환기 상태', detail: '유해화학물질·인화성가스·밀폐공간 작업 시 적정 지속 환기 여부' },
      { no: 8, category: '조리기구 안전관리', detail: '칼, 도마, 식판, 국자, 조리기구 등을 안전하게 사용·보관하는지 여부' },
      { no: 9, category: '고온설비 안전관리', detail: '뜨거운 국물, 조리솥, 튀김기, 스팀기기 사용 시 화상예방 수칙 준수 여부' },
      { no: 10, category: '전기·가스·화기 관리 상태', detail: '전기조리기구, 가스기구, 배선 손상 여부, 콘센트, 멀티탭, 누전차단기 상태' },
      { no: 11, category: '소화기 및 비상구 관리', detail: '소화기 비치 및 점검상태, 출입구·비상구 주변 장애물 적치 여부' },
      { no: 12, category: '동력기계 방호장치', detail: '믹서기, 분쇄기, 절단기, 식기세척기 등 위험기계 덮개·방호장치 정상 작동 여부' },
      { no: 13, category: '유해화학물질 취급', detail: 'MSDS 게시, 교육 실시여부, 경고 표지 부착 여부' },
      { no: 14, category: '시설물 점검', detail: '천장 마감재, 선반, 조명, 걸이류 등 낙하 우려 시설물 점검 여부' },
      { no: 15, category: '고열·한랭 작업', detail: '고열·한랭 작업 시 보호구 지급 여부, 휴게시간 편성 여부' },
      { no: 16, category: '조리 전·후 위생관리', detail: '식재료 손질, 조리, 배식, 보관과정에서 위생기준 준수 여부' },
      { no: 17, category: '안전보건교육 실시', detail: '식중독·화상·조리안전·베임·미끄럼·화재·응급상황 대응 교육 실시 여부' }
    ];
    
    const cafeChecklist = [
      { no: 1, category: '매장 내 통로 및 바닥 상태', detail: '이동 통로 정리 여부, 바닥의 물기·기름기·미끄럼 위험요소 제거 여부' },
      { no: 2, category: '작업공간 정리정돈·확보', detail: '커피머신, 제빙기, 오븐, POS 주변 작업 공간 확보 여부' },
      { no: 3, category: '미끄러짐·넘어짐 예방', detail: '미끄럼 주의 표지 부착, 미끄럼 방지화 착용 여부' },
      { no: 4, category: '정리정돈 및 청소 상태', detail: '홀, 주방, 창고, 카운터 주변 청소 및 정리정돈 상태' },
      { no: 5, category: '보호구 착용 개인위생', detail: '앞치마, 위생모, 위생장갑 등 착용 여부, 손씻기 및 개인위생 수칙 준수' },
      { no: 6, category: '화상 예방', detail: '에스프레소 머신, 스팀완드, 온수기 등 화상위험 설비 사용 시 주의 표지 부착' },
      { no: 7, category: '전기기기 관리 상태', detail: '커피머신, 제빙기, 냉장고, 온수통 등 전기기기의 전선 손상 여부' },
      { no: 8, category: '소화기 및 비상구 관리', detail: '소화기 비치 및 점검, 출입구·비상구 주변 장애물 적치 여부' },
      { no: 9, category: '유해화학물질 취급', detail: 'MSDS 게시, 교육 실시, 경고 표지 부착' },
      { no: 10, category: '고열·한랭 작업', detail: '고열·한랭 작업 시 보호구 지급, 휴게시간 편성 여부' },
      { no: 11, category: '위생시설 상태', detail: '손세정제, 세정용품 등 위생용품 비치 여부' },
      { no: 12, category: '위생 관리', detail: '조리도구, 텀블러 세척도구, 행주, 작업대의 세척·소독 실시 여부' },
      { no: 13, category: '고객 안전 관리', detail: '고객석, 테이블, 의자, 출입문 등의 청결 및 안전상태' },
      { no: 14, category: '직원 교육 실시 여부', detail: '화상예방, 식품위생, 고객응대, 응급상황 대응 안전교육 여부' }
    ];
    
    const checklist = facilityType === 'restaurant' ? restaurantChecklist : cafeChecklist;
    const facilityTypeText = facilityType === 'restaurant' ? '구내식당' : '카페';
    const checklistText = checklist.map(item => `${item.no}. ${item.category}: ${item.detail}`).join('\n');
    
    const prompt = `당신은 중대재해처벌법 및 산업안전보건법 전문가입니다.
한국 지자체 자활센터 위탁 ${facilityTypeText}의 주간 안전점검을 도와주세요.

[점검 정보]
- 사업장: ${facilityName}
- 업체: ${companyName}
- 점검일: ${inspectionDate}
- 추가 메모: ${notes || '없음'}

[${facilityTypeText} 점검 항목 ${checklist.length}개]
${checklistText}

[지시사항]
업로드된 ${images.length}장의 사진을 보고 위 점검 항목별로 분석하세요.
- 사진에서 확인 가능한 항목만 평가
- 사진에서 확인 불가능한 항목은 "해당없음"
- 미흡한 점이 보이면 구체적으로 지적

[출력 형식: JSON]
{
  "checklist": [
    {"no": 1, "result": "양호" 또는 "미흡" 또는 "해당없음", "improvement": "미흡일 경우 개선요망 사항"}
  ],
  "imageDescriptions": ["1번째 사진 설명 (15자 이내)", "2번째 사진 설명..."],
  "specialNotes": "특이사항 (2-3줄)",
  "actionItems": "조치 사항 (2-3줄)"
}

점검항목 수: ${checklist.length}개
이미지 설명 수: ${images.length}개

JSON만 출력하세요.`;
    
    const imageContent = images.map(img => ({
      type: "image",
      source: { type: "base64", media_type: "image/jpeg", data: img }
    }));
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{
          role: "user",
          content: [...imageContent, { type: "text", text: prompt }]
        }]
      })
    });
    
    if (!response.ok) {
      const errData = await response.json();
      return res.status(response.status).json({ error: `Claude API 오류: ${errData.error?.message || '알 수 없는 오류'}` });
    }
    
    const data = await response.json();
    const analysisText = data.content[0].text;
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return res.status(500).json({ error: '분석 결과를 파싱할 수 없습니다' });
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    
    return res.status(200).json({ success: true, analysis, checklist });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
