import Vue from 'vue'
import Vuex from 'vuex'
import { getToken, getBinding } from '../utils/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		hasBinding: false,
		openid: null,
		menu: [],
	},
	mutations: {
		login(state) {
			state.hasLogin = true;
		},
		logout(state) {
			state.hasLogin = false
			state.openid = null
		},
		binding(state, bool = true) {
			state.hasBinding = bool;
		},
		setOpenid(state, openid) {
			state.openid = openid
		},
		setMenu(state, menu) {
			state.menu = menu
		},
	},
	getters: {
	},
	actions: {
		initLoginState(context) {
			if (context.state.hasLogin == false) {
				context.commit('login', getToken() ? true : false)
			}
			if (context.state.hasBinding == false) {
				context.commit('binding', getBinding() ? true : false)
			}
		},
	}
})

export default store
