# oh_server

# E-R Diagram

![E-R Diagram](https://github.com/MyNameIsTaeYeong/oh_server/blob/main/ERdiagram.png)

# Table

```
CREATE TABLE Users (
    id INT AUTO_INCREMENT NOT NULL,
    email varchar(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Emotions (
	id INT AUTO_INCREMENT NOT NULL,
    name varchar(20) NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY(id),
	FOREIGN KEY(userId) REFERENCES users(id)
);

CREATE TABLE Activities (
	id INT AUTO_INCREMENT NOT NULL,
    name varchar(20) NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY(id),
	FOREIGN KEY(userId) REFERENCES users(id)
);

CREATE TABLE EmoOccurrences (
	id INT AUTO_INCREMENT NOT NULL,
    emotionName varchar(20) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    userId INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(userId) REFERENCES users(id)
);

CREATE TABLE ActOccurrences (
	id INT AUTO_INCREMENT NOT NULL,
    activityName varchar(20) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    userId INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(userId) REFERENCES users(id)
);


```

# INDEX

# API

- **GET** /users/{id} : id에 해당하는 유저조회.
- **GET** /emotions/{userId} : 감정 조회.
- **GET** /activities/{userId} : 활동 조회.
- **GET** /emooccurrences/{userId} : 감정 기록 조회.
- **GET** /actoccurrences/{userId} : 활동 기록 조회.
- **POST** /users : 유저 생성.
- **POST** /emotions : 감정 생성.
- **POST** /activities : 활동 생성.
- **POST** /emooccurrences : 감정 기록.
- **POST** /actoccurrences : 활동 기록.
- **POST** /EmoOccurrences/{userId}/ActOccurrences : 감정과 활동의 관계보기.
- **DELETE** /emotions/{id} : 감정 삭제.
- **DELETE** /activities/{id} : 활동 삭제.
- **DELETE** /emooccurrences/{id} : 감정 기록 삭제.
- **DELETE** /actoccurrences/{id} : 활동 기록 삭제.

# 문제점

- 보안
  - serverURL/Users/{숫자아이디}만으로 유저의 정보가 노출됨

# ToDo
