import styles from './styles'
import Vue from 'vue'
import {stripe, start} from './api/stripe'
import router from './network/router'
import {InvervalTimer} from './chrona'
import {isNotEmail} from 'emailValidation'

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
				preview: {}
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
			open: false,
			subtotal: 0,
			taxRate: 0.095,
			tax: 0
		},
		selected: {},
		view: '',
		total: 0,
		email: '',
		interval: 0,
		ready: false,
		closed: true,
		cycle: 0,
		created: false,
		token: false,
		card: false,
		errorMessage: '',
		emailErrors: '',
		emailValid: false,
		paymentSuccess: -1,
		postPaymentMsg: '',
		date: ''
	},
	methods: {
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
		setPreview(item) {
			this.food.menu.preview = item
		},
		selectItem() {
			this.selected = this.food.menu.preview
			this.pause()
			this.toggleOrder()
		},
		goBack() {
			this.food.menu.displaying = []
			this.resume()
		},
		calesitar() {
			const list = this.food.menu.displaying.length ? this.food.menu.displaying : this.food.menu.items
			const max = list.length - 1
			const index = (max, min = 0) => Math.floor(Math.random() * (max - min + 1) + min)
			const data = list[index(max)]
			this.food.menu.preview = data
		},
		setView(view) {
			//console.log('Setting view to ', view)
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
		setDate() {
			const date = new Date()
			let day, month, year = date.getFullYear()
			switch (date.getDay()) {
			case 0:
				day = 'Sunday'
				break
			case 1:
				day = 'Monday'
				break
			case 2:
				day = 'Tuesday'
				break
			case 3:
				day = 'Wednesday'
				break
			case 4:
				day = 'Thursday'
				break
			case 5:
				day = 'Friday'
				break
			case 6:
				day = 'Saturday'
			}
			switch (date.getMonth()) {
			case 0:
				month = 'January'
				break
			case 1:
				month = 'February'
				break
			case 2:
				month = 'March'
				break
			case 3:
				month = 'April'
				break
			case 4:
				month = 'May'
				break
			case 5:
				month = 'June'
				break
			case 6:
				month = 'July'
				break
			case 7:
				month = 'August'
				break
			case 8:
				month = 'September'
				break
			case 9:
				month = 'October'
				break
			case 10:
				month = 'November'
				break
			case 11:
				month = 'December'
			}
			this.date = `${day}, ${month} ${date.getDate()}, ${year}`
		},
		compareHours() {
			const date = new Date()
			const now = date.toTimeString().slice(0, 5)
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
			//console.log('Initiating Store Hours')
			await this.getSchedule()
			this.compareHours()
			//console.log('Finishing Store Hours')
		},
		togglePane(view = '') {
			if (view.length) {
				this.setView(view)
				this.closed = true
			} else this.closed = false
			//console.log(`Pane is currently ${this.closed ? 'closed' : 'open'}`)
		},
		toggleOrder() {
			this.order.open = !this.order.open
		},
		loop() {
			//setInterval(this.calesitar, 5000)
			this.cycle = new InvervalTimer(this.calesitar, 5000)
			//console.log(this.cycle)
		},
		pause() {
			this.cycle.pause()
			//console.log('Currently paused...')
		},
		resume() {
			this.cycle.resume()
			//console.log('Currently resumed...')
		},
		calculateTotal() {
			let quantity = 0
			let subtotal = 0
			for (let item in this.order.list) {
				quantity += this.order.list[item].quantity
				subtotal += this.order.list[item].total
				//console.log('inner quantity', quantity)
			}
			this.order.subtotal = Math.round(subtotal * 100)/100
			//console.log('subtotal', this.order.subtotal)
			this.order.tax = Math.round((this.order.subtotal * this.order.taxRate) * 100)/100
			//console.log('tax', this.order.tax)
			this.order.total = Math.round((this.order.subtotal + this.order.tax) * 100)/100
			//console.log('total', this.order.total)
			this.order.quantity = quantity
			//console.log('quantity', quantity)
		},
		submitItem() {
			const data = this.selected
			const total = Math.floor(data.price * data.quantity * 100)/100
			const item = {
				name: data.name,
				quantity: parseFloat(data.quantity),
				price: data.price,
				total: total,
			}
			//console.log(`${item.name}\n\t${item.quantity} X ${item.price} = ${item.total}`)
			if (item.quantity > 0) this.order.list[item.name] = item
			else if (this.order.list[item.name]) delete this.order.list[item.name]
			this.calculateTotal()
		},
		create() {
			this.card = start()
			this.created = true
		},
		recreate() {
			this.created = false
		},
		disableButton() {
			const stripeButton = document.getElementById('stripeButton')
			stripeButton.disabled = true
		},
		async charge() {
			const {token, error} = await stripe.createToken(vm.card)
			if (error) this.errorMessage = error.message
			else {
				this.checkEmail()
				if (this.emailValid) {
					this.disableButton()
					this.token = token
				}
			}
		},
		checkEmail() {
			if (this.email.length) if (isNotEmail(this.email)) {
				this.disableButton()
				this.emailErrors = 'Not a valid email address'
				this.emailValid = false
			} else {
				this.emailErrors = ''
				this.emailValid = true
			}
		},
		resetMessage() {
			if (this.paymentSuccess === 1) {
				this.paymentSuccess = -1
				this.postPaymentMsg = ''
			}
		}
	},
	watch: {
		async token() {
			if (this.token.id) {
				let res = await router.charge(this.token.id, this.order, this.email, this.date)
				this.paymentSuccess = res ? 1 : 0
				//console.log(this.paymentSuccess)
			}
		},
		email() {
			this.checkEmail()
		},
		paymentSuccess() {
			if (this.paymentSuccess === 0) this.postPaymentMsg = 'Charge didn\'t go through!'
			if (this.paymentSuccess === 1) this.postPaymentMsg = 'Got it, just give us a minute!'
		}
	},
	computed: {
		async start() {
			await this.populateClient()
			this.calesitar()
			this.loop()
			this.initiateStoreHours()
			const view = this.schedule.open ? 'menu' : 'closed'
			this.setView(view)
			this.setDate()
			this.ready = true
			//stripe.start()
		}
	},
	mounted() {
		this.$nextTick(() => {
			vm.start()
		})
	},
	filters: {
		round(value) {
			return Math.floor(value * 100)/100
		},
		quantize(value, quantity) {
			return quantity > 0 ? value * quantity : value
		},
		sign(value) {
			const sign = value < 1 ? value > 0 ? '¢' : '' : '$'
			return `${sign}${value}`
		},
		stringify(value, quantity) {
			const msg = quantity > 0 ? 'Your amount' : 'Original Price'
			return `${msg}: ${value}`
		},
	}
})
//global.vm = vm //For debugging only
