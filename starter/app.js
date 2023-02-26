require(`dotenv`).config()
const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const path = require('path')
const customersRoute = require('./routes/customers')
const port = process.env.PORT || 8000
const {engine} = require('express-handlebars')
const cookieParser = require('cookie-parser')



app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'landingPage.html'))
}) 

app.use('/',customersRoute)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {console.log(`Listening on port ${port}`)
        })
    } catch (err) {
        console.log(err)
    }
}

start()