// Seleciona a ul: lista de transações
const transactionsListUL = document.querySelector("#transactions-list");
// Seleciona o span: saldo atual
const balanceLabel = document.querySelector("#balance");
// Seleciona o span: receitas
const incomeLabel = document.querySelector("#income");
// Seleciona o span: despesas
const expenseLabel = document.querySelector("#expense");
// Seleciona o form
const formTransactions = document.querySelector("#form");
// Seleciona o input: nome da transação
const transactionNameInput = document.querySelector("#text");
// Seleciona o input: valor da transação
const transactionValueInput = document.querySelector("#amount");
// Seleciona a div que contem os botoes de adicionar receita ou despesa
const divAddButtons = document.querySelector("#add-inc-exp");
// Seleciona o button: adicionar transação
const addButton = document.querySelector("#add-btn");
// Seleciona o button: adicionar receita
const addIncomeButton = document.querySelector("#add-income-btn");
// Seleciona o button: adicionar despesa
const addExpenseButton = document.querySelector("#add-expense-btn");

// Objeto para indicar o tipo da transação
const transactionType = {
  Income: 0,
  Expense: 1
}

// Variavel para guardar o operador da transação
let transactionOperator = null;

// Cria um local storage para armazenar as transações no browser
const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Função para adicionar uma transação no DOM
const addTransactionToDOM = (transaction) => {
  // verificando se o valor da transação é positivo ou negativo e guardando o sinal num variavel
  const amountOperator = transaction.amount < 0 ? "-" : "+";

  // verificando se a transação é negativa ou positiva para determinar qual classe css será exibida na DOM
  const CSSClass = transaction.amount < 0 ? "minus" : "plus";

  // calculando o modulo do valor da transação para evitar que mostre 2 sinais de '-' (menos)
  const amountAbs = Math.abs(transaction.amount).toFixed(2);

  // criando um <li>
  const transactionItemLI = document.createElement("li");
  // adicionando a classe css
  transactionItemLI.classList.add(CSSClass);
  // adicionando o conteudo
  transactionItemLI.innerHTML = `
    ${transaction.name} <span>${amountOperator} R$ ${amountAbs}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  // adicionando a <li> na lista de transações
  transactionsListUL.append(transactionItemLI);
};

// Função para removar uma transação
const removeTransaction = (ID) => {
  //
  transactions = transactions.filter((transction) => transction.id !== ID);
  // atualizando o local storage e o DOM
  updateLocalStorage();
  init();
};

// Função para obter o saldo total das transações
const getBalance = (transactionsAmounts) =>
  transactionsAmounts
    .reduce((accumulator, amount) => accumulator + amount, 0) // soma os valores
    .toFixed(2); // arredonda para duas casa decimais

// Função para obter apenas os valores das receitas(valores positivos)
const getIncome = (transactionsAmounts) =>
  transactionsAmounts
    .filter((value) => value > 0) // filtra apenas os valores positivos
    .reduce((accumulator, value) => accumulator + value, 0) // soma os valores
    .toFixed(2); // arredonda para duas casas decimais

// Função para obters apenas os valores das despesas(valores negativos)
const getExpense = (transactionsAmounts) =>
  Math.abs(
    transactionsAmounts
      .filter((value) => value < 0) // filtra apenas os valores negativos
      .reduce((accumulator, value) => accumulator + value, 0) // soma os valores
  ).toFixed(2); // arredonda para duas casas decimais

// Atualizando os valores de Saldo, Receitas e Despesas
const updateBalanceValues = () => {
  /* cria uma lista com os valores das transações
  (usando Destructuring para pegar apenas a propriedade amount de cada objeto 
  na lista de transações) */
  const transactionsAmounts = transactions.map(({ amount }) => amount);

  // obtendo o saldo
  const balance = getBalance(transactionsAmounts);

  // obtendo as receitas
  const income = getIncome(transactionsAmounts);

  // obtendo as despesas
  const expense = getExpense(transactionsAmounts);

  // atualizando o conteudo dos textos no DOM
  balanceLabel.textContent = `R$ ${balance}`;
  incomeLabel.textContent = `+ R$ ${income}`;
  expenseLabel.textContent = `- R$ ${expense}`;
};

// Adiciona as transações no DOM quando a pagina for carregada
const init = () => {
  // Limpando a lista de transações para evitar a duplicação de itens
  transactionsListUL.innerHTML = "";

  // Iterando sob as transações para mostra-las na tela
  transactions.forEach(addTransactionToDOM);

  updateBalanceValues();
};

init();

// Adiciona as transação no local storage criado
const updateLocalStorage = () => {
  // Salva a informação no local storage
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

// Gera IDs aleatorios(numeros entre 0 e 1000)
const generateID = () => Math.round(Math.random() * 1000);

// Função para adicionar uma transação na lista de transações
const addToTransactionsList = (transactionName, transactionAmount) => {
  const transaction = {
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
  };

  transactions.push(transaction);
};

// Função para limpar os inputs do form
const cleanInputs = () => {
  transactionNameInput.value = "";
  transactionValueInput.value = "";
};

// Evento para tratar o envio(submit) do formulario
formTransactions.addEventListener("submit", (event) => {
  // Evita que o form seja enviado
  event.preventDefault();

  const transactionName = transactionNameInput.value.trim();
  let transactionValue = transactionValueInput.value.trim();
  const someEmptyField = transactionName === "" || transactionValue === "";

  // Verificando se algum dos campos(nome e valor da transação) foram preenchidos
  if (someEmptyField) {
    alert("Por favor, preencha o nome e o valor da transação!");
    return;
  }

  // Verificando o operador da transação
  if (transactionOperator === transactionType.Expense) {
    // Transforma em um número negativo para indicar que é uma despesa
    transactionValue *= -1;
  }

  // Cria uma transação se ambos os campos(nome e valor) forem preenchidos
  addToTransactionsList(transactionName, transactionValue);

  // Atualizando a DOM e o local storage
  init();
  updateLocalStorage();

  // Limpando os campos preenchidos
  cleanInputs();

  divAddButtons.classList.toggle("visible");
  form.classList.toggle("visible");
});

// Evento para tratar o cancelamento do envio(submit) do formulario
formTransactions.addEventListener("reset", (event) => {
  // Evita que o form seja enviado
  event.preventDefault();

  cleanInputs();

  divAddButtons.classList.toggle("visible");
  form.classList.toggle("visible");
});

// Evento para tratar o click do botao de adicionar Receita
addIncomeButton.addEventListener("click", () => {
  transactionOperator = transactionType.Income;
  divAddButtons.classList.toggle("visible");
  form.classList.toggle("visible");
});

// Evento para tratar o click do botao de adicionar Despesa
addExpenseButton.addEventListener("click", () => {
  transactionOperator = transactionType.Expense;
  divAddButtons.classList.toggle("visible");
  form.classList.toggle("visible");
});
