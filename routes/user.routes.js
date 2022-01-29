const express = require('express');

const userRouter = express.Router();
const userRegisterValidate = require('../middlewares/userRegisterValidate');
const UserController = require('../controllers/user.controller');
const { validateCallback } = require('../middlewares/validateCallback');
const { passwordEncryption } = require('../middlewares/passwordEncryption');
const userLoginValidate = require('../middlewares/userLoginValidate');

// 사용자 정보 조회
userRouter.get('/', UserController.findAll);
userRouter.get('/:value', UserController.findByValue);
// 사용자 회원가입
userRouter.post(
  '/register',
  [userRegisterValidate, validateCallback, passwordEncryption], // 입력 값 유효성 검사 및 비밀번호 암호화
  UserController.create,
);
// 사용자 로그인
userRouter.post(
  '/login',
  [userLoginValidate, validateCallback], // 입력 값 유효성 검사
  UserController.login,
);

module.exports = userRouter;
