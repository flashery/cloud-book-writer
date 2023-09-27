import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import axios from "axios";

export default function UpdateBookForm({ book, mode, className }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, put, errors, processing, recentlySuccessful } =
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

    const submit = (e) => {
        e.preventDefault();
        console.log("=================", book);
        if (mode === "create") {
            post(route("books.store"));
        } else {
            put(route("books.update", book.id));
        }
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
                                    key.charAt(0).toUpperCase() + key.slice(1)
                                }
                            />

                            <TextInput
                                id={key}
                                className="mt-1 block w-full"
                                value={data[key]}
                                onChange={(e) => setData(key, e.target.value)}
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
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

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
    );
}
