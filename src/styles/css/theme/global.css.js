import { globalStyle } from '@vanilla-extract/css';
import { vars } from 'styles/css/theme/vars.css';


globalStyle(':root', {
  backgroundColor: vars.color.white
});
globalStyle('.fa-solid.fa-bars', {
  fontSize: '35px'
});