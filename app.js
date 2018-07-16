// TODO
/*
    1. Add event handler to ok button
    2. Get input values
    3. Add new item to our data sctructure
    4. Add new item to the UI
    5. Calculate budget
    6. Update the UI

    UI MODULE
        Get input values
        Add new item to the UI
        Update the UI

    DATA MODULE
        Add new item to our data structure
        Calculate budget

    CONTROLLER MODULE
        Add event handler to ok button


  NEW TODO LIST
  1. Add event handler to delete expense element
  2. Delete the element from the data sctructure
  3. Delete item from de UI
  4. Re-calculate budget
  5. Update the UI

*/
// Create Modules.

// BUDGET CONTROLLER
const budgetController = (() => {
    class Expense {
      constructor(id, value, description) {
        this.id = id;
        this.value = value;
        this.description = description;
        this.percentage = -1;
      }
      calcPercentage(totalIncome) {
        if (totalIncome > 0) {
          this.percentage = Math.round((this.value / totalIncome) * 100);
        }
      }
      getPercentage() {
        return this.percentage;
      }
    }
    class Income {
      constructor(id, value, description) {
        this.id = id;
        this.value = value;
        this.description = description;
      }
    }
    let budgetData = {
      allItems: {
        expense: [],
        income: []
      },
      totals: {
        expense: 0,
        income: 0
      },
      budget: 0,
      percentage: -1
    };
    const calculateTotal = type => {
      let sum = 0;
      budgetData.allItems[type].forEach(element => {
        sum += element.value;
      });
  
      budgetData.totals[type] = sum;
    };
    return {
      addItem: (type, val, des) => {
        let newItem, ID;
        // Calculate next ID
        if (budgetData.allItems[type].length > 0) {
          ID =
            budgetData.allItems[type][budgetData.allItems[type].length - 1].id +
            1;
        } else {
          ID = 0;
        }
        // Create a newItem exp or inc depending on type
        if (type === "expense") {
          newItem = new Expense(ID, val, des);
        } else {
          newItem = new Income(ID, val, des);
        }
        // Push into data sctructure
        budgetData.allItems[type].push(newItem);
        return newItem;
      },
  
      deleteItem: (type, id) => {
        const ids = budgetData.allItems[type].map(element => {
          return element.id;
        });
        const index = ids.indexOf(id);
        if (index !== -1) {
          budgetData.allItems[type].splice(index, 1);
        }
      },
      calculateBudget: () => {
        // 1. Calculate total income and expenses
        calculateTotal("expense");
        calculateTotal("income");
        // 2. Calculate the budget: income - expenses
        budgetData.budget = budgetData.totals.income - budgetData.totals.expense;
        // 3. Calculate the percentage of income and expense
        if (budgetData.totals.income > 0) {
          budgetData.porcentage = Math.round(
            (budgetData.totals.expense / budgetData.totals.income) * 100
          );
        }
      },
      calcultePorcentages: totalIncome => {
        budgetData.allItems.expense.forEach(current => {
          current.calcPercentage(totalIncome);
        });
      },
      getPercentages: () => {
        let percentages = budgetData.allItems.expense.map(element => {
          return element.getPercentage();
        });
        return percentages;
      },
  
      getBudget: () => {
        return {
          budget: budgetData.budget,
          totalIncome: budgetData.totals.income,
          totalExpense: budgetData.totals.expense,
          percentage: budgetData.percentage
        };
      },
      logData: () => {
        console.log(budgetData.allItems);
      }
    };
  })();
  
  // UI CONTROLLER
  const UIController = (() => {
    const DOMStrings = {
      inputType: ".add__type",
      inputDescription: ".add__description",
      inputValue: ".add__value",
      inputBtn: ".add__btn",
      incomeContainer: ".income__list",
      expenseContainer: ".expenses__list",
      budgetLabel: ".budget__value",
      incomeLabel: ".budget__income--value",
      expenseLabel: ".budget__expenses--value",
      percentageLabel: ".budget__expenses--percentage",
      container: ".container",
      itemPercentage: ".item__percentage",
      dateLabel: ".budget__title--month"
    };
    const formatNumber = (number, type) => {
      /**
       * + or - before the number depending of type(income, expense)
       * exactly 2 decimal point
       * comma separanting thousands
       */
      Math.number = Math.abs(number);
      number = number.toFixed(2);
  
      numberSplit = number.split(".");
      let int = numberSplit[0];
      if (int.length > 3) {
        int =
          int.substring(0, int.length - 3) + "," + int.substring(int.length - 3);
      }
      dec = numberSplit[1];
      return (type === "expense" ? "- " : "+ ") + int + "." + dec;
    };
    const nodeForeachList = (list, callback) => {
      for (let index = 0; index < list.length; index++) {
        callback(list[index], index);
      }
    };
    return {
      displayDate: () => {
        const Months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "November",
          "December"
        ];
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        document.querySelector(DOMStrings.dateLabel).textContent =
          Months[month] + ", " + year;
      },
      getInput: () => {
        return {
          // inc for +, exp for -
          type: document.querySelector(DOMStrings.inputType).value,
          description: document.querySelector(DOMStrings.inputDescription).value,
          value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
        };
      },
      getDOMStrings: () => {
        return DOMStrings;
      },
      addListItem: (obj, type) => {
        // Create HTMl string with place holder text
        let html, newHtml, element;
        if (type === "income") {
          element = DOMStrings.incomeContainer;
          html =
            '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === "expense") {
          element = DOMStrings.expenseContainer;
          html =
            '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
  
        // Replace the  place holder with actual data
  
        newHtml = html.replace("%id%", obj.id);
        newHtml = newHtml.replace("%description%", obj.description);
        newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
        // Insert HTML into the DOM
        let htmlItem = document.querySelector(element);
        htmlItem.insertAdjacentHTML("beforeend", newHtml);
      },
      deleteItemList: itemSelector => {
        const theElement = document.getElementById(itemSelector);
        theElement.parentNode.removeChild(theElement);
      },
      changeStyleType: () => {
        const fields = document.querySelectorAll(
          DOMStrings.inputType +
            "," +
            DOMStrings.inputDescription +
            "," +
            DOMStrings.inputValue
        );
  
        nodeForeachList(fields, current => {
          current.classList.toggle("red-focus");
        });
      },
      displayBudget: obj => {
        let formattedBudget;
        if (obj.budget > 0) {
          formattedBudget = formatNumber(obj.budget, "income");
        } else {
          formattedBudget = formatNumber(obj.budget, "expense");
        }
        document.querySelector(
          DOMStrings.budgetLabel
        ).textContent = formattedBudget;
        document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(
          obj.totalIncome,
          "income"
        );
        document.querySelector(
          DOMStrings.expenseLabel
        ).textContent = formatNumber(obj.totalExpense, "expense");
        if (obj.porcentage > 0) {
          document.querySelector(DOMStrings.percentageLabel).textContent =
            obj.percentage + "%";
        } else {
          document.querySelector(DOMStrings.percentageLabel).textContent = "--";
        }
      },
      clearFields: () => {
        let fields, fieldArray;
        fields = document.querySelectorAll(
          DOMStrings.inputDescription + "," + DOMStrings.inputValue
        );
        fieldArray = Array.prototype.slice.call(fields);
        fieldArray.forEach((current, index, array) => {
          current.value = "";
        });
      },
      displayPercentage: percentages => {
        const fields = document.querySelectorAll(DOMStrings.itemPercentage);
  
        nodeForeachList(fields, (current, index) => {
          if (percentages[index] > 0) {
            current.textContent = percentages[index] + "%";
          } else {
            current.textContent = "--";
          }
        });
      }
    };
  })();
  
  // GLOBAL APP CONTROLLER
  const controller = ((budgetCrl, UICtrl) => {
    const setupEvenListeners = () => {
      const DOM = UICtrl.getDOMStrings();
      let add_btn = document.querySelector(DOM.inputBtn);
      add_btn.addEventListener("click", ctrlAddItem);
      document
        .querySelector(DOM.inputType)
        .addEventListener("change", UICtrl.changeStyleType);
      document.addEventListener("keypress", event => {
        if (event.charCode === 13) {
          ctrlAddItem();
        }
      });
      document
        .querySelector(DOM.container)
        .addEventListener("click", ctrlDeleteItem);
    };
    const updateBudget = () => {
      // 1. Calculate the budget
      budgetCrl.calculateBudget();
      // 2. Return the budget
      let budget = budgetCrl.getBudget();
      // 3. Display the budget to UI
      UICtrl.displayBudget(budget);
    };
    const updatePorcentages = () => {
      budgetCrl.calcultePorcentages(budgetCrl.getBudget().budget);
      const percentages = budgetCrl.getPercentages();
      UICtrl.displayPercentage(percentages);
    };
    const ctrlAddItem = () => {
      // Code to run when clicked add_btn
      // 1. Get the filed input data
      let input = UICtrl.getInput();
      if (input.description != "" && !isNaN(input.value) && input.value > 0) {
        // 2. Add item to the budgetController
        let newItem = budgetCrl.addItem(
          input.type,
          input.value,
          input.description
        );
        // budgetCrl.logData();
        // 3. Add item to UI
        UICtrl.addListItem(newItem, input.type);
        // 4. Clear input fields
        UICtrl.clearFields();
        // 5. Calculate and update th budget
        updateBudget();
        // 6. Calculate and updte porcentages
        updatePorcentages();
      }
    };
    const ctrlDeleteItem = event => {
      let DOM = UICtrl.getDOMStrings();
      const itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
      // Delete the item from th data structure
      if (itemID) {
        const splitID = itemID.split("-");
        const type = splitID[0];
        const ID = parseInt(splitID[1]);
        budgetCrl.deleteItem(type, ID);
  
        UICtrl.deleteItemList(itemID);
        updateBudget();
        updatePorcentages();
      }
    };
    return {
      init: () => {
        UICtrl.displayBudget({
          budget: 0,
          totalIncome: 0,
          totalExpense: 0,
          percentage: 0
        });
        UICtrl.displayDate();
        setupEvenListeners();
      }
    };
  })(budgetController, UIController);
  
  controller.init();
  