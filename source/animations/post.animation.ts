import { animations, AnimationProperties } from './index';

export function resolve(): AnimationProperties {

  const { keyframes, options } = animations.common.opacityResolve(animations.common.AnimationMode.Long);

  return {
    keyframes,
    options,
  };

}