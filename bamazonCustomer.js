var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "test1",
    database: "bamazon_db"
})

connection.connect(function(err){
    console.log("Connected as id: "+ connection.threadId);
    start();
})

var start = function(){
    connection.query("SELECT * FROM products", function(err,res){
        var table = new Table({
            head: ['position', 'item_id','product_name','department_name','price', 'stock_quantity']
        , colWidths: [10,10,35,20,15,20]
        });

        for(var i=0; i<res.length; i++){
        table.push([res[i].position, res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
        };
        console.log(table.toString());

        customer();

})

var customer = function(){
        inquirer.prompt([
        {
            name: "itemID",
            type: "input",
            message: "What is the item ID (5 digits) of the product you would like to buy?"
        },
        {
            name: "units",
            type: "input",
            message: "How many units of the item would you like to buy?",
            validate: function(value){
                if(isNaN(value)==false){
                    return true;
                }else{
                    return false;
                    console.log("Please enter a number value.")
                }
            }
        }])
        .then(function(answer){
            connection.query("SELECT * FROM products WHERE ?", {item_id: answer.itemID},function(err,res){
                var totalUnits = res[0].stock_quantity
                if(answer.units > totalUnits){
                    console.log ("Insufficient quantity!")
                    customer();
                } else {
                var remainingUnits = (parseInt(res[0].stock_quantity) - parseInt(answer.units));
                var totalCost = (parseInt(res[0].price) * parseInt(answer.units));
                var totalPrice = totalCost.toFixed(2);
                console.log("\nYou have chosen the following: " + res[0].product_name + "  " + "Total: " + totalPrice + "\n")
                }
                connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity:remainingUnits },{item_id: answer.itemID}], function(err, res) {
            
                console.log(res.affectedRows + " product(s) updated!\n");
                })
            })
        
        })
    }
}


