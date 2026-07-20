-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'STAFF');

-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('PRATO', 'BEBIDA', 'DOCE');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "TipoEntrega" AS ENUM ('ENTREGA', 'RETIRADA');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'CREDITO', 'DEBITO');

-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('PENDENTE', 'PREPARANDO', 'PRONTO', 'SAIU_ENTREGA', 'ENTREGUE', 'CANCELADO');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pratos" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "imagem_url" TEXT,
    "categoria" "Categoria" NOT NULL DEFAULT 'PRATO',
    "preco_base" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tamanhos" (
    "id" UUID NOT NULL,
    "prato_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "tamanhos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adicionais" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "adicionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prato_dia" (
    "id" UUID NOT NULL,
    "prato_id" UUID NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "prato_dia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fretes" (
    "id" UUID NOT NULL,
    "regiao" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fretes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios" (
    "id" UUID NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "abertura" TEXT NOT NULL,
    "fechamento" TEXT NOT NULL,
    "aberto" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "cliente_id" UUID NOT NULL,
    "status" "StatusPedido" NOT NULL DEFAULT 'PENDENTE',
    "tipo_entrega" "TipoEntrega" NOT NULL,
    "forma_pagamento" "FormaPagamento" NOT NULL,
    "frete_id" UUID,
    "valor_frete" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "observacoes" TEXT,
    "endereco_entrega" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_itens" (
    "id" UUID NOT NULL,
    "pedido_id" UUID NOT NULL,
    "prato_id" UUID,
    "nome_prato" TEXT NOT NULL,
    "tamanho_nome" TEXT,
    "preco_unitario" DECIMAL(10,2) NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "pedido_itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_item_adicionais" (
    "id" UUID NOT NULL,
    "pedido_item_id" UUID NOT NULL,
    "adicional_id" UUID,
    "nome" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "pedido_item_adicionais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "pratos_categoria_idx" ON "pratos"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "prato_dia_prato_id_dia_semana_key" ON "prato_dia"("prato_id", "dia_semana");

-- CreateIndex
CREATE UNIQUE INDEX "fretes_regiao_key" ON "fretes"("regiao");

-- CreateIndex
CREATE UNIQUE INDEX "horarios_dia_semana_key" ON "horarios"("dia_semana");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_telefone_key" ON "clientes"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_codigo_key" ON "pedidos"("codigo");

-- CreateIndex
CREATE INDEX "pedidos_status_idx" ON "pedidos"("status");

-- CreateIndex
CREATE INDEX "pedidos_cliente_id_idx" ON "pedidos"("cliente_id");

-- CreateIndex
CREATE INDEX "pedidos_created_at_idx" ON "pedidos"("created_at");

-- CreateIndex
CREATE INDEX "pedido_itens_pedido_id_idx" ON "pedido_itens"("pedido_id");

-- AddForeignKey
ALTER TABLE "tamanhos" ADD CONSTRAINT "tamanhos_prato_id_fkey" FOREIGN KEY ("prato_id") REFERENCES "pratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prato_dia" ADD CONSTRAINT "prato_dia_prato_id_fkey" FOREIGN KEY ("prato_id") REFERENCES "pratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_frete_id_fkey" FOREIGN KEY ("frete_id") REFERENCES "fretes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_itens" ADD CONSTRAINT "pedido_itens_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_itens" ADD CONSTRAINT "pedido_itens_prato_id_fkey" FOREIGN KEY ("prato_id") REFERENCES "pratos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_item_adicionais" ADD CONSTRAINT "pedido_item_adicionais_pedido_item_id_fkey" FOREIGN KEY ("pedido_item_id") REFERENCES "pedido_itens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_item_adicionais" ADD CONSTRAINT "pedido_item_adicionais_adicional_id_fkey" FOREIGN KEY ("adicional_id") REFERENCES "adicionais"("id") ON DELETE SET NULL ON UPDATE CASCADE;
