import type ItemPedidoDTO from "./ItemVendaDTO.js";

export default interface PedidoDTO {
    idCliente: number;
    itens: ItemPedidoDTO[] | ItemPedidoDTO;
}
