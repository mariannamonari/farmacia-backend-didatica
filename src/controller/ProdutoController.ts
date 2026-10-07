import { Produto } from "../model/Produto.js";
import type ProdutoDTO from "../dto/ProdutoDTO.js";
import type { Request, Response } from "express";

class ProdutoController extends Produto {

    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaProdutos = await Produto.listarTodosProdutos();
            return res.status(200).json(listaProdutos);
        } catch (error) {
            console.error(`Erro ao listar produtos: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao acessar lista de produtos." });
        }
    }

    static async alerta(req: Request, res: Response): Promise<Response> {
        try {
            const produtosEmAlerta = await Produto.listarProdutosEmAlerta();
            return res.status(200).json(produtosEmAlerta);
        } catch (error) {
            console.error(`Erro ao listar produtos em alerta: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao acessar produtos em alerta." });
        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos = req.body as ProdutoDTO;
            const produto = new Produto(
                dadosRecebidos.descricao,
                dadosRecebidos.preco,
                dadosRecebidos.qtdEstoque,
                dadosRecebidos.qtdMinEstoque,
                dadosRecebidos.validade
            );
            const respostaModelo = await Produto.cadastrarProduto(produto);

            if (respostaModelo) {
                return res.status(201).json({ mensagem: "Produto cadastrado com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar produto." });
            }
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : "Erro ao inserir produto.";
            const status = mensagem.toLowerCase().includes("obrigatória") || mensagem.toLowerCase().includes("inválido") ? 400 : 500;
            console.error(`Erro ao cadastrar produto: ${error}`);
            return res.status(status).json({ mensagem });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const idProdutoParam = req.params.idProduto;
            const idProduto = Number(idProdutoParam);

            if (isNaN(idProduto)) {
                return res.status(400).json({ erro: 'ID do produto inválido' });
            }
            const campos = req.body as ProdutoDTO;
            const atualizado = await Produto.atualizarProduto(idProduto, {
                descricao: campos.descricao,
                validade: campos.validade,
                preco: campos.preco,
                qtdEstoque: campos.qtdEstoque,
                qtdMinEstoque: campos.qtdMinEstoque,
            });
            console.log(idProduto, campos);

            if (atualizado) {
                return res.status(200).json({ mensagem: "Produto atualizado com sucesso." });
            } else {
                return res.status(400).json({ mensagem: "Erro ao atualizar produto." });
            }
        } catch (error) {
            const mensagem = error instanceof Error ? error.message : "Erro ao atualizar produto.";
            const status = mensagem.toLowerCase().includes("obrigatória") || mensagem.toLowerCase().includes("inválido") ? 400 : 500;
            console.error(`Erro ao atualizar produto: ${error}`);
            return res.status(status).json({ mensagem });
        }
    }
}

export default ProdutoController;
