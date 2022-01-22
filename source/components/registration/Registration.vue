<template>
	<transition name="opacity-transition">
		<div 
			v-if="RegistrationModal" 
			class="registration-wrap" 
			:class="[
				{ 'utils::glassy': $PIXI.utils.isWebGLSupported() }
			]"
			@click.self="ChangeModalStatus(false)"
			@mousewheel.prevent
			>

			<div class="registration-container">

				<loader
					:stages="UserRegistration" 
					:ignite="false"
					:forcedStage="LoaderStage"
					:controllable="true" 
					style="position: absolute" 
					/>

				<section class="registration-header">
					<span>
						Регистрация
					</span>
					<span>
						Какая-то ошибка, или напоминание о чём-то
					</span>
				</section>

				<section class="registration-body">
					<caption-card status="missunderstood">
						<template #type>
							Тут сыровато и пахнет плесенью.
						</template>
						<template #desc>
							Регистрация пока не доступна, простите.
						</template>
					</caption-card>
					<div class="registration-body-stage">
						<span v-for="i in 3" :key="i" :class="{ active: i === Stage }" />
					</div>
				</section>

				<section class="registration-footer">
					<common-button :class="{ disabled: Stage === крайняяСтадия }" @click.native="STEP_IMMITATION">
						Выбор иконки
					</common-button>
					<common-button @click.native="ChangeModalStatus(false)">
						Закрыть
					</common-button>
				</section>

			</div>

		</div>
	</transition>
</template>

<style lang="scss">

.registration {
	&-wrap {

		position: fixed; 
		top: 0; 
		left: 0; 
		z-index: 3000;

		width: $GLOBAL-BodySize; 
		height: 100vh;

		display: flex;
		place-content: center;
		place-items: center;

		background-color: rgba(var(--color-mono-200), .9);

		&:before {

			content: '';

			position: absolute; 
			z-index: -1;
			
			top: 0; 
			left: 0;  
			width: $GLOBAL-BodySize; 
			height: 100vh; 
			
			opacity: .5;

			background: {
				image: url('~assets/images/SVG/Stripes.svg');
				size: 20px;
			}

			mix-blend-mode: multiply;

			@media screen and ( max-width: $mobile-breakpoint ) {
				mix-blend-mode: unset;
			}

		}

	}
	&-container {

		@include gradient-border;

		position: relative;
		overflow: hidden;

		display: grid; 
		grid-template: {
			rows: max-content 1fr max-content;
		};

		height: 90vh;
		width: min(420px, 50vw);

		background-color: rgba(var(--color-mono-200));
		border-radius: var(--border-radius);

		section {
			display: flex;
			flex-direction: column;
			place-content: center;
			place-items: center;
			padding: 3vh 2vw;
		}

	}
	&-header {

		text-align: center;
		background-color: rgba(var(--color-mono-300));

		@extend %pattern-lines;

		span {
			&:nth-child(1) {
				font: {
					family: var(--decor-font);
					size: var(--font-size-42);
				}

				line-height: var(--size-56);
				letter-spacing: .15ch;
				margin-right: -.25ch;

			}
			&:nth-child(2) {
				color: rgb(var(--color-mono-600));
				font: {
					size: var(--font-size-14);
					weight: 700;
				}
			}
		}

	}
	&-body {

		display: grid;
		gap: 2vh;

		&-stage {

			display: flex;
			gap: .25vw;

			.active {
				background-color: var(--color-accent-lighting);
			}

			span {
				display: inline-block;
				width: 60px;
				height: 1px;
				background-color: var(--color-accent-edges-200);
			}
		}
	}
	&-footer {

		gap: 1vh;

		button {
			width: 75%;
		}

	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

// VUEX
	import { mapState, mapMutations, mapActions } from 'vuex'
	import { email, required, minLength, alphaNum } from 'vuelidate/lib/validators'
	import type { VuexModules } from '~/typescript/VuexModules'

// TYPES & INTERFACES & ENUMS
	import type { REGISTER_FORM, AUTH_ERRORS } from '~/store/Auth/Session'

// COMPONENTS
	import Loader 			from '~/components/common/Loader.vue'
	import CommonButton from '~/components/buttons/CommonButton.vue';
	import CaptionCard 	from '~/components/common/Caption.vue'

// MODULE
	export default Vue.extend({
		components: {
			CommonButton,
			CaptionCard,
			Loader
		},
		data() {
			return {

				ElementLoad: true,
				ElementLoadComplete: true,

				Email: '',
				Password: '',
				Name: '',

				Stage: 1,

				LoaderStage: -1,
				UserRegistration: [
					{ LoadPoint: 0, 	Message: 'Отправка данных' },
					{ LoadPoint: 100, Message: 'Переходим к следующему шагу' },
				]

			}
		},
		validations: {

			Email: { email, required },
			Password: { required, alphaNum, minLength: minLength(6) },
			Name: { required, minLength: minLength(3) },

		},
		computed: {

			...mapState({

				LoginStatus: 				state => (state as VuexModules).Auth.Session.LoginStatus,

				RegistrationModal: 	state => ( state as VuexModules ).Auth.Register.Modal,
				AuthError: 					state => ( state as VuexModules ).Auth.Session.AuthError,
				// LoaderMessage: 			state => ( state as VuexModules ).Loader.Message,
				// LoaderStatus: 			state => ( state as VuexModules ).Loader.Status,
			}),

			крайняяСтадия(): number {
				return 3;
			}

		},
		watch: {
			LoginStatus: {
				handler() {
					this.ChangeModalStatus(false)
				},
				deep: true
			}
		},
		methods: {

			...mapMutations({
				ChangeModalStatus: 'Auth/Register/ToggleRegisterModal',
				ChangeLoadMessage: 'Loader/Loader_ChangeLoadMessage',
			}),

			...mapActions({
				Register: 'Auth/Register/Register',
			}),

			DefineError(e: AUTH_ERRORS): string {

				enum ERROR {
					'auth/network-request-failed'	= 'Ошибка соединения',
					'auth/user-not-found' 				= 'Пользователя с такой почтой не существует',
					'auth/invalid-email' 					= 'Поле не соответствует критериям почты',
					'auth/wrong-password'					=	'Неверный пароль',
					'auth/email-already-in-use' 	= 'Данная почта занята другим пользователем',
				}

				return ERROR[e] ?? e

			},
			
			Auth() {

				this.ChangeLoadMessage('Отправка формы')

				const FORM: REGISTER_FORM  = {
					email: this.Email,
					password: this.Password,
					name: this.Name,
				} 

				this.Register(FORM)

			},

			STEP_IMMITATION() {

				this.LoaderStage 			= 0;
				this.Stage 						= 2;

				setTimeout(() => {

					this.LoaderStage 			= 1;
					this.Stage 						= 1;

				}, 6000)

			}

		}
	})

</script>