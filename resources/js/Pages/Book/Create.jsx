import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BookForm from './partials/BookForm';
import { Head } from '@inertiajs/react';

export default function Create({ auth, book }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Book</h2>}
        >
            <Head title="Create Book" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <BookForm
                            book={book}
                            mode={'create'}
                            className="max-w-xl"
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
