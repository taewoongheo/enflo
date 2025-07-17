import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const particleCanvasWidth = width;
export const particleCanvasHeight = height * 0.6;
