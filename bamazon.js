require('dotenv').config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306 //
    port: 3306,
  
    // Your username //
    user: "root",
  
    // Your password //
    password: process.env.MYSQL_PASSWORD,
    database: "bamazon_DB"
  });

// Connect to the mysql server and sql database //
connection.connect(function(err) {
    if (err) throw err;
    // Run the displayInventory function after the connection is made to prompt the user //
    displayInventory();
  });
  // DisplayInventory will retrieve the current inventory from the database and output it to the console //
  function displayInventory () {
    // Construct the database query string //
    queryStr = 'SELECT * FROM products';
    // Make DB query //
    connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('\x1b[36m%s\x1b[0m', 'Existing Inventory: ');
		console.log('...................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department_name + '  //  ';
			strOut += 'Price: $' + data[i].price + '\n';

			console.log('\x1b[36m%s\x1b[0m',strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

	  	//Prompt the user for item/quantity they would like to purchase //
	  	promptUserPurchase();
	})
}

// promptUserPurchase will prompt the user for the item/quantity they would like to purchase //
function promptUserPurchase () {
// Prompt the user to select an item //
inquirer
.prompt([
    {
        name: 'id',
        type: 'input',
        message: 'Please enter the Item ID for the item you would like to purchase.',
        filter: Number
    },
    {
        name: 'quantity',
        type: 'input',
        message: 'How many do you want to purchase?',
        filter: Number
    }
])
}