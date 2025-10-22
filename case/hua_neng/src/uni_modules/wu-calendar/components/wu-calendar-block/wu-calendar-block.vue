<template>
	<view class="wu-calendar-block"  >
		<view v-if="showMonth && FoldShowMonth" class="wu-calendar__box-bg">
			<text class="wu-calendar__box-bg-text">{{month}}</text>
		</view>
		<!-- 月或周日历 -->
		 <template v-if="customType === 'day'" >
			<view class="wu-calendar__weeks" v-for="(item, index) in weeks" :key="index">
				<template v-for="(weeks, weeksIndex) in item" :key="weeksIndex">
					<wu-calendar-item :key="weeksIndex" v-if="!monthShowCurrentMonth || !weeks.empty" class="wu-calendar-item--hook" :weekItemStyle="weekItemStyle" :weeks="weeks" :calendar="calendar"
						:selected="selected" :lunar="lunar" @change="choiceDate" :color="color" :actBadgeColor="actBadgeColor"
						:startText="startText" :endText="endText" :itemHeight="itemHeight - defaultMargin" :todayDefaultStyle="todayDefaultStyle"></wu-calendar-item>
					<view v-else class="wu-calendar__weeks-item" :style="[weekItemStyle]"></view>
				</template>
			</view>
		 </template>
		<view v-else-if="customType === 'week'" class="grid grid-cols-3 gap-[15px] ">
            <view
              class="h-[106px] box-border border font-500 whitespace-nowrap border-solid border-[#EAEAEA] rounded-[6px] p-[5px] flex flex-col justify-around items-center"
              :class="{ 'bg-primary': v.id == selectedWeek }"
              v-for="v in weekLists"
              :key="v.id"
              @click="choiceDate(v)"
            >
              <text
                class="text-4"
                :class="[
                  v.id == selectedWeek ? 'text-white' : 'text_color1',
                ]"
                >{{ v.info }}</text
              >
              <text
                class="text-[14px]"
                :class="[
                  v.id == selectedWeek ? 'text-white/80' : 'text_color2',
                ]"
                >{{ `${v.start}—${v.end || v.start}` }}</text
              >
			    <text
			  	v-if="![null, undefined].includes(v.value2)"
                :class="
                  [
                    'inline-block',
                    'text-[10px]',
                    'w-full',
                    'h-[14px]',
					'leading-[14px]',
                    'rounded-[2px]',
                    'text-center',
					v.id == selectedWeek ? 'text-primary' : 'text-white',
                    v.id == selectedWeek
                      ? 'bg-white!'
                      : 'bg-primary'
                  ].toString()
                "
                >{{ v.value2 }}</text
              >
              <text
			  	:style="v.style"
                :class="
                  [
                    'inline-block',
                    'text-[10px]',
                    'w-full',
                    'h-[14px]',
					'leading-[14px]',
                    'rounded-[2px]',
                    'text-center',
                    v.id == selectedWeek
                      ? 'bg-white!'
                      : ''
                  ].toString()
                "
                >{{ v.value }}</text
              >
            </view>
          </view>
		<view v-else-if="customType === 'month'" class="grid grid-cols-4 gap-[15px]">
            <view
              class="  h-[66px] box-border border font-500 whitespace-nowrap border-solid border-[#EAEAEA] rounded-[6px] p-[5px] flex flex-col justify-around items-center"
              :class="{ 'bg-primary': v.id === selectedMonth }"
              v-for="v in monthList"
              :key="v.id"
              @click="choiceDate(v)"
            >
              <text
                class="text-4"
                :class="[
                  v.id === selectedMonth ? 'text-white' : 'text_color1',
                ]"
                >{{ v.info }}</text
              >
              <text
				v-if="![null, undefined].includes(v.value2)"
                :class="
                  [
                    'inline-block',
                    'text-[10px]',
                    'w-full',
                    'h-[14px]',
                    'rounded-[2px]',
                    'text-center',
					'leading-[14px]',
					v.id === selectedMonth ? 'text-primary' : 'text-white',
                    v.id === selectedMonth
                      ? 'bg-white!'
                      : 'bg-primary'
                  ].toString()
                "
                >{{ v.value2 }}</text
              >
			    <text
			  	:style="v.style"
                :class="
                  [
                    'inline-block',
                    'text-[10px]',
                    'w-full',
                    'h-[14px]',
                    'rounded-[2px]',
					'leading-[14px]',
                    'text-center',
                    v.id === selectedMonth
                      ? 'bg-white!'
                      : ''
                  ].toString()
                "
                >{{ v.value }}</text
              >
            </view>
          </view>
	</view>
