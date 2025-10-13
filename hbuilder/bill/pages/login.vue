<template>
	<view class="page">
		<button type="primary" open-type="getUserInfo" @getuserinfo="wxlogin">点击登录</button>
	</view>
</template>

<script setup>
	const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoYXlreHh6ZWFsbHpiaXlja2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjMyODcsImV4cCI6MjA3NTczOTI4N30.W629bPQKn3yiXcfqVLBmIfrsLiTcezLe_Yigw0e-k7I'

	const wxlogin = async (e) => {
		uni.showLoading({
			mask: true,
			title: '登录中...'
		})
		uni.login({
			async success(res) {
				const login_code = res.code
				if (login_code) {
					//发起网络请求
					const res = await uni.request({
						url: `${getApp().globalData.base_url}/functions/v1/wechat-login`,
						dataType: "json",
						method: "POST",
						header: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${apikey}`, // 必须带上 Supabase 鉴权
						},
						data: JSON.stringify({
							code: login_code
						}),
					});
					const user = await uni.request({
						url: `${getApp().globalData.base_url}/auth/v1/token?grant_type=password`,
						dataType: "json",
						method: "POST",
						header: {
							"Apikey": apikey,
							"Content-Type": "application/json;charset=UTF-8",
							"Authorization": `Bearer ${apikey}`, // 必须带上 Supabase 鉴权
						},
						data: JSON.stringify({
							email: res.data.openid + '@wechat.local',
							password: res.data.openid
						}),
					});
					console.log(e.detail.userInfo.avatarUrl, '用户头像')
					uni.setStorageSync('token', user.data.access_token)
					uni.setStorageSync('userInfo', user.data.user)
					uni.switchTab({
						url: '/pages/input'
					})
					uni.hideLoading()
				} else {
					console.log('登录失败！' + res.errMsg)
					uni.hideLoading()
				}
			}
		})
	}
</script>

<style lang="scss" scoped>
	.page {
		background: $uni-bg-color;
		height: 100vh;
		padding: $uni-spacing-base;
		box-sizing: border-box;
		display: flex;
		// justify-content: center;
		align-items: center;
	}
</style>