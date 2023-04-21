<template>
	<view class="chat-container">
		<scroll-view id="chatContainer" class="chat-content" :scroll-top="scroll.curHeight" scroll-y="true"
			scroll-with-animation="true">
			<view id="chatContent" v-for="(message,index) in mdMessageList" :key="index">
				<view v-if="message.role==='user'" class="message-right">
					<towxml :nodes="message.content" class="content-right" />
					<view class="head-image">
						<image mode="aspectFit" src="/static/images/headImages/userQuery.png" class="head-image">
						</image>
					</view>
				</view>
				<view v-if="message.role!=='user'" class="message-left">
					<view class="head-image">
						<image mode="aspectFit" src="/static/images/headImages/AI.png" class="head-image"></image>
					</view>
					<view class="content-left">
						<towxml :nodes="message.content" class="content-left" />
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="chat-input-container">
			<view class="chat-input-wrapper">
				<textarea @input="onInput" @blur="onBlur" :value="inputValue" focus="true" auto-height="true"
					placeholder="请输入信息" maxlength="-1" class="chat-input" />
			</view>
			<view class="chat-send-btn-wrapper">
				<button class="chat-send-btn" type="primary" @click="onSend">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
	import towxml from '@/static/towxml/towxml'

	export default {
		components: {
			towxml
		},
		data() {
			return {
				testMsgList: [{
					role: "user",
					content: '你好: ``` public class Demo{ private String name;}```'
				}, {
					role: "assistant",
					content: '这是你需要的代码 ``` public class Assistant{ private String name; private String code;}```  # 结果如下：- 1 - 2'
				}],
				towxmlFunc: require('@/static/towxml/index.js'),
				mdMessageList: [], // 页面显示MD的消息列表
				pendingMsg: {
					role: 'assistant',
					content: '我正在努力思考中，请耐心等待10-90s...',
				},
				inputValue: '', // 输入框的值
				isSendingMsg: false,
				chatBody: {
					model: "gpt-3.5-turbo",
					messages: []
				}, // 发送ChatGPT的body
				scroll: {
					curHeight: 0,
					curSubItems: 0,
				},
			}
		},
		onLoad(options) {
			if (this.testMsgList.length > 0) {
				for (let i = 0; i < this.testMsgList.length; i++) {
					this.mdMessageList.push({
						role: this.testMsgList[i].role,
						content: this.towxmlFunc(this.testMsgList[i].content, 'markdown')
					})
				}
			}
		},

		methods: {
			onBlur(e) {
				console.log("onBlur e.detail.value=" + e.detail.value)
				// this.onSend()
			},
			bindTextAreaBlur(e) {
				console.log("bindTextAreaBlur e.detail.value=" + e.detail.value)
			},
			// 输入框输入时触发
			onInput(e) {
				console.log("onInput(e), e.detail.value=" + e.detail.value)
				this.inputValue = e.detail.value
			},
			// 点击发送按钮时触发
			onSend() {
				console.log("inputValue=" + this.inputValue)
				if (this.isSendingMsg) {
					uni.showModal({
						content: '正在等待ChatGPT返回信息，需要10-90s左右，请稍后尝试',
						showCancel: false,
						confirmText: '确定'
					})
					return
				}
				// 构造要发送的消息对象
				const message = {
					role: 'user', // 消息发送者
					content: this.inputValue, // 消息内容
				}
				// 发送消息
				this.sendMessage(message)
				// 清空输入框
				this.inputValue = ''
			},
			// 发送消息
			sendMessage(message) {
				let mdMessage = {
					role: message.role,
					content: this.towxmlFunc(message.content, 'markdown')
				}
				this.mdMessageList.push(mdMessage)
				this.isSendingMsg = true
				this.chatBody.messages.push(message) // 默认开启聊天上下文，将请求消息放入messages
				let mdPendingMsg = {
					role: this.pendingMsg.role,
					content: this.towxmlFunc(this.pendingMsg.content, 'markdown')
				}
				this.mdMessageList.push(mdPendingMsg) // 插入提示语
				this.scrollToBottom()
				this.$request.post("/chat-server/v1/chat/completions", this.chatBody).then(res => {
					debugger
					if (!res.success) {
						let errMsg = res.message;
						console.error('发送失败:', errMsg)
						uni.showModal({
							content: '请求ChatGPT失败, Error:' + errMsg,
							showCancel: false,
							confirmText: '确定'
						})
						return
					}
					console.log('消息发送成功', res)
					let aiContent = res.data.choices[0].message.content
					let lastMsg = this.mdMessageList[this.mdMessageList.length - 1]
					if (lastMsg.role === 'assistant') {
						this.mdMessageList.pop() // 删除提示信息
					}
					let resMsg = {
						role: 'assistant',
						content: aiContent,
					}
					let resMdMsg = {
						role: 'assistant',
						content: this.towxmlFunc(aiContent, 'markdown'),
					}
					this.chatBody.messages.push(resMsg) // 默认开启聊天上下文，将返回消息放入messages
					this.mdMessageList.push(resMdMsg) // 信息显示
					this.isSendingMsg = false
					this.scrollToBottom()
				}).catch(err => {
					this.isSendingMsg = false
					uni.showModal({
						content: '请求ChatGPT失败，可能服务器繁忙，请稍后再试',
						showCancel: false,
						confirmText: '确定'
					})
				})
			},

			//滚动到底部
			scrollToBottom() {
				debugger
				let query = uni.createSelectorQuery().in(this)
				query.select('#chatContainer').boundingClientRect()
				query.selectAll('#chatContent').boundingClientRect()
				query.exec((res) => {
					console.log("res[0].height=", res[0].height)
					console.log("res[1].length=", res[1].length)
					let items = res[1].length
					if (items > this.scroll.curSubItems) {
						let heightSum = 0
						for (let i = 0; i < res[1].length; i++) {
							heightSum = heightSum + res[1][i].height
						}
						this.scroll.curHeight = heightSum
						console.log("this.scroll.curHeight=" + this.scroll.curHeight)
					}
				})
			},
		},
	}
