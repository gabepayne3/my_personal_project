# NC News Seeding

Run the following command to create the development and test database

```
npm run setup-dbs
```

Then add two .env files at the root of the repo folder :

- .env.development
- .env.test

Inside the .development file PGDATABSE needs to equal nc_news 

Inside the .test file PGDATABSE needs to equal nc_news_test
