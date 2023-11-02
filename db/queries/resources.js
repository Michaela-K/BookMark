const db = require('../connection');

const getAllResources = (userId) => {
  const searchString = {
    text: `
    SELECT
    resources.id as id,
    resources.owner_id as user_id,
    resources.title as title,
    resources.description as description,
    resources.thumbnail_img as thumbnail_img,
    resources.url as url,
    categories.category_name as category_name,
    (SELECT COUNT(comments.id) FROM comments WHERE comments.id IS NOT NULL AND resources.id = comments.resource_id) AS number_of_comments,
    (SELECT COUNT(likes.id) FROM likes WHERE likes.resource_id = resources.id) AS likes,
    (SELECT ROUND(AVG(ratings.rating)) FROM ratings WHERE ratings.resource_id = resources.id) as avg_rating,
    EXISTS (SELECT 1 FROM likes WHERE likes.resource_id = resources.id AND likes.user_id =$1) AS liked
    FROM resources
    JOIN categories ON resources.category_id = categories.id
    LEFT JOIN comments ON comments.resource_id = resources.id
    LEFT JOIN likes ON likes.resource_id = resources.id
    LEFT JOIN ratings ON ratings.resource_id = resources.id
    GROUP BY resources.id, resources.owner_id, resources.title, resources.description, resources.thumbnail_img, resources.url, categories.category_name`,
    values: [userId]
  };
  return db.query(searchString)
    .then(data => {
      return data.rows;
    });
};

const getAllCategories = () => {
  const searchString = {
    text: `
    SELECT
    *
    FROM categories;`,
  };
  return db.query(searchString)
    .then(data => {
      return data.rows;
    });
};

const getAllFromCategories = (categoryId) => {
  const searchString = {
    text: `
    SELECT
    resources.id as resource_id,
    resources.owner_id as user_id,
    resources.title as title,
    resources.thumbnail_img as thumbnail_img,
    categories.id as category_id,
    categories.category_name as category_name
    FROM resources
    JOIN categories ON resources.category_id = categories.id
    WHERE categories.id = $1
    GROUP BY resources.id, resources.owner_id, resources.title, resources.thumbnail_img, categories.id, categories.category_name`,
    values: [categoryId]
  };
  return db.query(searchString)
    .then(data => {
      return data.rows;
    });

}

const insertNewCategory = (categoryName, categoryImg) => {
  const queryString = {
    text: `INSERT INTO categories (category_name, category_img) VALUES ($1, $2) RETURNING *;`,
    values: [categoryName, categoryImg]
  };
  return db.query(queryString)
    .then(data => {
      return data.rows;
    });
};

const getMyResources = (id) => {
  const searchString = {
    text: `
    SELECT
    resources.id as id,
    resources.owner_id as user_id,
    resources.title as title,
    resources.description as description,
    resources.thumbnail_img as thumbnail_img,
    resources.url as url,
    categories.category_name as category_name,
    (SELECT COUNT(comments.id) FROM comments WHERE comments.id IS NOT NULL AND resources.id = comments.resource_id) AS number_of_comments,
    (SELECT COUNT(likes.id) FROM likes WHERE likes.resource_id = resources.id) AS likes,
    (SELECT ROUND(AVG(ratings.rating)) FROM ratings WHERE ratings.resource_id = resources.id) as avg_rating,
    EXISTS (SELECT 1 FROM likes WHERE likes.resource_id = resources.id AND likes.user_id =$1) AS liked
    FROM resources
    JOIN categories ON resources.category_id = categories.id
    LEFT JOIN comments ON comments.resource_id = resources.id
    LEFT JOIN likes ON likes.resource_id = resources.id
    LEFT JOIN ratings ON ratings.resource_id = resources.id
    WHERE resources.owner_id = $1
    GROUP BY resources.id, resources.owner_id, resources.title, resources.description, resources.thumbnail_img, resources.url, categories.category_name`,
    values: [id]
  };
  return db.query(searchString)
    .then(data => {
      return data.rows;
    });
};

const getAllResourcesAUserLiked = (id) => {
  const searchString = {
    text: `
    SELECT
    resources.id as id,
    resources.owner_id as user_id,
    resources.title as title,
    resources.thumbnail_img as thumbnail_img
    FROM likes
    JOIN resources ON likes.resource_id = resources.id
    WHERE user_id = $1
    GROUP BY resources.id, resources.owner_id, resources.title, resources.thumbnail_img`,
    values: [id]
  };
  return db.query(searchString)
    .then(data => {
      return data.rows;
  });
}

const insertNewResource = (resource) => {
  const queryString = {
    text: `
    INSERT INTO resources (owner_id, url, thumbnail_img, title, description, category_id)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *;`,
    values: [resource.owner_id, resource.url, resource.thumbnail_img, resource.title, resource.description.trim(), resource.category_id]
  };
  return db.query(queryString)
    .then(data => {
      return data.rows;
    });
};

const categoryBtnResourcesSearch = (category_name) => {
  const searchString = {
    text: `
    SELECT
    resources.owner_id,
    resources.title,
    resources.description,
    resources.thumbnail_img,
    resources.url,
    categories.category_name,
    (SELECT COUNT(comments.id) FROM comments WHERE comments.id IS NOT NULL AND resources.id = comments.resource_id) AS number_of_comments,
    (SELECT COUNT(likes.id) FROM likes WHERE likes.resource_id = resources.id) AS likes
    FROM resources
    JOIN categories ON resources.category_id = categories.id
    LEFT JOIN comments ON comments.resource_id = resources.id
    LEFT JOIN likes ON likes.resource_id = resources.id
    WHERE categories.category_name = $1
    GROUP BY resources.id, resources.owner_id, resources.title, resources.description, resources.thumbnail_img, resources.url, categories.category_name`,
    values: [category_name]
  };
  return db.query(searchString)
    .then(data => {
      return data.rows;
    });
};

