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
    manager();
})

var manager = function(){
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message:  'What action would you like to perform?',
        choices: ['View Products for Sale', 'View Low Inventory', 
        'Add to Inventory', 'Add New Product']

    }).then(function(answer){
        switch (answer.action){
            case "View Products for Sale":
            availableProd();
            break;

            case 'View Low Inventory':
            lowInventory();
            break;

            case 'Add to Inventory':
            addInventory();
            break;

            case 'Add New Product':
            addProduct();
            break;
        }
    })                    
}

function availableProd(){
    connection.query('SELECT * FROM products', function(err,res){
               var table = new Table({
                   head: ['position', 'item_id','product_name','department_name','price', 'stock_quantity']
                   , colWidths: [10,10,35,20,15,20]   
            })
                for (var i=0; i<res.length; i++){
                    table.push([res[i].position, res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
                }
                console.log(table.toString());
            })
}

function lowInventory(){
    connection.query('SELECT * FROM products WHERE stock_quantity < 100', function(err,res){
               var table = new Table({
                   head: ['position', 'item_id','product_name','department_name','price', 'stock_quantity']
                   , colWidths: [10,10,35,20,15,20]   
                })
                for (var i=0; i<res.length; i++){
                    table.push([res[i].position, res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
                }
                console.log(table.toString());
            })
}

function addInventory(){
    inquirer.prompt([
    {
        name: 'itemID',
        type: 'input',
        message: 'To add more inventory, please enter the item_id # (5 digits).',
    },
    {
        name: 'units',
        type: 'input',
        message: 'How many items would you like to add to current inventory level?'
    }]). then(function(answer){
            connection.query("SELECT * FROM products WHERE ?", {item_id: answer.itemID}, function(err,res){
                var newInventory = (res[0].stock_quantity + answer.units)

                    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newInventory },{item_id: answer.itemID}], function(err, res) {
                        console.log(res.affectedRows + " product(s) updated!\n");
                        })
            })
    })
}

function addProduct(){
    inquirer.prompt([
    {
        name:'itemID',
        type:'input',
        message: 'Enter 5 digit item ID number for the new product'
    },
    {
        name: 'product',
        type: 'input',
        message: 'Enter the product name.'

    },
    {
        name: 'dept',
        type: 'input',
        message: 'Enter the department name.'
    },
    {   name: 'price',
        type: 'input',
        message: 'Enter price per unit.'
    },
    {
        name: 'units',
        type: 'input',
        message: 'Enter the inventory quantity.'
    }

    ]).then(function(answer){
        connection.query("INSERT INTO products SET ?", {item_id: answer.itemID, product_name: answer.product,
        department_name: answer.dept, price: answer.price, stock_quantity: answer.units}, function(err, res){
            console.log(res.affectedRows + "products inserted!\n");
        })
    
    })

}