<template>
    <li class="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white/60 dark:bg-neutral-800/60 group md:gradient-mask-bl-70">
        <div class="relative min-h-40">
            <p class="absolute z-10 top-4 left-4 text-neutral-500 dark:text-neutral-400 text-ellipsis max-w-20 text-xs">{{ name }}</p>
            <span class="hidden">{{ keywords }}</span>
            <a class="absolute inset-0 flex items-center justify-center" id="svg" ref="mySlot">
                <slot></slot>
            </a>
            <div class="absolute bottom-0 right-0 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button :title="'Download ' + downloadFormat.toUpperCase()" @click="downloadIcon" class="rounded-none border-none rounded-tl-md bg-transparent h-10 w-10 text-xs">
                    <i class="pi pi-download"></i>
                </button>
                <button title="Copy code" @click="copyCode" class="rounded-none border-none bg-transparent h-10 w-10 text-xs">
                    <i v-if="!showCheckIcon" class="pi pi-copy"></i>
                    <i v-if="showCheckIcon" class="pi pi-check text-green-500 dark:text-green-400"></i>
                </button>
            </div>
        </div>
    </li>
</template>


<script>
export default {
    name: 'IconCard',
    props: {
        name: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        keywords: {
            type: String,
            required: false,
        },
        color: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        downloadFormat: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            showCheckIcon: false
        };
    },
    methods: {
        async downloadIcon() {
            if (this.downloadFormat === 'svg') {
                this.downloadSVG();
            } else {
                this.downloadPNG();
            }
        },
        async downloadSVG() {
            try {
                const iconPath = require(`@/assets/svg-raw/${this.name}.svg`);
                const response = await fetch(iconPath);
                if (!response.ok) throw new Error('Network response was not ok');
                let svg = await response.text();
                
                // Modify SVG with the current color
                svg = svg.replace(/fill="[^"]*"/g, `fill="${this.color}"`);

                // Extract dimensions from size class
                const sizeMap = {
                    'text-xs': 12,
                    'text-sm': 16,
                    'text-base': 20,
                    'text-lg': 24,
                    'text-xl': 28,
                    'text-2xl': 32,
                    'text-3xl': 40,
                    'text-4xl': 48,
                    'text-5xl': 56,
                    'text-6xl': 64,
                };
                const dimension = sizeMap[this.size] || 100;

                // Add width and height attributes to SVG
                svg = svg.replace(/(width|height)="[^"]*"/g, '')
                          .replace(/<svg/, `<svg width="${dimension}" height="${dimension}"`);

                const blob = new Blob([svg], { type: 'image/svg+xml' });
                const element = document.createElement("a");
                element.download = `${this.name.toLowerCase()}.svg`;
                element.href = window.URL.createObjectURL(blob);
                element.click();
                element.remove();
            } catch (error) {
                console.error('Failed to download SVG:', error);
            }
        },
        async downloadPNG() {
            try {
                const iconPath = require(`@/assets/svg-raw/${this.name}.svg`);
                const response = await fetch(iconPath);
                if (!response.ok) throw new Error('Network response was not ok');
                let svg = await response.text();

                // Modify SVG with the current color
                svg = svg.replace(/fill="[^"]*"/g, `fill="${this.color}"`);

                // Extract dimensions from size class
                const sizeMap = {
                    'text-xs': 12,
                    'text-sm': 16,
                    'text-base': 20,
                    'text-lg': 24,
                    'text-xl': 28,
                    'text-2xl': 32,
                    'text-3xl': 40,
                    'text-4xl': 48,
                    'text-5xl': 56,
                    'text-6xl': 64,
                };
                const dimension = sizeMap[this.size] || 100;

                svg = svg.replace(/(width|height)="[^"]*"/g, '')
                          .replace(/<svg/, `<svg width="${dimension}" height="${dimension}"`);

                const canvas = document.createElement('canvas');
                canvas.width = dimension;
                canvas.height = dimension;
                const ctx = canvas.getContext('2d');

                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, dimension, dimension);
                    canvas.toBlob((blob) => {
                        const element = document.createElement("a");
                        element.download = `${this.name.toLowerCase()}.png`;
                        element.href = window.URL.createObjectURL(blob);
                        element.click();
                        element.remove();
                    }, 'image/png');
                };

                const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
                img.src = URL.createObjectURL(svgBlob);
            } catch (error) {
                console.error('Failed to download PNG:', error);
            }
        },
        async copyCode() {
            try {
                await navigator.clipboard.writeText(`<i class='${this.icon.toLowerCase()}'></i>`);
                this.showCheckIcon = true;
                setTimeout(() => {
                    this.showCheckIcon = false;
                }, 1200);
            } catch (error) {
                console.error('Failed to copy:', error);
            }
        }
    }
};
</script>
