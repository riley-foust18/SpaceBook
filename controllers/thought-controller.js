const {Thought, User} = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .sort({ _id: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // getUserById({params}, res) {
  //   User.findOne({_id: params.userId})
  //     .populate({
  //       path: 'thoughts',
  //       select: '-__v'
  //     })
  //     .select('-__v')
  //     .then(dbUserData => {
  //       if (!dbUserData) {
  //         res.status(404).json({ message: 'No user found with this id!' });
  //         return;
  //       }
  //       res.json(dbUserData);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.status(400).json(err);
  //     });
  // },

  createThought({body}, res) {
    Thought.create(body)
      .then(({_id}) => {
        return User.findOneAndUpdate(
          { _id: body.userId}, 
          {$push: {thoughts: _id}}, 
          {new: true}
        );
    })
    .then(dbThoughtData => {
      if(!dbThoughtData) {
        res.status(404).json({message: 'No user found with this id!'});
        return;
      }
      res.json(dbThoughtData)
    })
    .catch(err => res.json(err)); 
  },


  // updateUser({params, body}, res) {
  //   User.findOneAndUpdate({_id: params.userId}, body, {new: true})
  //     .then(dbUserData => {
  //       if (!dbUserData) {
  //         res.status(404).json({ message: 'No user found with this id!' });
  //         return;
  //       }
  //       res.json(dbUserData)
  //     })
  //     .catch(err => res.status(400).json(err));
  // },

  // deleteUser({params}, res) {
  //   User.findOneAndDelete({_id: params.userId})
  //     .then(dbUserData => {
  //       if (!dbUserData) {
  //         res.status(404).json({ message: 'No user found with this id!' });
  //         return;
  //       }
  //       res.json({message: 'User and associated thoughts deleted!'})
  //     })
  //     .catch(err => res.status(400).json(err));
  // },

  // addFriend({params}, res) {
  //   User.findOneAndUpdate(
  //     {_id: params.userId},
  //     {$push: {friends: params.friendId}},
  //     {new: true}
  //   )
  //     .select("-__v")
  //     .then(dbUserData => {
  //       if (!dbUserData) {
  //         res.status(404).json({ message: 'No user found with this id!' });
  //         return;
  //       }
  //       res.json(dbUserData);
  //     })
  //     .catch(err => res.status(400).json(err));
  // },

  // deleteFriend({params}, res) {
  //   User.findOneAndUpdate(
  //     {_id: params.userId},
  //     {$pull: {friends: params.friendId}},
  //     {new: true}
  //   )
  //     .then(dbUserData => {
  //       res.json(dbUserData)
  //     })
  //     .catch(err => res.json(err))
  // }
}

module.exports = thoughtController