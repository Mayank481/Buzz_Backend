const router = require('express').Router();
const user = require('../controllers/user.controller');
const bodyCleanup = require('../middlewares/bodyCleanup');

router.get('/', user.getAll);
router.get('/:id', user.getUser);
router.get('/sendRequest/:id', user.sendRequest);
router.get('/confirmRequest/:id', user.confirmRequest);
router.get('/deleteRequest/:id', user.deleteOrCancelRequest);
router.post('/updateUser/:id', bodyCleanup, user.updateProfile);
router.get('/friends/suggestions', user.suggestUsers);

module.exports = router;
