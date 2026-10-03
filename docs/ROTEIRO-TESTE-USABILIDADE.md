# Roteiro de teste de usabilidade — CHEM.OS

**Objetivo:** descobrir onde estudantes travam, se confundem ou desistem. Os testes automáticos não mostram isso.
**Participantes:** 3 a 5 estudantes (ensino médio ou 1º ano de graduação) que **nunca** usaram o site. Cinco pessoas costumam revelar a maior parte dos problemas. Se possível, inclua uma pessoa usando **celular**.
**Duração:** 25 a 30 minutos por pessoa. **Material:** o site publicado (ou `npm run serve`), cronômetro, este roteiro impresso e, se a pessoa permitir, gravação de tela.

## Regras para quem conduz
- Leia as tarefas em voz alta, sem explicar onde clicar. Diga: "estamos testando o site, não você".
- Peça para a pessoa **pensar em voz alta**. Não ajude por pelo menos 60 segundos; anote onde ela hesitou.
- Se travar por 2 minutos, registre "não concluiu", dê uma dica e siga em frente.

## Tarefas (uma folha de registro por pessoa)
1. Você acabou de abrir o site. **Diga com suas palavras o que ele faz.** (tempo livre, sem clicar)
2. **Descubra a massa molar** do sulfato de cobre pentaidratado, CuSO₄·5H₂O.
3. **Prepare uma solução:** quantos gramas de NaCl (58,44 g/mol) para 250 mL a 0,5 mol/L?
4. Você tem uma solução 18 mol/L e quer 250 mL a 1 mol/L. **Quanto precisa pipetar?** Depois abra o passo a passo e explique o que ele mostra.
5. **Encontre onde se estuda pH de tampões** e calcule o pH para pKa 4,76 com [base] = 0,2 e [ácido] = 0,1.
6. **Troque o tema** para um que você ache mais confortável de ler. Depois ligue o modo leitura.
7. **Salve um módulo como favorito** e volte a ele depois pelo menu.
8. *(só no celular)* **Volte ao menu** a partir de um módulo e compartilhe o resultado de um cálculo com um colega.
9. Jogue **uma rodada do quiz** da tabela periódica.

## O que registrar em cada tarefa
| Tarefa | Concluiu? (sim / com ajuda / não) | Tempo | Nº de erros ou cliques perdidos | Frase marcante / onde hesitou |
|---|---|---|---|---|
| 1–9 | | | | |

## Perguntas depois do teste
1. O que foi mais fácil? E o mais frustrante?
2. Você entenderia os resultados sem o professor? O que faltou explicar?
3. O passo a passo ajudou ou atrapalhou? Por quê?
4. Algum botão, palavra ou ícone você não entendeu?
5. Você usaria este site para estudar? Em que situação?

## Questionário rápido (SUS) — nota de 1 (discordo totalmente) a 5 (concordo totalmente)
1. Eu usaria este site com frequência. · 2. Achei o site mais complexo que o necessário. · 3. Achei fácil de usar. · 4. Precisaria de ajuda de alguém para usar. · 5. As funções estão bem integradas. · 6. Há inconsistências demais. · 7. A maioria das pessoas aprenderia a usar rápido. · 8. Achei o site pesado de usar. · 9. Senti confiança ao usar. · 10. Precisei aprender muita coisa antes de usar.

**Cálculo:** itens ímpares: nota − 1; itens pares: 5 − nota; some tudo e multiplique por 2,5 (0 a 100). Acima de 68 é considerado acima da média; acima de 80, muito bom.

## Como usar os resultados
- Liste os problemas por **quantas pessoas** tiveram cada um e por **gravidade** (impediu a tarefa / atrasou / incomodou).
- Corrija primeiro o que travou 2 ou mais pessoas. Repita o teste com outras 3 pessoas depois das correções.
- Meça também no celular com o Lighthouse (Chrome → F12 → Lighthouse → Mobile) e registre desempenho e acessibilidade.
