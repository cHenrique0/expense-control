const transactionsListUL = document.querySelector("#transactions-list");
const balanceLabel = document.querySelector("#balance");
const incomeLabel = document.querySelector("#income");
const expenseLabel = document.querySelector("#expense");
const addButton = document.querySelector("#add-btn");
const nameTransactionInput = document.querySelector("#text");

const dummyTransactions = [
  { id: 1, name: "Bolo de brigadeiro", amout: -20 },
  { id: 2, name: "Salário", amout: 300 },
  { id: 3, name: "Torta de frango", amout: -10 },
  { id: 4, name: "Violão", amout: 150 },
];

const addTransactionToDOM = (transaction) => {
  // verificando se o valor da transação é positivo ou negativo e guardando o sinal num variavel
  const operator = transaction.amout < 0 ? "-" : "+";

  // verificando se a transação é negativa ou positiva para determinar qual classe css será exibida na DOM
  const CSSClass = transaction.amout < 0 ? "minus" : "plus";

  // calculando o modulo do valor da transação para evitar que mostre 2 sinais de '-' (menos)
  const amountAbs = Math.abs(transaction.amout).toFixed(2);

  // criando um <li>
  const transactionItemLI = document.createElement("li");
  // adicionando a classe css
  transactionItemLI.classList.add(CSSClass);
  // adicionando o conteudo
  transactionItemLI.innerHTML = `${transaction.name} <span>${operator} R$ ${amountAbs}</span>
  <button class="delete-btn"><i class="fa-solid fa-xmark"></i></button>
  `;

  // adicionando a <li> na lista de transações
  transactionsListUL.append(transactionItemLI);
};

// Atualizando os valores de Saldo, Receitas e Despesas
const updateBalanceValues = () => {
  // cria uma lista com os valores das transações
  const transactionsAmounts = dummyTransactions.map(
    (transaction) => transaction.amout
  );

  // soma os valores das transações(com duas casas decimais)
  const balance = transactionsAmounts
    .reduce((accumulator, amount) => accumulator + amount, 0)
    .toFixed(2);

  // obtendo apenas os valores das receitas(valores positivos)
  const income = transactionsAmounts.filter((value) => value > 0);
  // somando a receita
  const totalIncome = income
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

  // obtendo apenas os valores das despesas(valores negativos)
  const expense = transactionsAmounts.filter((value) => value < 0);
  // somando a despesa
  const totalExpense = Math.abs(
    expense.reduce((accumulator, value) => accumulator + value, 0)
  ).toFixed(2);

  // atualizando o conteudo dos textos no DOM
  balanceLabel.textContent = `R$ ${balance}`;
  incomeLabel.textContent = `+ R$ ${totalIncome}`;
  expenseLabel.textContent = `- R$ ${totalExpense}`;
};

// Adiciona as transações no DOM quando a pagina for carregada
const init = () => {
  dummyTransactions.forEach(addTransactionToDOM);
  updateBalanceValues();
};

init();
