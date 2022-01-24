const express = require('express');

const userRouter = express.Router();
const { body, validationResult, check } = require('express-validator');

const fakeUserDatabase = require('../fakeUserDatabase');

userRouter.get('/', function (req, res) {
  res.send('/user 잘 작동중!!!');
});

// 에러 핸들링은 여기서
function registerValidatorErrorCallback(req, res, next) {
  const result = validationResult(req);
  const hasErrors = !result.isEmpty();
  if (hasErrors) {
    for (const error of result.errors) {
      if (
        error.msg === '이미 등록되어 있는 사용자명입니다.' ||
        error.msg === '이미 등록되어 있는 아이디입니다.'
      ) {
        return res.status(409).send({ isExisted: true });
      }
    }
    throw new Error(result.array()[0].msg);
  } else {
    return next();
  }
}

userRouter.post(
  '/register',
  [
    check('username')
      .exists({ checkFalsy: true })
      .withMessage('반드시 입력해주시기 바랍니다.')
      .isLength({ min: 3, max: 16 })
      .withMessage('최소 3자 이상 최대 16자 이하로 입력해주세요.')
      .custom((value, { req }) => {
        for (const userInfo in fakeUserDatabase) {
          if (fakeUserDatabase[userInfo].username === value) {
            throw new Error('이미 등록되어 있는 사용자명입니다.');
          } else {
            continue;
          }
        }
        return true;
      })
      .bail(),
    check('id')
      .exists({ checkFalsy: true })
      .withMessage('반드시 입력해주시기 바랍니다.')
      .isEmail()
      .withMessage('example@example.com 의 이메일 형식으로 입력해주세요.')
      .custom((value, { req }) => {
        for (const userInfo in fakeUserDatabase) {
          if (fakeUserDatabase[userInfo].id === value) {
            throw new Error('이미 등록되어 있는 아이디입니다.');
          } else {
            continue;
          }
        }
        return true;
      })
      .bail(),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('반드시 입력해주시기 바랍니다.')
      .matches(
        /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^*()\-_=+\\\|\[\]{};:\'",.<>\/?])*.{8,16}$/,
      )
      .bail()
      .withMessage(
        '숫자, 문자, 특수문자를 반드시 포함하여 최소 8자 이상 최대 16자 이하로 입력해주세요.',
      ),
    body('passwordConfirmation')
      .custom((value, { req }) => {
        if (!value) {
          throw new Error('반드시 입력해주시기 바랍니다.');
        }
        if (value !== req.body.password) {
          throw new Error(
            '앞서 입력하신 비밀번호와 일치하지 않습니다. 다시 입력해주세요.',
          );
        }
        return true;
      })
      .bail(),
    check('tel')
      .exists({ checkFalsy: true })
      .withMessage('반드시 입력해주시기 바랍니다.')
      .matches(/^\d{3}[-]{1}\d{4}[-]{1}\d{4}$/)
      .withMessage('반드시 000-0000-0000 의 형식으로 입력해주세요.'),
    registerValidatorErrorCallback,
  ],
  function (req, res) {
    // POST 방식으로 넘어오는 파라미터를 담고 있음.
    const newUserInfo = req.body;
    fakeUserDatabase.push(newUserInfo);
    res.status(201).json({ success: true });
    console.log('회원가입 성공');
  },
);

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
