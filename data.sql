INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("어린왕자들", "종이책", 0, "어리다..", "많이 어리다..", "김어림", 100, "목차입니다.", 20000, "2019-01-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("신데렐라들", "종이책", 1, "유리구두..", "투명한 유리구두..", "김구두", 100, "목차입니다.", 20000, "2023-12-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("백설공주들", "종이책", 2, "사과..", "빨간 사과..", "김사과", 100, "목차입니다.", 20000, "2023-11-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("흥부와 놀부들", "종이책", 3, "제비..", "까만 제비..", "김제비", 100, "목차입니다.", 20000, "2023-12-08");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("콩쥐 팥쥐", 4, 0, "ebook", 4, "콩팥..", "콩심은데 콩나고..", "김콩팥", 100, "목차입니다.", 20000, "2023-12-07");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("용궁에 간 토끼", 5, 1, "종이책", 5, "깡충..", "용왕님 하이..", "김거북", 100, "목차입니다.", 20000, "2023-10-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("해님달님", 15, 2, "ebook", 6, "동앗줄..", "황금 동앗줄..!", "김해님", 100, "목차입니다.", 20000, "2023-07-16");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("장화홍련전", 80, 0, "ebook", 7, "기억이 안나요..", "장화와 홍련이?..", "김장화", 100, "목차입니다.", 20000, "2023-03-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("견우와 직녀", 8, 1, "ebook", 8, "오작교!!", "칠월 칠석!!", "김다리", 100, "목차입니다.", 20000, "2023-02-01");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("효녀 심청", 12, 0, "종이책", 9, "심청아..", "공양미 삼백석..", "김심청", 100, "목차입니다.", 20000, "2023-01-15");

INSERT INTO books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("혹부리 영감", 22, 2, "ebook", 10, "노래 주머니..", "혹 두개 되버림..", "김영감", 100, "목차입니다.", 20000, "2023-06-05");


SELECT * FROM books LEFT JOIN  categories ON books.category_id = categories.id WHERE categories.id = 0;

SELECT * FROM books WHERE pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 30 DAY) AND NOW();

-- 도서 상세정보 쿼리
SELECT *,
(SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
(SELECT EXISTS(SELECT * FROM likes WHERE user_id = 1 AND liked_book_id = 10)) AS liked 
FROM books
LEFT JOIN categories
ON books.category_id = categories.category_id
WHERE books.id = 10;

SELECT * FROM books LEFT JOIN  categories ON books.category_id = categories.id
WHERE pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 30 DAY) AND NOW() AND category_id = 0;

-- 유저아이디 = 1 의 도서 아이디= 10을 좋아요했는지 여부 포함해서 도서 정보 쿼리하기
SELECT *,
(SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
(SELECT EXISTS(SELECT * FROM likes WHERE user_id = 1 AND liked_book_id = 10)) AS liked 
FROM books
LEFT JOIN categories
ON books.category_id = categories.category_id
WHERE books.id = 10;

INSERT INTO likes (user_id, liked_book_id) VALUES (1,10)

DELETE FROM likes WHERE user_id = 5 AND liked_book_id = 10

-- carts 테이블 관련 sql

INSERT INTO carts (user_id, book_id, qty) VALUES (1, 13, 1);

SELECT * FROM books LEFT JOIN carts ON carts.book_id = books.id WHERE user_id = 1;

DELETE FROM carts WHERE id = 9;