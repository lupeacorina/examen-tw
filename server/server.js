const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const cors = require('cors')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'sample.db',
  define: {
    timestamps: false
  }
})

const VirtualShelf = sequelize.define('virtualShelf', {
  // id:{
  //   type: Sequelize.INTEGER, 
    
  //   primaryKey: true
  // },
  descriere:{
    type:Sequelize.STRING,
    validate: {
      len: [3, 500]
    }


  },

  dataCreare:{
    type:Sequelize.DATE
  }
 
  
})

const Book = sequelize.define('book', {
  // id:{
  //   type: Sequelize.INTEGER, 
    
  //   primaryKey: true
  // },
  titlu:{
    type:Sequelize.STRING,
    validate: {
      len: [5, 500]
    }


  },
  genLiterar: {
    type:Sequelize.ENUM({
      values: ['COMEDY', 'TRAGEDY']
    })
    // type:Sequelize.ENUM('CAPTAIN', 'BOATSWAIN')
  },
  url:{
    type:Sequelize.STRING,
    validate:{
      isUrl: true
    }
  }
})

VirtualShelf.hasMany(Book)

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/sync', async (req, res) => {
  try {
    await sequelize.sync({ force: true })
    res.status(201).json({ message: 'created' })
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})
//VirtualShelf
app.get('/virtualShelfs', async (req, res) => {
  try {
    const query = {}
    let pageSize = 2
    const allowedFilters = ['descriere', 'dataCreare']
    const filterKeys = Object.keys(req.query).filter(e => allowedFilters.indexOf(e) !== -1)
    if (filterKeys.length > 0) {
     
      
      query.where = {}
      for (const key of filterKeys) {
        if(key=='dataCreare'){
          let dataParsare=parseInt(req.query[key])+1
          query.where[key]={
            [Op.gte]:`%${req.query[key]}%`,
            [Op.lte]:`%${dataParsare}`
          }
        }
        else{
        query.where[key] = {
          [Op.like]: `%${req.query[key]}%`
        }
      }
      
    }
    }

    const sortField = req.query.sortField
    let sortOrder = 'ASC'
    if (req.query.sortOrder && req.query.sortOrder === '-1') {
      sortOrder = 'DESC'
    }

    if (req.query.pageSize) {
      pageSize = parseInt(req.query.pageSize)
    }

    if (sortField) {
      query.order = [[sortField, sortOrder]]
    }

    if (!isNaN(parseInt(req.query.page))) {
      query.limit = pageSize
      query.offset = pageSize * parseInt(req.query.page)
    }

    const records = await VirtualShelf.findAll(query)
    const count = await VirtualShelf.count()
    res.status(200).json({ records, count })
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.post('/virtualShelfs', async (req, res) => {
  try {
    if (req.query.bulk && req.query.bulk === 'on') {
      await VirtualShelf.bulkCreate(req.body)
      res.status(201).json({ message: 'created' })
    } else {
      await VirtualShelf.create(req.body)
      res.status(201).json({ message: 'created' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/virtualShelfs/:id', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.id)
    if (virtualShelf) {
      res.status(200).json(virtualShelf)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.put('/virtualShelfs/:id', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.id)
    if (virtualShelf) {
      await virtualShelf.update(req.body, { fields: ['descriere','dataCreare'] })
      res.status(202).json({ message: 'accepted' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.delete('/virtualShelfs/:id', async (req, res) => {
  try {
    const virtualShelfs = await VirtualShelf.findByPk(req.params.id, { include: Book })
    if (virtualShelfs) {
      await virtualShelfs.destroy()
      res.status(202).json({ message: 'accepted' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/virtualShelfs/:vid/books', async (req, res) => {
  try {
    const virtualShelfs = await VirtualShelf.findByPk(req.params.vid)
    if (virtualShelfs) {
      const books = await virtualShelfs.getBooks()

      res.status(200).json(books)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/virtualShelfs/:vid/books/:bid', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.vid)
    if (virtualShelf) {
      const books = await virtualShelf.getBooks({ where: { id: req.params.bid } })
      res.status(200).json(books.shift())
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.post('/virtualShelfs/:vid/books', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.vid)
    if (virtualShelf) {
      const book = req.body
      book.virtualShelfId = virtualShelf.id
      console.warn(book)
      await Book.create(book)
      res.status(201).json({ message: 'created' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.put('/virtualShelfs/:vid/books/:bid', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.vid)
    if (virtualShelf) {
      const books = await virtualShelf.getBooks({ where: { id: req.params.bid } })
      const book = books.shift()
      if (book) {
        await book.update(req.body)
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.delete('/virtualShelfs/:vid/books/:bid', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.vid)
    if (virtualShelf) {
      const books = await virtualShelf.getBooks({ where: { id: req.params.bid } })
      const book = books.shift()
      if (book) {
        await book.destroy()
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error1' })
  }
})


app.post('/import', async (request, response, next) => {
  try {
    const registry = {};
    for (let v of request.body) {
      const virtualShelf = await VirtualShelf.create(v);
      for (let b of v.books) {
       
        const book= await Book.create(b);
     
       
        registry[b.key] = book;
        virtualShelf.addBook(book);
       
      }
      
      await virtualShelf.save();
    }
    response.sendStatus(204)
  } catch (error) {
    next(error);
  }
});


app.get('/export', async (request, response, next) => {
  try {
    const result = [];
    for (let v of await VirtualShelf.findAll()) {
      const virtualShelf = {
        descriere: v.descriere,
        dataCreare:v.dataCreare, 
        books: [],
      
      };
    
     
      for (let b of await v.getBooks()) {
        virtualShelf.books.push({
          key: b.id,
          titlu: b.titlu,
          genLiterar: b.genLiterar,
          url:b.url,
        });
      }
      result.push(virtualShelf);
    }
    if (result.length > 0) {
      response.json(result);
    } else {
      response.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
});

app.listen(8080)
