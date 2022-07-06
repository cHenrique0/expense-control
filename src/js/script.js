// Seleciona a ul: lista de transações
const transactionsListUL = document.querySelector("#transactions-list");
// Seleciona o span: saldo atual
const balanceLabel = document.querySelector("#balance");
// Seleciona o span: receitas
const incomeLabel = document.querySelector("#income");
// Seleciona o span: despesas
const expenseLabel = document.querySelector("#expense");
// Seleciona o input: nome da transação
const transactionNameInput = document.querySelector("#text");
// Seleciona o input: valor da transação
const transactionValueInput = document.querySelector("#amount");
// Seleciona o button: adicionar transação
const addButton = document.querySelector("#add-btn");
// Seleciona o button: remover transação
const deleteButton = document.querySelector("#delete-btn");
// Seleciona o form
const formTransactions = document.querySelector("#form");

// Cria um local storage para armazenar as transações no browser
const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Função para adicionar uma transação no DOM
const addTransactionToDOM = (transaction) => {
  // verificando se o valor da transação é positivo ou negativo e guardando o sinal num variavel
  const operator = transaction.amount < 0 ? "-" : "+";

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
    ${transaction.name} <span>${operator} R$ ${amountAbs}</span>
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
  updateLocalStorage();
  init();
};

// Atualizando os valores de Saldo, Receitas e Despesas
const updateBalanceValues = () => {
  // cria uma lista com os valores das transações
  const transactionsAmounts = transactions.map(
    (transaction) => transaction.amount
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
}

// Gera IDs aleatorios(numeros entre 0 e 1000)
const generateID = () => Math.round(Math.random() * 1000);

// Evento para tratar o submit do formulario
formTransactions.addEventListener("submit", (event) => {
  // Evita que o form seja enviado
  event.preventDefault();

  const transactionName = transactionNameInput.value.trim();
  const transactionValue = transactionValueInput.value.trim();

  // Verificando se algum dos campos(nome e valor da transação) não estejam preenchidos
  if (transactionName === "" || transactionValue === "") {
    alert("Por favor, preencha o nome e o valor da transação!");
    return;
  }

  // cria uma transação se ambos os campos forem preenchidos
  const transaction = {
    id: generateID(),
    name: transactionName,
    amount: Number(transactionValue),
  };

  // adicionando a transção na lista de transações
  transactions.push(transaction);
  init();
  updateLocalStorage();

  // Limpando os campos preenchidos
  transactionNameInput.value = "";
  transactionValueInput.value = "";
});
