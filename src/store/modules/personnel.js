import agentService from '../../services/agentService';
import accountService from '../../services/accountService';

export default {
  namespaced: true,
  state: {
    Requests: {},
    status: '',
    rescuers: {},
    passwordMessages: {},
    message: '',
    info: {},
    departmentDetails: {},
  },
  mutations: {
    get_request(state) {
      state.status = 'loading';
    },
    getRequests_success(state, Requests) {
      state.Requests = Requests;
      state.status = 'success';
    },
    acceptRequest_success(state, messages) {
      state.status = 'success';
      state.message = messages;
    },
    reg_success(state, message) {
      state.status = 'success';
      // eslint-disable-next-line prefer-destructuring
      state.message = message.messages[0];
    },
    get_error(state, errors) {
      state.status = 'error';
      state.message = errors;
    },
    get_rescuers(state, rescuers) {
      state.rescuers = rescuers;
      state.status = 'success';
    },
    updatePassword(state, passwordMessages) {
      state.passwordMessages = passwordMessages;
      state.status = 'success';
    },
    getBasicInfo_success(state, info) {
      state.info = info;
    },
    getDepartmentDetails_success(state, details) {
      state.departmentDetails = details;
    },
  },
  actions: {
    getRequests({ commit }) {
      return new Promise((resolve, reject) => {
        commit('get_request');
        agentService.GetAllRequests()
          .then((res) => {
            const SOSRequests = res.data.result;
            commit('getRequests_success', SOSRequests);
            resolve(res);
          })
          .catch((err) => {
            commit('get_error', err);
            reject(err);
          });
      });
    },
    acceptRequest({ commit }, requestInfo) {
      return new Promise((resolve, reject) => {
        agentService.AcceptSOSRequest(requestInfo.requestId, requestInfo.rescuerEmail)
          .then((res) => {
            commit('acceptRequest_success', res.data.messages);
            resolve(res);
          })
          .catch((err) => {
            commit('get_error', err);
            reject(err);
          });
      });
    },
    registerRescuer({ commit }, rescuer) {
      return new Promise((resolve, reject) => {
        commit('reg_request');
        agentService.RegisterRescuer(rescuer)
          .then((res) => {
            const response = res.data;
            commit('reg_success', response);
            resolve(res);
          })
          .catch((err) => {
            commit('reg_error', err);
            reject(err);
          });
      });
    },
    getRescuers({ commit }) {
      return new Promise((resolve, reject) => {
        commit('get_request');
        agentService.GetOnlineRescuers()
          .then((res) => {
            const onlineRescuers = res.data.result;
            commit('get_rescuers', onlineRescuers);
            resolve(res);
          })
          .catch((err) => {
            commit('get_error');
            reject(err);
          });
      });
    },
    updatePassword({ commit }, userPassword) {
      return new Promise((resolve, reject) => {
        commit('get_request');
        accountService.ResetPassword(userPassword)
          .then((res) => {
            const passwordMessages = res.data.messages;
            commit('updatePassword', passwordMessages);
            resolve(res);
          })
          .catch((err) => {
            commit('get_error');
            reject(err);
          });
      });
    },
    getBasicInfo({ commit }) {
      return new Promise((resolve, reject) => {
        commit('get_request');
        agentService.GetBasicInfo()
          .then((res) => {
            const info = res.data.result;
            commit('getBasicInfo_success', info);
            resolve(res);
          })
          .catch((err) => {
            commit('get_error', err);
            reject(err);
          });
      });
    },
    getDepartmentDetails({ commit }) {
      return new Promise((resolve, reject) => {
        commit('get_request');
        agentService.GetDepartmentDetails()
          .then((res) => {
            const details = res.data.result;
            commit('getDepartmentDetails_success', details);
            resolve(res);
          })
          .catch((err) => {
            commit('get_error', err);
            reject(err);
          });
      });
    },
  },
  getters: {
  },
};
