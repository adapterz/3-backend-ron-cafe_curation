const express = require('express');
const morgan = require('morgan');
const path = require('path');
const userRouter = require('./routes/user');

// express 인스턴스 생성
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(
  // 요청, 응답에 대한 좀 더 디테일한 로그 출력
  morgan('dev'),
  // json request body 파싱
  express.json(),
  // 요청 경로의 querystring 해석
  express.urlencoded({ extended: false }),
);

app.use('/user', userRouter);

// GET method route
// respond with "Hello World!" when a GET request is made to the hompage
app.get('/', function (req, res) {
  res.send('Hello World!');
  console.log('it is not end');
});

app.get('/user/:name', function (req, res) {
  console.log(req.params);
});

app.get('/search', function (req, res) {
  console.log(req.query);
  res.send(req.query);
});
// POST method route
// 애플리케이션의 홈페이지인 루트 라우트(/) 에서 POST 요청에 응답:
app.post('/', function (req, res) {
  res.send('Got a POST request');
});
// PUT method route
// /user 라우트에 대한 PUT 요청에 응답:
app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user');
});
// DELETE method route
// /user 라우트에 대한 DELETE 요청에 응답:
app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user');
});

app.listen(app.get('port'), () => {
  console.log(`Example app listening at http://localhost:${app.get('port')}`);
});
