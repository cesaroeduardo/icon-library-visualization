# Icon Library Visualization
### [https://cesaroeduardo.github.io/icon-library-visualization](https://cesaroeduardo.github.io/icon-library-visualization/)
![image](https://github.com/cesaroeduardo/icon-library-visualization/assets/44036260/d33c5604-5793-40c8-90ce-d374bef41e4b)


# Project setup
## Installing Dependencies
```
npm install
```

### Compiling and Hot-Reloading for Development
```
npm run serve
```

### Compiling and Minifying for Production
```
npm run build
```


# How to Add New Icon Libraries

This project is based on icon libraries that work as fonts.

### Step 1
Place your font (recommended .woff2 extension) in the `src > assets > icon-fonts` directory.

![image](https://github.com/cesaroeduardo/icon-library-visualization/assets/44036260/2d83bd5b-9650-4a75-a881-0f450a8e96c4)

### Step 2
Declare the import, font-callers, and glyphs in `src > assets > icons.scss`.

![image](https://github.com/cesaroeduardo/icon-library-visualization/assets/44036260/7e4e4b01-837d-4274-9354-5bcdfed7d612)

### Step 3
Declare the icons you want to add to the catalog in `src > icons.json`. The keywords are used to find the icons. (It is recommended to use AI to generate the array based on your Step 2)

![image](https://github.com/cesaroeduardo/icon-library-visualization/assets/44036260/8716c287-a381-486c-853a-b39300a78169)

### Step 4 (Optional)
To activate the downloads in SVG format, place the SVG of each icon in `src > assets > svg-raw`. The file name must match the name declared in `icons.scss`.

![image](https://github.com/cesaroeduardo/icon-library-visualization/assets/44036260/8423b77f-503c-4218-b776-65ff61693cbd)


### Hope you enjoy the project. o/

