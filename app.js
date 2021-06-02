const vm = new Vue({
  el: "#app",
  data:{
    produtos: [],
    produto: false,
    carrinho: [],
    mensagemAlerta: "Item adiconado",
    alertaAtivo: false,
    carrinhoAtivo: false,
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
    compararEstoque(){
      const items = this.carrinho.filter(item =>item.id === this.produto.id   
      )
      this.produto.estoque = this.produto.estoque - items.length
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
    },
    adicionarItem(){
      this.produto.estoque--;
      const {id, nome ,preco} = this.produto
      this.carrinho.push({id, nome ,preco})
      this.alerta(`${nome} adicionado ao carrinho`)
    },
    removerItem(index){
      this.carrinho.splice(index,1)
    },
    getLocalStorage(){
      if(window.localStorage.carrinho){
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    },
    alerta(mensagem){
      this.mensagemAlerta = mensagem
      this.alertaAtivo = true
      setTimeout(() => {
        this.alertaAtivo = false
      }, 1500)
    },
    clickForaCarrinho({ target, currentTarget }) {
      if (target === currentTarget) this.carrinhoAtivo = false;
    },
    router(){
      const hash = document.location.hash;
      if(hash){
        this.fetchProduto(hash.replace('#' , ""))
      }
    }
  },
  computed:{
    haveProduct(){
      return this.produto.estoque < 0 ? 'Produto esgotado' : 'Adicionar Item'
    },
    carrinhoTotal(){
      let total = 0;
      if(this.carrinho.length){
        this.carrinho.forEach((item) => {
          total = item.preco + total
        })
      }
      return total 
    }
  },
  watch: {
    carrinho(){
      window.localStorage.carrinho = JSON.stringify(this.carrinho)
    },
    produto(){
      document.title = this.produto.nome || 'Techno'
      const hash = this.produto.id  || "";
      history.pushState(null, null, `#${hash}`)
      if(this.produto){
        this.compararEstoque()
      }
    }
  },
  created(){
    this.fetchProdutos()
    this.getLocalStorage()
    this.router()
  }
})