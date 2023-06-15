const express = require('express')
const router = express.Router()
const Author = require('../models/author')//приєднуєм схему авторів
const Book = require('../models/book')
//const author = require('../models/author')


//всі роути авторів
router.get('/', async (req, res) => {
    let searchOptions = {}//за допомогою цієї функції шукаєм в полі search імена авторів
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')//'i' регулярка якщо імя поч. з вел. букви а ми вводим мааленьку всерівно покаже
    }
    try {
        const authors = await Author.find(searchOptions)//находим список наших авторів в бд searchOptions вставляєм для пошукуавтора в рядку сірч
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//новий автор
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })//шлях виглядає http://localhost:4000/authors/new якщо без /new то сторінка з усіма авторами
    //{ author: new Author() } приєднуєм схему авторів
})

//створюєм автор роут
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch {
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author
    try {
        const response = await Author.deleteOne({ _id: req.params.id });
        await author.remove()
        res.redirect('/authors')
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router;

