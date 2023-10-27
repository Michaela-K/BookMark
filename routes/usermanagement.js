const express = require('express');
const router = express.Router();

router.get('/:id', (req,res) =>{
  req.session.user_id = req.params.id;
  res.redirect('/resources')
})

router.post('/logout', (req,res) =>{
  req.session = null;
  res.redirect('/resources')
})

module.exports = router;
