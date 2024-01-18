process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

let b1;

beforeEach(async function() {
    await db.query("DELETE FROM books;")

    let result = await Book.create({
        "isbn": "069116151899",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2017
    });
    b1 = result
});

describe("Route Tests", function() {
   

    /** GET / => book */
    describe("GET /books/", function() {
        test("get all books", async function() {
            let response = await request(app)
            .get("/books")

            expect(response.body.books[0]).toEqual({
                "isbn": "069116151899",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            });
        });
    });

    /** GET /[id]  => {book: book} */
    describe("GET /books/:isbn", function() {
        test("get book by isbn", async function() {
            let response = await request(app)
            .get(`/books/${b1["isbn"]}`)

            expect(response.body.book).toEqual(b1)
        });
    });

    /** POST /   bookData => {book: newBook}  */
    describe("POST /books", function() {
        test("post book successfully", async function(){
            let b2 = {
                "isbn": "0691161518500",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Alex Taylor",
                "language": "english",
                "pages": 200,
                "publisher": "Springboard University Press",
                "title": "How to thoroughly test express applications",
                "year": 2024
            }
            let response = await request(app)
            .post("/books")
            .send(b2)
            expect(response.statusCode).toEqual(201)
            expect(response.body.book).toEqual(b2)
        })
        test("post book failure", async function(){
            let b2 = {
                "isbn": 1456,
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Alex Taylor",
                "language": "english",
                "pages": 200,
                "publisher": 1356,
                "title": "How to thoroughly test express applications",
                "year": 2024
            }
            let error = {"error":{"message":["instance.isbn is not of a type(s) string","instance.publisher is not of a type(s) string"],"status":400},"message":["instance.isbn is not of a type(s) string","instance.publisher is not of a type(s) string"]}
            let response = await request(app)
            .post("/books")
            .send(b2)
            expect(response.statusCode).toEqual(400)
            expect(response.error.text).toEqual(JSON.stringify(error))
            
        })
    })

    /** PUT /[isbn]   bookData => {book: updatedBook}  */
    describe("PUT /books/:isbn", function() {
        test("update book successfully", async function(){
            let b1Update = {
                "isbn": "069116151899",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Alex Taylor",
                "language": "english",
                "pages": 264,
                "publisher": "Springboard University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            }
            let response = await request(app)
            .put(`/books/${b1["isbn"]}`)
            .send(b1Update)
            expect(response.statusCode).toEqual(200)
            expect(response.body.book).toEqual(b1Update)
        })
        test("put book failure", async function(){
            let b1Update = {
                "isbn": 1456,
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Alex Taylor",
                "language": "english",
                "pages": 264,
                "publisher": 1356,
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            }
            let error = {"error":{"message":["instance.isbn is not of a type(s) string","instance.publisher is not of a type(s) string"],"status":400},"message":["instance.isbn is not of a type(s) string","instance.publisher is not of a type(s) string"]}
            let response = await request(app)
            .put(`/books/${b1["isbn"]}`)
            .send(b1Update)
            expect(response.statusCode).toEqual(400)
            expect(response.error.text).toEqual(JSON.stringify(error))
            
        })
    })
    /** DELETE /[isbn]   => {message: "Book deleted"} */
    describe("DELETE /books/:isbn", function() {
        test("Delete a book", async function() {
            let response = await request(app)
            .delete(`/books/${b1["isbn"]}`)
            expect(response.body).toEqual({ message: "Book deleted" })
        })
    })



})

afterAll(async function () {
    await db.end();
  });