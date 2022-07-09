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
const transactionNameInput = document.querySelector("#transaction-name");
// Seleciona o input: valor da transação
const transactionAmountInput = document.querySelector("#transaction-amount");
// Seleciona o input: data da transação
const transactionDateInput = document.querySelector("#transaction-date");
// Seleciona o input: local da transação
const transactionPlaceInput = document.querySelector("#transaction-place");
// Seleciona o input: descrição da transação
const transactionDescInput = document.querySelector("#transaction-desc");
// Seleciona a div que contem os botoes de adicionar receita ou despesa
const divAddButtons = document.querySelector("#add-inc-exp");
// Seleciona o button: adicionar transação
const addButton = document.querySelector("#add-btn");
// Seleciona o button: adicionar receita
const addIncomeButton = document.querySelector("#add-income-btn");
// Seleciona o button: adicionar despesa
const addExpenseButton = document.querySelector("#add-expense-btn");
// Criando um subtitulo para o <form>
const sectionTitle = document.createElement("h3");
// variavel para mudar o subtitulo de Nova Transação para Editando Transação
const subtitle = document.querySelector("#new-edit");

// Objeto para indicar o tipo da transação
const transactionType = {
  Income: "receita",
  Expense: "despesa",
};

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
  transactionItemLI.innerHTML = `
    <button type="button" class="collapsible ${CSSClass}">
      <i class="fa-icon fa-solid fa-angle-right"></i>
      <p>${transaction.name}</p><span>${amountOperator} R$ ${amountAbs}</span>
    </button>
    <div class="content visible">
      <div class="content-details">
        <span>Data: ${transaction.date}</span>
        <span>Local: ${transaction.place}</span>
        <span>Descrição: ${transaction.description}</span>
      </div>
      <div class="content-buttons">
        <button 
          class="delete-btn" 
          onclick="deleteConfirmationDialog(${transaction.id})">
            <i class="fa-solid fa-trash-can"></i>
        </button>
        <button class="edit-btn">
            <i class="fa-solid fa-pen"></i>
        </button>
      </div>
    </div>
  `;

  // Adicionando a <li> na lista de transações
  transactionsListUL.append(transactionItemLI);
};

// Função para remover uma transação
const removeTransaction = (ID) => {
  transactions = transactions.filter((transction) => transction.id !== ID);
  // atualizando o local storage e o DOM
  updateLocalStorage();
  init();
};

