const { validationResult } = require('express-validator');

function userCreation(req, res) {
  try {
    // validate the data to be submitted
    const result = validationResult(req);
    const hasErrors = !result.isEmpty();

    if (hasErrors) {
      for (const error of result.errors) {
        if (
          error.msg === '이미 등록되어 있는 사용자명입니다.' ||
          error.msg === '이미 등록되어 있는 아이디입니다.'
        ) {
          return res
            .status(409)
            .json({ message: 'Already Existed', isExisted: true });
        }
      }
      return res.status(400).json({
        fieldName: result.array(0).param,
        message: result.array()[0].msg,
      });
    } else {
      // POST 방식으로 넘어오는 파라미터를 담고 있음.
      const newUserInfo = req.body;
      fakeUserDatabase.push(newUserInfo);
      console.log('회원가입 성공');
      return res.status(201);
    }
  } catch (error) {
    return res.status(400).json({ message: 'Failed', error: error });
  }
}

exports.userCreation = userCreation;
