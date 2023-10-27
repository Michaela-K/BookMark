const express = require('express');
const router = express.Router();
const { getOneUser, updateUserProfile } = require('../db/queries/users');
const { getMyResources } = require('../db/queries/resources');

router.get('/:id/my-resources', (req, res) => {
  const userId = req.params.id;

  getMyResources(userId)
    .then(resources => {

      const templateVars = {
        userId,
        resources
      };
      res.render('my-resources', templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });

});

router.get('/:id/edit', (req, res) => {
  const userId = req.params.id;
  getOneUser(userId)
    .then(user => {
      const templateVars = {
        userId,
        user
      };
      res.render('users-edit', templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get('/:id', (req, res) => {
  const userId = req.params.id;

  getOneUser(userId)
    .then(user => {
      const templateVars = {
        userId,
        user
      };
      res.render('users-show', templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });

});

router.post('/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = req.body;

  updateUserProfile(userId, user)
    .then(user => {
      res.redirect(`/users/${userId}`);
    })
    .catch(err => {
      console.log({ error: err.message });
    });

});

module.exports = router;
