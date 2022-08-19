<template>
    <li class="library-module">
        <div class="library-module-container">
            <p class="name" id="name">{{ name }}</p>
            <span class="keywords">{{ keywords }}</span>
            <a title="add" class="library-module-flex-container" id="svg">
                <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="fill: rgb(0, 0, 0); width: 40px; height: 40px;"><path d="{{ teste }}"></path></svg>
            </a>
            <div class="action-list">
                <button title="Download SVG" onclick="downloadSVG()">
                    <svg focusable="false " preserveAspectRatio="xMidYMid meet " fill="currentColor " aria-label="Download SVG " aria-hidden="true " width="16 " height="16 " viewBox="0 0 16 16 " role="img" class="bx--btn__icon ">
                        <path d="M13 7L12.3 6.3 8.5 10.1 8.5 1 7.5 1 7.5 10.1 3.7 6.3 3 7 8 12zM13 12v2H3v-2H2v2l0 0c0 .6.4 1 1 1h10c.6 0 1-.4 1-1l0 0v-2H13z "></path>
                    </svg>
                </button>
                <button type="button " title="Copy code" onclick="copyCode()">
                    <svg focusable="false " preserveAspectRatio="xMidYMid meet " fill="currentColor " aria-label="Copy Code" aria-hidden="true" width="16" height="16" viewBox="0 0 32 32" role="img" class="bx--btn__icon">
                <path d="M31 16L24 23 22.59 21.59 28.17 16 22.59 10.41 24 9 31 16zM1 16L8 9 9.41 10.41 3.83 16 9.41 21.59 8 23 1 16z"></path>
                <path d="M5.91 15H26.080000000000002V17H5.91z" transform="rotate(-75 15.996 16)"></path>
                </svg>
                </button>
            </div>
        </div>
    </li>
</template>

<script>
export default {
  name: 'IconCard',
  props: {
    name: String,
    keywords: String,
    teste: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.library-module-container {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
}

.library-module-flex {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
}

.library-module {
    border: .0625rem solid;
    border-color: rgb(118, 118, 118);
    border-radius: 2px;
    position: relative;
    background-color: #fff;
    height: 0;
    padding-top: 100%;
}

.library-module:hover {
    border: 1px solid -webkit-focus-ring-color;
}

.library-module-flex-container {
    align-items: center;
    display: flex;
    justify-content: center;
    height: 100%;
}

.library-module p {
    font-family: 'Roboto', sans-serif;
    color: #1e1e1e;
    font-size: 16px;
    font-weight: 400;
    left: 1rem;
    letter-spacing: .32px;
    line-height: 1.33333;
    max-width: calc(100% - 2rem);
    position: absolute;
    top: .75rem;
    width: 100%;
}

.library-module-flex-container svg {
    fill: #1e1e1e;
    animation: SvgLibrary-module--fadeIn--3E8mB 70ms cubic-bezier(.2, 0, .38, .9);
    stroke: #1E1E1E;
}

.action-list {
    bottom: 0;
    display: flex;
    opacity: 1;
    position: absolute;
    right: 0;
    transition: opacity 70ms cubic-bezier(.2, 0, .38, .9);
    z-index: 1;
    opacity: 0;
}

.library-module-container:hover>.action-list {
    opacity: 1;
}

button {
    align-items: center;
    border: 0;
    border-radius: 0;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
    font-size: 100%;
    justify-content: space-between;
    letter-spacing: .16px;
    line-height: 1.28572;
    margin: 0;
    max-width: 20rem;
    min-height: 3rem;
    outline: none;
    padding: 1rem;
    position: relative;
    text-align: left;
    text-decoration: none;
    vertical-align: initial;
    vertical-align: top;
    background-color: #fff;
}

button:hover {
    background-color: rgb(221, 221, 221);
    transition: opacity 70ms cubic-bezier(.2, 0, .38, .9);
    color: #1e1e1e(0, 0, 0);
}

.keywords {
    display: none;
}
</style>
