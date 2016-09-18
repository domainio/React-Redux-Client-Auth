import axios from 'axios';
import { browserHistory } from 'react-router';
import { AUTH_USER, AUTH_ERROR, UNAUTH_USER, FETCH_MESSAGE } from './types';

const ROOT_URL = 'http://localhost:3090';

export function signinUser({ email, password }){
  return function(dispatch){
    // submit emil, pass to the server
    axios.post(`${ROOT_URL}/signin`, { email, password })
    .then(response => {
      // if request is good
      // - update state to indicate user authenticated
      dispatch({ type: AUTH_USER });
      // - save the JWT token
      localStorage.setItem('token', response.data.token);
      // - redirect to the route '/***
      browserHistory.push('/feature');
    })
    .catch(() => {
      // if request is bar
      // - show an error to user
      dispatch(authError('Bad login info'));
    });
  }
};

export function authError(error){
  return {
    type: AUTH_ERROR,
    payload: error
  }
};

export function signoutUser(){
  localStorage.removeItem('token');
  return { type: UNAUTH_USER };
};

export function signupUser({ email, password }){
  return function(dispatch){
    // submit emil, pass to the server
    axios.post(`${ROOT_URL}/signup`, { email, password })
    .then(response => {
      dispatch({ type: AUTH_USER });
      localStorage.setItem('token', response.data.token);
      browserHistory.push('/feature');
    })
    .catch(response => {
      console.log('response: ',response.data);
      //dispatch(authError(response.data.error));
      dispatch(authError('email in use... :))'));
    });
  }
};

export function fetchMessage(){

  return function(dispatch){
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') }
    }).then(response => {
      console.log('fetchMessage response = ', response);
      dispatch({
        type: FETCH_MESSAGE,
        payload: response.data.message
      });
      // console.log(response)
    });
  }
}
