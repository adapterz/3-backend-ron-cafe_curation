const express = require('express');
const app = express();
const router = express.Router();

const PORT = 3000;

router.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next router
  if (req.params.id == 0) next('route');
  // otherwise pass control to the next middleware function in this stack
  else next(); //
}, function (req, res, next) {
  // render a regular page
  res.send('regular');
});

// handler for the /user/:id path, which renders a special page
router.get('/user/:id', function (req, res, next) {
  console.log(req.params.id);
  res.send('special');
});

// mount the router on the app
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
