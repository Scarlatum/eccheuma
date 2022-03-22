<template>

	<main
		key="main"
		ref="index"
		class="holl-container"
		style="opacity: 0.001"
		@mouseover="changeGlobalVolume(1)"
		@mouseleave="changeGlobalVolume(0)"
	>

		<client-only>
			<canvas-component v-if="application.context.browser && application.gpu.available()" @ready.once="Animate" />
		</client-only>

		<section class="holl-mute">
			<span
				:class="{ active: mute }"
				@click="globalMute(!mute)"
			>
				<icon name="Mute" />
			</span>
		</section>

		<section class="holl-info">

			<span class="index_app_version">
				СБОРКА: {{ application.hash }}
			</span>

		</section>

		<section v-show="CanvasReady || $isMobile" class="holl-logo">
			
			<svg v-if="!$isMobile" ref="LOGO_SVG" fill="none" viewBox="0 0 157 24">
				<path
					ref="LOGO_PATH"
					d="m156 7h-155c1-2 1-3 3-4 1-1 3-2 6-2h138c2 0 4 1 5 2 2 1 3 2 3 4zm-135 2h20c0 1 0 3-1 4s-3 2-7 2h-20c0-2 1-3 2-4 2-1 4-2 6-2zm135 8c0 2-1 3-3 4-1 1-3 2-5 2h-138c-3 0-5-1-6-2-2-1-2-2-3-4h155z"
					stroke="rgb(var(--color-mono-900))"
				/>
			</svg>

		</section>

		<section class="holl-navigation">
			<header-navigation :search="false" :background="false" :routePrefetch="false" />
		</section>

		<section class="holl-quote">
			<span ref="quote">
				" {{ Quotes[CurentQuoteIndex] }} "
			</span>
		</section>

		<section class="holl-links">

			<a
				v-for="(item, index) in Links"
				:key="index"
				:href="item.link"
			>
			
				<icon :name="item.icon" /> {{ item.title }}

			</a>
		</section>

	</main>
</template>

