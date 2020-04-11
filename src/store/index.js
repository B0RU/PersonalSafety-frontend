import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import registerModule from './modules/register';
import personnelModule from './modules/personnel';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    email: localStorage.getItem('email') || '',
    messages: {},
    status: '',
    token: localStorage.getItem('token') || '',
    errorMessage: null,
    statusCode: null,
  },
  mutations: {
    login_request(state) {
      state.status = 'loading';
    },
    login_success(state, token) {
      state.status = 'success';
      state.token = token;
    },
    login_messages(state, messages) {
      state.messages = messages;
    },
    login_email(state, email) {
      state.email = email;
    },
    login_statusCode(state, statusCode) {
      state.statusCode = statusCode;
    },
    authError(state, message) {
      state.errorMessage = message;
      state.status = 'error';
    },
    logout(state) {
      state.status = '';
      state.token = '';
      state.messages = {};
      state.personnel.passwordMessages = {};
      state.register.message = '';
    },
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('login_request');
        localStorage.setItem('email', user.email);
        axios.post('http://localhost:5566/api/Account/Login', user)
          .then((res) => {
            const token = res.data.result;
            const { messages } = res.data;
            const statusCode = res.data.status;
            localStorage.setItem('token', token);
            // eslint-disable-next-line prefer-template
            axios.defaults.headers.common.Authorization = 'Bearer ' + token;
            commit('login_success', token);
            commit('login_messages', messages);
            commit('login_statusCode', statusCode);
            resolve(res);
          })
          .catch((err) => {
            commit('authError', err.response.data.messages[0]);
            localStorage.removeItem('token');
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout');
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        delete axios.defaults.headers.common.Authorization;
        resolve();
      });
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
    user: (state) => (state.messages ? state.messages[2] : ''),
    statusCode: (state) => state.statusCode,
    SOSRequests: (state) => state.personnel.Requests,
    passwordMessages: (state) => state.personnel.passwordMessages,
    rescuers: (state) => state.personnel.rescuers,
    messages: (state) => state.register.message,
  },
  modules: {
    register: registerModule,
    personnel: personnelModule,
  },
});
