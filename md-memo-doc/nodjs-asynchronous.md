# node js 비동기

Node.js는 비동기 이벤트 주도 JavaScript 런타임이며, **논 블로킹 I/O** 모델을 사용하여 여러 I/O 작업을 동시에 처리할 수 있다.

    논 블로킹 I/O :  Node.js에서 실행 중인 자바스크립트 코드가 I/O 작업을 기다리지 않고 즉시 다음 코드로 넘어갈 수 있게 하는 방식이다. 이는 I/O 작업이 완료되기를 기다리는 동안에도 다른 작업을 동시에 수행할 수 있게 해서 애플리케이션의 효율성과 반응성을 향상시킨다.

## 비동기 처리 방식

순서를 무시하고 처리 가능한 작업을 먼저 처리하며, 오래 걸리는 작업은 이벤트 루프와 콜백 함수를 사용하여 나중에 처리한다.

### 비동기 발생

코드 실행 중 기다림이 필요할 때, 예를 들어 `setTimeout()`, `setInterval()`, 또는 데이터베이스 쿼리 같은 함수가 호출된다.

### 비동기 처리 방법

1. **콜백 함수**: 특정 작업 완료 후 실행될 함수를 매개변수로 전달.
2. **Promise (resolve, reject) 및 then & catch**: 작업 성공 여부에 따라 `resolve` 또는 `reject` 함수를 호출.
3. **Async/Await**: ES2017에서 도입된, 프로미스를 사용하기 더 쉬운 문법.

### Promise

#### Promise basic

```javascript
// 프로미스 매개변수 : 함수(resolve, reject)
// 일을 다 하면 무조건 콜백함수 resolve() or reject() 둘 중 하나를 호출
let promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('완료'), 3000);
});

promise
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {});
```

#### Promise chaining

```javascript
let promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('완료'), 3000);
})
  .then(
    (result) => {
      console.log(result);
      return result + '1111';
    },
    (error) => {}
  )
  .then(
    (result) => {
      console.log(result);
      return result + '22222';
    },
    (error) => {}
  )
  .then(
    (result) => {
      console.log(result);
    },
    (error) => {}
  );
```

### async / await

프로미스 객체를 좀 더 쉽고 편하게 사용하기 위한 문법

#### 1. 첫 번째 기능

async 함수는 항상 프로미스 객체를 반환한다.
반환 값이 프로미스가 아닌 경우 자동으로 Promise.resolve()로 감싸서 반환한다.

```javascript
async function func() {
  return 7; //Promise 객체를 반환 중
}

func().then((result) => {
  console.log('promise resolve : ', result)
  },
    (error) => {
      console.log('promise reject : ', error);
    };
);
```

#### 2. 두 번째 기능

await 키워드는 프로미스가 완료될 때까지 함수의 실행을 일시 중지한다.

```javascript
async function f() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('완료'), 3000);
  });
  let result = await promise;
  //promise 객체가 일 다 할 떄까지 기다려줌.

  console.log(result);
}

f();
```
