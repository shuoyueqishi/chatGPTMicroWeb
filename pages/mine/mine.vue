<template>
	<view class="mine-containar">
		<view class="myinfo-containar">
			<image class="avatar-display" :src="avatarUrl"></image>
			<view class="name-dispaly">
				<text class="nickname-display">{{nickname}}</text>
				<text class="id-display">用户ID: <text style="font-weight: bold;">{{userId}}</text></text>
			</view>
			<view class="grant-btn">
				<navigator url="/pages/userInfo/userInfo">
					<button click="grantUserInfo" type="default" size="mini">授权微信用户信息></button>
				</navigator>
			</view>
		</view>
		<view class="text-display"><text>当前积分: {{credit}}</text></view>
		<view class="text-display"><text>电话号码: {{telephone}}</text></view>
	</view>
</template>

<script>
	import request from '@/request/request.js'
	import store from '@/store/store.js'
	export default {
		data() {
			return {
				avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				nickname: '匿名用户',
				userId: '',
				telephone: '',
				openid: '',
				credit: '1000'
			}
		},
		onShow(options) {
			if (this.$util.isStringNotEmpty(this.$store.state.avatarUrl)) {
				this.avatarUrl = this.$store.state.avatarUrl
			}
			if (this.$util.isStringNotEmpty(this.$store.state.nickname)) {
				this.nickname = this.$store.state.nickname
			}
			if (this.$util.isStringNotEmpty(this.$store.state.openid)) {
				this.openid = this.$store.state.openid
			}
			if (this.$util.isStringNotEmpty(this.$store.state.userId)) {
				this.userId = this.$store.state.userId
			}
		},
		methods: {
			grantUserInfo() {

			},
		}
	}
</script>

<style lang="scss">
	.mine-containar {
		display: flex;
		flex-direction: column;
		padding: 15rpx;
		margin: 10rpx;

		.myinfo-containar {
			display: flex;
			flex-direction: row;
			padding: 10rpx;
			margin: 5rpx;
			align-items: flex-center;
			align-content: flex-center; //可以设置交叉轴的对齐方式
			justify-content: space-aroud;

			.avatar-display {
				flex-basis: 150rpx;
				max-height: 150rpx;
				border-radius: 10rpx;
			}

			.name-dispaly {
				display: flex;
				flex-direction: column;
				flex-basis: 100rpx;
				flex-grow: 1;
				font-family: system-ui;
				padding-left: 20rpx;

				.nickname-display {
					flex-basis: 100rpx;
					flex-grow: 1;
					font-size: 40rpx;
					font-weight: bold;
				}

				.id-display {
					font-size: 30rpx;
				}
			}

			.grant-btn {
				height: 120rpx;
				font-size: 32rpx;
			}
		}

		.text-display {
			font-size: 35rpx;
			padding-top: 30rpx;
			padding-left: 25rpx;
		}
	}
</style>