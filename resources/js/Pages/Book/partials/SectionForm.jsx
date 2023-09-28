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
import Dropdown from "./Dropdown";

export default function SectionForm({ section, mode }) {
    const user = usePage().props.auth.user;
    const [selectedItem, setSelectedItem] = useState(null);
    const { data, setData, get, errors, processing, recentlySuccessful } =
        useForm({
            book_id: section.book_id,
            parent_id: section.parent_id,
            title: section.title,
            content: section.content,
            nesting_level: section.nesting_level,
            order: section.order,
            updated_by: user.id,
        });
    const [sections, setSections] = useState([]);

    useEffect(() => {
        getSections();
    }, []);

    const getSections = async () => {
        const response = await axios.get(`/api/books/${section.book_id}/sections`);
        setSections(response.data.sections);
    };

    const submit = async (e) => {
        e.preventDefault();

        if (mode === "create") {
            await axios.post(route("sections.store"), data);
        } else {
            await axios.put(route("sections.update", section.id), data);
        }

        get(route("books.edit", section.book_id));
    };

    return (
        <section className="max-w-xl mx-auto mt-10 mb-10 space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Section Information
                </h2>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <Dropdown
                    items={sections}
                    onSelect={(item) => setSelectedItem(item)}
                />

                {Object.keys(data).map((key) => {
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
