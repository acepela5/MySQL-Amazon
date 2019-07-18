var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "adigalan",
    database: "bamazon_db"
});

connection.connect(function (err) {
    //if (err) throw err;
    console.log(err);

    console.log("Connected to id: ", connection.threadId);
   displayProducts()
});

function displayProducts(){
   connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {3
       console.table(res)
       purchaseProduct()
    })
}

function purchaseProduct() {
   // connection.query("SELECT * FROM products", function (err, res) {
        // if (err) throw err;
        //console.log(res)
        inquirer
            .prompt([
                {
                    name: "item_id",
                    type: "number",
                    // choices: function () {
                    //     var choiceArr = [];
                    //     for (var i = 0; i < res.length; i++) {
                    //         choiceArr.push(res[i].item_id + "," + res[i].product_name) + "," + res[i].price)
                    //     }
                    //     return choiceArr;
                    // },
                    message: "Enter the ID number of the product you would like to purchase."
                    // validate: function (value) {
                    //     if (isNan(value)) {
                    //         return false
                    //     }
                    //     else {
                    //         return true
                    //     }
                    // }
                },
                {
                    name: "howMany",
                    type: "input",
                    message: "How many copies of this item would your like to purchase?"
                }
            ]).then(function (answer) {

                connection.query(`SELECT * FROM products where item_id=${parseInt(answer.item_id)}`, function(err,res){
                console.log(res)
                var chosenItem = res[0]
               
                console.log("id:", answer.item_id)
                if (chosenItem.stock_quantity >= parseInt(answer.howMany)) {
                  
                    var newQ = chosenItem.stock_quantity - parseInt(answer.howMany)
                    console.log("newQ:", newQ)
                  
                    connection.query(
                        `UPDATE products SET stock_quantity=${newQ} WHERE item_id=${answer.item_id}`,
                       
                        function (err) {
                            if (err) throw err;
                            console.log(err)
                        }
                    );
                    console.log("Total is: " + (parseInt(answer.howMany)*parseFloat(chosenItem.price)))
                    connection.end();
                }
                else {
                    console.log("It appears that we do not have enough copies of this product. Please try another quantity.")
                    purchaseProduct();
                 }
            }); 
   });
}