</template>

<script>
	import mpMixin from '@/uni_modules/wu-ui-tools/libs/mixin/mpMixin.js';
	import mixin from '@/uni_modules/wu-ui-tools/libs/mixin/mixin.js';
	import props from './props.js';
	import WuCalendarItem from '../wu-calendar-item/wu-calendar-item.vue'

	import {
		initVueI18n
	} from '@dcloudio/uni-i18n'
	import i18nMessages from '../i18n/index.js'
	const {
		t
	} = initVueI18n(i18nMessages)

	export default {
		emits: ['change'],
		mixins: [mpMixin, mixin, props],
		data() {
			return {
				FoldShowMonth: false,
			}
		},
		mounted() {
			this.FoldShowMonth = this.FoldStatus == 'open';
		},
		computed: {
			weekLists() {
				return this.weekList
				// let list = []
				// Object.values(this.weeks).forEach((ll, idx) => {
				// 	const lList = ll.filter(v => v.fullDate)
				// 	lList.forEach((l, i) => {
				// 		if (i === 0) {
				// 			if (l.fullDate) {
				// 				list[idx] = {
				// 					fullStart: l.fullDate,
				// 					start: l.fullDate.slice(5),
				// 					info: `第${idx + 1}周`,
				// 					...this.weekList[idx]
				// 				}
				// 			}
				// 		} else {
				// 			if (l.fullDate) {
				// 				list[idx].fullEnd = l.fullDate
				// 				list[idx].end = l.fullDate.slice(5)
				// 			}
				// 		}
				// 	})
				// })
				// return list
			},
			weekItemStyle() {
				let weeksLength = Object.keys(this.weeks).length;
				let calendarHeight = this.FoldStatus === 'open' ? this.itemHeight * 6 : this.itemHeight;
				let margin = weeksLength && this.weeks[weeksLength - 1][0].empty ? this.itemHeight / (weeksLength - 1) + this.defaultMargin : this.defaultMargin
				return {
					marginTop: margin / 2 + 'px',
					marginBottom: margin / 2 + 'px',
					height: this.itemHeight - this.defaultMargin + 'px'
				}
			}
		},
		watch: {
			FoldStatus(newVal) {
				this.$nextTick(()=>{
					this.FoldShowMonth = this.FoldStatus == 'open';
				})
			}
		},
		methods: {
			choiceDate(weeks) {
				this.$emit('change', weeks)
			},
		}
	}
</script>

<style lang="scss" scoped>
	$wu-text-color-grey: #999;
	
	.wu-calendar-block {
		.wu-calendar__weeks {
			position: relative;
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			flex-direction: row;
			padding: 0 8rpx;
		}
		
		.wu-calendar__weeks-item {
			flex: 1;
		}
		
		.wu-calendar__box-bg {
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			justify-content: center;
			align-items: center;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			pointer-events: none;
		}
		
		.wu-calendar__box-bg-text {
			font-size: 100rpx;
			transform: scale(4);
			font-weight: bold;
			color: $wu-text-color-grey;
			opacity: 0.1;
			text-align: center;
			/* #ifndef APP-NVUE */
			line-height: 1;
			/* #endif */
		}
	}
</style>