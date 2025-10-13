<script>
	import {
		version
	} from './package.json'

	export default {
		onLaunch: function() {
			console.log('App Launch');
			const token = uni.getStorageSync('token')
			if (token) {
				uni.switchTab({
					url: '/pages/input'
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			base_url: 'https://chaykxxzeallzbiyckhn.supabase.co',
			apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoYXlreHh6ZWFsbHpiaXlja2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjMyODcsImV4cCI6MjA3NTczOTI4N30.W629bPQKn3yiXcfqVLBmIfrsLiTcezLe_Yigw0e-k7I'
		}
	}
</script>
<style lang="scss">
@import '@/uni_modules/uni-scss/index.scss';
</style>

