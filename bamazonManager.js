var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "adigalan",
    database: "bamazon_db"
}); 

connection.connect(function(err){
    if (err) throw err;
    console.log("Connected to id: ", connection.threadId);
    // connection.end();
    start();
});

function start(){
  inquirer
  .prompt({
      name: "menuOptions",
      type: "list",
      message: "Would you like to do?",
      choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Exit"
      ]
}).then(function(answer){
    switch(answer.menuOptions) {
        case "View Products for Sale":
            viewProducts();
            break;
        case "View Low Inventory":
            lowInventory();
            break;
        case "Add to Inventory":
            addInventory();
        case "Add New Product":
            addProduct();
            break;
        case "Exit":
            connection.end();
            break;
    }
})
};

function viewProducts(){
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i=0; i < res.length; i++){
         
         console.log(`
         ${res[i].item_id} ${res[i].product_name} ${res[i].department_name} Price: ${res[i].price} Quantity: ${res[i].stock_quantity}` )
        }
        "\n"
        start();
     }) 
};

function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err,res){
        for (var i=0; i < res.length; i++){
         
            console.log(`
            ${res[i].item_id} ${res[i].product_name} ${res[i].department_name} Price: ${res[i].price} Quantity: ${res[i].stock_quantity}` )
           }
           "\n"
           start();
    })
};

function addInventory() {
    inquirer
    .prompt([
        {
            name:"product_name",
            type: "input",
            message: "What product would you like to update?"
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "How many copies of this product are you adding to the stock?",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              return false;
            }
          }
    ]).then(function(answer){
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: answer.stock_quantity
        },
        {
          product_name: answer.product_name
        }
      ],
      function(err, res) {
        if (err) throw err;
        console.log(res.product_name + " updated!\n");
        "\n"
        start();
      }
    )
    })
}

function addProduct(){
    inquirer
    .prompt([
      {
        name: "product_name",
        type: "input",
        message: "What is the product you would like to add?"
      },
      {
        name: "department",
        type: "input",
        message: "What department would you like to add this product to?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price for this product?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "stock_quantity",
        type: "input",
        message: "How many copies of this product are you adding to the stock?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ]).then(function(answer) {
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.product_name,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.stock_quantity
          },
          function(err) {
            if (err) throw err;
            console.log("Your product was added successfully!");
            "\n"
            start();
          }
        );
      });
};