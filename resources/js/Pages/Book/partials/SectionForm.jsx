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
import { toast } from "react-toastify";

export default function SectionForm({ section, selectedSection, mode }) {
    const user = usePage().props.auth.user;
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
    const [selectedParentSection, setSelectedParentSection] = useState(null);
    const [sections, setSections] = useState([]);

    const dropDownFields = ["parent_id"];
    const hiddenFields = ["book_id", "updated_by"];

    useEffect(() => {
        getSections();
    }, []);

    const getSections = async () => {
        const response = await axios.get(
            `/api/books/${section.book_id}/sections`
        );

        const flattenedList = response.data.sections.reduce((acc, section) => {
            acc = acc.concat(flattenObject(section));
            delete acc.all_descendants;
            return acc;
        }, []);

        // Set sections data from flattened list order by id
        setSections(
            flattenedList
                .filter((item) => item.id !== section.id)
                .sort((a, b) => a.id - b.id)
        );
    };

    function flattenObject(obj) {
        const result = [obj];
        const descendants = obj.all_descendants || [];

        for (const descendant of descendants) {
            result.push(...flattenObject(descendant));
        }
        return result;
    }

    const submit = async (e) => {
        e.preventDefault();

        if (mode === "create") {
            await axios.post(route("sections.store"), data);
        } else {
            await axios.put(route("sections.update", section.id), data);
        }

        get(route("books.edit", section.book_id));
    };

    const handleParentSelect = (item) => {
        console.log(item);
        if (!item?.parent_id) {
            setData("parent_id", null);
            setSelectedParentSection(item);
        }

        if (item.parent_id === section.id) {
            toast.error(`${item.title} is a child of ${section.title} section`);
            return;
        }

        setData("parent_id", item.id);
        setSelectedParentSection(item);
    };

    const createInputLabel = (str) => {
        str = str.charAt(0).toUpperCase() + str.slice(1);
        return str.replace("_", " ");
    };

    return (
        <section className="max-w-xl mx-auto mt-10 mb-10 space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Section Information
                </h2>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {Object.keys(data).map((key) => {
                    if (hiddenFields.includes(key)) return null;

                    if (dropDownFields.includes(key)) {
                        return sections && sections.length > 0 ? (
                            <div key={key}>
                                <InputLabel
                                    htmlFor={key}
                                    style={{ display: "block" }}
                                    value={createInputLabel(key)}
                                />
                                <Dropdown
                                    items={sections}
                                    id="id"
                                    title="Select Parent Section"
                                    label="title"
                                    item={selectedParentSection}
                                    onSelect={(item) =>
                                        handleParentSelect(item)
                                    }
                                />
                            </div>
                        ) : null;
                    }

                    return (
                        <div key={key}>
                            <InputLabel
                                htmlFor={key}
                                style={{ display: "block" }}
                                value={createInputLabel(key)}
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
