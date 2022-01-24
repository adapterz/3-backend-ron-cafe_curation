const express = require('express');

const userRouter = require('./routes/user');


// express 인스턴스 생성
const app = express();
const PORT = 3000;
// json request body 파싱
app.use(express.json());

app.use('/user',userRouter);

// GET method route
// respond with "Hello World!" when a GET request is made to the hompage
app.get('/', function (req, res) {
    res.send('Hello World!');
    res.end();
    console.log('it is not end');
});

app.get('/user/:name', function (req, res) {
    console.log(req.params);
});

app.get('/search', function (req,res) {
    console.log(req.query);
    res.send(req.query);
})
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

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});