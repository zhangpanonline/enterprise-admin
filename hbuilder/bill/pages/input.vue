<template>
	<view class="page">
		<uni-forms border>
			<uni-forms-item label="金额">
				<uni-easyinput v-model="form.amount" type="digit" :inputBorder="false"
					placeholder="请输入金额"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item label="类别">
				<uni-data-picker :localdata="typeOptions"
					:map="{ text: 'name', value: 'id', children: 'category_level2' }" :inputBorder="false"
					popup-title="请选择班级" v-model="form.type"></uni-data-picker>
			</uni-forms-item>
			<uni-forms-item label="日期">
				<uni-datetime-picker type="date" v-model="form.date" start="1970-01-01" end="2099-12-31" />
			</uni-forms-item>
		</uni-forms>
		<button class="submit" type="primary" @click="onSubmit()">提交</button>
	</view>
</template>

<script setup>
	const base_url = 'https://chaykxxzeallzbiyckhn.supabase.co'
	const apikey =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoYXlreHh6ZWFsbHpiaXlja2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjMyODcsImV4cCI6MjA3NTczOTI4N30.W629bPQKn3yiXcfqVLBmIfrsLiTcezLe_Yigw0e-k7I'
	import {
		reactive,
		ref
	} from 'vue'
	const date = new Date()
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const form = reactive({
		amount: null,
		date: `${year}-${month}-${day}`,
		type: ''
	})
	const typeOptions = ref([])
	const onSubmit = async () => {
		const res = await uni.request({
			url: `${base_url}/rest/v1/records?apikey=${apikey}`,
			dataType: 'json',
			method: 'POST',
			header: {
				// Authorization: `Bearer ${apikey}`,
				'Content-Type': 'application/json',
			},
			data: JSON.stringify([{
				date: form.date,
				amount: form.amount,
				category_id: form.type
			}, ]),
		})
		console.log(res, '@@')
	}
	getCategoryTree()
	async function getCategoryTree() {
		try {
			const res = await uni.request({
				url: `${base_url}/rest/v1/rpc/get_category_tree?apikey=${apikey}`,
				dataType: 'json',
			});
			typeOptions.value = res.data
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

	.submit {
		border-radius: 50px;
	}
</style>