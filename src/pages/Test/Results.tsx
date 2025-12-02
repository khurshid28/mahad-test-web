import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ResultsTable from "../../components/tables/test/resultsTable";
import { useCallback, useState } from "react";
import axiosClient from "../../service/axios.service";
import { useFetchWithLoader } from "../../hooks/useFetchWithLoader";
import { LoadSpinner } from "../../components/spinner/load-spinner";

export default function ResultsPage() {
  // Get student_id from URL params if exists
  const params = new URLSearchParams(window.location.search);
  const studentIdParam = params.get('student_id');
  
  const fetchResults = useCallback(() => {
    return axiosClient.get('/result/all').then(res => res.data);
  }, []);

  const { data, isLoading, error, refetch } = useFetchWithLoader({
    fetcher: fetchResults,
  });


  const fetchGroups = useCallback(() => {
    return axiosClient.get('/group/all').then(res => res.data);
}, []);

const { data: books_data } = useFetchWithLoader({
    fetcher: fetchGroups,
    onSuccess: useCallback((dataSubject: any[]) => {
        set_all_group_options((dataSubject as any[]).map((e, index) => {
            return new Option(`${e.name}`, `${e.id}`)
        }));

    }, []),
});

const [all_group_options, set_all_group_options] = useState<HTMLOptionElement[]>([]);

  return (
    <>
      <PageMeta
        title="Test Dashboard"
        description="Test Dashboard"
      />
      <PageBreadcrumb pageTitle="Natijalar" />
      <div className="space-y-6">

        {
          isLoading && <div className="min-h-[450px]  flex-col flex justify-center">
            <LoadSpinner />
          </div>
        }
        {
          data && <ComponentCard title="Natijalar jadvali">
            <ResultsTable data={data} refetch={refetch} groups={all_group_options} studentIdFilter={studentIdParam}/>
          </ComponentCard>
        }
       
      </div>
    </>
  );
}
