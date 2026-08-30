<template>
  <span class="brand-logo">
    <svg
      class="brand-logo__mark"
      viewBox="0 0 64 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path class="brand-logo__left" d="M11 51V7L33 48" />
      <path class="brand-logo__right" d="M31 48L53 7V51" />
    </svg>
    <span class="brand-logo__wordmark">
      <span class="brand-logo__given">Mateus</span>
      <span class="brand-logo__family">Matyak</span>
      <span class="brand-logo__rule" />
    </span>
  </span>
</template>

<style scoped lang="scss">
.brand-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.brand-logo__mark {
  display: block;
  width: 34px;
  height: 30px;
}

.brand-logo__left,
.brand-logo__right {
  fill: none;
  stroke-width: 7.2;
  stroke-linejoin: miter;
  stroke-miterlimit: 2.2;
  stroke-linecap: butt;
}

.brand-logo__left {
  stroke: var(--color-text);
}

.brand-logo__right {
  stroke: var(--color-accent);
}

.brand-logo__wordmark {
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 0.42em;
  justify-items: center;
  font-size: 0.54rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  line-height: 1;
  text-transform: uppercase;
}

.brand-logo__given {
  color: var(--color-text);
}

.brand-logo__family {
  color: var(--color-accent);
}

.brand-logo__rule {
  grid-column: 1 / -1;
  width: 11px;
  height: 1.5px;
  margin-top: 3px;
  background: var(--color-accent);
}

@media (max-width: 400px) {
  .brand-logo__wordmark {
    display: none;
  }
}
</style>
