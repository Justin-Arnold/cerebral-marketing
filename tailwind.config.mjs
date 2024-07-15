const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
		  fontFamily: {
			sans: ['Inter var', ...defaultTheme.fontFamily.sans],
		  },
		},
	  },
	  plugins: [
		require('daisyui'),
		require('@tailwindcss/forms')
	  ],
	  daisyui: {
		themes: [
		  {
			norde: {
			  "primary": "#88C0D0", //#88C0D0 //#81A1C1 //#5E81AC
			  "secondary": "#81A1C1", //#88C0D0 //#81A1C1 //#5E81AC
			  "accent": "#B48EAD",
			  "neutral": "#2E3440",
			  "base-100": "#3d4451", //#3B4252 //#434C5E //#4C566A
			  "success": "#A3BE8C",
			  "warning": "#D08770",
			  "error": "#BF616A"
			},
		  },
		  "nord",
		],
	  },
}
