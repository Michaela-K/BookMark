const express = require('express');
const { getAllResources, getResourceDetails, insertNewResource, searchBarResources, updateResource, insertRating, addComment, increaseLikes, decreaseLikes, getAllCategories, getAllFromCategories, deleteResource, insertNewCategory } = require('../db/queries/resources');
const { getOneUser } = require('../db/queries/users');
const router = express.Router();

//resources/categories - Show all categories
router.get('/categories', (req, res) => {
  const userId = req.session.user_id;

  const sortArrayOfObjects = (arrOfObjs, key) => {
    return arrOfObjs.sort((a, b) => {
      const itemA = a[key].toLowerCase();
      const itemB = b[key].toLowerCase();
      if (itemA < itemB) {
        return -1;
      }
      if (itemA > itemB) {
        return 1;
      }
      return 0;
    });
  };

  getAllCategories()
    .then(categories => {

      let result = sortArrayOfObjects(categories, "category_name")

      const templateVars = {
        categories,
        userId
      };
      res.render('categories', templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

//resources/category/:id - Show all categories
router.get('/category/:id', (req, res) => {
  const userId = req.session.user_id;
  const categoryId = req.params.id;

  getAllFromCategories(categoryId)
    .then(categorydata => {

      const templateVars = {
        categorydata,
        userId
      };
      res.render('category-show', templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

//resources/new - Show New resource Page
router.get('/new', (req, res) => {
  const userId = req.session.user_id;

  getAllCategories()
    .then(categoryData => {

    const templateVars = {
      userId,
      categoryData
    };

    if(!userId ){
      res.send(`
      <h1 style='text-align: center;'>Create A Resource</h1>
      <h2 style='text-align: center;'>You are not allowed to Create A Resource</h2>
      `);
    } else{
    res.render("resource-new", templateVars);
    }
  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  });

});

//resources/search - Search bar
router.get('/search', (req, res) => {
  const query = req.query.q.trim();
  const userId = req.session.user_id;

  searchBarResources(query)
    .then(queryResult => {

      const templateVars = {
        query,
        queryResult,
        userId
      };
      res.render('resources-search', templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// resources/:id/edit - Resources edit
router.get('/:id/edit', (req, res) => {
  const resourceId = req.params.id;
  const userId = req.session.user_id;

  getResourceDetails(resourceId, userId)
    .then(resource => {
      const templateVars = {
        resourceId,
        resource: resource[0],
        userId
      };

      if(resource[0].user_id != userId ){
        res.send(`
        <h1 style='text-align: center;'>Edit Resource</h1>
        <h2 style='text-align: center;'>You are not allowed to edit this resource</h2>
        `);
      } else{
        res.render("resource-edit", templateVars);
      }
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });

});

//resources/:id - Show resource with that :id
router.get('/:id', (req, res) => {
  const resourceId = req.params.id;
  const userId = req.session.user_id;

  getResourceDetails(resourceId, userId)
    .then(resource => {
      const templateVars = {
        resource,
        userId,
        resourceId
      };
      res.render("resource-show", templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });

});

//resources/ - Show All Resources
router.get('/', (req, res) => {
  const userId = req.session.user_id;

  getAllResources(userId)
    .then(resources => {

      const templateVars = {
        userId,
        resources
      };
      res.render('resources', templateVars);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });

});

// ----POST-----

// POST - UNLike
router.post('/:id/unlike', (req, res) => {
  const userId = req.session.user_id;
  const resourceId = req.params.id;

  getOneUser(userId)
  .then(user =>{
    if (!userId || userId !== user.id){
      res.send(`
        <h1 style='text-align: center;'>Like A Resource</h1>
        <h2 style='text-align: center;'>Please Log In !</h2>
        `);
    }else{
      decreaseLikes(userId, resourceId)
        .then(unlike => {
          res.redirect(`/users/${userId}/my-resources`);
        })
        .catch(err => {
          console.log({ error: err.message });
        });
    }
  })
  .catch(err => {
    console.log({ error: err.message });
   })
});

// POST - Like
router.post('/:id/like', (req, res) => {
  const userId = req.session.user_id;
  const resourceId = req.params.id;

  getOneUser(userId)
  .then(user =>{
    if (!userId || userId !== user.id){
      res.send(`
        <h1 style='text-align: center;'>Like A Resource</h1>
        <h2 style='text-align: center;'>Please Log In !</h2>
        `);
    }else{
    increaseLikes(userId, resourceId)
      .then(like => {
        res.redirect(`/users/${userId}/my-resources`);
      })
      .catch(err => {
        console.log({ error: err.message });
      });
    }
  })
  .catch(err => {
    console.log({ error: err.message });
  });
});

// Post to /resources/:id/comment
router.post('/:id/comment', (req, res) => {
  const resourceId = req.params.id;
  const commentText = req.body.comment;
  const userId = req.session.user_id;

  if (!userId){
    res.send(`
      <h1 style='text-align: center;'>Comment on a Resource</h1>
      <h2 style='text-align: center;'>Please Log In to Comment !</h2>
      `);
  }else{
  addComment(userId, commentText, resourceId)
    .then(resource => {
      res.redirect(`/resources/${resourceId}`);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
  }
});

//resources/:id/rating - Edit rating
router.post('/:id/rating', (req, res) => {

  const userId = req.session.user_id;
  const resourceId = req.params.id;
  const rating = req.body.rating;

  getOneUser(userId)
  .then(user =>{
    if (!userId || userId !== user.id){
      res.send(`
      <h1 style='text-align: center;'>Rate A Resource</h1>
      <h2 style='text-align: center;'>Please Log In to Add a Rating</h2>
      `);
  }else{
    insertRating(userId, resourceId, rating)
      .then(rating => {
        res.redirect(`/resources/${resourceId}`);
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  }
  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  });
});

//resources/:id/delete - Delete a resource
router.post('/:id/delete', (req, res) => {
  const userId = req.session.user_id;
  const resourceId = req.params.id;

  getOneUser(userId)
  .then(user =>{
    if (!userId || userId != user.id){
      res.send(`
      <h1 style='text-align: center;'>Delete A Resource</h1>
      <h2 style='text-align: center;'>Please Log In !</h2>
      `);
    }else{
      deleteResource(userId, resourceId)
      .then(result => {
        res.redirect(`/resources`);
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
    }
  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  });

});

// Post to /resources/:id - Edit Resource
router.post('/:id', (req, res) => {
  const resourceId = req.params.id;
  const resourceToUpdate = req.body;
  const userId = req.session.user_id;

  getOneUser(userId)
  .then(user =>{
    if (!userId || userId != user.id){
      res.send(`
      <h1 style='text-align: center;'>Edit A Resource</h1>
      <h2 style='text-align: center;'>Please Log In !</h2>
      `);
    }else{
      updateResource(resourceId, resourceToUpdate)
    .then(resource => {
      res.redirect(`/resources/${resourceId}`);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
    }
  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  });
});

// Post to /resources - Add New Resource
router.post('/', (req, res) => {
  const resource = req.body;
  const userId = req.session.user_id;


  getOneUser(userId)
  .then(user =>{
    if (!userId || userId != user.id){
      res.send(`
      <h1 style='text-align: center;'>Create A Resource</h1>
      <h2 style='text-align: center;'>Please Log In !</h2>
      `);
    }else{

      if (resource.category_id === 'new') {
        insertNewCategory(resource.new_category, resource.category_img)
        .then(result => {
          const newCategoryId = result[0].id;
          resource.category_id = newCategoryId;

          return insertNewResource(resource);
        })
        .then(resource => {
          res.redirect(`/users/${userId}/my-resources`);
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
      } else {
        console.log(resource)
        insertNewResource(resource)
        .then(resource => {
          console.log("INSIDE", resource)
          res.redirect(`/users/${userId}/my-resources`);
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
      }
    }

  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  });
});


module.exports = router;
