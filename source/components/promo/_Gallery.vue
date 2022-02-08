<template>
	<section class="promo_body">
		
		<vue-image
			:content="{ path: 'Promo/4.png' }" 
			:sections="{ date: false, description: false, zoom: false }" 
			:property="{ fit: 'cover', type: 'promo', collumn: 7 }"
		/>

		<section v-once>
			<h4>Наглядный результат.</h4>
			<p>
				А если говорить проще, то можно представить, что у вас есть некая болванка в виде кнопки или блока с "чем-то", и раньше бы приходилось копировать эту болванку, заполнять её нужным "чем-то" в копированном элементе и молиться богам, чтобы это всё пошло не по пизде и адекватно заработало.
			</p> 
			<p>
				И это ещё не самое сладкое, ибо сладкое начнётся, когда ты решишь всё это поменять визуально. Теперь же есть и шаблонизатор, sass c его переменными, вложенностями, ИНТЕРПОЛЯЦИЕЙ и прочим дерьмом.
			</p>
		</section>
		
	</section> 
</template>

<style lang="scss" scoped>

.promo {
	&_body {
		@include gradient_border(block);

		display: grid;

		grid-template: {
			columns: minmax(0, 40vw) 45ch;
			rows: 100%;
		}

		column-gap: 30px; 
		row-gap: 3vh;
		
		padding: 10vh 2vw;

		align-items: center;
		justify-content: center;
		background-color: rgb(var(--color-mono-300));

		@media screen and ( max-width: $mobile-breakpoint ) {
			grid-template-columns: 1fr;
			text-align: center;
		}

		width: 100%;

		h4 {
			font-weight: 800;
		}

		p {
			font-size: var(--font-size-20);
			font-family: var(--read-font);
			font-weight: 500;
			color: rgb(var(--color-mono-900));
		}

	}
}

</style>

<script>

	export default {
		components: {
			VueImage: () => import('~/components/image/Image.vue'),
		},
	}
</script>
