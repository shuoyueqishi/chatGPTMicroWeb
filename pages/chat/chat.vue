<template>
	<view>
		<!-- <view>
			<uni-collapse>
				<uni-collapse-item title="聊天工具">
					<uni-row class="tool-bar">
						<uni-col class="tool-item" :span="4">
							<button class="tool-item-btn" type="primary" size="mini" @click="saveChat">保存</button>
						</uni-col>
						<uni-col class="tool-item" :span="4">
							<button class="tool-item-btn" type="primary" size="mini" @click="copyChat">复制</button>
						</uni-col>
						<uni-col :span="6">
							<button class="tool-item-btn" type="primary" size="mini" @click="exportMd">导出MD</button>
						</uni-col>
						<uni-col :span="6">
							<button class="tool-item-btn" type="primary" size="mini" @click="exportPdf">导出PDF</button>
						</uni-col>
						<uni-col :span="4">
							<button type="warn" size="mini" @click="deleteChat">删除</button>
						</uni-col>
					</uni-row>
				</uni-collapse-item>
			</uni-collapse>
		</view> -->
		<view class="chat-container">

			<scroll-view id="chatContainer" class="chat-content" :scroll-top="scroll.curHeight" scroll-y="true"
				scroll-with-animation="true">
				<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
					:direction="direction" @trigger="trigger" @fabClick="fabClick" />
				<view id="chatContent" v-for="(message,index) in mdMessageList" :key="index">
					<view v-if="message.role==='user'" class="message-right">
						<towxml :nodes="message.content" class="content-right" />
						<view class="head-image">
							<image mode="aspectFit" :src="avatarUrl" class="head-image">
							</image>
							<rudon-rowMenuDotDotDot :localdata="options" @change="menuAction($event, index)">
								···
							</rudon-rowMenuDotDotDot>
						</view>
					</view>
					<view v-if="message.role!=='user'" class="message-left">
						<view class="head-image">
							<image mode="aspectFit" src="/static/images/headImages/AI.png" class="head-image"></image>
						</view>
						<view class="content-left">
							<towxml :nodes="message.content" class="content-left" />
						</view>
						<rudon-rowMenuDotDotDot :localdata="options" @change="menuAction($event, index)">
							···
						</rudon-rowMenuDotDotDot>
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
	</view>
</template>

