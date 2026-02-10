import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import RatesTable, { RateItemProps } from "../../components/tables/rate/RatesTable";
import axiosClient from "../../service/axios.service";
import { useCallback, useState } from "react";
import { useFetchWithLoader } from "../../hooks/useFetchWithLoader";
import { LoadSpinner } from "../../components/spinner/load-spinner";

export default function RatePage() {

  // Get user role from localStorage
  const getUserRole = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.role;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  let [group_options, set_group_options] = useState<HTMLOptionElement[]>([]);
  const fetchStudents = useCallback(() => {
    const role = getUserRole();
    const endpoint = role === 'ADMIN' ? '/admin/rate' : '/student/rate';
    return axiosClient.get(endpoint).then(res => res.data);
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
      set_group_options((data as any[]).map((e, index) => {
        return new Option(`${e.name}`, `${e.id}`)
      }));

    }, [])
  }



  );

  let sortedData = (list: RateItemProps[]): RateItemProps[] => {
    return list.map((e) => {
      if (e.results && e.results?.length > 0) {
        // Kitoblar bo'yicha guruhlash
        const bookScores = new Map<number, number[]>();
        const specialScores: number[] = [];
        const randomScores: number[] = [];
        
        for (let index = 0; index < e.results?.length; index++) {
          const result = e.results[index];
          
          if (result.type === "RANDOM") {
            // Random testlar
            const totalItems = ((result as any).answers as any[])?.length ?? 0;
            const solved = result.solved ?? 0;
            if (totalItems > 0) {
              randomScores.push((solved / totalItems) * 100);
            }
          } else if (result.type === "SPECIAL") {
            // Maxsus testlar
            const totalItems = ((result as any).answers as any[])?.length ?? 0;
            const solved = result.solved ?? 0;
            if (totalItems > 0) {
              specialScores.push((solved / totalItems) * 100);
            }
          } else {
            // Oddiy testlar - kitob bo'yicha guruhlash
            const bookId = result.test?.section?.book_id;
            const count = result.test?._count?.test_items;
            const solved = result.solved ?? 0;
            if (bookId && count && count > 0) {
              if (!bookScores.has(bookId)) {
                bookScores.set(bookId, []);
              }
              bookScores.get(bookId)!.push((solved / count) * 100);
            }
          }
        }

        // Har bir kitobning o'rtachasini hisoblash
        const bookAverages: number[] = [];
        bookScores.forEach((scores) => {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          bookAverages.push(avg);
        });

        console.log('Student:', e.name);
        console.log('Book scores:', Array.from(bookScores.entries()));
        console.log('Book averages:', bookAverages);
        console.log('Special scores:', specialScores);
        console.log('Random scores:', randomScores);

        // Barcha o'rtachalarni birlashtirish
        const allAverages = [
          ...bookAverages,
          ...specialScores,
          ...randomScores
        ];

        console.log('All averages:', allAverages);

        e.rate = allAverages.length > 0 
          ? allAverages.reduce((a, b) => a + b, 0) / allAverages.length 
          : 0;
          
        console.log('Final rate:', e.rate);
      } else {
        e.rate = 0;
      }
      return e;
    }).sort((a, b) => {
      return (b?.rate ?? 0) - (a?.rate ?? 0);
    });
  }

  return (
    <>
      <PageMeta
        title="Test Dashboard"
        description="Test Dashboard"
      />
      <PageBreadcrumb pageTitle="Reyting" />
      <div className="space-y-6">

        {
          isLoading && <div className="min-h-[450px]  flex-col flex justify-center">
            <LoadSpinner />
          </div>
        }
        {
          data && <ComponentCard title="Reyting jadvali">
            <RatesTable data={sortedData(data)} refetch={refetch} groups={group_options} />
          </ComponentCard>
        }
      </div>
    </>
  );
}
