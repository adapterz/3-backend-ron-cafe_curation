const express = require('express');

const userRouter = express.Router();
const userRegisterValidate = require('../middlewares/userRegisterValidate');
const UserController = require('../controllers/user.controller');
const { validateCallback } = require('../middlewares/validateCallback');
const { passwordEncryption } = require('../middlewares/passwordEncryption');
const userLoginValidate = require('../middlewares/userLoginValidate');
const { upload, uploadCallback } = require('../middlewares/userProfileUpload');

// 사용자 정보 조회
userRouter.get('/', UserController.findAll);
userRouter.get('/:value', UserController.findByValue);
// 사용자 회원가입
userRouter.post(
  '/register',
  [upload.single('profile'), uploadCallback], // 이미지 파일 서버 폴더 업로드 및 파일 경로 req 객체에 추가
  [userRegisterValidate, validateCallback], // 입력 값 유효성 검사 및 비밀번호 암호화
  passwordEncryption, // 비밀번호 암호화
  UserController.create,
);
// 사용자 로그인
userRouter.post(
  '/login',
  [userLoginValidate, validateCallback], // 입력 값 유효성 검사
  UserController.login,
);
// 회원가입 시 이메일 인증
userRouter.post('/auth/email', UserController.authEmail);

module.exports = userRouter;
