const express = require('express');

const userRouter = express.Router();
const { body, validationResult, check } = require('express-validator');

const fakeUserDatabase = require('../fakeUserDatabase');
const userRegisterValidate = require('../validator/userRegisterValidate');
const { userCreation } = require('../controllers/userController');

userRouter.get('/', function (req, res) {
  res.send('/user 잘 작동중!!!');
});

userRouter.post('/register', [userRegisterValidate], userCreation);

// 에러 핸들링은 여기서
function loginValidatorErrorCallback(req, res, next) {
  const result = validationResult(req);
  const hasErrors = !result.isEmpty();
  if (hasErrors) {
    throw new Error(result.array()[0].msg);
  }
  return next();
}

userRouter.post(
  '/login',
  [
    check('id', '아이디를 입력해 주세요.').exists({ checkFalsy: true }),
    check('password', '비밀번호를 입력해 주세요.').exists({ checkFalsy: true }),
    loginValidatorErrorCallback,
  ],
  function (req, res) {
    // req.body = {id: "", password: ""}
    const loginUser = req.body;
    fakeUserDatabase.forEach(userInfo => {
      const isIdSame = userInfo.id === loginUser.id;
      const isPasswordSame = userInfo.password == loginUser.password;

      if (!isIdSame || !isPasswordSame) {
        res.status(401).json({
          success: false,
          message:
            '등록되지 않은 아이디이거나 아이디 또는 비밀번호를 잘못 입력하셨습니다..',
        });
        return false;
      }
      if (isIdSame && isPasswordSame) {
        res.status(200).json({ success: true });
        return false;
      }
    });
    console.log('로그인 성공');
  },
);

// validation check 에 대한 Error 핸들링
userRouter.use(function (err, req, res, next) {
  console.error(err);
  console.log('error handling here');
  res.status(400).json({ error: true });
});

module.exports = userRouter;
