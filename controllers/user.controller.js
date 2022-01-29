const User = require('../models/user');
const bcrypt = require('bcrypt');

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
exports.login = function (req, res) {
  const emailValue = req.body.email;
  const passwordValue = req.body.password;
  let userInfo;
  User.findByEmail(emailValue, function (err, user) {
    if (!user.length) {
      // user 가 존재하지 않으면
      return res
        .status(400)
        .send({ message: '해당 이메일은 등록되어 있지 않습니다.' });
    } else {
      userInfo = user[0];
      // 비밀번호 일치 여부 검사
      const check = bcrypt.compareSync(passwordValue, userInfo.password);

      if (isRight) {
        console.log('로그인 성공');
        // 로그인 성공 후 메인 페이지로 이동
        res.status(200).redirect('/');
      } else {
        res.status(400).send({
          message:
            '비밀번호를 잘못 입력하셨습니다. 다시 입력해주시기 바랍니다.',
        });
      }
    }
  });
};
