# oh_server

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
