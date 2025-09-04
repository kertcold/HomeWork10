HomeWork10

| Method | Description                                                         | Expected Status Code | Test Data                                                    |
|--------|---------------------------------------------------------------------|----------------------|--------------------------------------------------------------|
| POST   | loan data not filled                                                | 400 - Bad Request    | default data as it is in Swagger API endpoint's request body |
| POST   | low risk: high income, no debt, employed, reasonable loan           | 200 - OK             | income 5000, loan 2000                                       |
| POST   | medium risk: moderate income, small debt, employed, reasonable loan | 200 - OK             | income 2000, debt 500, loan 3000                             |
| POST   | high risk: moderate income, high debt, employed, reasonable loan    | 200 - OK             | income 1000, debt 2000, loan 3000, period 6 months           |
| POST   | no income                                                           | 400 - Bad Request    | income 0                                                     | 
| POST   | invalid age                                                         | 400 - Bad Request    | age 0                                                        |  
| POST   | negative decision: loan-period very high risk ratio                 | 200 - OK             | income 2000, loan 3000, period 24 months                     |
