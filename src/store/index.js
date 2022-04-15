import Vue from 'vue'
import Vuex from 'vuex'
import { getAppId } from '../utils/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		hasBinding: false,
		openid: null,
		menu: [],
	},
	mutations: {
		login(state, bool = true) {
			state.hasLogin = bool;
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
				context.commit('login', getAppId() ? true : false)
			}
		},
	}
})

export default store
