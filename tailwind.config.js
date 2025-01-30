/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#FCF9E8',
        secondary: '#4D2A0A',
        tertiary: '#bb8860',
      },
      fontFamily: {
        'spartan-black': 'LeagueSpartan-Black',
        'spartan-bold': 'LeagueSpartan-Bold',
        'abeezee': 'ABeeZee-Regular',
        'abeezee-italic': 'ABeeZee-Italic',
      },
    },
  },
  plugins: [],
}
