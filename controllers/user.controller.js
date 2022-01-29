const User = require('../models/user');

// 사용자 정보 조회
exports.findAll = function (req, res) {
  User.findAll(function (err, user) {
    if (err) res.status(400).send(err);
    res.status(200).send(user);
  });
};
exports.findByValue = function (req, res) {
  let value = req.params.value;
  const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/; // 이메일 형식 유효성 검사
  if (emailRegex.test(value)) {
    // path variable 이 이메일 형식이면
    User.findByEmail(value, function (err, user) {
      if (err) res.status(400).send(err);
      res.status(200).send(user);
    });
  } else {
    // path variable 이 그냥 문자열 형식이면
    User.findByName(value, function (err, user) {
      if (err) res.status(400).send(err);
      res.status(200).send(user);
    });
  }
};
exports.create = function (req, res) {
  // 사용자 객체 생성
  const newUser = new User(req.body);
  // 데이터베이스에 사용자 정보 저장
  User.create(newUser, function (err, user) {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(201).json({
      data: user,
    });
  });
  console.log('회원가입 성공');
};
