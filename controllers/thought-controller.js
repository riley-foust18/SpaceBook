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

  getThoughtById({params}, res) {
    Thought.findOne({_id: params.thoughtId})
      .select('-__v')
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

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


  updateThought({params, body}, res) {
    Thought.findOneAndUpdate({_id: params.thoughtId}, body, {new: true})
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData)
      })
      .catch(err => res.status(400).json(err));
  },

  deleteThought({params}, res) {
    Thought.findOneAndDelete({_id: params.thoughtId})
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        return User.findOneAndUpdate(
          { username:  dbThoughtData.username},
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then(dbUserData => {
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  addReaction({params, body}, res) {
    Thought.findOneAndUpdate(
      {_id: params.thoughtId},
      {$push: {reactions: body}},
      {new: true}
    )
      .select("-__v")
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },

  deleteReaction({params, body}, res) {
    Thought.findOneAndUpdate(
      {_id: params.thoughtId},
      {$pull: {reactions: {reactionId: body.reactionId}}},
      {new: true}
    )
      .select("-__v")
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No reaction found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(400).json(err));
  },
}

module.exports = thoughtController