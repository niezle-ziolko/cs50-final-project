import { createGlobalTheme } from '@vanilla-extract/css';


export const root = createGlobalTheme(':root', {
  color: { 
    blue: '#26b0ff',
    black: '#222831',
    white: '#f2f2f2'
  },
  fontFamily: {
    primary: '\'balsamiqSans\', arial',
    icons: '\'icons\', arial'
  },
  side: {
    center: 'center'
  },
  display: {
    flex: 'flex'
  },
  justifyContent: {
    space: 'space-between'
  }
});

export const vars = { ...root };