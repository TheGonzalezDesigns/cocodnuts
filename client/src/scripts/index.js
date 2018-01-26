/*eslint no-unused-vars: ["warn", { "vars": "local" },]*/
/*global styles*/
/*global global*/
import styles from './styles'
import Vue from 'vue'
import stripe from './api/stripe'
import router from './network/router'

const vm = new Vue({
	el: '#app',
	data: {
		food: {
			menu: {
				items: [],
				categories: [],
				lists: [],
				displaying: [],
				popular: [],
				preview: {},
			}
		},
		schedule: {
			open: {
				time: ''
			},
			close: {
				time: ''
			},
		},
		order: {
			total: 0
		},
		view: '',
		total: 0
	},
	methods: {
		updatePopular() {
			//this.food.popular;
		},
		updateCategories() {
			const menu = this.food.menu
			const categories = menu.items.map(item => item.category)
			menu.categories = [...new Set(categories)]
		},
		updateLists() {
			const menu = this.food.menu
			const items = menu.items
			const categories = menu.categories
			const filter = (category, items) => items.filter(item => item.category == category)
			const lists = categories.map(category => filter(category, items))
			lists.forEach((list, index) => {
				const category = categories[index]
				menu.lists[category] = list
			})
		},
		async populateClient() {
			const res = await router.requestMenu()
			if (res.valid) {
				const data = res.data
				this.food.menu.items = data
				this.updateCategories()
				this.updateLists()
				//this.updatePopular()
			}
		},
		selectList(category) {
			this.food.menu.displaying = this.food.menu.lists[category]
			this.calesitar()
		},
		calesitar() {
			const list = this.food.menu.displaying.length ? this.food.menu.displaying : this.food.menu.items
			const max = list.length - 1
			const index = (max, min = 0) => Math.floor(Math.random() * (max - min + 1) + min)
			const data = list[index(max)]
			this.food.menu.preview = data
		},
		addOrder(item) {
			let order = this.order[item.name]
			let data = item
			if (!order) {
				data = {
					name: data.name,
					price: data.price,
					quantity: 0
				}
				order = data
			}
			order.quantity += 1
			this.order.total += 1
			this.total += order.price
		},
		removeOrder(item) {
			let order = this.order[item.name]
			if (order) {
				order.quantity -= order.quantity ? 1 : 0
			}
		},
		setView(view) {
			this.view = view
		}
	},
	watch: {

	},
	computed: {
		async start() {
			await this.populateClient()
			this.calesitar()
			setInterval(this.calesitar, 5000)
			this.setView('menu')
			//stripe.start()
		}
	},
	mounted() {
		this.$nextTick(() => {
			vm.start()
		})
	}
})
global.vm = vm //For debugging only
