<template>
	<view>
		<uni-list class="chat-list">
			<!-- <view v-for="(value, key) in chatHeadList" :key="key">
				<uni-list-chat :avatar-circle="true" :avatar="avatarUrl" :title="value.headId" :note="value.chatName"
					:time="value.lastUpdateDate" clickable @click="gotoChatDetail(value)"></uni-list-chat>
			</view> -->
			<view class="chat-list-item" v-for="(value, key) in chatHeadList" :key="key"
				@click="gotoChatDetailByIdx(key)">
				<view>
					<image class="avata-logo" :src="avatarUrl"></image>
				</view>
				<view class="chat-content">
					<view class="chat-time">
						<text>{{ value.lastUpdateDate }}</text>
					</view>
					<view class="chat-name">
						<text>{{ value.chatName }}</text>
					</view>
				</view>
			</view>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chatName: '',
				chatHeadList: [],
				avatarUrl: this.$store.state.avatarUrl,
			}
		},

		onShow(options) {
			this.queryChatMessage()
		},
		methods: {

			gotoChatDetailByIdx(index) {
				debugger
				let headId = this.chatHeadList[index].headId
				console.log("gotoChatDetailByIdx headId=", headId)
				// 关闭当前页面，去往指定页面
				uni.reLaunch({
					url: `/pages/chat/chat?chatHeadId=${headId}`
				});
			},

			gotoChatDetail(value) {
				debugger
				console.log("gotoChatDetail...")
				// 关闭当前页面，去往指定页面
				uni.redirectTo({
					url: `../chat/chat?chatHeadId=${value.headId}`
				})
			},

			queryChatMessage() {
				const param = {
					userId: this.$store.state.userId
				}
				this.$request.get("/chat-gpt-gw/chat-gpt/chat/content/head/query", param)
					.then(res => {
						if (!res.success) {
							let errMsg = res.message;
							console.error('发送失败:', errMsg)
							uni.showModal({
								content: '请求聊天历史失败, Error:' + errMsg,
								showCancel: false,
								confirmText: '确定'
							})
							return
						}
						this.chatHeadList = res.data
					}).catch(err => {
						this.isSendingMsg = false
						uni.showModal({
							content: '请求聊天历史失败，error:' + err,
							showCancel: false,
							confirmText: '确定'
						})
					})
			}
		}
	}
</script>

<style lang="scss">
	.chat-list {
		display: flex;
		flex-direction: column;
		padding: 5rpx;
		margin: 1rpx;

		.chat-list-item {
			display: flex;
			flex-direction: row;
			padding: 10rpx;
			margin: 5rpx;
			align-items: flex-center;
			align-content: flex-center; //可以设置交叉轴的对齐方式
			justify-content: space-aroud;
			background-color: whitesmoke;
			border-radius: 20rpx;

			.avata-logo {
				width: 100rpx;
				height: 100rpx;
				border-radius: 15rpx;
			}

			.chat-content {
				padding-left: 10rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.chat-time {
					font-size: 30rpx;
				}

				.chat-name {
					font-size: 40rpx;
				}
			}
		}
	}
</style>