</script>


<style scoped>
	.chat-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100vh;
		overflow: auto;
		box-sizing: border-box;
	}

	.chat-content {
		display: flex;
		flex-direction: column;
		background-color: lightyellow;
		width: 100%;
		height: 90vh;
	}

	.message-left {
		/*flex布局*/
		display: flex;
		/*交叉轴（垂直轴）方向，顶部对齐*/
		align-items: flex-start;
		/*主轴（水平轴）方向，左对齐*/
		justify-content: flex-start;
		margin: 10rpx;
	}

	.message-right {
		/*flex布局*/
		display: flex;
		/*交叉轴（垂直轴）方向，顶部对齐*/
		align-items: flex-start;
		/*主轴（水平轴）方向，右对齐*/
		justify-content: flex-end;
		margin: 10rpx;
	}

	.head-image {
		width: 60rpx;
		height: 60rpx;
		/* flex-basis: 60rpx; */
	}

	.content-left>>>.h2w__main {
		border-radius: 10rpx;
		border: 2rpx solid black;
		background-color: #f0f0f0;
		flex-shrink: 1;
		max-width: 600rpx;
		padding: 0rpx 10rpx;
		margin: 0;
	}

	.content-right>>>.h2w__main {
		border-radius: 10rpx;
		border: 2rpx solid black;
		background-color: #e0f0f0;
		flex-shrink: 1;
		padding: 0rpx 10rpx;
		margin: 0;
		max-width: 600rpx;
	}

	.chat-input-container {
		width: 100%;
		height: 10vh;
		display: flex;
		align-items: center;
		align-items: center;
		justify-content: space-between;
	}

	.chat-input-wrapper {
		padding-left: 10rpx;
	}

	.chat-input {
		min-height: 70rpx;
		width: 590rpx;
		background-color: #f2f2f2;
		border-radius: 10rpx;
		flex-grow: 1;
		flex-basis: 200rpx;
		padding-left: 20rpx;
		padding-top: 10rpx;
	}

	.chat-send-btn-wrapper {
		flex-basis: 110rpx;
		border-radius: 10rpx;
		padding-right: 10rpx;
	}

	.chat-send-btn {
		width: 100%;
		font-size: 24rpx;
		background-color: #007AFF;
		color: #FFFFFF;
	}
</style>