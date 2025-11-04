export default {
	props: {
		weekList: {
			type: Array,
			default: () => {
				return []
			}
		},
		selectedWeek: {
			type: String,
			default: ''
		},
		monthList: {
			type: Array,
			default: () => {
				return []
			}
		},
		selectedMonth: {
			type: String,
			default: ''
		},
		showMonth: {
			type: Boolean,
			default: false
		},
		// 折叠状态
		FoldStatus: {
			type: String,
			default: null
		},
		// 自定义类型 day:天 week:周 month:月
		customType: {
			type: String,
			default: '',
			validator(value) {
				return ['month', 'week', 'day'].includes(value)
			}
		},
		month: {
			type: [Number, String],
			default: null
		},
		color: {
			type: String,
			default: '#3c9cff'
		},
		startText: {
			type: String,
			default: '开始'
		},
		endText: {
			type: String,
			default: '结束'
		},
		weeks: {
			type: [Object, Array],
			default: ()=> {
				return []
			}
		},
		calendar: {
			type: Object,
			default: () => {
				return {}
			}
		},
		selected: {
			type: Array,
			default: () => {
				return []
			}
		},
		lunar: {
			type: Boolean,
			default: false
		},
		itemHeight: {
			type: Number,
			default: 64
		},
		monthShowCurrentMonth: {
			type: Boolean,
			default: false
		},
		actBadgeColor: {
			type: String,
			default: '#fff'
		},
		// 默认边距
		defaultMargin: {
			type: Number,
			default: 8
		},
		// 是否显示今日默认样式(默认为true)
		todayDefaultStyle: {
			type: Boolean,
			default: true
		},
	}
}