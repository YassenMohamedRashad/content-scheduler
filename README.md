<p align="center"  style="font-size : 30px;">
  <a href="https://github.com/YassenMohamedRashad/content-scheduler" target="_blank" style="font-size: 2em; font-weight: bold; text-decoration: none; color: white;">
    <span style="font-weight: bold;"><span style="color : #407076">Content</span>Scheduler</span>
  </a>
</p>

This guide will help you install and run the Content Scheduler project, which consists of a Laravel (PHP, MySQL) backend and a React (Vite) frontend.

---

## 🧰 Prerequisites

Make sure you have the following installed:

- [XAMPP](https://www.apachefriends.org/index.html) (includes PHP, MySQL, Apache)
- [Composer](https://getcomposer.org/download/) (PHP dependency manager)
- [Node.js & npm](https://nodejs.org/)
- [Git](https://git-scm.com/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YassenMohamedRashad/content-scheduler
cd content-scheduler
```

---

## ⚙️ Backend Setup (Laravel)

1. **Navigate to the backend folder:**

  ```bash
  cd backend
  ```

2. **Install PHP dependencies:**

  ```bash
  composer install
  ```

3. **Set up the environment file and generate the application key:**

  ```bash
  cp .env.example .env
  php artisan key:generate
  ```

4. **Configure the database:**

  - Start MySQL from XAMPP Control Panel.
  - Go to [phpMyAdmin](http://localhost/phpmyadmin) and create a new database (e.g., `laravel_app`).
  - Update your `.env` file with the database credentials:
    ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=laravel_app
    DB_USERNAME=root
    DB_PASSWORD=
    ```

5. **Run database migrations and seeders (very important for the app to work):**

  ```bash
  php artisan migrate --seed
  ```

6. **Start the Laravel server:**

  ```bash
  php artisan serve
  ```

7. **Start the queue worker:**

  ```bash
  php artisan queue:work
  ```

---

## 💻 Frontend Setup (React + Vite)

1. **Navigate to the frontend folder:**

    ```bash
    cd ../frontend
    ```

2. **Install Node.js dependencies:**

    ```bash
    npm install
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    ```

---

Now you can access the backend at [http://127.0.0.1:8000](http://127.0.0.1:8000) and the frontend at the URL shown in your terminal http://localhost:8080.

Api Doc : https://apidog.com/apidoc/shared/fdd5b820-286d-40e0-8502-8a633dc4d70b

