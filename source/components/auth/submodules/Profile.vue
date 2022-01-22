<template>
	<div class="auth_profile-container">

		<section class="auth_profile-header" :style="`background-image: url(${ UserState.UserImageID })`">
			<i :style="`background-image: url(${ UserState.UserImageID })`" />
			<div class="auth_profile-header-info">
				<tag :light="true">
					{{ UserState.UserName }}
				</tag>
				<span>{{ DefineUserStatus(UserState.UserStatus) }}</span>
			</div>
		</section>

		<section class="auth_profile-body">

			<template v-for="(area, index) in profileAreas">
				<div v-if="area" :key="index" class="auth_profile-body-section">
					<strong>{{ area.title }}</strong>
					<span>{{ area.value }}</span>
					<icon :name="area.icon" />
						<!-- <popover>
							{{ area.info }}
						</popover> -->
				</div>
			</template>

		</section>

		<section v-once class="auth_profile-footer">

			<!-- <template v-if="$isMobile">
				<nuxt-link tag="button" :to="`/user-panel?uid=${ UserState.UserID }`">
					Личный Кабинет
				</nuxt-link>
			</template>

			<nuxt-link v-if="UserState.UserID === __SELF_KEY__" tag="button" to="/admin">
				Админ Панель
			</nuxt-link> -->
			<eccheuma-button @click.native="logout()">
				Выйти
			</eccheuma-button>
		</section>

	</div>
</template>

<style lang="scss">

.auth_profile {
	&-container {

		overflow: {
			y: hidden;
			x: hidden;
		}

		border: {
			radius: var(--border-radius);
		}

		background: {
			color: rgb(var(--color-mono-200));
		}

	}

	&-header {

		display: grid;
		position: relative;
		place-content: center;
		justify-items: center;

		gap: 2vh;
		padding-block: 2vh;

		color: rgb(var(--color-mono-900));
		background: {
			repeat: no-repeat;
			size: calc(100% - 1.4rem) auto;
			position: center;
		}

		&:before {

			content: '';

			position: absolute;
			width: 100%; height: 100%;

			background: {
				color: rgba(var(--color-mono-1000), 1);
			}

			mix-blend-mode: color;
			z-index: 1;

		}

		&:after {

			content: '';

			position: absolute;
			width: 100%; height: 100%;

			background: radial-gradient(
				closest-side, 
				rgba(var(--color-mono-200), .75) 0%, 
				rgba(var(--color-mono-200), 1) 95%
			);

			z-index: 1;

		}

		i {

			// height: clamp(100px, 15vh, 100%);
			height: 100px;
			aspect-ratio: 1/1;
			z-index: 2;

			background: {
				size: cover;
				repeat: no-repeat;
				position: center;
			}

			border: {
				radius: 100%;
				width: 4px;
				style: solid;
				color: var(--color-accent-edges-100);
			}

		}

		&-info {
			z-index: 2;
			display: grid;
			row-gap: 1vh;
			text-align: center;
		}

	}

	&-body {

		width: 85%;
    margin: 0 auto;

		padding: 3vh 0;

		&-section {

			display: inline-grid;

			width: 100%;

			margin-bottom: 2vh;

			grid-template: {
				columns: 4fr 1fr;
				areas: 	'title title'
								'value info'
			}

			row-gap: .5vh;

			strong {
				grid: {
					column: title;
					row: 		title;
				}

				font: {
					size: var(--font-size-14);
					weight: 700;
				}

				color: rgb(var(--color-mono-500))

			}

			span {

				grid: {
					column: value;
					row: 		value;
				}

				padding: 1vh 1vw;

				color: rgb(var(--color-mono-900));

				border: 1px solid rgb(var(--color-mono-400));
				border: {
					radius: var(--border-radius);
				}

				font: {
					size: var(--font-size-14);
					weight: 600;
				}

			}

			i {

				fill: rgb(var(--color-mono-900));

			}

		}

	}

	&-footer {

		display: inline-grid;

		width: 100%;

		padding: 3vh 0;

		border-top: 1px solid rgb(var(--color-mono-400));

		button {
			width: 75%;
			margin: auto;
		}

	}

}

</style>

<script lang="ts">

	import Vue from 'vue'

// VUEX
	import { mapState, mapActions } from 'vuex'

// COMPONENTS
	import EccheumaButton from '~/components/buttons/CommonButton.vue';
	// import Popover 				from '~/components/common/Popover.vue';
	import Tag 						from '~/components/common/Tag.vue';
	import Icon						from '~/components/common/Icon.vue'

// MIXINS 
	import F_UserStatus from '~/assets/mixins/filters/UserStatus'
	import F_WorkStatus from '~/assets/mixins/filters/WorkStatus'

// TYPES
	import type { VuexModules } from '~/typescript/VuexModules'
	import type { USER_STATE 	} from '~/typescript/User' 

	type PROFILE_AREA = {
		title: string
		value: string | number
		icon: string
		info?: string
	}

// MODULE
	export default Vue.extend({
		components: {
			// Popover,
			Icon,
			Tag,
			EccheumaButton,
		},
		mixins: [ F_UserStatus, F_WorkStatus ],
		computed: {
			...mapState({

				UserState: 			state => ( state as VuexModules ).User.State.UserState,
				NewMessages:		state => ( state as VuexModules ).User.Messages.NewMessagesCount,
				Messages: 			state => ( state as VuexModules ).User.Messages.Messages

			}),

			profileAreas(): { [K in keyof USER_STATE]?: PROFILE_AREA } | { Messages: PROFILE_AREA } {

				const LastMessage = this.Messages.length ? [ ...this.Messages ].pop()?.Message : ''

				return {
					UserBalance: {
						title: 'Баланс',
						value: `${ this.UserState.UserBalance } ₽`,
						info: 'Ваш текущий баланс.',
						icon: 'Service',
					},
					UserWorkStatus: {
						title: 'Статус заказа',
						value: this.DefineWorkStatus(this.UserState.UserWorkStatus),
						info: 'Текущий статус последнего заказа заказа',
						icon: 'Fire',
					},
					Messages: {
						title: 'Сообщения',
						value: this.NewMessages,
						info: `Последнее сообщенее: "${ LastMessage?.slice(0, 65) }"`,
						icon: 'Message',
					}
				}
			}

		},
		methods: {

			...mapActions({
				logout: 'Auth/Logout/Logout'
			}),

		}
	})

</script>