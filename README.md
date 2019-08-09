# code-markup-parser

### Motivação

É extremamente chato ter que parar um algoritmo para alterar uma palavra em negrito,
colocar uma vírgula, colocar um link do **_zap_** em algum ícone da página e outras
diversas mudanças que temos que fazer por que pessoas leigas tem `medo` de código.

Com isso, acabei incrementando alguns itens a [minha estratégia](https://g4rcez.github.io/criando-uma-biblioteca-js-01/)
de ter itens dinâmicos em uma SPA. Esse parser é mais uma ferramenta ao meu arsenal para
permitir que pessoas leigas possam manipular os textos bem como quiserem, sem que
eu precise parar meu trabalho para alterações menores que possam ser feitas
por quem sabe o que quer. Com o parser em mão, basta saber ler e escrever :)

### Tags

Eu me inspirei tanto que quase copiei totalmente o [BB Code](https://www.bbcode.org),
e não tem como, acho que é o mais próximo de texto puro que podemos ter para usuários leigos.

- `[t]<TEXT>[\/t]`: Cria uma tag `<span>` e pode aplicar alguns parâmetros
- `[b]<TEXT>[\/b]`: Cria uma tag `<strong>`, deixando em negrito e pode aplicar alguns parâmetros
- `[i]<TEXT>[\/i]`: Cria uma tag `<i>`, deixando itálico e pode aplicar alguns parâmetros
- `[link]<TEXT>[\/link]`: Cria uma tag `<a>`, criando um link com `target="_blank"`,
  transformando o link ou texto em `https://` e pode aplicar alguns parâmetros
- `[line]<TEXT>[\/line]`: Cria uma tag `<p>` para criar um parágrafo e pode aplicar alguns parâmetros
- `[zap]<TEXT>[\/zap]`: Cria uma tag `<a>` para redirecionar para o Whatsapp e pode aplicar alguns parâmetros.
  `Sim, eu quis colocar zap por ser algo mais de tiozão`

### Parâmetros

- `color=<COR|HEXADECIMAL>`: cria uma cor com base no objeto de configurações `colors` ou assume uma cor/hexadecimal
- `url=<URL>`: meio auto explicativo
- `phone=<PHONE>`: meio auto explicativo, mas quero explicar. `Esse serve para você passar um número e chamar no zap com o [zap]`
- `class="PHONE"`: esse ainda não está implementado, mas será para aplicar regras de CSS com classes ao elemento corrente

### ToDo

- [ ] implementar parâmetro class
- [ ] criar tag Telegram
- [ ] criar tag Instagram
- [ ] criar tag Facebook
- [ ] integrar com outras ferramentas ainda não publicadas

### Ajuda nós

Ajuda nós (nós === eu), posta uma issue aí com uma sugestão ou faz um pull request refatorando/melhorando
o código.

PS: Melhorar o código não é difícil :)
