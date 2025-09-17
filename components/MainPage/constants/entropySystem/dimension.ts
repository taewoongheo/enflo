import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const viewportHeight = height;
export const viewportWidth = width;
export const particleCanvasWidth = width;
export const particleCanvasHeight = height * 0.65;
