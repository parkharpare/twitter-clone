import axios from 'axios';
import {
  TWEET_LOADING,
  GET_TWEET,
  GET_TWEETS,
  CREATE_TWEET,
  REMOVE_TWEET,
  LIKE_TWEET,
  GET_ERRORS,
} from './types';
import { closeCreateTweetModal } from './uiActions';
import { setAlert } from './alertActions';

export const setTweetLoading = () => ({
  type: TWEET_LOADING,
});

export const setCurrentTweet = (tweet) => ({
  type: GET_TWEET,
  payload: tweet,
});

export const getTweet = (tweetId) => async (dispatch) => {
  dispatch(setTweetLoading());

  try {
    const res = await axios.get(`/api/tweets/${tweetId}`);

    dispatch({
      type: GET_TWEET,
      payload: res.data.tweet,
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || [],
    });
  }
};

export const createTweet = (tweet, addNewTweetToState = true) => async (
  dispatch
) => {
  if (addNewTweetToState) {
    dispatch(setTweetLoading());
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify(tweet);

  try {
    const res = await axios.post('/api/tweets', body, config);

    dispatch({
      type: CREATE_TWEET,
      payload: {
        data: res.data.tweet,
        addNewTweetToState,
      },
    });

    dispatch(closeCreateTweetModal());
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || [],
    });
  }
};

export const getTweets = (query = '') => async (dispatch) => {
  dispatch(setTweetLoading());

  try {
    const res = await axios.get(`/api/tweets${query}`);

    dispatch({
      type: GET_TWEETS,
      payload: res.data.tweets,
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || [],
    });
  }
};

export const likeTweet = (tweetId, authUserId) => async (dispatch) => {
  try {
    await axios.post(`/api/tweets/like/${tweetId}`);

    dispatch({
      type: LIKE_TWEET,
      payload: {
        tweetId,
        authUserId,
      },
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || [],
    });
  }
};

export const removeTweet = (tweetId) => async (dispatch) => {
  try {
    if (window.confirm('Are you sure you want to remove this tweet?')) {
      await axios.delete(`/api/tweets/${tweetId}`);

      dispatch({
        type: REMOVE_TWEET,
        payload: tweetId,
      });
      dispatch(setAlert('Tweet successfully deleted', 'success'));
    }
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data.errors || [],
    });
  }
};
