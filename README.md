# oh_server

## E-R Diagram

![E-R Diagram](https://github.com/MyNameIsTaeYeong/oh_server/blob/main/ER%20Diagram.drawio.png)

## Table

```
CREATE TABLE Users (
    id INT AUTO_INCREMENT NOT NULL,
    email varchar(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Records (
    id INT AUTO_INCREMENT NOT NULL,
    recordName varchar(20) NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(userId)
    REFERENCES users(id)
);

CREATE TABLE Occurrences (
    id INT AUTO_INCREMENT NOT NULL,
    recordValue INT NOT NULL,
    recordDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    recordId INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(recordId)
    REFERENCES records(id)
);
```
