import bcrypt from 'bcryptjs';

import { User, Photo } from '../models/index.js';

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};


// -- get all users --
exports.getAllUsers = (req, res) => {
  User.findAll().then(users => {
    if (users.length === 0) {
      res.send({"users": "no users found"});
    }
    res.send({"users": users});
  });
}

// -- find user by id --
exports.getUserById = (req, res) => {
  User.findOne({
    where: { id: req.params.userId },
    include: [{ model: Photo, where: { is_profile_picture: false } }]
  }).then(user => {
    res.send({ user })
  });
};

// -- add user --
exports.createUser = (req, res) => {
  User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    pet_name: req.body.pet_name
  }).then(user => {
    res.send({ user});
  })
};

// -- set user password --
exports.setUserPassword = (req, res) => {
  User.findById(req.params.userId).then((user) => {
    // generate hash from user provided password
    const hash = bcrypt.hashSync(req.body.password, 10);

    // update user model password columnn specifically with hash
    user.update({ password: hash }).then((updatedUser) => {

      // return the updated user to the client
      res.send({ user: updatedUser });
    }).catch(e => {

      res.status(500).send("could not update the password of this user");
    });
  }).catch(e => {

    res.status(500).send("Could not locate user by that id");
  });
}

// -- update an existing user --
exports.updateUser = (req, res) => {
  User.findById(req.params.userId).then((user) => {
    user.update(req.body).then((updatedUser) => {
      res.send({ user: updatedUser });
    }).catch(e => {
      res.status(500).send("Could not update the requested entity");
    });
  }).catch(e => {
    res.status(500).send("Could not locate user by that id");
  });
}
