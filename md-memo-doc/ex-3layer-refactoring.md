# 3 layer 분리 전 코드

## orderController

```javascript
const postOrder = async (req, res, next) => {
  try {
    const { carts, delivery, userId } = req.body;

    // deliveries 테이블에 넣기
    let sql = `INSERT INTO deliveries (address, receiver, contact)
        VALUES ("${delivery.address}", "${delivery.receiver}", "${delivery.contact}")`;

    const [insertDeliveries] = await mariadb.query(sql);
    // console.log(insertDeliveries.insertId);

    // 방금 생성된 deliveries의 id 갖고 orders 테이블에 넣기
    sql = `INSERT INTO orders (user_id, delivery_id)
        VALUES ("${userId}", "${insertDeliveries.insertId}");`;

    const [insertOrders] = await mariadb.query(sql);
    // console.log(insertOrders.insertId);

    //장바구니 id로 장바구니 테이블 정보 가져와서 그 데이터와 order의 id를 order_details 테이블에 넣기
    sql = `INSERT INTO order_details (order_id, book_id, qty)
      SELECT "${insertOrders.insertId}", book_id, qty FROM carts
      WHERE carts.id IN (${carts})`;

    const [insertOrderDetails] = await mariadb.query(sql);
    // console.log(insertDeliveries);

    //주문된 카트 물품들을 삭제하는 로직
    sql = `DELETE FROM carts WHERE id IN (${carts})`;
    await mariadb.query(sql);

    res.status(StatusCodes.OK).json({ orderId: insertOrders.insertId });
  } catch (error) {
    next(
      new CustomError(
        '주문 처리 오류',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      )
    );
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { userId } = req.body;
    let sql = `SELECT 
      orders.id, deliveries.address, orders.created_at, deliveries.receiver,books.id AS book_id,
      books.title, books.price, books.author, order_details.qty
      FROM orders
      LEFT JOIN deliveries
      ON orders.delivery_id = deliveries.id
      LEFT JOIN order_details
      ON orders.id = order_details.order_id
      LEFT JOIN books
      ON books.id = order_details.book_id
      WHERE orders.user_id = "${userId}";`;

    const [queryData] = await mariadb.query(sql);
    // console.log(results);

    const dataMap = {};
    queryData.forEach((order) => {
      if (!dataMap[order.id]) {
        dataMap[order.id] = {
          orderId: order.id,
          address: order.address,
          created_at: order.created_at,
          receiver: order.receiver,
          totalPrice: order.price * order.qty,
          totalQty: order.qty,
          orderedBooks: [
            {
              id: order.book_id,
              title: order.title,
              price: order.price,
              author: order.author,
              qty: order.qty,
            },
          ],
        };
      } else {
        dataMap[order.id].orderedBooks.push({
          id: order.book_id,
          title: order.title,
          price: order.price,
          author: order.author,
          qty: order.qty,
        });
        dataMap[order.id].totalPrice += order.price * order.qty;
        dataMap[order.id].totalQty += order.qty;
      }
    });

    const results = Object.values(dataMap);

    res.status(200).json(results);
  } catch (error) {
    next(
      new CustomError(
        '주문 목록 불러오기 실패',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      )
    );
  }
};
```

## cartsController

```javascript
onst getCarts = async (req, res, next) => {
  try {
    const { userId, selectedItems } = req.body;

    let sql = `SELECT
      carts.id AS cart_id, books.id, books.title, books.summary, books.price, carts.qty
      FROM carts
      LEFT JOIN books ON carts.book_id = books.id`;
    const conditions = [`user_id = "${userId}"`];

    //선택한 카트 아이템이 있는 경우
    if (selectedItems) {
      conditions.push(` carts.id IN (${selectedItems})`);
    }
    // sql문 조건 취합해서 추가하기
    if (conditions) {
      const condition = conditions.join(' AND ');
      sql += ` WHERE ${condition}`;
    }

    const [results] = await mariadb.query(sql);
    if (results.length === 0) {
      return next(
        new CustomError('카트에 담긴 도서 없음', StatusCodes.NOT_FOUND)
      );
    }
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};
```