// Função para editar uma transação
const editTransaction = (ID) => {
  const [transaction] = transactions.filter((t) => t.id === ID);

  if (formTransactions.contains(sectionTitle)) {
    formTransactions.removeChild(sectionTitle);
  }

  divAddButtons.classList.toggle("visible");
  formTransactions.classList.toggle("visible");

  transactionNameInput.value = transaction.name;
  transactionAmountInput.value = transaction.amount;
  transactionDateInput.value = transaction.date;
  transactionPlaceInput.value = transaction.place;
  transactionDescInput.value = transaction.description;
  const someEmptyField =
    transactionNameInput.value.trim() === "" ||
    transactionAmountInput.value.trim() === "";

  /* Verificando se algum dos campos(nome e valor)
  foram preenchidos */
  if (someEmptyField) {
    someEmptyFieldDialog();
    return;
  }

  // addToTransactionsList(
  //   transaction.name,
  //   transaction.amount,
  //   transaction.date,
  //   transaction.place,
  //   transaction.desc
  // );

  // // Atualizando a DOM e o local storage
  // init();
  // updateLocalStorage();

  // // Limpando os campos preenchidos
  // cleanInputs();

  if (subtitle.textContent !== "Editando transação") {
    subtitle.textContent = "Editando transação";
    return;
  }
  subtitle.innerHTML = `
    <i class="fa-solid fa-coins"></i>
    Nova transação
  `;
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
const addToTransactionsList = (
  transactionName,
  transactionAmount,
  transactionDate,
  transactionPlace,
  transactionDesc
) => {
  const transaction = {
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
    date: transactionDate,
    place: transactionPlace,
    description: transactionDesc,
  };

  transactions.push(transaction);
};

// Função para limpar os inputs do form
const cleanInputs = () => {
  transactionNameInput.value = "";
  transactionAmountInput.value = "";
  transactionDateInput.value = "";
  transactionPlaceInput.value = "";
  transactionDescInput.value = "";

  transactionNameInput.removeAttribute("required");
  transactionAmountInput.removeAttribute("required");
};

// Evento para tratar o click do botao de adicionar Receita
addIncomeButton.addEventListener("click", () => {
  // Adicionando um titulo ao formulario
  sectionTitle.textContent = transactionType.Income;
  sectionTitle.classList.add("section-title");
  formTransactions.prepend(sectionTitle);

  // Operação: adicionando receita
  transactionOperator = transactionType.Income;
  divAddButtons.classList.toggle("visible");
  formTransactions.classList.toggle("visible");
});

// Evento para tratar o click do botao de adicionar Despesa
addExpenseButton.addEventListener("click", () => {
  // Adicionando um titulo ao formulario
  sectionTitle.textContent = transactionType.Expense;
  sectionTitle.classList.add("section-title");
  formTransactions.prepend(sectionTitle);

  // operação: adicionando despesa
  transactionOperator = transactionType.Expense;
  divAddButtons.classList.toggle("visible");
  formTransactions.classList.toggle("visible");
});

// Evento para tratar o envio(submit) do formulario
formTransactions.addEventListener("submit", (event) => {
  // Evita que o form seja enviado
  event.preventDefault();

  const transactionName = transactionNameInput.value.trim();
  let transactionAmount = transactionAmountInput.value.trim();
  const transactionDate = transactionDateInput.value;
  const transactionPlace = transactionPlaceInput.value.trim();
  const transactionDesc = transactionDescInput.value.trim();
  const someEmptyField = transactionName === "" || transactionAmount === "";

  /* Verificando se algum dos campos(nome e valor da transação)
  foram preenchidos */
  if (someEmptyField) {
    someEmptyFieldDialog();
    return;
  }

  // Verificando se a transação é uma adição de despesa
  if (transactionOperator === transactionType.Expense) {
    // Transforma em um número negativo para indicar que é uma despesa
    transactionAmount *= -1;
  }

  // Cria uma transação se todos os campos forem preenchidos
  addToTransactionsList(
    transactionName,
    transactionAmount,
    transactionDate,
    transactionPlace,
    transactionDesc
  );

  // Atualizando a DOM e o local storage
  init();
  updateLocalStorage();

  // Limpando os campos preenchidos
  cleanInputs();

  subtitle.innerHTML = `
    <i class="fa-solid fa-coins"></i>
    Nova transação
  `;
  divAddButtons.classList.toggle("visible");
  formTransactions.classList.toggle("visible");

  // refresh
  location.reload();
});

// Evento para tratar o cancelamento do envio(submit) do formulario
formTransactions.addEventListener("reset", (event) => {
  // Evita que o form seja enviado
  event.preventDefault();

  cleanInputs();

  subtitle.innerHTML = `
    <i class="fa-solid fa-coins"></i>
    Nova transação
  `;
  divAddButtons.classList.toggle("visible");
  formTransactions.classList.toggle("visible");
});

// Função para confirmação de deleção de uma transação
const deleteConfirmationDialog = (ID) =>
  Swal.fire({
    title: "Você tem certeza?",
    text: "Não é possível reverter!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3e8ae7",
    cancelButtonColor: "#c0392b",
    confirmButtonText: "Sim, apague a transação!",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      removeTransaction(ID);

      Swal.fire({
        title: "Apagado!",
        text: "Sua transação foi apagada",
        icon: "success",
        confirmButtonColor: "#3e8ae7",
      }).then((result) => {
        if (result.isConfirmed) {
          // refresh
          location.reload();
        }
      });
    }
  });

// Função para informar ao usuario que ele esqueceu de preencher os campos
const someEmptyFieldDialog = () =>
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Por favor, preencha pelo menos o nome e o valor da transação!",
    confirmButtonColor: "#3e8ae7",
  }).then(() => {
    verifyEmptyField();
  });

/* Função para verificar se um campo esta vazio. Se sim, adiciona um atributo
"required" para indicar visualmente que é necessário o preenchimento daquele
campo.
*/
const verifyEmptyField = () => {
  const listFields = [transactionNameInput, transactionAmountInput];
  listFields.forEach((element) => {
    if (element.value.trim() === "") {
      element.setAttribute("required", "required");
    }
  });
};

// Tratando o click na transação para mostrar mais detalhes
const collapsibleButtonsList = document.querySelectorAll(".collapsible");
const collapsibleButtonsIcon = document.querySelectorAll(".fa-icon");
const content = document.querySelectorAll(".content");
for (let item = 0; item < collapsibleButtonsList.length; item++) {
  collapsibleButtonsList[item].addEventListener("click", () => {
    collapsibleButtonsList[item].classList.toggle("active");
    collapsibleButtonsIcon[item].classList.toggle("fa-angle-down");
    collapsibleButtonsIcon[item].classList.toggle("fa-angle-right");
    content[item].classList.toggle("visible");
    content[item].classList.toggle("show-content");
  });
}
