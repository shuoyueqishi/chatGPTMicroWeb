<template>
	<view>
		<view>我的个人信息</view>
		<button class="avatar-wrapper" open-type="chooseAvatar" bind:chooseavatar="onChooseAvatar">
			<image class="avatar" :src="avatarUrl"></image>
		</button>
		<view>
			<view>openid: {{openid}}</view>
			<view>sessionKey: {{sessionKey}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
			}
		},
		computed: {
			openid() {
				return this.$store.state.openid
			},
			sessionKey() {
				return this.$store.state.sessionKey
			}
		},
		methods: {
			onChooseAvatar(e) {
				debugger
				const {
					avatarUrl
				} = e.detail
				this.avatarUrl = avatarUrl
			}
		}
	}
</script>

<style>

</style>