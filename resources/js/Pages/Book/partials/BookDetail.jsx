import NavLink from "@/Components/NavLink";
import { useEffect } from "react";

export default function BookDetail({ book, deleteBook, ...props }) {
    useEffect(() => {
        console.log("==========================", book);
    }, [book]);

    return (
        <div className="max-w-sm mx-auto mt-10">
            <div className="bg-white p-1 rounded-lg shadow-lg">
                <img style={{ width: '320px', height: '320px' }} className="object-cover" src={book.image} alt={book.title} />
                <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
                <p className="text-gray-700 mb-4">{book.description}</p>
                <div className="flex items-center p-2">
                    <div className="text-sm">
                        <p className="text-gray-900 leading-none">
                            {book.author.name}
                        </p>
                    </div>
                    <div className="text-sm ml-auto">
                        <NavLink href={route("books.edit", book.id)}>
                            Edit
                        </NavLink>
                    </div>
                    <div className="text-sm ml-1">
                        <NavLink onClick={(e) => deleteBook(book.id)} href="#">
                            Delete
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}
