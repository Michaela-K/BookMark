const express = require('express');
const router = express.Router();
const { getOneUser, updateUserProfile } = require('../db/queries/users');
const { getMyResources, getAllResourcesAUserLiked } = require('../db/queries/resources');

//GET - my-resouces
router.get('/:id/my-resources', (req, res) => {
  const userId = req.params.id;

  const getMyResourcesPromise = getMyResources(userId);
  const getAllResourcesAUserLikedPromise = getAllResourcesAUserLiked(userId);


  Promise.all([getMyResourcesPromise, getAllResourcesAUserLikedPromise])
    .then(([myResources, likedResources]) => {
      let allMyResources = myResources.concat(likedResources);

      // Filter out resources with the same ID ensuring that only unique resources remain in the uniqueResources array
      const uniqueResources = allMyResources.filter(
        //Three parameters(curr element, index of curr el, self: The array on which the filter method was applied)
        (resource, index, self) =>
          index ===
          self.findIndex((r) => r.id === resource.id)
          //findIndex -searches for the first occurrence of an el with the same ID as the current el
          //If the two indexes match, the callback function returns true, indicating that the current element should be included in the resulting uniqueResources array.
      );

      const templateVars = {
        userId,
        uniqueResources
      };
      res.render('my-resources', templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });

});

//GET - edit a user page
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

//GET - see user profile
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

// POST - update user profile
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