<script>
	import towxml from '@/static/towxml/towxml'
	import util from '@/utils/util.js'

	export default {
		components: {
			towxml
		},
		data() {
			return {
				horizontal: 'left',
				vertical: 'top',
				direction: 'horizontal',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
				content: [{
						iconPath: '/static/images/tabbar/create_new.png',
						selectedIconPath: '/static/images/tabbar/create_new.png',
						text: '新建',
						active: false
					},
					{
						iconPath: '/static/images/tabbar/copy.png',
						selectedIconPath: '/static/images/tabbar/copy.png',
						text: '复制',
						active: false
					},
					{
						iconPath: '/static/images/tabbar/保存.png',
						selectedIconPath: '/static/images/tabbar/保存.png',
						text: '保存',
						active: false
					},
					{
						iconPath: '/static/images/tabbar/删除.png',
						selectedIconPath: '/static/images/tabbar/删除.png',
						text: '删除',
						active: false
					}
				],
				chatHeadId: '',
				userId: '',
				options: [{
						value: 'copyContent',
						text: '复制'
					},
					{
						value: 'deleteContent',
						text: '删除'
					}
				],
				avatarUrl: "/static/images/headImages/userQuery.png",
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
			if (util.isStringNotEmpty(this.$store.state.avatarUrl)) {
				this.avatarUrl = this.$store.state.avatarUrl
			}
			if (util.isStringNotEmpty(this.$store.state.userId)) {
				this.userId = this.$store.state.userId
			}
			this.chatHeadId = options.chatHeadId
			if (util.isNull(this.chatHeadId)) {
				return
			}
			const queryParams = {
				headId: this.chatHeadId
			}
			this.$request.get("/chat-gpt-gw/chat-gpt/chat/content/line/query", queryParams)
				.then(res => {
					if (!res.success) {
						let errMsg = res.message;
						console.error('发送失败:', errMsg)
						uni.showModal({
							content: '请求聊天详情失败, Error:' + errMsg,
							showCancel: false,
							confirmText: '确定'
						})
						return
					}

					let chatLineList = res.data
					for (let i = 0; i < chatLineList.length; i++) {
						let chatMsg = {
							role: chatLineList[i].chatRole,
							content: chatLineList[i].chatContent
						}
						this.chatBody.messages.push(chatMsg)

						let mdMsg = {
							role: chatLineList[i].chatRole,
							content: this.towxmlFunc(chatLineList[i].chatContent, 'markdown'),
						}
						this.mdMessageList.push(mdMsg)
					}
					this.scrollToBottom()
				}).catch(err => {
					this.isSendingMsg = false
					uni.showModal({
						content: '获取聊天详情失败，error:' + err,
						showCancel: false,
						confirmText: '确定'
					})
				})
		},

		onHide() {
			this.saveChat()
		},

		methods: {
			trigger(e) {
				console.log(e)
				this.content[e.index].active = true
				switch (e.item.text) {
					case '新建':
						this.createNewChat()
						break
					case '复制':
						this.copyChat()
						break
					case '保存':
						this.saveChat()
						break
					case '删除':
						this.deleteChat()
						break
					default:
						console.log("deafult")
				}
				this.content[e.index].active = false
			},
			fabClick() {
				console.log("fabClick")
			},
			saveChat() {
				if (this.chatBody.messages.length < 1) return
				let chatLineList = []
				for (let i = 0; i < this.chatBody.messages.length; i++) {
					let chatLine = {
						chatRole: this.chatBody.messages[i].role,
						chatContent: this.chatBody.messages[i].content
					}
					chatLineList.push(chatLine)
				}
				let chatParam = {
					userId: this.userId,
					headId: util.isNull(this.chatHeadId) ? null : this.chatHeadId,
					chatLineVoList: chatLineList
				}
				this.$request.post("/chat-gpt-gw/chat-gpt/chat/content/add", chatParam)
					.then(res => {
						if (!res.success) {
							let errMsg = res.message;
							console.error('保存聊天失败:', errMsg)
							uni.showModal({
								content: '保存聊天详情失败, Error:' + errMsg,
								showCancel: false,
								confirmText: '确定'
							})
							return
						}
						debugger
						this.chatHeadId = res.data
					}).catch(err => {
						this.isSendingMsg = false
						uni.showModal({
							content: '保存聊天信息失败，error:' + err,
							showCancel: false,
							confirmText: '确定'
						})
					})
			},
			createNewChat() {
				this.saveChat()
				this.chatBody = {
					model: "gpt-3.5-turbo",
					messages: []
				}
				this.mdMessageList = []
			},
			copyChat() {
				var chatContentArr = new Array();
				if (util.isNotNull(this.chatHeadId)) {
					chatContentArr.push("# ")
					chatContentArr.push("会话-")
					chatContentArr.push(this.chatHeadId)
					chatContentArr.push("\n")
				}
				for (var i = 0; i < this.chatBody.messages.length; i++) {
					let msg = this.chatBody.messages[i]
					chatContentArr.push("### ")
					chatContentArr.push(msg.role)
					chatContentArr.push("\n")
					chatContentArr.push(msg.content)
					chatContentArr.push("\n\n")
					chatContentArr.push("---")
					chatContentArr.push("\n\n")
				}
				let chatContentStr = chatContentArr.join('');
				uni.setClipboardData({
					data: chatContentStr,
					success: () => {
						uni.showToast({
							title: "复制MD文本成功"
						})
					}
				})
			},
			exportPdf() {
				uni.showModal({
					content: '功能开发中...',
					showCancel: false,
					confirmText: '确定'
				})
			},
			exportMd() {
				uni.showModal({
					content: '功能开发中...',
					showCancel: false,
					confirmText: '确定'
				})
			},
			deleteChat() {
				if (util.isNotNull(this.chatHeadId)) {
					let idList = []
					idList.push(this.chatHeadId)
					let delParam = {
						headIdList: idList
					}
					this.$request.del("/chat-gpt-gw/chat-gpt/chat/content/delete", delParam)
						.then(res => {
							if (!res.success) {
								let errMsg = res.message;
								console.error('删除聊天失败:', errMsg)
								uni.showModal({
									content: '删除聊天详情失败, Error:' + errMsg,
									showCancel: false,
									confirmText: '确定'
								})
								return
							}
							this.chatHeadId = res.data
						}).catch(err => {
							this.isSendingMsg = false
							uni.showModal({
								content: '删除聊天信息失败，error:' + err,
								showCancel: false,
								confirmText: '确定'
							})
						})
				}
				this.chatBody = {
					model: "gpt-3.5-turbo",
					messages: []
				}
				this.mdMessageList = []
			},
			menuAction(action, rowId) {
				// 打印看参数
				console.log(JSON.stringify(action))
				console.log(JSON.stringify(rowId))
				// 忽略初始化时的传入的空操作
				if (action === '') {
					return
				}
				// 动作
				if (action === 'copyContent') {
					let value = this.chatBody.messages[rowId].content
					uni.setClipboardData({
						data: value,
						success: () => {
							uni.showToast({
								title: "复制文本成功"
							})
						}
					})
				} else if (action === 'deleteContent') {
					this.chatBody.messages.splice(rowId, 1)
					this.mdMessageList.splice(rowId, 1)
					this.saveChat()
					success: () => {
						uni.showToast({
							title: "删除成功"
						})
					}
				}
			},
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
				this.$request.post("/chat-gpt-gw/chat-gpt/v1/chat/completions", this.chatBody).then(res => {
					if (!res.success) {
						let errMsg = res.message;
						console.error('发送失败:', errMsg)
						uni.showModal({
							content: '请求ChatGPT失败, Error:' + errMsg,
							showCancel: false,
							confirmText: '确定'
						})
						this.isSendingMsg = false
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
	.tool-bar {
		display: flex;
		flex-direction: row;
		padding-left: 10rpx;
		align-items: flex-center;
		align-content: flex-center;
		justify-content: space-aroud;
		background-color: whitesmoke;
	}

	.tool-item {
		flex-basis: 100rpx;
		flex-grow: 1;
	}

	.tool-item-btn {
		background-color: #007AFF;
	}

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
		/* background-color: lightyellow; */
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
		width: 65rpx;
		height: 65rpx;
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

	.copyBtn {
		width: 15rpx;
		align-items: flex-start;
	}

	.content-right {
		padding-right: 10rpx;
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