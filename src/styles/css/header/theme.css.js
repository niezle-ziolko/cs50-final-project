import { styleVariants } from '@vanilla-extract/css';
import { vars } from 'styles/css/theme/vars.css';


export const header = styleVariants({
  header: {
    display: vars.display.flex,
    justifyContent: vars.justifyContent.space,
    padding: '25px'
  },
  box: {

  },
  logo: {
    width: '100px',
    height: '100px'
  },
  menu: {
    textAlign: vars.side.center,
    alignItems: vars.side.center,
    height: '100%',
    display: vars.display.flex
  }
});