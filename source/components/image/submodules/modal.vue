<template>
	<portal v-if="modalState" to="Modal">

		<div
			v-if="modalState" 
			class="modal-wrap"
			:class="{ 'utils::glassy': application.context.browser && (!$isMobile || application.gpu.available()) }" 
			@mousewheel.prevent="changeZoom"
			@click.self="toggleModal" 
		>
			<div class="modal-container">

				<section class="modal-header">
					<span>{{ title || '' }}</span>
					<span>{{ description || '' }}</span>
				</section>

				<div 
					ref="image"
					v-dragscroll="true"
					class="modal-body" 
					:style="`overflow: ${ Zoom ? 'scroll' : 'hidden' }`"
					:class="[
						{ 'grab': Zoom },
						{ 'grabbing': Grabbing && Zoom },
					]"
					@mousedown="grab(true)" 
					@mouseup="grab(false)"
					
					>
				
					<picture>
						<source :srcset="URL.avif" type="image/avif">
						<img :src="URL.webp" :style="Zoom ? zoomStyle : null" @dblclick="Zoom = !Zoom">
					</picture>

				</div>

				<div class="modal-footer">
					<common-button @click.native="Zoom = !Zoom">
						{{ Zoom ? 'Уменьшить' : 'Увеличить' }}
					</common-button>
					<common-button @click.native="toggleModal">
						Закрыть
					</common-button>
				</div>

			</div>
		</div>

	</portal>
</template>

<style lang="scss" scoped>

.grab {
	cursor: grab;
}

.grabbing {
	cursor: grabbing;
}

.modal {
	&-wrap {
		position: fixed; top: 0; left: 0; z-index: 9999;
		height: 100vh; width: $GLOBAL-BodySize;
		background:
			radial-gradient(farthest-side, rgb(var(--color-mono-200), .5) 0%, rgb(var(--color-mono-200), .9) 85%), 
			url(~assets/images/Stripes.png?size=15);
		display: flex;
	}
	&-container {

		display: grid;
		
    grid-template: {
			columns: 1fr;
			rows: minmax(10vh, min-content) 8fr auto;
		}

    overflow: hidden;
    height: 95vh;
		aspect-ratio: 16/9;
    background-color: rgb(var(--color-mono-300));
    border: 1px solid rgb(var(--color-mono-400));
    border-radius: var(--border-radius);
    margin: auto;

	}
	&-header {

		display: grid;
		width: 100%;
		text-align: center; 
		align-content: center;
		color: rgb(var(--color-mono-1000)); 
		background-color: rgb(var(--color-mono-200));
		padding: 2vh 0;

		span {

			display: block;
			text-align: center;

			&:first-child {

				font: {
					family: var(--decor-font);
					size: var(--font-size-42);
					weight: 500;
				}

				letter-spacing: .15ch;

			}

			&:last-child {
				color: rgb(var(--color-mono-600));
				font-size: var(--font-size-16)
			}

		}
	}
	&-body {
		$mar: 10px;
		margin: $mar;
		height: calc(100% - (#{$mar} * 2));
		width: calc(100% - (#{$mar} * 2));

		picture {

			display: flex;
			width: 100%;
			height: 100%;

			img {
				width: 100%;
				height: 100%;
				padding: 10px;
				object-fit: contain;
				transition: all 120ms linear;
				margin: auto;
			}

		}

		&::-webkit-scrollbar {
			width: 10px;
			height: 10px;
			min-width: 5px;
			min-height: 5px;
			&-corner {
				background: transparent;
			}
			&-track {
				border-radius: 2rem;
				background-color: rgb(var(--color-mono-200));
				border: 1px solid rgb(var(--color-mono-400));
			}
			&-thumb {
				border-radius: 2rem;
				background-color: rgb(var(--color-mono-500));
				border: 2px solid rgb(var(--color-mono-200));
				&:hover {
					background-color: rgb(var(--color-mono-1000))
				}
			}
			&-button {
				height: 0;
				width: 0;
			}
		}
	}
	&-footer {
		display: grid;
		width: 100%;
		padding: 2vh 25%;
		grid-template-columns: repeat(auto-fit, minmax(min-content, 250px)); 
		grid-column-gap: 20px;
		background-color: rgb(var(--color-mono-200));
		place-content: center;
	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// VUEX
	import { mapActions } from 'vuex'
	
	// NAMESPACES
	import { Image } from '~/typescript/Image'

	// VARIABLES
	const PLACEHOLDER: Image.formatsStruct = {
		avif: require('~/assets/images/ImagePlaceholder.png?resize&size=1000&format=avif').src,
		webp: require('~/assets/images/ImagePlaceholder.png?resize&size=1000&format=webp').src,
	}

	const zoomStep = 20;

	// MODULE
	export default Vue.extend({
		components: {
			CommonButton: () => import('~/components/buttons/CommonButton.vue')
		},
		props: {
			modalState: { 
				type: Boolean,
				required: true, 
				default: false 
			} as PropOptions<boolean>,
			path: { 
				type: String,
				required: true 
			} as PropOptions<string>,
			title: {
				type: String,
				default: '',
				required: false,
			} as PropOptions<string>,
			description: {
				type: String,
				default: '',
				required: false,
			} as PropOptions<string>,
		},
		data() {
			return {

				URL: PLACEHOLDER,
				Grabbing: false,

				Zoom: false,
				ZoomRate: 150,

			}
		},
		computed: {
			zoomStyle(): { height: string, width: string } {

				const perc = `${ this.ZoomRate }%`;

				return {
					height: perc,
					width: perc,
				}

			}
		},
		async mounted() {
			if ( this.application.context.browser ) {
				this.URL = await this.getImageURL({ 
					path: this.path,
					size: 1440,
				}) as Image.formatsStruct
			}
		},
		methods: {

			...mapActions({
				getImageURL: 'Images/getImageURL',
			}),

			changeZoom({ deltaY }: WheelEvent) {

				const sign = Math.sign(deltaY);
				const zoom = this.ZoomRate + (zoomStep * sign);

				this.ZoomRate = sign > 0
					? zoom > 300
						? Math.min(300, zoom)
						: zoom
					: zoom < 50
						? Math.max(50, zoom)
						: zoom

			},

			toggleModal() {
				this.$emit('toggle-modal', !this.modalState)
			},

			grab(value: boolean) {

				if ( this.Zoom ) {
					this.Grabbing = value
				}

			}

		},
	})
</script>
