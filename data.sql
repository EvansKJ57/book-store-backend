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


-- deliveries 테이블에 배송관련 정보 입력
INSERT INTO deliveries (address, receiver, contact)
VALUES ('서울시 중구', '기정', '010-4233-2311');

-- orders 테이블에 주문정보 입력
INSERT INTO orders (user_id, delivery_id)
VALUES ( 1, (SELECT max(id) FROM deliveries));

-- 주문상테 정보 입력
INSERT INTO order_details (order_id, book_id, qty)
VALUES ((SELECT max(id) FROM orders), 7, 1);

INSERT INTO order_details (order_id, book_id, qty)
VALUES (1, 9, 2);

SELECT max(id) FROM deliveries;

-- 카트에서 데이터 가져와서 orders에 방금 추가된 id 가져와서 carts테이블에 넣기
INSERT INTO order_details (order_id, book_id, qty)
SELECT "${insertOrders.insertId}", book_id, qty FROM carts
WHERE carts.id IN (${carts})

-- 결제된 장바구니 물품 삭제

DELETE FROM carts WHERE id IN (1,3,6);

-- 해당 유저의 주문 내역 전체 보기
SELECT 
orders.id, deliveries.address, orders.created_at, deliveries.receiver,books.id AS book_id, 
books.title, books.price, books.author, order_details.qty
FROM orders
LEFT JOIN deliveries
ON orders.delivery_id = deliveries.id
LEFT JOIN order_details
ON orders.id = order_details.order_id
LEFT JOIN books
ON books.id = order_details.book_id
WHERE orders.user_id = 2;