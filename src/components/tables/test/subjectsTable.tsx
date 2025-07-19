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
  import bookImage from "../../../../public/images/product/book.png"
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
  import { Subject } from "../../../pages/Test/Subjects";
  import DropzoneComponent from "../../form/form-elements/DropZone";
  import FileInputExample from "../../form/form-elements/FileInputExample";
  import FileInput from "../../form/input/FileInput";
import axiosClient from "../../../service/axios.service";
import { toast } from "react-toastify";
  
  // interface Order {
  //   id: number;
  //   name: string;
  //   image: string;
  //   createdAt: Date;
  //   status: string;
  // }
  
  // Define the table data using the interface
  // const statictableData: Order[] = [
  //   {
  //     id: 1,
  
  //     name: "Subject 1",
  //     image: "/images/product/product-01.jpg",
  //     createdAt: new Date("2025-03-02"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  
  //     name: "Subject 2",
  //     image: "/images/product/product-02.jpg",
  //     createdAt: new Date("2025-03-02"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 3,
  
  //     name: "Subject 3",
  //     image: "/images/product/product-03.jpg",
  //     createdAt: new Date("2025-04-10"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 1,
  
  //     name: "Subject 1",
  //     image: "/images/product/product-01.jpg",
  //     createdAt: new Date("2025-03-02"),
  
  //     status: "Cancel",
  //   },
  //   {
  //     id: 2,
  
  //     name: "Subject 2",
  //     image: "/images/product/product-02.jpg",
  //     createdAt: new Date("2025-03-02"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 3,
  
  //     name: "Subject 3",
  //     image: "/images/product/product-03.jpg",
  //     createdAt: new Date("2025-04-10"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 1,
  
  //     name: "Subject 1",
  //     image: "/images/product/product-01.jpg",
  //     createdAt: new Date("2025-03-02"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  
  //     name: "Subject 2",
  //     image: "/images/product/product-02.jpg",
  //     createdAt: new Date("2025-03-02"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 3,
  
  //     name: "Subject 3",
  //     image: "/images/product/product-03.jpg",
  //     createdAt: new Date("2025-04-10"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 1,
  
  //     name: "Subject 1",
  //     image: "/images/product/product-01.jpg",
  //     createdAt: new Date("2025-03-02"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  
  //     name: "Subject 2",
  //     image: "/images/product/product-02.jpg",
  //     createdAt: new Date("2025-03-02"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 3,
  
  //     name: "Subject 3",
  //     image: "/images/product/product-03.jpg",
  //     createdAt: new Date("2025-04-10"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 1,
  
  //     name: "Subject 1",
  //     image: "/images/product/product-01.jpg",
  //     createdAt: new Date("2025-03-02"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  
  //     name: "Subject 2",
  //     image: "/images/product/product-02.jpg",
  //     createdAt: new Date("2025-03-02"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 3,
  
  //     name: "Subject 3",
  //     image: "/images/product/product-03.jpg",
  //     createdAt: new Date("2025-04-10"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 1,
  
  //     name: "Subject 1",
  //     image: "/images/product/product-01.jpg",
  //     createdAt: new Date("2025-03-02"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  
  //     name: "Subject 2",
  //     image: "/images/product/product-02.jpg",
  //     createdAt: new Date("2025-03-02"),
  
  //     status: "Active",
  //   },
  //   {
  //     id: 3,
  
  //     name: "Subject 3",
  //     image: "/images/product/product-03.jpg",
  //     createdAt: new Date("2025-04-10"),
  
  //     status: "Cancel",
  //   },
  // ];


  interface SubjectItemProps {
    id: number;
    name: string;
    image :string;
    createdt :string;
  
  }
  
  export default function SubjectsTable({ data, refetch }: {
    data: SubjectItemProps[],
    refetch: () => Promise<void>
  }) {
    const [tableData, settableData] = useState(data);
  
    const { isOpen, openModal, closeModal } = useModal();
    const handleAdding = () => {
      // Handle save logic here
  
      console.log("handleAdding...");
  
      closeModal();
      setSubject(emptySubject);
    };
    let emptySubject: Subject = {
      name: "",
      image: "",
    };
    let [Subject, setSubject] = useState<Subject>(emptySubject);
  
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
    let currentItems: SubjectItemProps[] = data.slice(startIndex, endIndex);
  
    const goToPreviousPage = () => {
      setCurrentPage((page) => Math.max(page - 1, 1));
    };
  
    const goToNextPage = () => {
      setCurrentPage((page) => Math.min(page + 1, maxPage));
    };
    console.log(">> data length :", data.length);
  
    useEffect(() => {
      const startIndex = (currentPage - 1) * +optionValue;
      const endIndex = startIndex + +optionValue;
      currentItems = data.slice(startIndex, endIndex);
    }, [currentPage,]);
  
    useEffect(() => {
      setCurrentPage(1);
    }, [optionValue,data]);
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSubject({
          ...Subject,
          imageFile: file
        })
        
      }
    };


    let editSubject = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      try {
        const formData = new FormData();
        formData.append('name', Subject.name ?? "");
        if (Subject.imageFile) formData.append('image', Subject.imageFile); 
  
        const res = await axiosClient.put(`/subject/${Subject.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
  
        toast.success('Subject muvaffaqiyatli saqlandi');
        await refetch();
  
      } catch (error) {
        console.error('Edit Subject error:', error);
        toast.error('Xatolik yuz berdi');
  
      } finally {
        closeModal();
      }
    };

    let deleteSubject = async(id:number)=>{
   
      try {
        const res = await axiosClient.delete(`/subject/${id}`);
        
        toast.success("Subject muvaffaqiyatli o'chirildi");
        await refetch();
  
      } catch (error) {
        console.error('Delete Subject error:', error);
        toast.error('Xatolik yuz berdi');
  
      }
    }
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
            <div>
              {" "}
              <Button
                size="sm"
                variant="outline"
                endIcon={<DownloadIcon className="size-5 fill-white" />}
              >
                Yuklab olish
              </Button>
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
                  Fanlar
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
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-sm ">
                        <img
                          width={40}
                          height={40}
                          src={  order.image ? import.meta.env.VITE_STATIC_PATH +  order.image : bookImage}
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
                        setSubject({
                          id : order.id,
                          name: order.name,
                          image: order.image,
                          imageFile : undefined
                        });
                        openModal();
                      }}
                    >
                      <EditIcon></EditIcon>
                    </Button>
  
                    <Button
                      size="mini"
                      variant="outline"
                      onClick={async () => {
                        deleteSubject(order.id);
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
          {(currentPage - 1) * +optionValue + 1} dan  {" "}
          {Math.min(tableData.length, currentPage * +optionValue)}  gacha, {" "}
          {tableData.length}  
          </div>
        </div>
  
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
          <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Fanni o'zgartisih
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                Update Subject with full details.
              </p>
            </div>
            <form className="flex flex-col">
              <div className="px-2 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      value={Subject.name}
                      onChange={(e) =>
                        setSubject({
                          ...Subject,
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
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Yopish
                </Button>
                <Button size="sm" onClick={editSubject}>
                  Saqlash
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
  