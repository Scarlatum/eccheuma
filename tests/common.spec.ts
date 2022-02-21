import { expect, test } from 'vitest';

import { Image } from '~/typescript/Image';

test('images::matchSize', () => {

  // LARGER
  expect(Image.matchSize(Image.sizes.medium + 1))
    .toBe(Image.sizes.large);

  // EQUAL
  expect(Image.matchSize(Image.sizes.medium))
    .toBe(Image.sizes.medium);

  // LOWER
  expect(Image.matchSize(Image.sizes.medium - 1))
    .toBe(Image.sizes.medium);

})