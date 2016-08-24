import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import { LOGIN_FACEBOOK, LOGIN_LOCAL, LOGIN_CHROME } from './constants';
import { loginFacebookSuccess, loginFacebookError } from './actions';
import { postRequest } from 'utils/request';
import { storeToken, getToken } from 'utils/operations';
import { AUTH_URL } from 'global_constants';
import { selectLogin, selectPassword } from './selectors';

function* loginFacebookSaga() {
  const login = yield select(selectLogin());
  const password = yield select(selectPassword());
  const requestURL = `${AUTH_URL}/auth/facebook`;
  const body = {
    login,
    password,
  };
  try {
    const authData = yield call(postRequest, requestURL, body);
    if (authData.status === 200) {
      yield storeToken('tinderToken', authData.data.authToken);
      yield storeToken('fbToken', authData.data.fbToken);
      yield put(loginFacebookSuccess({ authToken: authData.data.authToken, fbToken: authData.data.fbToken }));
      yield put(push('/dashboard/home'));
    }
  } catch (loginError) {
    yield put(loginFacebookError(loginError));
  }
}

function* loginChromeSaga(token) {
  const requestURL = `${AUTH_URL}/auth/facebook/${token}`;
  try {
    const authData = yield call(postRequest, requestURL);
    if (authData.status === 200) {
      yield storeToken('tinderToken', authData.data.authToken);
      yield storeToken('fbToken', authData.data.fbToken);
      yield put(loginFacebookSuccess({ authToken: authData.data.authToken, fbToken: authData.data.fbToken }));
      yield put(push('/dashboard/home'));
    }
  } catch (loginError) {
    yield put(loginFacebookError(loginError));
  }
}

function* loginLocalSaga() {
  const authToken = yield getToken('tinderToken');

  try {
    const authenticationData = yield call(postRequest, `${AUTH_URL}/tinder/checkAuth`, { authToken });
    if (authenticationData.data) {
      yield put(loginFacebookSuccess({ authToken }));
      yield put(push('/dashboard/home'));
    }
  } catch (err) {
    const token = window.location.pathname.split('/login/')[1];
    if (token) {
      yield loginChromeSaga(token);
    } else {
      chrome.runtime.sendMessage('ijolldjdhcdcceonmopahocncafnlike', { type: 'doAuth' }); // eslint-disable-line
    }
  }
}


export function* authSaga() {
  const watcher = [
    yield fork(takeLatest, LOGIN_FACEBOOK, loginFacebookSaga),
    yield fork(takeLatest, LOGIN_LOCAL, loginLocalSaga),
    yield fork(takeLatest, LOGIN_CHROME, loginChromeSaga),
  ];

  yield take(LOCATION_CHANGE);
  yield watcher.map(each => cancel(each));
}

export default [
  authSaga,
];
