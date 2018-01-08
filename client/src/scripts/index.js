/*eslint no-unused-vars: ["warn", { "vars": "local" }]*/
/*global styles global*/
import styles from './styles'
import Vue from 'vue'
import router from './network/router'

const vm = new Vue({
	el: '#app',
	data: {},
	methods: {

	},
	watch: {

	},
	mounted() {
		this.$nextTick(() => {

		})
	}
})
//global.vm = vm //For debugging only
