const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/reactmongoapp")
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connected"+err));

const todoSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.post('/addTodo', async (req, res) => {
  const { name,age } = req.body;
  //Here we are creating a new Todod object or document, whihc has a 
  const newTodo = new Todo({
   name:name,
   age:age,
  });
  try {
    await newTodo.save();
    res.status(201).json({ message: 'Todo added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getTodos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/deleteData/:id', async (req, res) => {
  const id = req.params.id;
  try{
    await Todo.findByIdAndDelete(id);
    res.json({message: 'Todo deleted successfully'});
  }catch(error){
    res.status(500).json({ error: error.message });
  }
});

app.put('/updateData/:id', async(req, res) => {
  const id = req.params.id;
  const {name,age} = req.body;
  
  try{
    const updatedTodo = await Todo.findByIdAndUpdate(id, { name, age });
  if(!updatedTodo){
      return res.status(404).json({message: 'Todo Not found'});
    }
    res.status(200).json(updatedTodo);
  }catch(error){
    res.status(500).json({message: 'error.message'});
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
