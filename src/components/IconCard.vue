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
                    <i class="pi pi-copy"></i>
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
    keywords: {
        type: String,
        required: false, 
        },
    icon: {
        type: String,
        required: true,
        }
  },
    methods: {
        async downloadSVG() {
            const svg = this.$refs.mySlot.innerHTML;
            const blob = new Blob([svg.toString()]);
            const element = document.createElement("a");
            element.download = this.name.toLowerCase() + ".svg";
            element.href = window.URL.createObjectURL(blob);
            element.click();
            element.remove();
        },
        async copyCode() {
            try {
                await navigator.clipboard.writeText("<i class='ai ai-" + this.name.toLowerCase() + "'></i>");
                alert('Copied');
            } catch($e) {
                alert('Cannot copy');
            }
        }
    }
}
</script>