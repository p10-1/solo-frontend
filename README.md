# 빚이 없는 솔로 - 청년을 위한 금융 자산 분석 서비스

![logo2](https://github.com/user-attachments/assets/c8cdcb5f-1786-4f2a-9d17-ed21ddbad36d)

## 📌 목차
1. [프로젝트 소개](#프로젝트-소개)
2. [팀원 소개](#팀원-소개)
3. [기술 스택](#기술-스택)
4. [프로젝트 구조](#프로젝트-구조)
5. [주요 기능](#주요-기능)
6. [개발 기간 및 작업 관리](#개발-기간-및-작업-관리)
7. [기대 효과](#기대-효과)
8. [API 명세](#api-명세)
9. [컴포넌트 구조](#컴포넌트-구조)
10. [설치 및 실행 방법과 사용예시](#설치-및-실행-방법과-사용예시)
11. [감사의 글](#감사의-글)

## 💸 프로젝트 소개
저희 팀 워크스페이스는 <a href="https://www.notion.so/b83ba20953634c2dbc6fb94ffafb2697?pvs=4"><img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white" style="width: 70px; height: auto; border-radius: 10px;"></a> 에서 확인할 수  있습니다.<br>
**빚이 없는 솔로**는 금융 문맹률이 높은 청년층을 위한 종합적인 금융자산 분석 비교 서비스입니다.

- **개발 기간**: 2024.09.05 ~ 2024.10.15
- **주요 기능**:
  - 개인 금융 자산 분석 및 시각화
  - 맞춤형 금융 상품 추천
  - 사용자 커뮤니티
  - 청년 정책 및 금융 뉴스 정보 제공
  - 금융 퀴즈를 통한 지식 학습

## 팀원 소개

| 이름 | 역할 | 담당 업무 |
|------|------|-----------|
| 김준영 | 조장, 백엔드 | 로그인, 게시판, 청년 정책, 금융 퀴즈, 금융 상품 |
| 강소라 | 프론트엔드 | 피그마 디자인, 전체 웹 디자인 |
| 서나연 | 백엔드 | 자산 관리, 포인트 관리, 대출 가이드, 금융 뉴스, 스웨거 UI |
| 심윤재 | 백엔드 | 금융 자산 분석/비교, 자산 코멘트, 상품 추천 |
| 오지현 | 프론트엔드 | 디자인 보조, 금융 퀴즈 기능 |

## 기술 스택

### Frontend
![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Pinia](https://img.shields.io/badge/pinia-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![Axios](https://img.shields.io/badge/axios-%23671ddf.svg?style=for-the-badge&logo=axios&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)

### Backend
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)

### Database
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Amazon EC2](https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=amazon-ec2&logoColor=white)

### 기타
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

## 프로젝트 구조

### 플로우 차트
![FlowChart](https://github.com/user-attachments/assets/5a045dca-8d6f-4f7d-8986-fe087a4a6abd)

```
프로젝트_루트/
├── frontend/
│   └── (Vue.js 관련 파일 및 폴더)
├── backend/
│   └── (Spring Framework 관련 파일 및 폴더)
└── database/
    └── (MySQL 관련 파일)
```

## 주요 기능

![메인 페이지](메인페이지_이미지_URL)

1. **로그인** (카카오 소셜 로그인)
   - 간편한 카카오 계정 연동 로그인

2. **금융 자산 분석**
   ![자산 분석](자산분석_이미지_URL)
   - 전체 자산 비중 분석 및 시각화
   - 사용자 간 자산 비교
   - 월별, 카테고리별 자산 추이 그래프

3. **대출 자산 분석**
   ![대출 분석](대출분석_이미지_URL)
   - 월별 상환금액 및 추이 그래프
   - 대출 기간별 이자 계산

4. **금융 상품 추천**
   ![상품 추천](상품추천_이미지_URL)
   - 사용자 맞춤형 금융 상품 추천

5. **사용자 커뮤니티**
   ![커뮤니티](커뮤니티_이미지_URL)
   - 자유로운 정보 공유 및 소통

6. **청년 정책 정보 제공**
   ![청년 정책](청년정책_이미지_URL)
   - 최신 청년 정책 정보 제공

7. **금융 뉴스 제공**
   ![금융 뉴스](금융뉴스_이미지_URL)
   - 실시간 금융 뉴스 업데이트

8. **금융 퀴즈**
   ![금융 퀴즈](금융퀴즈_이미지_URL)
   - 재미있는 금융 퀴즈로 지식 향상

9. **마이페이지**
   ![마이페이지](마이페이지_이미지_URL)
   - 개인화된 자산 관리 정보 제공


## 개발 기간 및 작업 관리

| 단계 | 기간 |
|------|------|
| 요구사항 분석 및 기획 | 2024.09.05 ~ 2024.09.07 |
| 데이터베이스 설계 및 구축 | 2024.09.09 ~ 2024.09.10 |
| API 설계 및 UI/UX 디자인 | 2024.09.11 ~ 2024.09.12 |
| 개발 환경 세팅 | 2024.09.12 |
| 백엔드 컨트롤러 테스트 | 2024.09.12 ~ 2024.09.18 |
| 기능 구현 | 2024.09.19 ~ 2024.09.27 |
| 기능 고도화 | 2024.09.28 ~ 2024.10.02 |
| 디자인 및 최종 테스트 | 2024.10.03 ~ 2024.10.11 |
| 포트폴리오 및 문서 작업 | 2024.10.12 ~ 2024.10.15 |

## 기대 효과

1. **사회초년생의 재정적 안정성 마련**
   - 자산 분석 비교 서비스를 통한 재정 안정성 향상
   - 맞춤형 금융 혜택 및 정책 정보 제공
   - 직관적인 대출 상환 정보 및 가이드 제공

2. **사회초년생의 금융 지식 확보**
   - 금융 퀴즈와 뉴스를 통한 경제 관념 형성
   - 시각적 자산 통계를 통한 현 금융 수준 파악
   - 커뮤니티를 통한 정보 공유 및 소통

## API 명세

![localhost_9000_swagger-ui html](https://github.com/user-attachments/assets/4e1beda9-7902-49f5-bff0-dab8b563a01b)

자세한 API 명세는 [API 명세서.pdf](https://github.com/user-attachments/files/17366139/API.pdf)를 참조해 주세요.

## 컴포넌트 구조


자세한 컴포넌트 구조는 [컴포넌트 설계](https://github.com/user-attachments/files/17365916/default.pdf)를 참조해 주세요.

## 설치 및 실행 방법과 사용예시

### 설치 및 실행 방법

1. 저장소 클론
   ```
   git clone [저장소 URL]
   ```

2. 프론트엔드 설정
   ```
   cd frontend
   npm install
   ```

3. 데이터베이스 설정
   - MySQL 설치 및 데이터베이스 생성
   - `application.properties` 파일에서 데이터베이스 연결 정보 설정

4. 애플리케이션 실행
   - 프론트엔드: `npm run serve`

### 사용 예시

1. 자산 분석
   ```
   사용자가 로그인 후 자산 페이지에 접속하면, 다음과 같은 정보를 볼 수 있습니다:
   - 현재 총 자산 금액과 자산 분포 차트
   - 지난 6개월간의 자산 변화 추이 그래프
   - 같은 연령대 사용자들과의 자산 비교 차트
   ```

2. 금융 상품 추천
   ```
   사용자의 자산 상태와 선호도를 바탕으로 맞춤형 금융 상품을 추천합니다:
   - 예: 단기 저축이 필요한 사용자에게는 높은 이율의 단기 예금 상품 추천
   - 예: 장기 투자를 원하는 사용자에게는 안정적인 수익률의 펀드 상품 추천
   ```

3. 커뮤니티 활동
   ```
   사용자들은 커뮤니티에서 다음과 같은 활동을 할 수 있습니다:
   - 자신의 자산 관리 팁을 공유하는 게시글 작성
   - 다른 사용자의 게시글에 댓글로 조언 제공
   - 유용한 정보를 담은 게시글에 '좋아요' 표시
   ```

## 감사의 글

이 프로젝트는 다음의 오픈소스 라이브러리들의 도움을 받아 제작되었습니다:

- [Vue.js](https://vuejs.org/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [Chart.js](https://www.chartjs.org/)

그리고 프로젝트 개발에 아낌없는 조언과 지원을 해주신 멘토님들께 깊은 감사를 드립니다.
