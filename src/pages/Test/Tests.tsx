import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

import { BoxIcon, CheckCircleIcon, DownloadIcon, PlusIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { useModal } from "../../hooks/useModal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { Modal } from "../../components/ui/modal";
import { useCallback, useEffect, useState } from "react";
import FileInput from "../../components/form/input/FileInput";
import Select from "../../components/form/Select";
import TestsTable from "../../components/tables/test/testsTable";
import axiosClient from "../../service/axios.service";
import { useFetchWithLoader } from "../../hooks/useFetchWithLoader";
import { LoadSpinner } from "../../components/spinner/load-spinner";
import {
  mapQuestionToDto,
  ParsedResult,
  parseQuestions,
  readDocx,
} from "../../service/parse-docs.service";

import { toast } from "react-toastify";
export interface Test {
  id?: number;
  name?: string;
  section?: any;
  section_id?: number;
  book?: string;
  book_id?: number;
}

export default function TestsPage() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleAdding = () => {
    // Handle save logic here

    console.log("handleAdding...");

    closeModal();
    setTest(emptyTest);
  };
  let emptyTest: Test = {};
  let [Test, setTest] = useState<Test>(emptyTest);

  const [quiz, setQuiz] = useState<ParsedResult | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const text = await readDocx(e.target.files[0]);
      const parsed = await parseQuestions(text);
      setQuiz(parsed);
      setTest({
        ...Test,
        name: parsed.title,
      });
      console.log(parsed);
    }
  };

  const [all_Book_options, set_all_Book_options] = useState<
    HTMLOptionElement[]
  >([]);

  const fetchTests = useCallback(() => {
    return axiosClient.get("/test/all").then((res) => res.data);
  }, []);

  const {
    data,
    isLoading,
    error,
    refetch: refetchTest,
  } = useFetchWithLoader({
    fetcher: fetchTests,
  });

  useEffect(() => {
    console.log("Data updated:", data);
    setTest(emptyTest);
  }, [data]);

  const fetchBooks = useCallback(() => {
    return axiosClient.get("/book/all").then((res) => res.data);
  }, []);

  const { data: books_data } = useFetchWithLoader({
    fetcher: fetchBooks,
    onSuccess: useCallback((dataBook: any[]) => {
      set_all_Book_options(
        (dataBook as any[]).map((e, index) => {
          return new Option(`${e.name}`, `${e.id}`);
        })
      );
    }, []),
  });

  const fetchSections = useCallback(() => {
    return axiosClient.get("/section/all").then((res) => res.data);
  }, []);
  const [all_Section_options, set_all_Section_options] = useState<
    HTMLOptionElement[]
  >([]);
  const { data: sectionss_data } = useFetchWithLoader({
    fetcher: fetchSections,
    onSuccess: useCallback((datasection: any[]) => {
      set_all_Section_options(
        (datasection as any[]).map((e, index) => {
          return new Option(`${e.name}`, `${e.id}`);
        })
      );
    }, []),
  });

  // const all_Book_options = [
  //     { value: "Book 1", label: "Book 1" },
  //     { value: "Book 2", label: "Book 2" },
  //     { value: "Book 3", label: "Book 3" },
  // ];

  let createMoreTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (Test.section_id && quiz?.questions) {
        const res = await axiosClient.post("/test-item/more", {
          section_id: Test.section_id,
          items: quiz?.questions.map((q) => mapQuestionToDto(q, 0)),
        });
        toast.success("Saqlandi");
        console.log("Saqlandi");

        refetchTest().then((e) => {
          setTest(emptyTest);
          setQuiz(null);
        });
      } else {
        toast.warn("Ma'lumotlar to'liq emas");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Saqlashda xatolik aniqlandi ");
    }
    closeModal();
  };
  return (
    <>
      <PageMeta title="Tests | Test Dashboard" description="Test Dashboard" />
      <PageBreadcrumb pageTitle="Testlar" />

      <div className="space-y-6 ">
        {isLoading && (
          <div className="min-h-[450px]  flex-col flex justify-center">
            <LoadSpinner />
          </div>
        )}

        {data && (
          <ComponentCard
            title="Testlar jadvali"
            action={
              <div className="flex flex-row gap-4">
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    endIcon={<DownloadIcon className="size-5 fill-white" />}
                  >
                    Yuklab olish
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  startIcon={<PlusIcon className="size-5 fill-white" />}
                  onClick={() => {
                    setTest(emptyTest);
                    setQuiz(null);
                    openModal();
                  }}
                >
                  Qo'shish
                </Button>
              </div>
            }
          >
            <TestsTable
              data={data}
              refetch={refetchTest}
              books={all_Book_options}
            />
          </ComponentCard>
        )}
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Qo'shish
            </h4>
            {/* <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Create new Test with full details.
            </p> */}
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Kitob</Label>
                  <Select
                    options={all_Book_options}
                    className="dark:bg-dark-900"
                    defaultValue={Test.book_id ? `${Test.book_id}` : undefined}
                    placeholder="Kitobni tanlang"
                    onChange={(e) => {
                      setTest({
                        ...Test,
                        book_id: +e,
                      });
                    }}
                  />
                </div>

                <div>
                  <Label>Bo'lim</Label>
                  <Select
                    options={all_Section_options}
                    className="dark:bg-dark-900"
                    defaultValue={
                      Test.section_id ? `${Test.section_id}` : undefined
                    }
                    placeholder="Bo'limni tanlang"
                    onChange={(e) => {
                      setTest({
                        ...Test,
                        section_id: +e,
                      });
                    }}
                  />
                </div>

                <div>
                  <Label>Sarlavha</Label>
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
                  <Label>Fayl [docx]</Label>
                  <FileInput
                    onChange={handleFileChange}
                    className="custom-class"
                    accept=".docx" // faqat .docx fayllar ko‘rinadi
                  />
                </div>
              </div>

              <div className="max-h-[300px]  flex flex-col py-4">
                {quiz && (
                  <div className="flex flex-row gap-2 items-center mb-4">
                    <CheckCircleIcon className="text-green-600 dark:text-green-400  size-8" />
                    <p className="text-green-600 dark:text-green-400 ">
                      {quiz.questions.length} ta test aniqlandi
                    </p>
                  </div>
                )}
                {quiz &&
                  quiz.questions.map((q) => (
                    <div
                      key={q.number}
                      className="mb-4 p-2 rounded-xl border border-gray-200  dark:border-white/[0.05]  text-gray-800 dark:text-white/90"
                    >
                      <p className="font-semibold">
                        {q.number}. {q.text}
                      </p>
                      <ul>
                        {q.options.map((opt, idx) => (
                          <li key={idx}>
                            <span
                              className={
                                opt.isCorrect
                                  ? "text-green-600 dark:text-green-400 "
                                  : ""
                              }
                            >
                              {String.fromCharCode(65 + idx)}) {opt.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Bekor qilish
              </Button>
              <Button size="sm" onClick={createMoreTest}>
                Saqlash
              </Button>
            </div>
          </form>
          ``
        </div>
      </Modal>
    </>
  );
}
