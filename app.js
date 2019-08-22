const express=require('express');
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
var x = require('request');

var app=express();
let Schema=mongoose.Schema;
// const studentModel = mongoose.model("students", {

const studentSchema = new Schema({

    firstname: String,
    lastname: String,
    admno:String
});
//const markModel = mongoose.model("marks", {

const markSchema = new Schema({
    studId:{type:mongoose.Types.ObjectId,ref:'students'},
    sub: String,
    mark: String,
    totalmark:String
});

var studentModel = mongoose.model('students', studentSchema);

var markModel = mongoose.model('marks', markSchema);


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//mongodb+srv://anishsnair:<password>@cluster0-rqfpy.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect("mongodb://localhost:27017/testdb",{ useNewUrlParser: true });
//Mongoose.connect("mongodb+srv://anishsnair:hello12345@cluster0-rqfpy.mongodb.net/test?retryWrites=true&w=majority");


app.get("/getdata", async (request, response) => {

    try {
        var result = await studentModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.post("/addstudents", async (request, response) => {
    try {
      var studentdata = new studentModel(request.body);
        var result = await studentdata.save();
        response.send(result);
    } catch (error) {
      console.log(error)

        response.status(500).send(error);
    }
});

app.post("/addmarks", async (request, response) => {
    try {
      console.log(request.body)

      var marksofstudents = new markModel(request.body);

  var result = await marksofstudents.save();

        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/view", async (request, response) => {
    try {


  studentModel.aggregate([

      //  {
          // $group: {
          //       _id: '$_id',  //$region is the column name in collection
          //
          //   },
        //   },

          {  $lookup: {
                from: "marks", // collection to join
                localField: "_id",//field from the input documents
                foreignField: "studId",//field from the documents of the "from" collection
                as: "marks"// output array field
            }

        }],function (error, data) {
         return response.send(data);
     //handle error case also
    });
    //console.log(resources);

      //  var result = await markModel.find({"studId":"5d5ed2f5c36c3b9e878f1908"}).populate('studId');
    //    response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});




app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
});
