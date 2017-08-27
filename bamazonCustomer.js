var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var keys = require('./keys.js');	//contain host,port,user,pw, and database 	

var connection = mysql.createConnection(keys.connection);

connection.connect(function(err) {
    
    if (err){ 
        console.log(" You have an error "+JSON.stringify(err));
        throw err;}
});

console.log("connect successful !!!!!");


function selectItem() {
	connection.query('SELECT * FROM products', function(err, res) {
	    if (err){ 
            console.log(" You have an error "+JSON.stringify(err));
            throw err;}

		var table = new Table({
			head: ["Product ID", "Product Name", "Department Name", "Price", "Quantity"],
			colWidths: [15, 20, 20, 15, 15],
		});
		
		for(var i = 0; i < res.length; i++) {
			table.push(
			    [res[i].itemID, res[i].ProductName, res[i].DepartmentName, parseFloat(res[i].Price).toFixed(2), res[i].StockQuantity]
			);
		}
		
		console.log(table.toString());

        inquirer
            .prompt([
                {
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

			connection.query('SELECT * FROM products JOIN departments ON products.DepartmentName = departments.DepartmentName', function(err, res) {
		    	if (err){ 
                    console.log(" You have an error "+JSON.stringify(err));
                    throw err;}

		    	if(res[userInput.itemNumber - 1].StockQuantity > userInput.Quantity) {
		    		var newQuantity = parseInt(res[userInput.itemNumber - 1].StockQuantity) - parseInt(userInput.Quantity);
		    		var total = parseFloat(userInput.Quantity) * parseFloat(res[userInput.itemNumber - 1].Price);
			    	total = total.toFixed(2);

			    	var departmentTotal = parseFloat(total) + parseFloat(res[userInput.itemNumber - 1].TotalSales);
			    	departmentTotal = departmentTotal.toFixed(2);

	    			connection.query("UPDATE departments SET ? WHERE ?", [{
		    			TotalSales: departmentTotal
		    		}, {
		    			DepartmentName: res[userInput.itemNumber - 1].DepartmentName
		    		}], function(error, results) {});

		    		connection.query("UPDATE products SET ? WHERE ?", [{
		    			StockQuantity: newQuantity
		    		}, {
		    			itemID: userInput.itemNumber
		    		}], function(error, results) {
		    			if (err){ 
                            console.log(" You have an error "+JSON.stringify(err));
                            throw err;}

                   console.log("Your total is $" + total);
			    	  console.log("Your order for " + userInput.Quantity + " " + res[userInput.itemNumber - 1].ProductName +" has been placed.");
			    		
			    		orderMorItems();
		    		});

		    	} else {
		    		console.log("We're sorry, we only have " + res[userInput.itemNumber - 1].StockQuantity + " of that product.");
		    		orderMorItems();
		    	}	    
			});
		});	
	});
}

function orderMorItems() {
    inquirer
        .prompt([
		{
			type: "confirm",
			message: "want to order more items?",
			name: "goAgain"
		},
	]).then(function (userInput) {
		if(userInput.goAgain) {
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
