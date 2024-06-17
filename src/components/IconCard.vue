<template>
    <li class="border border-white/20 rounded-lg overflow-hidden bg-white/20 group">
        <div class="relative bg-white-50/10 h-80">
            <p class="absolute top-4 left-4 text-white text-sm">{{ name }}</p>
            <span class="hidden">{{ keywords }}</span>
            <a class="absolute inset-0 flex items-center justify-center" id="svg" ref="mySlot">
                <slot></slot>
            </a>
            <div class="absolute bottom-0 right-0 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button title="Download SVG" @click="downloadSVG" class="text-white flex items-center justify-center rounded-tl-md h-11 w-11 bg-white/10 hover:bg-white/20">
                    <i class="ai ai-azion"></i>
                </button>
                <button title="Copy code" @click="copyCode" class="text-white flex items-center justify-center h-11 w-11 bg-white/10 hover:bg-white/20">
                    <i class="ai ai-azion"></i>
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
                await navigator.clipboard.writeText("<i class='ai ai-" + this.name.toLowerCase() + "' />");
                alert('Copied');
            } catch($e) {
                alert('Cannot copy');
            }
        }
    }
}
</script>