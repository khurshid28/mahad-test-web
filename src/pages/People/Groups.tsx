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
import GroupsTable from "../../components/tables/people/groupsTable";
import FileInput from "../../components/form/input/FileInput";
import axiosClient from "../../service/axios.service";
import { useFetchWithLoader } from "../../hooks/useFetchWithLoader";
import { LoadSpinner } from "../../components/spinner/load-spinner";
import { toast } from "react-toastify";
export interface Group {
  name?: string;
  image?: string;
}
export default function GroupsPage() {


  const fetchGroups = useCallback(() => {
    return axiosClient.get('/group/all').then(res => res.data);
  }, []);

  const { data, isLoading, error, refetch } = useFetchWithLoader({
    fetcher: fetchGroups,
  });

  const { isOpen, openModal, closeModal } = useModal();

  let [name,setName] =useState("");
  let [file,setFile] =useState<File | undefined>();


  let sendGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axiosClient.post('/group', { name });
      
     
      toast.success('Guruh muvaffaqiyatli yaratildi');
      await refetch();

    } catch (error) {
      console.error('Create Group error:', error);
      toast.error('Xatolik yuz berdi');

    }finally { 
      closeModal();
    }
  };






  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      setFile(file)
    }
  };
  return (
    <>
      <PageMeta
        title="Groups | Test Dashboard"
        description="Test Dashboard"
      />
      <PageBreadcrumb pageTitle="Groups" />

      <div className="space-y-6 ">
        {
          isLoading && <div className="min-h-[450px]  flex-col flex justify-center">
            <LoadSpinner />
          </div>
        }

        {
          data && <ComponentCard
            title="Groups Table"
            action={
              <>
                <Button
                  size="sm"
                  variant="primary"
                  startIcon={<PlusIcon className="size-5 fill-white" />}
                  onClick={() => {
                    setName("");
                    setFile(undefined);
                    openModal()
                  }}
                >
                  Add Group
                </Button>
              </>
            }
          >
            <GroupsTable data={data}  refetch={refetch}/>
          </ComponentCard>
        }
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add Group
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Create new Group with full details.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={sendGroup}>
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value,)
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
              <Button size="sm" type="submit">
                Saqlash
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
