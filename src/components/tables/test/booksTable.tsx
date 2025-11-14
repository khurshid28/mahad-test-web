import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import bookImage from "../../../../public/images/product/book.png";
import Moment from "moment";

import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CloseCircleIcon,
  CloseIcon,
  CloseLineIcon,
  CopyIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  EyeCloseIcon,
  EyeIcon,
  PlusIcon,
} from "../../../icons";
import { useEffect, useState } from "react";
import { useModal } from "../../../hooks/useModal";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { Modal } from "../../ui/modal";
import Select from "../../form/Select";
import Switch from "../../form/switch/Switch";
import { Book } from "../../../pages/Test/Books";
import DropzoneComponent from "../../form/form-elements/DropZone";
import FileInputExample from "../../form/form-elements/FileInputExample";
import FileInput from "../../form/input/FileInput";
import MultiSelect from "../../form/MultiSelect";
import axiosClient from "../../../service/axios.service";
import Pagination from "../../ui/pagination/Pagination";
import { toast } from "react-toastify";

// interface Order {
//   id: number;
//   name: string;
//   image: string;
//   createdAt: Date;
//   status: string;
//   subject_id? : string;
// }

interface BookItemProps {
  id?: number;
  name?: string;
  image?: string;
  imagFile?: string;
  createdt: string;
  subject?: any;
  subject_id?: number;
  fullBlock?: boolean;
  stepBlock?: boolean;
}
// Define the table data using the interface
// const statictableData: Order[] = [
//   {
//     id: 1,

//     name: "Book 1",
//     image: "/images/product/product-01.jpg",
//     createdAt: new Date("2025-03-02"),

//     status: "Active",
//     subject_id : "Subject 1"
//   },
//   {
//     id: 2,

//     name: "Book 2",
//     image: "/images/product/product-02.jpg",
//     createdAt: new Date("2025-03-02"),

//     status: "Active",
//      subject_id : "Subject 2"
//   },
//   {
//     id: 3,

//     name: "Book 3",
//     image: "/images/product/product-03.jpg",
//     createdAt: new Date("2025-04-10"),

//     status: "Active",
//      subject_id : "Subject 1"
//   },
//   {
//     id: 1,

//     name: "Book 1",
//     image: "/images/product/product-01.jpg",
//     createdAt: new Date("2025-03-02"),

//     status: "Cancel",
//      subject_id : "Subject 3"
//   },
//   {
//     id: 2,

//     name: "Book 2",
//     image: "/images/product/product-02.jpg",
//     createdAt: new Date("2025-03-02"),

//     status: "Active",
//      subject_id : "Subject 1"
//   },
//   {
//     id: 3,

//     name: "Book 3",
//     image: "/images/product/product-03.jpg",
//     createdAt: new Date("2025-04-10"),

//     status: "Active",
//      subject_id : "Subject 1"
//   },
//   {
//     id: 1,

//     name: "Book 1",
//     image: "/images/product/product-01.jpg",
//     createdAt: new Date("2025-03-02"),

//     status: "Active",
//      subject_id : "Subject 2"
//   },
//   {
//     id: 2,

//     name: "Book 2",
//     image: "/images/product/product-02.jpg",
//     createdAt: new Date("2025-03-02"),

//     status: "Active",
//      subject_id : "Subject 2"
//   },
//   {
//     id: 3,

//     name: "Book 3",
//     image: "/images/product/product-03.jpg",
//     createdAt: new Date("2025-04-10"),

//     status: "Active",
//     subject_id : "Subject 2"    },
//   {
//     id: 1,

//     name: "Book 1",
//     image: "/images/product/product-01.jpg",
//     createdAt: new Date("2025-03-02"),

//     status: "Active",
//      subject_id : "Subject 2"
//   },
//   {
//     id: 2,

//     name: "Book 2",
//     image: "/images/product/product-02.jpg",
//     createdAt: new Date("2025-03-02"),

//     status: "Active",
//      subject_id : "Subject 1"
//   },
//   {
//     id: 3,

//     name: "Book 3",
//     image: "/images/product/product-03.jpg",
//     createdAt: new Date("2025-04-10"),

//     status: "Active",
//      subject_id : "Subject 2"
//   },
//   {
//     id: 1,

//     name: "Book 1",
//     image: "/images/product/product-01.jpg",
//     createdAt: new Date("2025-03-02"),

//     status: "Active",
//      subject_id : "Subject 2"
//   },
//   {
//     id: 2,

//     name: "Book 2",
//     image: "/images/product/product-02.jpg",
//     createdAt: new Date("2025-03-02"),

//     status: "Active",
//      subject_id : "Subject 2"
//   },
//   {
//     id: 3,

