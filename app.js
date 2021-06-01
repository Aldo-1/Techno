const vm = new Vue({
  el: "#app",
  data:{
    produtos: []
  },
  methods:{
    async fetchProdutos(){
      const response = await fetch('./api/produtos.json')
      const data = await response.json()
      this.produtos = data
    }
  },
  created(){
    this.fetchProdutos()
  }
})