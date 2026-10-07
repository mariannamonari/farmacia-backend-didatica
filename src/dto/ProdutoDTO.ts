export default interface ProdutoDTO {
    idProduto?: number;
    descricao: string;
    validade: Date | null;
    preco: number;
    qtdEstoque: number;
    qtdMinEstoque: number;
}
 