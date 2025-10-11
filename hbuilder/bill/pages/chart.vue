<template>
	<view class="page">
		<uni-group v-for="v in data" :key="v.date" :title="v.date" top="20" mode="card">
			<view class="group-item" v-for="item in v.list">
				<text>{{item.amount}}</text>
				<text>{{item.category_level1_name}}</text>
				<text>{{item.category_level2_name}}</text>
			</view>
		</uni-group>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
	} from 'vue'
	import {
	    onShow
	  } from "@dcloudio/uni-app";
	const base_url = 'https://chaykxxzeallzbiyckhn.supabase.co'
	const apikey =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoYXlreHh6ZWFsbHpiaXlja2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjMyODcsImV4cCI6MjA3NTczOTI4N30.W629bPQKn3yiXcfqVLBmIfrsLiTcezLe_Yigw0e-k7I'
	const data = ref([])
	onShow(getCategoryTree)
	async function getCategoryTree() {
		try {
			const res = await uni.request({
				url: `${base_url}/rest/v1/rpc/get_records_list1?apikey=${apikey}`,
				dataType: 'json',
			});
			console.log(res)
			data.value = res.data
		} catch (err) {
			console.error(err)
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background: $uni-bg-color;
		height: 100vh;
		padding: $uni-spacing-base;
		box-sizing: border-box;
	}
	.group-item {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}
</style>