const searchBarResources = (searchWord) => {
  const searchString = {
    text: `
    SELECT
    resources.id AS id,
    resources.owner_id AS owner_id,
    resources.title AS title,
    resources.description AS description,
    resources.thumbnail_img AS thumbnail_img,
    resources.url AS url,
    categories.category_name AS category_name,
    (SELECT COUNT(comments.id) FROM comments WHERE comments.id IS NOT NULL AND resources.id = comments.resource_id) AS number_of_comments,
    (SELECT COUNT(likes.id) FROM likes WHERE likes.resource_id = resources.id) AS likes
    FROM resources
    JOIN categories ON resources.category_id = categories.id
    LEFT JOIN comments ON comments.resource_id = resources.id
    LEFT JOIN likes ON likes.resource_id = resources.id
    WHERE (resources.title ILIKE $1 OR resources.description ILIKE $1)
    GROUP BY resources.id, resources.owner_id, resources.title, resources.description, resources.thumbnail_img, resources.url, categories.category_name`,
    values: [`%${searchWord}%`]
  };
  return db.query(searchString)
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      console.log(error.message);
    });
};

const getResourceDetails = (id, userId) => {
  const queryString = {
    text: `SELECT
    resources.id AS id,
    resources.owner_id AS user_id,
    resources.title AS title,
    resources.description AS description,
    resources.thumbnail_img AS thumbnail,
    resources.url As url,
    categories.category_name AS category_name,
    users.profile_picture AS profile_picture,
    users.handle AS handle,
    comments.comment_text AS comments,
    (SELECT COUNT(*) FROM comments WHERE comments.resource_id = resources.id) AS total_comments,
    (SELECT COUNT(*) FROM ratings WHERE ratings.resource_id = resources.id) AS total_ratings,
    (SELECT ROUND(AVG(ratings.rating)) FROM ratings WHERE ratings.resource_id = resources.id) as avg_rating,
    ARRAY_AGG(comments.comment_text) AS comments,
    ARRAY_AGG(user_profiles.profile_picture) AS profile_comment,
    EXISTS (SELECT 1 FROM likes WHERE likes.resource_id = resources.id AND likes.user_id =$2) AS liked
    FROM resources
    JOIN categories ON resources.category_id = categories.id
    JOIN users ON users.id = resources.owner_id
    LEFT JOIN comments ON comments.resource_id = resources.id
    LEFT JOIN ratings ON ratings.resource_id = resources.id
    LEFT JOIN (
      SELECT DISTINCT ON (user_id) comments.user_id, users.profile_picture
      FROM comments
      JOIN users ON users.id = comments.user_id
    ) AS user_profiles ON user_profiles.user_id = comments.user_id
    WHERE resources.id = $1
    GROUP BY resources.id, resources.owner_id, resources.title, resources.description, resources.thumbnail_img, resources.url, categories.category_name, comments.comment_text, users.profile_picture, users.handle;`,
    values: [id, userId]
  };
  return db.query(queryString)
    .then(data => {
      return data.rows;
    });
};

const updateResource = (id, resource) => {
  const updateString = {
    text: `UPDATE resources
      SET owner_id = $1,
      url = $2,
      thumbnail_img = $3,
      title = $4,
      description = $5,
      category_id = $6
      WHERE id = $7
      RETURNING *;`,
    values: [resource.owner_id, resource.url, resource.thumbnail_img, resource.title, resource.description, resource.category_id, id]
  };
  return db.query(updateString)
    .then(data => {
      return data.rows;
    });
};

const insertRating = (userId, resourceId, rating) => {
  const queryString = {
    text: `
    INSERT INTO ratings (user_id, resource_id, rating)
    VALUES($1, $2, $3)
    RETURNING *;`,
    values: [userId, resourceId, rating]
  };
  return db.query(queryString)
    .then(data => {
      return data.rows;
    });
};

const addComment = (userId, commentText, resourceId) => {
  const queryString = {
    text: `
    INSERT INTO comments (user_id, comment_text, resource_id)
    VALUES($1, $2, $3)
    RETURNING *;`,
    values: [userId, commentText, resourceId]
  };
  return db.query(queryString)
    .then(data => {
      const row = data.rows[data.rows.length - 1];
      return data.rows;
    });
};

const increaseLikes = (userId, resourceId) => {
  const queryString = {
    text: `
    INSERT INTO likes (user_id, resource_id)
    VALUES($1, $2)
    RETURNING *;`,
    values: [userId, resourceId]
  };
  return db.query(queryString)
    .then(data => {
      return data.rows;
    });
};

const decreaseLikes = (userId, resourceId) => {
  const queryString = {
    text: `
    DELETE FROM likes
    WHERE user_id = $1 AND resource_id = $2
    RETURNING *;`,
    values: [userId, resourceId]
  };
  return db.query(queryString)
    .then(data => {
      return data.rows;
    });
};

const deleteResource = (userId, resourceId) => {
  const queryString = {
    text: `
    DELETE FROM resources
    WHERE owner_id = $1 AND resources.id = $2
    RETURNING *;`,
    values: [userId, resourceId]
  };
  return db.query(queryString)
    .then(data => {
      return data.rows;
    });
};

module.exports = {
  getAllResources,
  insertNewResource,
  getMyResources,
  categoryBtnResourcesSearch,
  getResourceDetails,
  searchBarResources,
  updateResource,
  insertRating,
  addComment,
  increaseLikes,
  decreaseLikes,
  getAllCategories,
  getAllFromCategories,
  getAllResourcesAUserLiked,
  deleteResource,
  insertNewCategory
};
