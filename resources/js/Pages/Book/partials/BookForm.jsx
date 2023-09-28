import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import BookSection from "./BookSection";
import SectionForm from "./SectionForm";

export default function BookForm({ book, mode, className }) {
    const user = usePage().props.auth.user;
    const [isModalOpen, setModalOpen] = useState(false);
    const [sectionMode, setSectionMode] = useState("create");

    const [section, setSection] = useState({
        book_id: 0,
        parent_id: 0,
        title: "",
        content: "",
        nesting_level: 0,
        order: 0,
        updated_by: 0,
    });

    const { data, setData, get, errors, processing, recentlySuccessful } =
        useForm({
            title: book.title,
            author: book.author.id,
            publisher: book.publisher,
            isbn: book.isbn,
            image: book.image,
            description: book.description,
            updated_by: user.id,
        });

    const objects = ["author"];
    const hidden = ["updated_by"];

    const editSection = (section) => {
        setSection(section);
        setSectionMode("update");
        setModalOpen(true);
    };

    const submit = async (e) => {
        e.preventDefault();

        if (mode === "create") {
            await axios.post(route("books.store"), data);
        } else {
            await axios.put(route("books.update", book.id), data);
        }

        get(route("books.index"));
    };

    const handleUploadFile = async (file) => {
        const isAuthenticated = await checkGoogleDriveAuthStatus();

        if (!isAuthenticated) {
            // Initiate Google OAuth process, and upon return, then post the file.
            window.location.href = "/google-drive";
            return;
        }

        // Create a FormData object
        let formData = new FormData();

        // Append the file to the form data under the key 'file'
        formData.append("file", file);

        // Now, use Axios to send the FormData
        try {
            const response = await axios.post(
                route("google-drive.upload"),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // Handle the response, if needed
            console.log(response.data);
            setData({ ...data, image: response.data.url });
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const checkGoogleDriveAuthStatus = async () => {
        const response = await axios.get("/google-drive/auth-status");
        const data = response.data;
        return data.authenticated;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <section className={className}>
                <header>
                    <h2 className="text-lg font-medium text-gray-900">
                        Book Information
                    </h2>
                </header>

                <form
                    onSubmit={submit}
                    encType="multipart/form-data"
                    className="mt-6 space-y-6"
                >
                    <div key="file">
                        <InputLabel
                            htmlFor="file"
                            style={{ display: "block" }}
                            value="Image"
                        />

                        <input
                            type="file"
                            onChange={(e) => {
                                handleUploadFile(e.target.files[0]);
                            }}
                            name="file"
                        />

                        <InputError className="mt-2" message={errors.file} />
                    </div>

                    {Object.keys(data).map((key) => {
                        if (hidden.includes(key)) return;

                        if (objects.includes(key) && data[key]) {
                            return (
                                <div key={key}>
                                    <InputLabel
                                        htmlFor={key}
                                        style={{ display: "block" }}
                                        value={
                                            key.charAt(0).toUpperCase() +
                                            key.slice(1)
                                        }
                                    />

                                    <label>{book[key].name}</label>
                                </div>
                            );
                        }

                        return (
                            <div key={key}>
                                <InputLabel
                                    htmlFor={key}
                                    style={{ display: "block" }}
                                    value={
                                        key.charAt(0).toUpperCase() +
                                        key.slice(1)
                                    }
                                />

                                <TextInput
                                    id={key}
                                    className="mt-1 block w-full"
                                    value={data[key]}
                                    onChange={(e) =>
                                        setData(key, e.target.value)
                                    }
                                    required
                                    isFocused
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors[key]}
                                />
                            </div>
                        );
                    })}

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>
                            Save
                        </PrimaryButton>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-gray-600">Saved.</p>
                        </Transition>
                    </div>
                </form>
            </section>
            <section className="max-w-sm mx-auto">
                <header>
                    <h2 className="text-lg font-medium text-gray-900">
                        Sections
                    </h2>

                    <button
                        onClick={() => {
                            setSection({
                                book_id: 0,
                                parent_id: 0,
                                title: "",
                                content: "",
                                nesting_level: 0,
                                order: 0,
                                updated_by: 0,
                            });
                            setSectionMode("create");

                            setModalOpen(true);
                        }}
                        className="ml-30"
                    >
                        Add Section
                    </button>
                </header>
                <BookSection
                    bookId={book.id}
                    editSection={editSection}
                ></BookSection>
            </section>

            {isModalOpen && (
                <Modal
                    title="My Modal"
                    show={isModalOpen}
                    onClose={() => setModalOpen(false)}
                >
                    <SectionForm section={section} mode={sectionMode} />
                </Modal>
            )}
        </div>
    );
}
