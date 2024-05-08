import * as userRepository from './auth.js';
import mongoose from 'mongoose';
import { useVirtualId } from '../db/database.js';

const tweetSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    url: String,
  },
  { timestamps: true }
);

useVirtualId(tweetSchema);

const Tweet = mongoose.model('Tweet', tweetSchema);

export async function getAll() {
  return Tweet.find().sort({ createdAt: -1 });
}

export async function getAllByUsername(username) {
  return Tweet.find({ username }).sort({ createdAt: -1 });
}

export async function getById(id) {
  return Tweet.findById(id);
}

export async function create(text, userId) {
  return userRepository
    .findById(userId) //
    .then((user) =>
      new Tweet({
        text,
        userId,
        name: user.name,
        username: user.username,
      }) //
        .save()
    );
}

export async function update(id, text) {
  return Tweet.findByIdAndUpdate(id, { text }, { returnOriginal: false });
}

export async function remove(id) {
  return Tweet.findByIdAndDelete(id);
}


