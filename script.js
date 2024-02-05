document.addEventListener('DOMContentLoaded', function() {
    const tocItems = document.querySelectorAll('.toc li');
    const contentElements = document.querySelectorAll('#contentContainer *');  // 모든 자손 요소를 선택합니다.

    // 각 요소의 가시성을 추적하는 Map을 생성합니다.
    const visibilityMap = new Map();

    // 각 요소의 id와 가장 가까운 상위 섹션 id를 매핑합니다.
    let currentSectionId = '';
    let currentSectionText = '';  // 현재 섹션 텍스트를 저장할 변수 추가

    contentElements.forEach(el => {
        if (el.id.startsWith('section-')) {
            currentSectionId = el.id;  // 현재 섹션 id 업데이트
            currentSectionText = el.textContent.trim();  // 현재 섹션 텍스트 업데이트

        }
        visibilityMap.set(el, currentSectionId);  // 요소를 현재 섹션 id에 매핑합니다.
    });

    // 3단계 이상의 목차 항목을 숨김
    tocItems.forEach(function(tocItem) {
        const index = tocItem.getAttribute('data-index');
        const level = index.split('.').length;
        if (level > 3) {
            tocItem.style.display = 'none';
        }
    });

    // 현재 섹션 텍스트를 표시하는 요소 추가
    const currentSectionTextElement = document.createElement('div');
    currentSectionTextElement.id = 'currentSectionText';
    currentSectionTextElement.textContent = '';

    document.getElementById('contentContainer').prepend(currentSectionTextElement);


    tocItems.forEach(function(tocItem) {
        tocItem.addEventListener('click', function(event) {
            event.preventDefault();

            // 'active' 클래스를 모든 목차 항목에서 제거
            tocItems.forEach(item => {
                item.classList.remove('active');
            });

            // 현재 목차 항목에 'active' 클래스 추가
            this.classList.add('active');

            // 현재 목차 항목의 data-index를 가져옴
            const currentIndex = this.getAttribute('data-index');
            const currentSectionSelector = `section-${currentIndex}`;

            // 모든 요소를 숨김
            contentElements.forEach(el => {
                el.style.display = 'none';
            });

            // 현재 섹션과 그 하위 섹션을 표시
            contentElements.forEach(el => {
                const sectionId = visibilityMap.get(el);  // 요소에 매핑된 섹션 id를 가져옵니다.
                console.log(sectionId, currentSectionSelector);  // Debugging: 섹션 ID 값 확인
                if (sectionId && sectionId.startsWith(currentSectionSelector)) {
                    switch (el.nodeName) {
                        case 'STRONG':
                            // <strong> 태그에 대해서는 'inline'으로 설정하여 개행을 방지
                            el.style.display = 'inline';
                            break;
                        case 'UL':
                            // <ul> 태그에 대해서는 'block'으로 설정하여 기본 스타일을 유지
                            el.style.display = 'block';
                            break;
                        case 'LI':
                            // <li> 태그에 대해서는 'list-item'으로 설정하여 기본 스타일을 유지
                            el.style.display = 'list-item';
                            break;
                        default:
                            // 다른 태그에 대해서는 'block'으로 설정
                            el.style.display = 'block';
                            break;
                    }
                }
            });

            // URL 해시를 목차 번호로 변경
            history.pushState(null, null, `#toc-${currentIndex}`);

            // 현재 섹션 텍스트 구성
            let currentSectionText = ''; // 현재 섹션 텍스트 초기화
            const sectionNumbers = currentIndex.split('.'); // 목차 번호를 분할
            sectionNumbers.forEach((number, index) => {
                // 이스케이프 처리된 ID 사용
                const sectionId = sectionNumbers.slice(0, index + 1).join('.').replace(/\./g, '\\.');
                const sectionTitle = document.querySelector(`#section-${sectionId}`);
                if (sectionTitle) {
                    currentSectionText += sectionTitle.textContent.trim() + ' > ';
                }
            });
            currentSectionText = currentSectionText.slice(0, -3); // 마지막 ' > ' 제거
            document.getElementById('currentSectionText').textContent = currentSectionText;

        });
    });
});