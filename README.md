# oh_server

# π μκ°

ν­μμ μμΈμ μ°ΎκΈ° μν΄ κΈ°λ‘νκ³  ν΅κ³ λ΄λ μ νλ¦¬μΌμ΄μ.

[PlayStoreμμ λ€μ΄λ‘λνκΈ°](https://play.google.com/store/apps/details?id=com.oh)

# π μ¬μ©κΈ°μ 

- NodeJS
- Express
- MySql
- jest
- supertest
- AWS EC2
- AWS Elastic cache (Redis)
- AWS RDS

# π μν€νμ²

![μν€νμ²](./%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98.png)

# π E-R Diagram

![E-R Diagram](https://github.com/MyNameIsTaeYeong/oh_server/blob/main/ERdiagram.png)

# π Table

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

# π API : [Link](https://documenter.getpostman.com/view/5013120/UyrGAtod)

# π νλ‘μ νΈ κ³Όμ  : [Link](https://velog.io/@imtaebari/series/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8)

- DB νμ΄λΈ 3μ κ·νκΉμ§ μ§ν.
- jwtλ₯Ό μ¬μ©νμ¬ μΈκ° κ΅¬ν.
- 100λͺμ΄ λμμ μ’μμ λλ₯Έ κ²½μ° λμμ± μ²λ¦¬

  - μ²« λ²μ§Έ μλ : mysql FOR UPDATEλ₯Ό μ΄μ©νμ¬ νΈλμ­μ λμ νμ μ½κΈ° μ°μ° λκΈ°.
  - λ λ²μ§Έ μλ : DB λΆν κ°μ, λΉ λ₯Έ μλ΅μ μν΄ redisλ₯Ό μ¬μ©νμ¬ κ΅¬ν.
  - [μ½λ](https://github.com/MyNameIsTaeYeong/oh_server/blob/main/services/ShareTagService.js#L47)

- μμ  λ° νμ₯μ΄ λΆνΈν λͺλ Ήν μ½λμμ Controller, Service, Repository κ³μΈ΅μΌλ‘ λΆλ¦¬.
- DI μ μ©.

  - κ³μΈ΅ κ° κ²°ν©λλ₯Ό λ?μΆκΈ° μν¨.
  - μΈλΆμμ μνλ νλ‘μ°λ₯Ό μ£Όμνμ¬ νμ€νΈκ° μ½λλ‘ νκΈ° μν¨.

- nginx λμ
  - https μ€μ .
