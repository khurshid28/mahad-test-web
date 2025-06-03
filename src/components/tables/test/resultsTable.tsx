import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../ui/table";
  
  import Badge from "../../ui/badge/Badge";
  
import Moment from "moment";
  import { useEffect, useState } from "react";
  import Button from "../../ui/button/Button";
  import { ArrowRightIcon, DownloadIcon } from "../../../icons";
  import Select from "../../form/Select";
  

  import bookImage from "../../../../public/images/product/book.png"
  interface ResultProps {
    id?: number;
    student?: {
      id?: number; 
      image?: string;
      name?: string;
      phone?: string;
      group?: {
        id?: number; 
        name?: string;
      };
    };
   
    test?: {
      id? : number;
      _count?: {
        test_items?: number,
        results? : number,
      },
      section_id ? : number;
      section?: {
        id?: number; 
        name?: string;
        book_id? : number;
        book? : {
          id?: number; 
          name?: string;
          image?: string;
          
        }
      };
    };
   
    // test_count : number,
    // result_count :number;
    // Result: number;
    createdt :Date;
  }
  
  // Define the table data using the interface
  // const statictableData: Order[] = [
  //   {
  //     id: 1,
  //     user: {
  //       image: "/images/user/user-17.jpg",
  //       name: "Xurshid Ismoilov",
  //       phone: "+998(95)064-28-27",
  //     },
  //     group: "Group 1",
  //     result_count: 38,
  //     Result: 93.2,
  //     book :"Book 1",
  //     section :"Section 1",
  //     test_count : 40,
  //     createdAt : new Date("2025-04-10"),
     
      
  //   },
  //   {
  //     id: 2,
  //     user: {
  //       image: "/images/user/user-18.jpg",
  //       name: "Kaiya George",
  //       phone: "+998(95)064-28-27",
  //     },
  //     group: "Group 2",
  //     result_count: 28,
  //     Result: 84.7,
  //     book :"Book 2",
  //     section :"Section 3",
  //     test_count : 30,
  //     createdAt : new Date("2025-04-09"),
  //   },
  //   {
  //     id: 3,
  //     user: {
  //       image: "/images/user/user-17.jpg",
  //       name: "Zain Geidt",
  //       phone: "+998(95)064-28-27",
  //     },
  //     group: "Group 2",
  //     result_count: 26,
  //     Result: 84.2,
  //     book :"Book 2",
  //     section :"Section 2",
  //     test_count : 32,
  //     createdAt : new Date("2025-04-01"),
  //   },
  //   {
  //     id: 4,
  //     user: {
  //       image: "/images/user/user-20.jpg",
  //       name: "Abram Schleifer",
  //       phone: "+998(95)064-28-27",
  //     },
  //     result_count: 23,
  //     group: "Group 2",
  //     Result: 78.0,
  //     book :"Book 2",
  //     section :"Section 2",
  //     test_count : 30,
  //     createdAt : new Date("2025-03-24"),
  //   },
  //   {
  //     id: 5,
  //     user: {
  //       image: "/images/user/user-21.jpg",
  //       name: "Carla George",
  //       phone: "+998(95)064-28-27",
  //     },
  //     group: "Group 1",
  //     result_count: 22,
  //     Result: 75.7,
  //     book :"Book 1",
  //     section :"Section 2",
  //     test_count : 30,
  //     createdAt : new Date("2025-03-24"),
  //   },
  //   {
  //     id: 5,
  //     user: {
  //       image: "/images/user/user-21.jpg",
  //       name: "Carla George",
  //       phone: "+998(95)064-28-27",
  //     },
  //     group: "Group 1",
  //     result_count: 31,
  //     Result: 75.7,
  //     book :"Book 2",
  //     section :"Section 2",
  //     test_count : 36,
  //     createdAt : new Date("2025-03-24"),
  //   },
  //   {
  //     id: 5,
  //     user: {
  //       image: "/images/user/user-21.jpg",
  //       name: "Carla George",
  //       phone: "+998(95)064-28-27",
  //     },
  //     group: "Group 1",
  //     result_count: 22,
  //     Result: 75.7,
  //     book :"Book 2",
  //     section :"Section 2",
  //     test_count : 30,
  //     createdAt : new Date("2025-03-24"),
  //   },
  //   {
  //     id: 5,
  //     user: {
  //       image: "/images/user/user-21.jpg",
  //       name: "Carla George",
  //       phone: "+998(95)064-28-27",
  //     },
  //     group: "Group 3",
  //     result_count: 18,
  //     Result: 60,
  //     book :"Book 2",
  //     section :"Section 2",
  //     test_count : 30,
  //     createdAt : new Date("2025-03-24"),
  //   },
  //   {
  //     id: 5,
  //     user: {
  //       image: "/images/user/user-21.jpg",
  //       name: "Carla George",
  //       phone: "+998(95)064-28-27",
  //     },
  //     group: "Group 3",
  //     Result: 55.0,
  //     result_count: 16,
  //     book :"Book 2",
  //     section :"Section 2",
  //     test_count : 30,
  //     createdAt : new Date("2025-03-24"),
  //   },
  // ];
  
  
  
  export default function ResultsTable(
    { data, groups, refetch }: {
      data: ResultProps[],
      groups: any[]
      refetch: () => Promise<void>
  }
  ) {
  
    const [tableData, setTableData] = useState(data);
    const options = [
      { value: "5", label: "5" },
      { value: "10", label: "10" },
      { value: "20", label: "20" },
    ];
  
  
    const group_options = [
      { value: "All group", label: "All group" },
     ...groups
    ];
    let [optionValue, setoptionValue] = useState("5");
    let [groupoptionValue, setGroupoptionValue] = useState("All group");
    
   
    
    const handleSelectGroupChange = (value: string) => {
      setGroupoptionValue(value);
    };
  
    const handleSelectChange = (value: string) => {
      setoptionValue(value);
    };
    
    // Pationation
    
    const [currentPage, setCurrentPage] = useState(1);
    const maxPage = Math.ceil(tableData.length / +optionValue);
    
    const startIndex = (currentPage - 1) * +optionValue;
    const endIndex = startIndex + +optionValue;
    let currentItems: ResultProps[] = tableData.slice(startIndex, endIndex);
    
    const goToPreviousPage = () => {
      setCurrentPage((page) => Math.max(page - 1, 1));
    };
    
    const goToNextPage = () => {
      setCurrentPage((page) => Math.min(page + 1, maxPage));
    };
    console.log(">> data length :", tableData.length);
    
    useEffect(() => {
      const startIndex = (currentPage - 1) * +optionValue;
      const endIndex = startIndex + +optionValue;
      currentItems = tableData.slice(startIndex, endIndex);
    }, [currentPage]);
    
    useEffect(() => {
      setCurrentPage(1);

      if (groupoptionValue == "All group") {
        setTableData(data)
        
      }else{
        setTableData(data.filter((item)=>item.student?.group?.id == +groupoptionValue));
      }
    }, [optionValue,groupoptionValue]);
  
  
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
        <div className="px-5 py-3  flex flex-row justify-between items-center border-b border-gray-100 dark:border-white/[0.05]">
            <div className="flex flex-row items-center gap-2 text-theme-sm font-medium text-gray-500 text-start  dark:text-gray-400">
              <span>Show</span>
  
              <Select
                options={options}
                onChange={handleSelectChange}
                className="dark:bg-dark-900"
                defaultValue="5"
              />
              <span>entries</span>
            </div>
            <div className="flex flex-row items-center gap-2 text-theme-sm font-medium text-gray-500 text-start  dark:text-gray-400">
              
              <Select
                options={group_options}
                onChange={handleSelectGroupChange}
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
                  Students
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 "
                >
                  Finished
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Book
                </TableCell>
  
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Result Count
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Result
                </TableCell>
              </TableRow>
            </TableHeader>
  
            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {currentItems.map((order,index) => (
                <TableRow key={index}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                          width={40}
                          height={40}
                          src={order.student?.image ?? bookImage}
                          alt={order.student?.name }
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.student?.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.student?.group?.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                  {Moment(order.createdt).format("MMMM DD, yyyy")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.test?.section?.book?.name ?? ""}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.test?.section?.name ?? ""}
                        </span>
                      </div>
                  </TableCell>
  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {order.test?._count?.results ?? ""}/{order.test?._count?.test_items ?? ""}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    { Math.floor((order.test?._count?.results ?? 0) / (order.test?._count?.test_items ?? 1)).toFixed(2)} %
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
            Showing {(currentPage - 1) * +optionValue + 1} to{" "}
            {Math.min(tableData.length, currentPage * +optionValue)} of{" "}
            {tableData.length} entries
          </div>
        </div>
      </div>
    );
  }
  