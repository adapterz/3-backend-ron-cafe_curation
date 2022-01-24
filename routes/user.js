const express = require('express');
const userRouter = express.Router();
const { body, validationResult, check } = require('express-validator');

const fakeUserDatabase = require('../fakeUserDatabase');

userRouter.get('/', function (req, res) {
    res.send('/user 잘 작동중!!!');
    return;
});

function validatorErrorCallback (req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        for (let error of errors.errors) {
            if (error.msg === "이미 등록되어 있는 사용자명입니다." || error.msg === "이미 등록되어 있는 아이디입니다.") {
                return res.status(409).send({"isExisted": true}); 
            }
        }

        return res.status(400).json({ errors: errors.array()});
    }
    next();
}

userRouter.post('/register', [
    check('username')
        .exists()
        .withMessage('반드시 입력해주시기 바랍니다.')
        .isLength({ min: 3, max: 16 })
        .withMessage('최소 3자 이상 최대 16자 이하로 입력해주세요.')
        .custom((value, { req }) => {
            for (let userInfo in fakeUserDatabase) {
                if (fakeUserDatabase[userInfo].username === value) {
                    throw new Error("이미 등록되어 있는 사용자명입니다.");
                }
            }
        }),
    check('id')
        .exists()
        .withMessage('반드시 입력해주시기 바랍니다.')
        .bail()
        .isEmail()
        .withMessage('example@example.com 의 이메일 형식으로 입력해주세요.')
        .custom((value, { req }) => {
            for (let userInfo in fakeUserDatabase) {
                if (fakeUserDatabase[userInfo].id === value) {
                    throw new Error("이미 등록되어 있는 아이디입니다.");
                }
            }
        }),
    check('password')
        .exists()
        .withMessage('반드시 입력해주시기 바랍니다.')
        .matches(/^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^*()\-_=+\\\|\[\]{};:\'",.<>\/?])*.{8,16}$/)
        .withMessage('숫자, 문자, 특수문자를 반드시 포함하여 최소 8자 이상 최대 16자 이하로 입력해주세요.'),
    body('passwordConfirmation')
        .custom((value, { req }) => {
            if (!value) {
                throw new Error('반드시 입력해주시기 바랍니다.');
            }
            if (value !== req.body.password) {
                throw new Error('앞서 입력하신 비밀번호와 일치하지 않습니다. 다시 입력해주세요.');
            }
        return true;
    }).bail(),
    check('tel')
        .exists()
        .withMessage('반드시 입력해주시기 바랍니다.')
        .matches(/^\d{3}[-]{1}\d{4}[-]{1}\d{4}$/)
        .withMessage('반드시 000-0000-0000 의 형식으로 입력해주세요.'),
    validatorErrorCallback
], function (req, res) {
    // POST 방식으로 넘어오는 파라미터를 담고 있음.
    const userInfo = req.body;

    res.status(201).json({success: true});
    console.log('회원가입 성공');
    return;
});

module.exports = userRouter;