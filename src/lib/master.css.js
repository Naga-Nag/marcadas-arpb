import { init, Style } from '@master/css';
Style.extend('classes', {
    main: 'font-family:Comfortaa bg:rgb(51,87,155) r:12 p:12|15|20',
    btn: 'font:semibold color:black h:40 r:4 b:none p:10|15 r:2 cursor:pointer bg:rgb(255,255,255) bg:rgb(185,185,185):hover ~background-color|200ms|ease-in-out',
    btn_blue: '',
    noselect: 'user-select:none -ms-user-select:none -moz-user-select:none -webkit-user-select:none',
    nakedbtn: 'bg:none b:none p:0 cursor:pointer outline:none',
})
init()