<style lang="scss" scoped>

	@mixin section_position($area: block) {
		grid: {
			row: $area;
			column: $area;
		}
	}

	.holl {
		&-container {
			display: grid;
			grid-template: {
				columns: 1fr 12fr 1fr;
				rows: 10vh 40vh 1fr 1fr 10vh;
				areas: ". build 	mute" ". logo 	." ". nav 		." ". quote 	." ". links 	.";
			}

			@media screen and ( max-width: $mobile-breakpoint ) {
				grid-template: {
					columns: 100vw;
					rows: 1fr 1fr 4fr 1fr 1fr 60px;
					areas: "build" "logo" "nav" "mute" "links";
				}
			}

			position: relative;
			width: 100vw;
			height: 100vh;

			@media screen and ( max-width: $mobile-breakpoint ) {
				overflow: hidden;
				width: 100vw;
				min-height: 90vh;
			}

			&:before {

				content: "";

				position: absolute;
				top: 0; left: 0;
				z-index: 0;

				width: 100vw; 
				height: 100vh;

				opacity: .25;

				background: {
					image: url('~assets/images/Background.png?size=360');
					size: cover;
					position: center;
					repeat: no-repeat;
					blend-mode: multiply;
				}

			}

			&:after {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				z-index: 2;
				width: 100vw;
				height: 100vh;
				background: radial-gradient(rgba(#14141D, .66), rgb(var(--color-mono-200)) 75%);
			}

			@media screen and ( max-width: $mobile-breakpoint ) {
				&:after {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					z-index: 2;
					width: 100vw;
					height: 100vh;
					background: radial-gradient(#00000000 0%, #000000ff 85%);
				}
			}

			section {
				position: relative;
				z-index: 1000;
			}

		}
		&-mute {
			@include section_position($area: mute);

			align-self: center;
			justify-self: center;

			span {
				
				$size: 50px;

				cursor: pointer;
				display: flex;
				width: $size;
				height: $size;
				color: rgb(var(--color-mono-500));
				font-size: calc(#{ $size } / 3);
				background-color: rgb(var(--color-mono-200));
				border: 3px solid rgb(var(--color-mono-400));
				border-radius: 100%;
				opacity: 1;

				i {
					@include icon-size(24px);
					margin: auto;
				}

			}

			.active {

				background-color: rgb(var(--color-mono-900)) !important;
				animation: Mute 1s infinite alternate;

				i {
					fill: rgb(var(--color-mono-300)) !important;
				}

				@keyframes Mute {
					0% {
						transform: scale(0.85);
					}
					100% {
						transform: scale(1);
					}
				}

			}

		}
		&-info {
			@include section_position($area: build);

			align-self: center;
			justify-self: center;

			span {
				color: rgba(var(--color-mono-500));
				font-size: var(--font-size-12);
				font-weight: 900;
				letter-spacing: 1ch;
				text-align: center;

				text-transform: uppercase;

				@media screen and ( max-width: $mobile-breakpoint ) {
					font-size: 0.45rem;
					letter-spacing: 0.5ch;
				}

			}
		}
		&-logo {
			@include section_position($area: logo);

			align-self: end;

			@media screen and (max-width: $mobile-breakpoint) {
				align-self: center;
			}

			svg {
				background: {
					size: contain;
					position: center;
					repeat: no-repeat;
				}

				height: 1.5rem;
				width: 100%;
				margin: 3vh 0;
			}

			// span {
			// 	opacity: 0;

			// 	display: block;
			// 	text-align: center;
			// 	pointer-events: none;

			// 	margin: {
			// 		top: 5px;
			// 	}

			// 	@media screen and (max-width: $mobile-breakpoint) {
			// 		opacity: 1;
			// 	}

			// 	&:nth-of-type(1) {

			// 		color: rgb(var(--color-mono-900));
					
			// 		font: {
			// 			size: var(--font-size-42);
			// 			family: var(--decor-font);
			// 		}

			// 		letter-spacing: 0.5ch;
			// 		margin-right: -0.25ch;
			// 		line-height: normal;

			// 	}

			// 	&:nth-of-type(2) {
			// 		color: rgb(var(--color-mono-800));
			// 		// line-height: 2vh;
			// 		letter-spacing: 0.5ch;
			// 		font: {
			// 			size: 0.45rem;
			// 			weight: 600;
			// 		}
			// 	}
			// }
			
		}
		&-navigation {
			@include section_position($area: nav);

			align-self: center;
			z-index: 1010 !important;

		}
		&-quote {
			@include section_position($area: quote);

			align-self: center;
			justify-self: center;

			width: 70ch;
			text-align: center;

			span {
				font-weight: 600;
				font-style: italic;
				color: rgba(var(--color-mono-800));
				font-size: var(--font-size-16);
			}

			z-index: 0;

		}
		&-links {
			@include section_position($area: links);

			align-self: center;
			justify-self: center;

			display: flex;

			a {

				margin: 0 15px;
				font-weight: 700;
				margin: 0px 10px;
				font-size: var(--font-size-16);
				color: rgb(var(--color-mono-400));
				text-decoration: underline;
				display: flex;

		    justify-content: center;
		    align-items: flex-end;

				transition-duration: 250ms;

				i {
					margin: 0 4px;
					fill: rgb(var(--color-mono-400));
					transition-duration: 125ms;
				}

				&:hover {
					margin: 0px 25px;
					color: rgb(var(--color-mono-1000));
					text-decoration: underline;
					i {
						margin: 0 4px;
						fill: rgb(var(--color-mono-1000));
					}
				}

			}
		}
	}

</style>

<script lang="ts">

	import Vue from 'vue'

// VUEX
	import { mapState, mapMutations, mapActions } from 'vuex'

// UTILS
	import { gpu } from '~/utils/gpu';

// TYPES
	import type { AnimeInstance, AnimeAnimParams } 	from 'animejs'
	import type { VuexMap } 										from '~/typescript/VuexMap'

// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound'

// COMPONENTS
	import HeaderNavigation from '~/components/layout/header/HeaderNavigation.vue'
	import CanvasComponent	from '~/components/Canvas.vue';
	import Icon 						from '~/components/common/Icon.vue'

// MODULE
	export default Vue.extend({
		components: {
			CanvasComponent,
			HeaderNavigation,
			Icon,
		},
		mixins: [ 
			EmitSound 
		],
		data() {
			return {

				CanvasReady: false as boolean | undefined,

				CurentQuoteIndex: 0,

				Quotes: [
					'Escape from Mordorland - Блог-портфолио ориентируемый на визуальный дизайн сайтов, логотипов, баннеров, и UI интерфейса. Предоставление услуг по работе с веб-дизайном и digital дизайном, фирменным стилем, и прочим графическим услугам',
					'SPA - Что-то странное, но работает лучше.',
					'Tilda это конечно быстро, но есть одна загвоздка...'
				],

				Links: [
					{ link: 'https://vk.com/club158755478', icon: 'VK', title: 'ВКонтакте'},
					{ link: 'https://github.com/Scarlatum', icon: 'URL', title: 'GitHub' },
					// { link: 'https://facebook.com', 				icon: 'Facebook', 	title: 'FaceBook' 	},
					// { link: 'https://telegramm.com', 				icon: 'Telegramm', 	title: 'Telegramm' 	},
				],
			
				HollVolume: 0,

				AnimeInstance: [] as AnimeInstance[],
				
			}
		},
		computed: {

			...mapState({
				mute: ( state: any ) => (state as VuexMap).Sound.global.mute,
			}),

		},
		watch: {
			CanvasReady: {
				handler() {

					(this.$refs.index as HTMLElement).animate([
						{ opacity: 0 },
						{ opacity: 1 },
					], {
						duration: 3000,
						easing: 'ease-in-out',
						fill: 'forwards',
					})

				}
			},
		},
		created() {

			if ( process.server ) return;

			this.setSounds([{
				file: 'Holl',
				name: 'Ambient',
				settings: { 
					rate: 1, 
					volume: .25, 
					loop: true,
				},
			}])

			window.onload = () => {
				if ( ! gpu.available() ) {
					this.CanvasReady = undefined;
				}
			}

		},
		mounted() {

			if ( process.browser ) {

				const Ambient = this.Sounds.get('Ambient')!;

				Ambient.volume(0);
				this.playSound(this.Sounds.get('Ambient'))
				Ambient.fade(0, 1, 3000)

				this.changeQuote();

			}

		},
		beforeDestroy() {

			const HOWL = this.Sounds.get('Ambient');

			this.AnimeInstance.forEach((anim) => {
				anim.pause();
			})

			if ( HOWL ) HOWL.fade(HOWL.volume(), 0, 5e3);

		},
		methods: {

			...mapMutations({
				setDeviceType: 'setDeviceType'
			}),

			...mapActions({
				changeGlobalVolume: 'Sound/changeGlobalVolume',
				globalMute: 				'Sound/globalMute',
			}),

			// ! Refactor this with Animation API
			Animate() {

				this.CanvasReady = true;

				const LOOP: boolean = true;

				const COLOR = `rgb(${ getComputedStyle(document.body).getPropertyValue('--mono-800').trim() })`;

				const ANIMATIONS: AnimeAnimParams[] = [
					{	
						targets: this.$refs.LOGO_SVG,
						filter: [
							{ value: 'drop-shadow(0px 0px 3px #FFFFFF)', duration: 2000 },
							{ value: 'drop-shadow(0px 0px 0px #FFFFFF)', duration: 5000 },
						],
						endDelay: 2000,
						round: 100,
						loop: LOOP, 
						easing: 'easeInOutSine',
						direction: 'alternate',
					},
					{	
						targets: this.$refs.LOGO_PATH,
						strokeDashoffset: [ this.$AnimeJS.setDashoffset, 0 ],
						fill: [
							{ value: COLOR, duration: 2500, delay: 1500, endDelay: 5000, }
						],
						delay: 1000,
						duration: 3000,
						round: 100, 
						loop: LOOP,
						easing: 'easeInOutSine',
						direction: 'alternate',
					},
					{
						targets: '.holl-logo span',
						opacity: [0, 1],
						filter: [
							{ value: 'drop-shadow(0px 0px 4px #FFF)' },
							{ value: 'drop-shadow(0px 0px 0px #FFF)' },
						],
						delay: this.$AnimeJS.stagger(1000, { start: 0 }), 
						endDelay: 8000, 
						duration: 1000,
						round: 100,
						loop: LOOP, 
						easing: 'linear',
						direction: 'alternate',
					}
				]

				ANIMATIONS.forEach((item) => {
					this.AnimeInstance.push(this.$AnimeJS(item))
				})

			},

			changeQuote() {

				this.CurentQuoteIndex = Math.trunc(Math.random() * this.Quotes.length)

				const textAnimation = (this.$refs.quote as HTMLElement).animate([
					{ opacity: 0 },
					{ opacity: 1 },
				], {
					duration: 750,
					endDelay: 5000,
					fill: 'both',
				})

				textAnimation.onfinish = () => {
					textAnimation.onfinish = () => this.changeQuote();
					textAnimation.reverse();
				}
				
			}

		},
	})

</script>
