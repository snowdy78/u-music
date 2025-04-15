## install dependencies
```cmd
cd front-end 
```
```cmd
npm install
```
## build the project
```cmd
npm run build
```
## start front-end build on local host
```cmd
npm run dev
```

## install Laravel

go to myapp file and run

```cmd
composer install
```
then
```cmd
npm install
```
## install into apache
then go to C:/Windows/System32/drivers/etc/
open `hosts` file and insert:
```
127.0.0.1 u-music-api.ru
```
then go to xampp_path/apache/conf/extra
open httpd-vhosts.conf
```
<VirtualHost *:80>
    ServerAdmin webmaster@dummy-host2.example.com
    DocumentRoot "C:/xampp/htdocs/u-music/myapp/public"
    ServerName u-music-api.ru
    ErrorLog "logs/dummy-host2.example.com-error.log"
    CustomLog "logs/dummy-host2.example.com-access.log" common
</VirtualHost>
```

## migrate mysql

for migration of database use this commands
```cmd
cd u-music/myapp
php artisan key:generate
php artisan cache:clear
php artisan config:clear
php artisan migrate --seed
```

If you need to run a server, use apache on your device.




