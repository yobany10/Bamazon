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

  // validateInput makes sure that the user is supplying only positive integers for their inputs
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

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
        validate: validateInput,
        filter: Number
    },
    {
        name: 'quantity',
        type: 'input',
        message: 'How many do you want to purchase?',
        validate: validateInput,
        filter: Number
    }
]).then(function(input) {
    var item = input.id;
    var quantity = input.quantity;

    // Query db to confirm that the given item ID exists in the desired quantity //
    var queryStr = 'SELECT * FROM products WHERE ?';

    connection.query(queryStr, {id: item}, function(err, data) {
        if (err) throw err;

        // If the user has selected an invalid item ID, data attay will be empty //
        if (data.length === 0) {
            console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
            displayInventory();
            
        } else {
            var productData = data[0];

            // If the item requested by the user is in stock //
            if (quantity <= productData.stockQuantity) {
                console.log('The item you have selected is in stock! Ordering now...');

                // Construct the updating query string //
                var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;

                // Update the inventory //
                connection.query(updateQueryStr, function(err, data) {
                    if(err) throw err;

                    console.log('Your oder has been placed! Your total is $' + productData.price * quantity);
					console.log('Thank you for shopping with us!');
                    console.log("\n---------------------------------------------------------------------\n");
                    
                // End the database connection //
                connection.end();
                })
            } else {

                console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
				console.log('Please modify your order.');
				console.log("\n---------------------------------------------------------------------\n");

				displayInventory();
            }
        }
    })
})
}