/*eslint no-unused-vars: ["warn", { "vars": "local" },]*/
/*global styles global*/
import styles from './styles'
import Vue from 'vue'
import router from './network/router'
//import organic from './organic'

const vm = new Vue({
	el: '#app',
	data: {
		food: {
			trending: {
				populated: false,
				data: {},
			},
			latest: {
				populated: false,
				data: {},
			},
			frequent: {
				populated: false,
				data: {},
			},
			menu: [
				{
					name: 'milkshake',
					category: 'drinks',
					price: '9.99',
					photo: 'http://www.portalsabores.com.br/wp-content/uploads/2014/08/Spiked-Milkshakes.jpg',
					description: 'Yum!',
					index: 0
				},
				{
					name: 'media luna',
					category: 'pan',
					price: '2.99',
					photo: 'https://thehappening.com/wp-content/uploads/2016/02/cafe-y-pan.jpg',
					description: '¡Delicioso!',
					index: 2
				},
				{
					name: 'apple pie',
					category: 'deserts',
					price: '100.99',
					photo: 'http://www.willcookforsmiles.com/wp-content/uploads/2016/09/Apple-Pie-Bread-Pudding-3-from-willcookforsmiles.com_.jpg',
					description: 'Yum!'
				},
			],
		},
		schedule: {
			open: {
				time: ''
			},
			close: {
				time: ''
			},
		},
		components: {
			suggested: {
				populated: true,
				show: false,
				data: {},
			},
		},
		stats: {

		},
	},
	methods: {
		updateSuggested() {
			const suggested = this.components.suggested
			const frequent = this.food.frequent
			const trending = this.food.trending
			const latest = this.food.latest
			if (frequent.populated) {
				suggested.data = frequent.data
			} else if (trending.populated) {
				suggested.data = trending.data
			} else if (latest.populated) {
				suggested.data = latest.data
			} else suggested.populated = false
			suggested.show = suggested.populated
		},
		updateFrequent(frequent) {
			this.food.frequent = frequent
		},
		updateTrending(trending) {
			this.food.trending = trending
		},
		updateLatest(latest) {
			this.food.latest = latest
		},
		async populateClient() {
			const data = await router.getData()
			this.updateFrequent(data.frequent)
			this.updateTrending(data.trending)
			this.updateLatest(data.latest)
		}
	},
	watch: {

	},
	computed: {
		async start() {
			await this.populateClient()
			await this.updateSuggested()
		},
	},
	mounted() {
		this.$nextTick(() => {
			vm.start()
		})
	},
})
//global.vm = vm //For debugging only
