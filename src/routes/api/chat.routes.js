import express from 'express';
import checkUser from '../../middlewares/checkUser';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('chat.html', { user: req.user });
});


export default router;
