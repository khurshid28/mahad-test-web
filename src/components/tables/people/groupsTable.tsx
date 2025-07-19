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
import { Group } from "../../../pages/People/Groups";
import DropzoneComponent from "../../form/form-elements/DropZone";
import FileInputExample from "../../form/form-elements/FileInputExample";
import FileInput from "../../form/input/FileInput";
import { useFetchWithLoader } from "../../../hooks/useFetchWithLoader";
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


interface GroupItemProps {

  id: number;
  name: string;
  createdt: string;

}
export default function GroupsTable({ data ,refetch }: {
  data: GroupItemProps[],
  refetch :() =>  Promise<void>
}) {

  const [tableData, settableData] = useState(data);




  const { isOpen, openModal, closeModal } = useModal();
  let [name,setName] =useState("");
  let [id,setId] =useState<number | undefined>();
  let [file,setFile] =useState<File | undefined>();


  let editGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axiosClient.put(`/group/${id}`, { name });
      
     
      toast.success('Guruh muvaffaqiyatli yaratildi');
      await refetch();

    } catch (error) {
      console.error('Create Group error:', error);
      toast.error('Xatolik yuz berdi');

    }finally { 
      closeModal();
    }
  };
  let emptyGroup: Group = {
    name: "",
    image: "",
  };
  let [group, setGroup] = useState<Group>(emptyGroup);

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
  useEffect(() => {

    console.log("changed page ");
    settableData(data);
    setCurrentPage(1);

    return () => {
    }
  }, [data])
  const maxPage = Math.ceil(tableData.length / +optionValue);

  const startIndex = (currentPage - 1) * +optionValue;
  const endIndex = startIndex + +optionValue;
  let currentItems: GroupItemProps[] = tableData.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, maxPage));
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * +optionValue;
    const endIndex = startIndex + +optionValue;
    currentItems = tableData.slice(startIndex, endIndex);

  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [optionValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      setFile(file)
    }
  };



  let deleteGroup = async(id:number)=>{
   
    try {
      const res = await axiosClient.delete(`/group/${id}`);
      
      toast.success("Guruh muvaffaqiyatli o'chirildi");
      await refetch();

    } catch (error) {
      console.error('Delete Group error:', error);
      toast.error('Xatolik yuz berdi');

    }
  }
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="px-5 py-3  flex flex-row justify-between items-center border-b border-gray-100 dark:border-white/[0.05]">
          <div className="flex flex-row items-center gap-2 text-theme-sm font-medium text-gray-500 text-start  dark:text-gray-400">
            {/* <span>Show</span> */}

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
                Guruh
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
                    {/* <div className="w-10 h-10 overflow-hidden rounded-sm ">
                      <img
                        width={40}
                        height={40}
                        src={order.image}
                        alt={order.name}
                      />
                    </div> */}
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.name}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {Moment(Date.parse(`${order.createdt}`)).format("MMMM DD, yyyy")}
                </TableCell>

                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      "success"
                      // order.status === "Active"
                      //   ? "success"
                      //   : order.status === "Pending"
                      //     ? "warning"
                      //     : "error"
                    }
                  >
                    {/* {order.status} */}

                    {"Active"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex gap-2  flex-row items-center">
                  <Button
                    size="mini"
                    variant="outline"
                    className="text-xl fill-gray-500 dark:fill-gray-400"
                    onClick={() => {
                      setGroup({
                        name: order.name,
                        image: "",
                      });
                      setName(order.name);
                      setId(order.id);
                      openModal();
                    }}
                  >
                    <EditIcon></EditIcon>
                  </Button>

                  <Button
                    size="mini"
                    variant="outline"
                    onClick={()=> deleteGroup(order.id)}
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
              Gruruhni o'zgartirish
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update Group with full details.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) =>
                     setName(e.target.value)
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
              <Button size="sm" onClick={editGroup}>
                Saqlash
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
