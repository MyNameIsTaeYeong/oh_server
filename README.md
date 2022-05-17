# oh_server

# 📌 소개

폭식의 원인을 찾기 위해 기록하고 통계 내는 애플리케이션.

[PlayStore에서 다운로드하기](https://play.google.com/store/apps/details?id=com.oh)

# 📌 기술스택

- Express
- MySql
- AWS EC2
- jest
- supertest

# 📌 아키텍처

![아키텍처](./%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98.png)

# 📌 E-R Diagram

![E-R Diagram](https://github.com/MyNameIsTaeYeong/oh_server/blob/main/ERdiagram.png)

# 📌 Table

```
CREATE TABLE Users (
    id INT AUTO_INCREMENT NOT NULL,
    email varchar(30)  UNIQUE NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Emotions (
    id INT AUTO_INCREMENT NOT NULL,
    name varchar(20) NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Activities (
    id INT AUTO_INCREMENT NOT NULL,
    name varchar(20) NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE
);



CREATE TABLE EmoOccurrences (
    id INT AUTO_INCREMENT NOT NULL,
    emotionName varchar(20) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    userId INT NOT NULL,
    recordId INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(userId) REFERENCES Users(id),
    FOREIGN KEY(recordId) REFERENCES Emotions(id) ON DELETE CASCADE
);

CREATE TABLE ActOccurrences (
    id INT AUTO_INCREMENT NOT NULL,
    activityName varchar(20) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    userId INT NOT NULL,
    recordId INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(userId) REFERENCES Users(id),
    FOREIGN KEY(recordId) REFERENCES Activities(id) ON DELETE CASCADE
);

CREATE TABLE RefreshTokens (
    userId INT NOT NUll,
    refreshToken char(255) NOT NULL,
    PRIMARY KEY(userId),
    FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE ShareTags (
	id INT AUTO_INCREMENT NOT NULL,
    content varchar(255) NOT NULL,
    likeCnt INT DEFAULT 0,
    userId INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(userId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Likes (
	userId INT NOT NULL,
	tagId INT NOT NULL,
    PRIMARY KEY(userId, tagId),
	FOREIGN KEY(userId) REFERENCES Users(id),
    FOREIGN KEY(tagId) REFERENCES ShareTags(id) ON DELETE CASCADE
);
```

# 📌 [API](https://documenter.getpostman.com/view/5013120/UyrGAtod)

# 📌 [프로젝트 과정](https://velog.io/@imtaebari/series/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8)

- DB 테이블 3정규화까지 진행.
- jwt를 사용하여 인가 구현
- 좋아요 동시성 처리
  - mysql FOR UPDATE를 이용하여 트랜잭션동안 행의 읽기연산 대기.
  - jmeter를 통한 기능 검증.
- 기존에 저장소 mock 테스트를 실제 저장소 test로 변환.
- 서버의 응답속도 향상, 데이터 베이스의 부하 감소를 위해 redis 캐시 서버 추가.
  - 캐싱 전략
    - 변경에 크게 영향받지 않는 데이터 : lazyLoading, 데이터 일관성을 개선하기 위해 캐시 데이터에 TTL 설정.
    - 일관성이 중요한 데이터 : write through, lazyLoading 캐시 메모리 관리를 위해 캐시 데이터에 TTL 설정.
- 데이터 베이스의 부하 감소를 위해 aws rds를 사용하여 DB 복제
  - master : 쓰기 요청 전담
  - slave : 읽기 요청 전담
- nginx 도입
  - 부하분산을 위한 로드밸런서 역할.
  - https 설정.
