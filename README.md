
# DevMarket - Ecommerce

DevMarket é uma aplicação de e-commerce voltada para a compra e gerenciamento de produtos. Desenvolvida com Next.js e React, ela permite a visualização de itens, além de fornecer uma interface para registro de novos produtos através de um formulário intuitivo.

## Stack utilizada

**Front-end:** NextJS, TypeScript, TailwindCSS.

**Back-end:** Node, Express.

## Funcionalidades

Listagem de Produtos: Exibe produtos em cards com informações detalhadas como nome, peso, perecibilidade, preço e data de validade.

Registro de Novo Produto: Botão para abrir um modal e registrar um novo produto, com campos para nome, unidade de medida, quantidade, perecibilidade, preço, data de validade e data de fabricação.

Editar um Produto: Botão para abrir um modal e editar o produto com novas informações com os seguinter campos nome, unidade de medida, quantidade, perecibilidade, preço, data de validade e data de fabricação.

Navegação Simplificada: Menu com os links das telas.

Paginação: Organização da listagem de produtos com paginação para melhor visualização.


## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/NiloMarcos/devmarket.git
```

Entre no diretório do projeto

```bash
  cd devmarket
```

Instale as dependências na raiz

```bash
  yarn install
```

Instale as dependências do servidor

```bash
  cd server

  yarn install

  yarn dev ( Após instalar as dependências rode este comando para subir o servidor ).
```

Inicie o projeto na raiz ( Abra outro terminal e rode o comando, ambos os terminais rodando em simultâneo )

```bash
  yarn dev
```

OBS: É necessário rodar o servidor primeiro para que a URL de busca de produtos esteja ativa. As funções de editar e adicionar um novo produto precisam, obrigatoriamente, que o servidor esteja em execução.

