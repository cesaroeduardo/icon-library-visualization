<template>
    <li class="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white/80 dark:bg-neutral-800/80 group">
        <div class="relative min-h-40">
            <p class="absolute top-4 left-4 text-neutral-500 dark:text-neutral-300 text-ellipsis max-w-20 text-xs tracking-tight">{{ name }}</p>
            <span class="hidden">{{ keywords }}</span>
            <a class="absolute inset-0 flex items-center justify-center" id="svg" ref="mySlot">
                <slot></slot>
            </a>
            <div class="absolute bottom-0 right-0 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button title="Download SVG" @click="downloadSVG" class="rounded-none border-none rounded-tl-md bg-transparent h-10 w-10 text-xs">
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
        }
    },
    data() {
        return {
            showCheckIcon: false
        };
    },
    methods: {
        async downloadSVG() {
            try {
                // Use require to get the correct path to the SVG file
                const iconPath = require(`@/assets/svg-raw/${this.name}.svg`);
                const response = await fetch(iconPath);
                if (!response.ok) throw new Error('Network response was not ok');
                const svg = await response.text();
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
