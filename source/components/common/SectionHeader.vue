<template>
  <div v-once class="section-header">
    <slot name="header" />
    <slot />
  </div>
</template>

<style lang="scss">

.section-header {

  display: grid;

  height: 15vh;
  margin-bottom: 2vh;

  place-content: center;
  // background-color: rgb(var(--color-mono-200));
  color: rgb(var(--color-mono-900));

  border-radius: var(--border-radius);

  span {

    display: block;
    text-align: center;

    &:nth-child(1) {
      font: {
        size: var(--font-size-56);
        family: var(--decor-font);
        weight: 900;
      }

      letter-spacing: .15ch;
    }
    &:nth-child(2) {
      font: {
        size: var(--font-size-20);
        weight: 600;
      }
    }
  }

}

</style>
