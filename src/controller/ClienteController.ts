import { Cliente } from "../model/Cliente.js";
import type ClienteDTO from "../dto/ClienteDTO.js";
import type { Request, Response } from "express";

class ClienteController extends Cliente {

    static async todos(req: Request, res: Response): Promise<Response> {
        try {
            const listaClientes: Array<Cliente> | null = await Cliente.listarClientes();
            return res.status(200).json(listaClientes);

        } catch (error) {
            console.error(`Erro ao consultar modelo. ${error}`);
            return res.status(500).json({ mensagem: "Não foi possivel acessar a lista de clientes." });

        }
    }

    static async novo(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidosCliente = req.body as ClienteDTO;
            const cliente = new Cliente(dadosRecebidosCliente.nome, dadosRecebidosCliente.cpf);
            const respostaModelo = await Cliente.cadastrarCliente(cliente);

            if (respostaModelo) {
                return res.status(201).json({ mensagem: "Cliente cadastrado com sucesso." });

            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar cliente." });
            }

        } catch (error) {
            const mensagem = error instanceof Error ? error.message : "Não foi possível inserir o cliente";
            const status = mensagem.toLowerCase().includes("obrigatório") || mensagem.toLowerCase().includes("inválido") ? 400 : 500;
            console.error(`Erro no modelo. ${error}`);
            return res.status(status).json({ mensagem });
        }
    }
}

export default ClienteController;