const db = require('../connection');

const getAllUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

const getOneUser = (id) => {
  const queryString = {
    text: `SELECT * FROM users WHERE id = $1`,
    values: [id]
  };
  return db.query(queryString)
    .then(data => {
      return data.rows[0];
    });
};

const updateUserProfile = (id,user) => {
  const updateString = {
    text: `UPDATE users 
      SET first_name = $1,
      last_name = $2,
      email = $3,
      password = $4,
      profile_picture = $5,
      handle = $6,
      bio = $7
      WHERE id = $8
      RETURNING *`,
    values: [user.first_name, user.last_name, user.email, user.password, user.profile_picture, user.handle, user.bio, id]
  };
  return db.query(updateString)
    .then(data => {
      return data.rows;
    });
};

module.exports = { getAllUsers, getOneUser, updateUserProfile};
