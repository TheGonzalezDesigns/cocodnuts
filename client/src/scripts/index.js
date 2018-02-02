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
			opening: '',
			colosing: '',
			open: true,
			freindly: {
				opening: '',
				colosing: '',
			}
		},
		order: {
			total: 0,
			list: {},
			quantity: 0,
			price: 0
		},
		view: '',
		total: 0,
		email: '',
		intervals: [],
		orderQuantity: 0,
		ready: false,
		closed: true
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
			console.log('Setting view to ', view)
			this.view = view
		},
		async getSchedule() {
			const date = await router.requestDate()
			const legible = (string) => {
				const parse = (string, a, b) => parseFloat(string.slice(a, b))
				const hours = parse(string, 0, 2)
				const minutes = parse(string, 3, 5)
				const timeOfDay = hours < 12 ? 'AM' : 'PM'
				const formatted = (hours % 12) ? hours : timeOfDay == 'PM' ? '12' : '00'
				const time = formatted + ':' + minutes + ' ' + timeOfDay
				return time
			}
			this.schedule.opening = date.opening
			this.schedule.closing = date.closing
			this.schedule.freindly.opening = legible(date.opening)
			this.schedule.freindly.closing = legible(date.closing)
		},
		compareHours() {
			const date = new Date()
			const now = date.date.toTimeString().slice(0, 5)
			const convertTime = (string) => {
				const parse = (string, a, b) => parseFloat(string.slice(a, b))
				const hours = parse(string, 0, 2) * 60
				const minutes = parse(string, 3, 5)
				const time = hours + minutes
				return time
			}
			const currently = convertTime(now)
			const opening = convertTime(this.opening)
			const closing = convertTime(this.closing)
			this.schedule.open = (currently >= opening) && (currently < closing)
		},
		async initiateStoreHours() {
			console.log('Initiating Store Hours')
			await this.getSchedule()
			this.compareHours()
			console.log('Finishing Store Hours')
<<<<<<< HEAD
		},
		togglePane(view = '') {
			if (view.length) {
				this.setView(view)
				this.closed = true
			} else this.closed = false
			console.log(`Pane is currently ${this.closed ? 'closed' : 'open'}`)
=======
>>>>>>> ee33a9e3523534037498b322961a46bb58aaa4c9
		}
	},
	computed: {
		async start() {
<<<<<<< HEAD
			await this.populateClient()
			this.calesitar()
			setInterval(this.calesitar, 5000)
			this.initiateStoreHours()
			const view = this.schedule.open ? 'menu' : 'closed'
			this.setView(view)
			this.ready = true
=======
			//await this.populateClient()
			//this.calesitar()
			//setInterval(this.calesitar, 5000)
			//this.initiateStoreHours()
			//const view = this.schedule.open ? 'menu' : 'closed'
			//this.setView(view)
			//stripe.start()
>>>>>>> ee33a9e3523534037498b322961a46bb58aaa4c9
		}
	},
	mounted() {
		this.$nextTick(() => {
			vm.start()
		})
	}
})
global.vm = vm //For debugging only
