# bamazon
Amazon-like storefront using MySQL

**Video Demo of App:** 
[YouTube](https://youtu.be/QDY53Icm0k8)

**App Summary:**
This application uses MySQL to create a database called `bamazon`.  The database includes a table called `products` which has been pre-populated with inventory data (item id, product name, department name, price, and stock quantity).

The app performs two functions: 

**1.  Customer** 

    * The app is designed to fulfill customer product orders 
    * It will prompt the customer to make a purchase selection and a quantity amount 
    * Based on price and quantity, the app will display the total amount for the purchase
    * Inventory will be decreased by the amount purchased by the customer 
    * 'Insufficient quantity' will display if the customer tries to purchase more than what's available. 


**2. Manager** 

    * The app will prompt the Manager to select an action: 

        * View Products For Sale
        * View Low Inventory (all products with inventory < 5)
        * Add to Inventory (increase inventory amount as needed and log change)
        * Add New Product entirely (and log change)



