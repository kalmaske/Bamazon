var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var keys = require('./keys.js'); //contain host,port,user,pw, and database 	

var connection = mysql.createConnection(keys.connection);

connection.connect(function (err) {

	if (err) {
		console.log(" You have an error " + JSON.stringify(err));
		throw err;
	}
});

console.log("connect successful !!!!!");


function selectItem() {
	connection.query('SELECT * FROM products', function (err, res) {
		if (err) {
			console.log(" You have an error " + JSON.stringify(err));
			throw err;
		}

		var table = new Table({
			head: ["Item ID", "Product Name", "Department Name", "Price", "Quantity"],
			colWidths: [15, 20, 20, 15, 15],
		});

		for (var i = 0; i < res.length; i++) {
			table.push(
				[res[i].ItemID, res[i].ProductName, res[i].DepartmentName, parseFloat(res[i].Price).toFixed(2), res[i].StockQuantity]
			);
		}

		console.log(table.toString());

		inquirer
			.prompt([{
					type: "number",
					message: "Item ID you would like to buy : ",
					name: "itemNumber"
				},
				{
					type: "number",
					message: "Quantity : ",
					name: "Quantity"
				},
			]).then(function (userInput) {
				var query = 'SELECT * FROM products  WHERE itemID=' + userInput.itemNumber;
				console.log(query)
				connection.query(query, function (err, res) {
					if (err) {
						console.log(" You have an error " + JSON.stringify(err));
						throw err;
					}
					console.log(res);
					if (res[0].StockQuantity > userInput.Quantity) {
						var newQuantity = parseInt(res[0].StockQuantity) - parseInt(userInput.Quantity);
						var total = parseFloat(userInput.Quantity) * parseFloat(res[0].Price);
						total = total.toFixed(2);


						connection.query("UPDATE products SET ? WHERE ?", [{
							StockQuantity: newQuantity
						}, {
							itemID: userInput.itemNumber
						}], function (error, results) {
							if (err) {
								console.log(" You have an error " + JSON.stringify(err));
								throw err;
							}

							console.log("Your total is $" + total);
							console.log("Your order for " + userInput.Quantity + " " + res[0].ProductName + " has been placed.");

							orderMorItems();
						});

					} else {
						console.log("We're sorry, we only have " + res[0].StockQuantity + " of that product.");
						orderMorItems();
					}
				});
			});
	});
}

function orderMorItems() {
	inquirer
		.prompt([{
			type: "confirm",
			message: "want to order more items?",
			name: "goAgain"
		}, ]).then(function (userInput) {
			if (userInput.goAgain) {
				selectItem();
			} else {
				exit();
			}
		});
}

function exit() {
	connection.end();
	console.log("Have a great day!");
}

selectItem();