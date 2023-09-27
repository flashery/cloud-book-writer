import { useEffect, useState } from "react";
import BookDetail from "./partials/BookDetail";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import NavLink from "@/Components/NavLink";

export default function List({ auth }) {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        getBooks();
    }, []);

    const getBooks = async () => {
        const res = await axios.get("/api/books");
        setBooks(res.data);
    };

    const deleteBook = async (id) => {
        await axios.delete("/api/books/" + id);
        getBooks();
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    List of Books
                </h2>
            }
        >
            <Head title="List Of Books" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-10">
                        <h1 className="text-3xl font-bold mb-10 text-center">
                            List of Books
                        </h1>
                        <div className="text-sm ml-1 flex justify-end p-4">
                            <NavLink className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded" href={route("books.create")}>
                                Add Book
                            </NavLink>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {books.map((book) => (
                                <BookDetail
                                    book={book}
                                    deleteBook={deleteBook}
                                    key={book.id}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
