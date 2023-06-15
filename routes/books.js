const express = require('express')
const router = express.Router()
const Book = require('../models/book')//приєднуєм схему книг
const Author = require('../models/author')
const book = require('../models/book')

//всі роути книжок
router.get('/', async (req, res) => {
    let query = Book.find()
    if (req.query.title != null && req.query.title !== '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//нова книга
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

//створюєм роут книги
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        text: req.body.text
    })

    try {
        const newBook = await book.save()
        res.redirect(`books`)
    } catch {
        renderNewPage(res, book, true)
    }
})


const renderNewPage = async (res, book, hasError = false) => {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
                                .populate('author')
                                .exec()
        res.render('books/show', { book: book })
    } catch {
        res.redirect('/')
    } 
})

module.exports = router;