import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Moment from "moment";

import Badge from "../../ui/badge/Badge";
import Button from "../../ui/button/Button";
import {
  ArrowRightIcon,
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
import { Test } from "../../../pages/Test/Tests";
import DropzoneComponent from "../../form/form-elements/DropZone";
import FileInputExample from "../../form/form-elements/FileInputExample";
import FileInput from "../../form/input/FileInput";
import MultiSelect from "../../form/MultiSelect";

import bookImage from "../../../../public/images/product/book.png";
import {
  ParsedResult,
  parseQuestions,
  readDocx,
} from "../../../service/parse-docs.service";

interface TestProps {
  id: number;
  name: string;
  createdt: Date;

  section: any;
  section_id?: number;
  _count?: any;
}

export default function TestsTable({
  data,
  books,
  refetch,
}: {
  data: TestProps[];
  books: any[];
  refetch: () => Promise<void>;
}) {
  const [tableData, settableData] = useState(data);

  const { isOpen, openModal, closeModal } = useModal();
  const handleAdding = () => {
    // Handle save logic here

    console.log("handleAdding...");

    closeModal();
    setTest(emptyTest);
  };
  let emptyTest: Test = {};
  let [Test, setTest] = useState<Test>(emptyTest);

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
  let currentItems: TestProps[] = tableData.slice(startIndex, endIndex);

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

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = event.target.files?.[0];
  //     if (file) {
  //         console.log("Selected file:", file.name);
  //     }
  // };

  const Book_options = [
    { value: "Hamma kitoblar", label: "Hamma kitoblar" },
    ...books,
  ];

  // const all_Book_options = [
  //     { value: "Book 1", label: "Book 1" },
  //     { value: "Book 2", label: "Book 2" },
  //     { value: "Book 3", label: "Book 3" },
  // ];

  let [BookoptionValue, setBookoptionValue] = useState("Hamma kitoblar");

  const handleSelectBookChange = (value: string) => {
    setBookoptionValue(value);
  };

  useEffect(() => {
    setCurrentPage(1);

    if (BookoptionValue == "Hamma kitoblar") {
      settableData(data);
    } else {
      settableData(
        data.filter((item) => item.section.book_id === +BookoptionValue)
      );
    }
  }, [optionValue, BookoptionValue]);

  const all_sections_options = [
    { value: "Section 1", label: "Section 1" },
    { value: "Section 2", label: "Section 2" },
    { value: "Section 3", label: "Section 3" },
  ];

  const [quiz, setQuiz] = useState<ParsedResult | null>(null);

  
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="px-5 py-3  flex flex-row justify-between items-center border-b border-gray-100 dark:border-white/[0.05]">
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
              options={Book_options}
              onChange={handleSelectBookChange}
              className="dark:bg-dark-900"
            />
          </div>
        </div>
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Bo'lim
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Sana
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 text-center  font-medium text-gray-500 text-theme-xs dark:text-gray-400"
              >
                Savollar
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
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentItems.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex flex-row gap-2">
                  <div className="w-10 h-10 overflow-hidden rounded-sm ">
                    <img
                      width={40}
                      height={40}
                      src={
                        order.section &&
                        order.section.book &&
                        order.section.book.image
                          ? import.meta.env.VITE_STATIC_PATH +
                            order.section.book.image
                          : bookImage
                      }
                      alt={order.name}
                    />
                  </div>
                  <div>
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {order.section &&
                        order.section.book &&
                        order.section.book.name}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {order.section && order.section.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {Moment(order.createdt).format("MMMM DD, yyyy")}
                </TableCell>
                <div>
                  <span className="block text-center font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {order._count && order._count.test_items}
                  </span>
                </div>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      "success"
                      // order.status === "Active"
                      //     ? "success"
                      //     : order.status === "Pending"
                      //         ? "warning"
                      //         : "error"
                    }
                  >
                    {/* {order.status} */}
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex gap-2  flex-row items-center">
                  <Button
                    size="mini"
                    variant="outline"
                    className="text-xl fill-gray-500 dark:fill-gray-400"
                    onClick={() => {
                      setTest({
                        ...order,
                      });
                      openModal();
                    }}
                  >
                    <EditIcon></EditIcon>
                  </Button>

                  <Button
                    size="mini"
                    variant="outline"
                    onClick={async () => {}}
                  >
                    <DeleteIcon className="text-xl fill-gray-500 dark:fill-gray-400"></DeleteIcon>
                  </Button>

                  <Button
                    size="mini"
                    variant="outline"
                    onClick={async () => {}}
                  >
                    <DownloadIcon className="text-xl fill-gray-500 dark:fill-gray-400"></DownloadIcon>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="px-5 py-3 gap-3 flex flex-col md:flex-row justify-between md:items-center border-t border-gray-100 dark:border-white/[0.05] text-theme-sm font-medium text-gray-500  dark:text-gray-400">
        <div className="flex flex-row items-center gap-2  text-start  ">
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10"
            disabled={currentPage === 1}
            onClick={goToPreviousPage}
          >
            <ArrowRightIcon className="rotate-180 fill-gray-500  dark:fill-gray-400 scale-200" />
          </Button>

          {[...Array(maxPage)].map((_, i) => (
            <Button
              size="sm"
              variant={currentPage === i + 1 ? "primary" : "outline"}
              className="w-10 h-10"
              disabled={false}
              key={i}
              onClick={() => {
                currentPage !== i + 1 && setCurrentPage(i + 1);
              }}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10"
            disabled={currentPage === maxPage}
            onClick={goToNextPage}
          >
            <ArrowRightIcon className=" fill-gray-500  dark:fill-gray-400 scale-200" />
          </Button>
        </div>
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
              Edit Test
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update Test with full details.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Book</Label>
                  <Select
                    options={books}
                    className="dark:bg-dark-900"
                    defaultValue={`${Test.section}`}
                    onChange={(e) => {
                      setTest({
                        ...Test,
                        book_id: +e,
                      });
                    }}
                  />
                </div>

                <div>
                  <Label>Section</Label>
                  <Select
                    options={all_sections_options}
                    className="dark:bg-dark-900"
                    defaultValue={`${Test.section}`}
                    onChange={() => {}}
                  />
                </div>

                <div>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={Test.name}
                    onChange={(e) =>
                      setTest({
                        ...Test,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>File</Label>
                  <FileInput
                    // onChange={handleFileChange}
                    className="custom-class"
                  />
                </div>
              </div>
            </div>

          
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleAdding}>
                Saves
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
