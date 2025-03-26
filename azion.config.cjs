module.exports = {
  build: {
    preset: {
      name: 'vue'
    }
  },
  origin: [
    {
      name: 'origin-storage-default',
      type: 'object_storage'
    }
  ],
  rules: {
    request: [
      {
        name: 'Deliver Static Assets',
        match: '.(css|js|ttf|woff|woff2|pdf|svg|jpg|jpeg|gif|bmp|png|ico|mp4|json|xml|html)$',
        behavior: {
          deliver: true
        }
      },
      {
        name: 'Handle SPA Routes',
        match: '^\\/',
        behavior: {
          rewrite: '/index.html'
        }
      }
    ]
  }
}
