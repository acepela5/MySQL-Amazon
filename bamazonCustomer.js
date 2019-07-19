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
        inquirer
            .prompt([
                {
                    name: "item_id",
                    type: "number",
                    message: "Enter the ID number of the product you would like to purchase.",
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
                var chosenItem = res[0]
               
                console.log(
`Item Id: ${answer.item_id} 
Product: ${chosenItem.product_name}`)
                if (chosenItem.stock_quantity >= parseInt(answer.howMany)) {
                  
                    var newQ = chosenItem.stock_quantity - parseInt(answer.howMany)
                  
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
                    console.log("It appears that we do not have enough copies of this product. Please select another product or quantity.")
                    purchaseProduct();
                 }
            }); 
   });
}
 