//     name: "Book 3",
//     image: "/images/product/product-03.jpg",
//     createdAt: new Date("2025-04-10"),

//     status: "Active",
//      subject_id : "Subject 1"
//   },
//   {
//     id: 1,

//     name: "Book 1",
//     image: "/images/product/product-01.jpg",
//     createdAt: new Date("2025-03-02"),

//     status: "Active",
//      subject_id : "Subject 2"
//   },
//   {
//     id: 2,

//     name: "Book 2",
//     image: "/images/product/product-02.jpg",
//     createdAt: new Date("2025-03-02"),

//     status: "Active",
//      subject_id : "Subject 2"
//   },
//   {
//     id: 3,

//     name: "Book 3",
//     image: "/images/product/product-03.jpg",
//     createdAt: new Date("2025-04-10"),

//     status: "Cancel",
//      subject_id : "Subject 1"
//   },
// ];

export default function BooksTable({
  data,
  subjects,
  refetch,
}: {
  data: BookItemProps[];
  subjects: any[];
  refetch: () => Promise<void>;
}) {
  const [tableData, settableData] = useState(data);

  const { isOpen, openModal, closeModal } = useModal();
  const handleAdding = () => {
    // Handle save logic here

    console.log("handleAdding...");

    closeModal();
    setBook(emptyBook);
  };
  let emptyBook: Book = {
    name: "",
    image: "",
  };
  let [Book, setBook] = useState<Book>(emptyBook);

  const options = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
  ];
  let [optionValue, setoptionValue] = useState("5");

  const handleSelectChange = (value: string) => {
    setoptionValue(value);
  };

  // Pationation

  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(tableData.length / +optionValue);

  const startIndex = (currentPage - 1) * +optionValue;
  const endIndex = startIndex + +optionValue;
  let currentItems: BookItemProps[] = tableData.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, maxPage));
  };
  console.log(">> currentItems length :", currentItems.length);

  useEffect(() => {
    const startIndex = (currentPage - 1) * +optionValue;
    const endIndex = startIndex + +optionValue;
    currentItems = tableData.slice(startIndex, endIndex);
  }, [currentPage, tableData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      setBook({
        ...Book,
        imageFile: file,
      });
    }
  };
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const multiOptions = [
    { value: "Group 1", text: "Group 1", selected: false },
    { value: "Group 2", text: "Group 2", selected: false },
    { value: "Group 3", text: "Group 3", selected: false },
  ];

  const Subject_options = [
    new Option("Hamma Fanlar", "Hamma Fanlar"),
    ...subjects,
  ];

  // const all_Subject_options = [
  //   { value: "Subject 1", label: "Subject 1" },
  //   { value: "Subject 2", label: "Subject 2"},
  //   { value: "Subject 3", label: "Subject 3"},
  // ];

  let [subjectoptionValue, setSubjectoptionValue] = useState("Hamma Fanlar");

  const handleSelectSubjectChange = (value: string) => {
    setSubjectoptionValue(value);
  };
  const handleSelectAllSubjectChange = (value: string) => {};

  useEffect(() => {
    setCurrentPage(1);

    if (subjectoptionValue == "Hamma Fanlar") {
      settableData(data);
    } else {
      settableData(
        data.filter((item) => item.subject_id == +subjectoptionValue)
      );
    }
  }, [optionValue, subjectoptionValue]);

  useEffect(() => {
    settableData(data);
    setCurrentPage(1);
  }, [data]);

  let editBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", Book.name ?? "");
      formData.append("subject_id", `${Book.subject_id}`);
      if (Book.imageFile) formData.append("image", Book.imageFile);
        // append flags
        formData.append("fullBlock", Book.fullBlock ? "1" : "0");
        formData.append("stepBlock", Book.stepBlock ? "1" : "0");
      
      const res = await axiosClient.put(`/book/${Book.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Book muvaffaqiyatli yaratildi");
      await refetch();
    } catch (error) {
      console.error("Create Book error:", error);
      toast.error("Xatolik yuz berdi");
    } finally {
      closeModal();
    }
  };

  let deleteBook = async (id: number | undefined) => {
    try {
      const res = await axiosClient.delete(`/book/${id}`);

      toast.success("Book muvaffaqiyatli o'chirildi");
      await refetch();
    } catch (error) {
      console.error("Delete Book error:", error);
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
      <div className="max-w-full overflow-x-auto">
        <div className="px-5 py-3  flex flex-row justify-between items-center border-b border-gray-100 dark:border-white/5">
          <div className="flex flex-row items-center gap-2 text-theme-sm font-medium text-gray-500 text-start  dark:text-gray-400">
            <Select
              options={options}
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
              defaultValue="5"
            />
            <span>Ko'rsatish</span>
          </div>
          <div className="flex flex-row items-center gap-2 text-theme-sm font-medium text-gray-500 text-start  dark:text-gray-400">
            <Select
              options={Subject_options}
              onChange={handleSelectSubjectChange}
              className="dark:bg-dark-900"
            />
          </div>
        </div>
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/5">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Kitoblar
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Sana
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Fan
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Ruhsatlar
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
            {currentItems.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-sm ">
                      <img
                        width={40}
                        height={40}
                        src={
                          order.image
                            ? import.meta.env.VITE_STATIC_PATH + order.image
                            : bookImage
                        }
                        alt={order.name}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {Moment(order.createdt).format("MMMM DD, yyyy")}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.subject && order.subject.name}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      "success"
                      // order.status === "Active"
                      //   ? "success"
                      //   : order.status === "Pending"
                      //   ? "warning"
                      //   : "error"
                    }
                  >
                    Active
                    {/* {order.status} */}
                  </Badge>
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                 

                  {
                    order.fullBlock ?  <CheckCircleIcon className="inline-block w-5 h-5 mr-1 text-green-500 dark:text-green-400" /> : <CloseCircleIcon className="inline-block w-5 h-5 ml-1  text-red-500 dark:text-red-400" />
                  }

                  {
                    order.stepBlock ?  <CheckCircleIcon className="inline-block w-5 h-5 mr-1 text-green-500 dark:text-green-400" /> : <CloseCircleIcon className="inline-block w-5 h-5 ml-1  text-red-500 dark:text-red-400" />
                  }
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex gap-2  flex-row items-center">
                  <Button
                    size="mini"
                    variant="outline"
                    className="text-xl fill-gray-500 dark:fill-gray-400"
                    onClick={() => {
                      setBook({
                        id: order.id,
                        name: order.name,
                        image: order.image,
                        subject_id: order.subject_id,
                        fullBlock: order.fullBlock ?? false,
                        stepBlock: order.stepBlock ?? false,
                      });
                      // alert(order.subject_id,)

                      openModal();
                    }}
                  >
                    <EditIcon></EditIcon>
                  </Button>

                  <Button
                    size="mini"
                    variant="outline"
                    onClick={async () => {
                      deleteBook(order.id);
                    }}
                  >
                    <DeleteIcon className="text-xl fill-gray-500 dark:fill-gray-400"></DeleteIcon>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="px-5 py-3 gap-3 flex flex-col md:flex-row justify-between md:items-center border-t border-gray-100 dark:border-white/5 text-theme-sm font-medium text-gray-500  dark:text-gray-400">
        <Pagination
          currentPage={currentPage}
          totalPages={maxPage}
          onPageChange={setCurrentPage}
        />
        <div>
          {(currentPage - 1) * +optionValue + 1} dan{" "}
          {Math.min(tableData.length, currentPage * +optionValue)} gacha,{" "}
          {tableData.length}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
  <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Kitobni o'zgartirish
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update Book with full details.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* <div>
                  <MultiSelect
                    label="Groups"
                    options={multiOptions}
                    onChange={(values) => setSelectedValues(values)}
                  />
                  <p className="sr-only">
                    Selected Values: {selectedValues.join(", ")}
                  </p>
                </div> */}

                <div>
                  <Label>Subject </Label>
                  <Select
                    options={subjects}
                    className="dark:bg-dark-900"
                    defaultValue={
                      Book.subject_id ? `${Book.subject_id ?? ""}` : undefined
                    }
                    onChange={(e) => {
                      setBook({
                        ...Book,
                        subject_id: +e,
                      });
                    }}
                  />
                </div>

                <div>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={Book.name}
                    onChange={(e) =>
                      setBook({
                        ...Book,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Image</Label>
                  <FileInput
                    onChange={handleFileChange}
                    className="custom-class"
                  />
                </div>
                  
                </div>
            </div>

            {/* Ruhsatlar - placed separately from other properties */}
            <div className="px-2 mt-4">
              <Label>Ruhsatlar</Label>
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center">
                  <Switch
                    label="Testni ishlashga ruhsat berish"
                    checked={Book.fullBlock ?? false}
                    onChange={(v) =>
                      setBook({
                        ...Book,
                        fullBlock: v,
                      })
                    }
                  />
                </div>
                <div className="flex items-center">
                  <Switch
                    label="Ketma-ket ishlash"
                    checked={Book.stepBlock ?? false}
                    onChange={(v) =>
                      setBook({
                        ...Book,
                        stepBlock: v,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Yopish
              </Button>
              <Button size="sm" onClick={editBook}>
                Saqlash
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
