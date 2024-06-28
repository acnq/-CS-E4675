# MongoDB details
mongodb+srv://fanyuanhaotc:<password>@cluster0.sxx9qcu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
password: klxsx6258

### PS
1. note we didn't let token to be expired for the simplicity of testing
2. if you want to make requests test via `./requests`, first run `./requests/test_users.rest`, then `./requests/test_login.rest`, then `./requests/test_blogs.rest`, the order matters.
3. also implemented the test of deleting a blog via token