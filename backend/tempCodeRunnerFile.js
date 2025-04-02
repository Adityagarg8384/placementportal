
app.use(cookieParser());

app.use("/", router);

dbconnect();

app.listen(3000, ()=>{
    console.log("App has successfully started on Port 3000");
})