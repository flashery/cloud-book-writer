# A simple application for my test in syllaby

## Install docker 
## Clone this repo 
`git clone git@github.com:flashery/cloud-book-writer.git`

## Run this command
```
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php82-composer:latest \
    composer install --ignore-platform-reqs
```
## Install npm packages
`npm install`

## Run the migration
`./vendor/bin/sail migrate`

## Run sail
`./vendor/bin/sail up`

## Run npm dev server
`npm run dev`

## Visit your site
`http://localhost`

## API Documentation
`https://documenter.getpostman.com/view/1797280/2s9YJXbRB3#a297a533-d006-4edb-8472-3aaf5033b9ca`