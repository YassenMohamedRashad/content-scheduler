<p align="center"><a href="https://laravel.com" style="font-size: 2em; font-weight: bold; text-decoration: none; color: white" target="_blank">
<span style="color: red">Content</span>Schedular
</a></p>

This guide will help you set up and run this project from scratch, starting with installing PHP and MySQL using XAMPP.

---

## 🧰 Prerequisites

Before running this project, ensure the following are installed on your system:

### 1. ✅ Install XAMPP (includes PHP, MySQL, Apache)
- Download XAMPP from: https://www.apachefriends.org/index.html
- Install it and run the **Apache** and **MySQL** services via the XAMPP Control Panel.

### 2. ✅ Install Composer (PHP dependency manager)
- Download from: https://getcomposer.org/download/
- Verify installation by running the following command:
  ```bash
  composer --version
  ```
---

## 📁 Clone the Project
Use Git to clone this repository:
``` git clone https://github.com/YassenMohamedRashad/content-scheduler ```
```
cd content-scheduler
```
## 📦 Install Laravel Dependencies
Run the following command to install PHP dependencies:
```
composer install
```
## ⚙️ Set Up Environment File
```
cp .env.example .env
```
Then generate the application key:
```
php artisan key:generate
```
## 🛠 Configure Database
- Open XAMPP Control Panel and start MySQL.
- Go to http://localhost/phpmyadmin in your browser.
- Create a new database (e.g., laravel_app).
- Update the .env file with your database credentials:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_app
DB_USERNAME=root
DB_PASSWORD=
```
By default, XAMPP uses root with no password.

## 🗃️ Run Migrations (Optional: Seed Data)
```
php artisan migrate
```
Optional (Seed test data) :
```
php artisan db:seed
```
## 🔥 Start the Development Server
```
php artisan serve
```
Then open your browser and go to:
```
http://127.0.0.1:8000
```

--- 
--- 
---

## Testing Using Pest
Run following command to initialize testing db:
```
php artisan migrate --env=testing
```

Run following command to run tests:
```
php artisan test
```
additionaly you can run test for specific file:
```
php artisan test --filter=TestFile
```
