import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { BoxIcon, PlusIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { useModal } from "../../hooks/useModal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { Modal } from "../../components/ui/modal";
import { useCallback, useState } from "react";
import StudentsTable from "../../components/tables/people/studentsTable";
import Select from "../../components/form/Select";
import FileInput from "../../components/form/input/FileInput";
import axiosClient from "../../service/axios.service";
import { useFetchWithLoader } from "../../hooks/useFetchWithLoader";
import { LoadSpinner } from "../../components/spinner/load-spinner";
import { Options } from "flatpickr/dist/types/options";
import { toast } from "react-toastify";
export interface Student {
  id? :number;
  name: string;
  phone: string;
  group_id?: number
  password?: string
}
export default function StudentsPage() {
  const { isOpen, openModal, closeModal } = useModal();
  // const handleAdding = () => {
  //   // Handle save logic here

  //   console.log("handleAdding...");

  //   closeModal();
  //   setStudent(emptyStudent);
  // };
  let emptyStudent: Student = {
    name: "",
    phone: "",
    

  };


  let [Student, setStudent] = useState<Student>(emptyStudent);

  let [options, setOptions] = useState<HTMLOptionElement[]>([]);

  let [optionValue, setoptionValue] = useState("");

  const handleSelectChange = (value: string) => {
    setoptionValue(value);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };


  
  let createStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axiosClient.post('/student', { ...Student });
      
     
      toast.success('Student muvaffaqiyatli yaratildi');
      await refetch();

    } catch (error) {
      console.error('Create Student error:', error);
      toast.error('Xatolik yuz berdi');

    }finally { 
      closeModal();
    }
  };


  const fetchStudents = useCallback(() => {
    return axiosClient.get('/student/all').then(res => res.data);
  }, []);


  const { data, isLoading, error, refetch } = useFetchWithLoader({
    fetcher: fetchStudents,
  });

  const fetchGroups = useCallback(() => {
    return axiosClient.get('/group/all').then(res => res.data);
  }, []);

  const { data: groups, isLoading: isLoadingGroups, error: errorIsGroups, refetch: refetchGroups } = useFetchWithLoader({
    fetcher: fetchGroups,
    onSuccess: useCallback((data: any[]) => {
      setOptions((data as any[]).map((e, index) => {
        return new Option(`${e.name}`, `${e.id}`)
      }));
      
    }, [])
  }



  );

  return (
    <>
      <PageMeta
        title="Students | Test Dashboard"
        description="Test Dashboard"
      />
      <PageBreadcrumb pageTitle="Studentlar" />

      <div className="space-y-6 ">

        {
          isLoading && <div className="min-h-[450px]  flex-col flex justify-center">
            <LoadSpinner />
          </div>
        }
        {data && <ComponentCard
          title="Studentlar jadvali"
          action={
            <>
              <Button
                size="sm"
                variant="primary"
                startIcon={<PlusIcon className="size-5 fill-white" />}
                onClick={() => {
                  setStudent(emptyStudent)
                  openModal()
                }}
              >
                Qo'shish
              </Button>
            </>
          }
        >
          <StudentsTable data={data} refetch={refetch} groups={options} />
        </ComponentCard>}
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Student qo'shish
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Create new Student with full details.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Fullname</Label>
                  <Input
                    type="text"
                    value={Student.name}
                    onChange={(e) =>
                      setStudent({
                        ...Student,
                        name: e.target.value,
                      })
                    }
                  />
                </div>


                <div>
                  <Label>Phonenumber</Label>
                  <Input
                    type="text"
                    value={Student.phone}
                    onChange={(e) =>
                      setStudent({
                        ...Student,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>




                <div>
                  <Label>Group</Label>
                  <Select
                    options={options}
                    placeholder="Select group"
                    onChange={(e)=>{
                      setStudent({
                        ...Student,
                        group_id :+e
                      })
                    }}
                    className="dark:bg-dark-900"
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
              <Button size="sm" onClick={createStudent}>
                Saqlash
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
