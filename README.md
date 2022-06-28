# oh_server

# 📌 소개

폭식의 원인을 찾기 위해 기록하고 통계 내는 애플리케이션.

[PlayStore에서 다운로드하기](https://play.google.com/store/apps/details?id=com.oh)

# 📌 사용기술

- NodeJS
- Express
- MySql
- jest
- supertest
- AWS EC2
- AWS Elastic cache (Redis)
- AWS RDS

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

# 📌 API : [Link](https://documenter.getpostman.com/view/5013120/UyrGAtod)

# 📌 프로젝트 과정 : [Link](https://velog.io/@imtaebari/series/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8)

- DB 테이블 3정규화까지 진행.
- jwt를 사용하여 인가 구현.
- 100명이 동시에 좋아요 누른 경우 동시성 처리

  - 첫 번째 시도 : mysql FOR UPDATE를 이용하여 트랜잭션 동안 행의 읽기 연산 대기.
  - 두 번째 시도 : DB 부하 감소, 빠른 응답을 위해 redis를 사용하여 구현.
  - [코드](https://github.com/MyNameIsTaeYeong/oh_server/blob/main/services/ShareTagService.js#L47)

- 수정 및 확장이 불편한 명령형 코드에서 Controller, Service, Repository 계층으로 분리.
- DI 적용.

  - 계층 간 결합도를 낮추기 위함.
  - 외부에서 원하는 플로우를 주입하여 테스트가 쉽도록 하기 위함.

- nginx 도입
  - https 설정.
