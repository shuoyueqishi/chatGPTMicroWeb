<template>
	<view>
	    <text>系统当前发生了错误！！！</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			let timer = setTimeout(()=>{
				clearTimeout(timer)
				uni.switchTab({
					url:'/pages/home/home'
				})
			},2000)
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
