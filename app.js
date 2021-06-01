const vm = new Vue({
  el: "#app",
  data:{
    produtos: [],
    produto: false
  },
  filters:{
    numeroPreco(valor){
      return valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    }
  },
  methods:{
    async fetchProdutos(){
      const response = await fetch('./api/produtos.json')
      const data = await response.json()
      this.produtos = data
    },
    async fetchProduto(id){
      const response = await fetch(`./api/produtos/${id}/dados.json`)
      const data = await response.json()
      this.produto = data
    },
    fecharModal(e){
      console.log(e)
      if(e.target === e.currentTarget){
        this.produto = false
      }
    },
    abrirModal(id){
      this.fetchProduto(id)
      window.scrollTo(0,0)
    }
  },
  created(){
    this.fetchProdutos()
  }
})