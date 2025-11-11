



import * as FileSaver from "file-saver";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";

import { PlusIcon } from "../../icons";
import Button from "../../components/ui/button/Button";
import { useModal } from "../../hooks/useModal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { Modal } from "../../components/ui/modal";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../service/axios.service";
import Badge from "../../components/ui/badge/Badge";
import Moment from "moment";
import { EditIcon, DeleteIcon, TimeIcon, UserCircleIcon } from "../../icons";
import { FiEye, FiDownload } from "react-icons/fi";
import { Document, Packer, Paragraph, HeadingLevel } from "docx";

interface Group {
  id: number;
  name: string;
  createdt: string;
}

interface Subject {
  id: number;
  name: string;
  image: string | null;
  createdt: string;
}

interface Book {
  id: number;
  name: string;
  image: string | null;
  subject_id: number;
  createdt: string;
}

interface Section {
  id: number;
  name: string;
  image: string | null;
  book_id: number;
  createdt: string;
}

interface Test {
  id: number;
  name: string;
  section_id: number;
  createdt: string;
}

interface TestItem {
  id: number;
  number?: number;
  question?: string;
  answer_A?: string;
  answer_B?: string;
  answer_C?: string;
  answer_D?: string;
  answer?: string; // 'A', 'B', 'C', 'D' yoki null
  test_id?: number;
  createdt?: string;
}

interface GeneratedTest {
  id: string;
  specialTestId: number;
  items: TestItem[];
  createdAt: string;
  answerKey: { [key: number]: string }; // Javoblar kaliti
}

export interface SpecialTest {
  id?: number;
  name: string;
  activationStartTime: string;
  activationEndTime: string;
  duration: number;
  groupIds: number[];
  testConfig: {
    subjectId: number; // Fan (majburiy)
    bookId?: number; // Kitob (ixtiyoriy)
    sectionIds?: number[]; // Bo'limlar (ixtiyoriy)
    questionCount: number; // Nechta savol
  };
  status?: string;
  generatedTest?: GeneratedTest; // Tuzilgan test
}

// Mock data - faqat Groups va SpecialTests uchun (backend tayyor emas)
const mockGroups = [
  { id: 1, name: "1-guruh", createdt: new Date().toISOString() },
  { id: 2, name: "2-guruh", createdt: new Date().toISOString() },
  { id: 3, name: "3-guruh", createdt: new Date().toISOString() },
  { id: 4, name: "Kechki guruh", createdt: new Date().toISOString() },
];

const mockSpecialTests: SpecialTest[] = [
  {
    id: 1,
    name: "Matematika fani bo'yicha",
    activationStartTime: "2025-11-14T08:00:00",
    activationEndTime: "2025-11-16T23:59:00",
    duration: 120,
    groupIds: [1, 2],
    testConfig: {
      subjectId: 1, // Matematika
      questionCount: 30
    },
    status: "Kutilmoqda",
  },
  {
    id: 2,
    name: "Fizika kitobidan",
    activationStartTime: "2025-11-11T12:00:00",
    activationEndTime: "2025-11-13T18:00:00",
    duration: 90,
    groupIds: [3],
    testConfig: {
      subjectId: 2, // Fizika
      bookId: 2, // Kitob tanlangan
      questionCount: 25
    },
    status: "Faol",
  },
  {
    id: 3,
    name: "Tanlangan bo'limlardan",
    activationStartTime: "2025-11-12T10:00:00",
    activationEndTime: "2025-11-14T20:00:00",
    duration: 60,
    groupIds: [1],
    testConfig: {
      subjectId: 1, // Matematika
      bookId: 1, // Kitob
      sectionIds: [1, 3], // Bo'limlar tanlangan
      questionCount: 20
    },
    status: "Faol",
  },
];

export default function SpecialTestsPage() {
  // Modal ochiq/berkitilganligini boshqarish uchun state
  const [isAllItemsModalOpen, setIsAllItemsModalOpen] = useState(false);
  // Barcha test-itemlarni saqlash uchun state
  const [allTestItems, setAllTestItems] = useState<TestItem[]>([]);
  // Modal state for fallback random
  const [isFallbackModalOpen, setIsFallbackModalOpen] = useState(false);
  const [fallbackPendingTest, setFallbackPendingTest] = useState<SpecialTest | null>(null);
  const [fallbackMissingSections, setFallbackMissingSections] = useState<string[]>([]);
  const [data, setData] = useState<SpecialTest[]>(mockSpecialTests);
  const [isLoading, setIsLoading] = useState(false);

  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [tests, setTests] = useState<Test[]>([]);

  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isConfirmOpen, openModal: openConfirmModal, closeModal: closeConfirmModal } = useModal();
  const { isOpen: isViewOpen, openModal: openViewModal, closeModal: closeViewModal } = useModal();

  const [editingTest, setEditingTest] = useState<SpecialTest | null>(null);
  const [pendingTest, setPendingTest] = useState<SpecialTest | null>(null);
  const [viewingTest, setViewingTest] = useState<SpecialTest | null>(null);

  const [name, setName] = useState("");
  const [activationStartTime, setActivationStartTime] = useState("");
  const [activationEndTime, setActivationEndTime] = useState("");
  const [duration, setDuration] = useState<number>(60);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  
  // Test config - Fan majburiy, Kitob va Bo'limlar ixtiyoriy
  const [selectedSubject, setSelectedSubject] = useState<number>(0);
  const [selectedBook, setSelectedBook] = useState<number>(0); // 0 = tanlangan yo'q
  const [selectedSectionIds, setSelectedSectionIds] = useState<number[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(10);

  // API dan guruhlarni yuklash
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get('/group/all');
        setGroups(response.data || []);
      } catch (error) {
        console.error('Guruhlarni yuklashda xatolik:', error);
        toast.error('Guruhlarni yuklashda xatolik');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // API dan fanlar, kitoblar va bo'limlarni yuklash
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectsRes, booksRes, sectionsRes, testsRes] = await Promise.all([
          axiosClient.get('/subject/all'),
          axiosClient.get('/book/all'),
          axiosClient.get('/section/all'),
          axiosClient.get('/test/all'),
        ]);
        
        console.log('📚 Subjects:', subjectsRes.data);
        console.log('📖 Books:', booksRes.data);
        console.log('📑 Sections:', sectionsRes.data);
        console.log('📝 Tests:', testsRes.data);
        
        setSubjects(subjectsRes.data || []);
        setBooks(booksRes.data || []);
        setSections(sectionsRes.data || []);
        setTests(testsRes.data || []);
      } catch (error) {
        console.error('Ma\'lumotlarni yuklashda xatolik:', error);
        toast.error('Ma\'lumotlarni yuklashda xatolik');
      }
    };

    fetchData();
  }, []);

  // Test itemlarni yuklash (barcha testlar uchun)
  useEffect(() => {
    const fetchTestItems = async () => {
      try {
        const response = await axiosClient.get('/test-item/all');
        console.log('❓ Test Items:', response.data);
        setAllTestItems(response.data || []);
      } catch (error) {
        console.error('Test itemlarni yuklashda xatolik:', error);
      }
    };

    fetchTestItems();
  }, []);

  const handleOpenModal = () => {
    setEditingTest(null);
    setName("");
    setActivationStartTime("");
    setActivationEndTime("");
    setDuration(60);
    setSelectedGroups([]);
    setSelectedSubject(subjects.length > 0 ? subjects[0].id : 0);
    setSelectedBook(0);
    setSelectedSectionIds([]);
    setQuestionCount(10);
    openModal();
  };

  const handleEditTest = (test: SpecialTest) => {
    setEditingTest(test);
    setName(test.name);
    setActivationStartTime(test.activationStartTime);
    setActivationEndTime(test.activationEndTime);
    setDuration(test.duration);
    setSelectedGroups(test.groupIds);
    setSelectedSubject(test.testConfig.subjectId);
    setSelectedBook(test.testConfig.bookId || 0);
    setSelectedSectionIds(test.testConfig.sectionIds || []);
    setQuestionCount(test.testConfig.questionCount);
    openModal();
  };

  const createOrUpdateTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('🔵 Form submit bosildi');
    // Validation vaqtincha olib tashlandi
    try {
      const testConfig: SpecialTest['testConfig'] = {
        subjectId: selectedSubject,
        questionCount,
      };
      if (selectedBook > 0) {
        testConfig.bookId = selectedBook;
      }
      if (selectedSectionIds.length > 0) {
        testConfig.sectionIds = selectedSectionIds;
      }
      const testData: SpecialTest = {
        id: editingTest?.id || data.length + 1,
        name,
        activationStartTime,
        activationEndTime,
        duration,
        groupIds: selectedGroups,
        testConfig,
        status: editingTest?.status || "Kutilmoqda",
      };
      console.log('🟢 Test data:', testData);
      setPendingTest(testData);
      closeModal();
      openConfirmModal();
      console.log('🟡 Tasdiqlash modali ochildi');
    } catch (error) {
      console.error('Test yaratishda xatolik:', error);
      toast.error('Xatolik yuz berdi');
    }
  };

  const confirmAndSaveTest = () => {
    if (!pendingTest) return;

    console.log('🔴 Test tuzish boshlandi');
    console.log('📊 Available items:', allTestItems.length);


    try {
      // Real random test tuzish
      const generatedTest = generateRandomTest(pendingTest);
      console.log('✅ Test tuzildi:', generatedTest);

      // Yetarli savol borligini tekshirish
      if (generatedTest.items.length === 0) {
        // Tanlangan bo'limlar uchun savol yo'q, aniq nomlarni ko'rsatamiz
        let missingSections: string[] = [];
        if (pendingTest.testConfig.sectionIds && pendingTest.testConfig.sectionIds.length > 0) {
          missingSections = pendingTest.testConfig.sectionIds
            .map(id => sections.find(s => s.id === id)?.name)
            .filter(Boolean) as string[];
        }
        setFallbackPendingTest(pendingTest);
        setFallbackMissingSections(missingSections);
        setIsFallbackModalOpen(true);
        return;
      }
  // Fallback random testni modal orqali tasdiqlash
  const handleFallbackRandom = () => {
    if (!fallbackPendingTest) return;
    const questionCount = fallbackPendingTest.testConfig.questionCount;
    const selectedItems = allTestItems.sort(() => Math.random() - 0.5).slice(0, questionCount);
    const answerKey: { [key: number]: string } = {};
    selectedItems.forEach((item, i) => { answerKey[i + 1] = item.answer; });
    const generatedTest = {
      id: `gen_${Date.now()}`,
      specialTestId: fallbackPendingTest.id!,
      items: selectedItems.map((item, i) => ({ ...item, number: i + 1 })),
      createdAt: new Date().toISOString(),
      answerKey,
    };
    const testWithGenerated = { ...fallbackPendingTest, generatedTest };
    if (editingTest) {
      setData(data.map(test => test.id === editingTest.id ? testWithGenerated : test));
      toast.success('Test yangilandi');
    } else {
      setData([...data, testWithGenerated]);
      toast.success('Test muvaffaqiyatli tuzildi');
    }
    setPendingTest(null);
    setFallbackPendingTest(null);
    setIsFallbackModalOpen(false);
    closeConfirmModal();
  };

  const handleFallbackCancel = () => {
    setFallbackPendingTest(null);
    setIsFallbackModalOpen(false);
    closeConfirmModal();
  };
      {/* Fallback random modal */}
      <Modal isOpen={isFallbackModalOpen} onClose={handleFallbackCancel} className="max-w-[400px] m-4">
        <div className="p-6">
          <h4 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">Savollar topilmadi</h4>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {fallbackMissingSections.length > 0
              ? `Tanlangan bo'limlarda (${fallbackMissingSections.join(", ")}) savollar topilmadi.`
              : `Tanlangan bo'limlar uchun savollar topilmadi.`}
            <br />
            <span className="font-medium">Boshqa bo'limlardan random savollar olishni xohlaysizmi?</span>
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleFallbackCancel}>Yo‘q</Button>
            <Button onClick={handleFallbackRandom}>Ha, random tuzilsin</Button>
          </div>
        </div>
      </Modal>
      {/* Barcha test-itemlarni jadvalda ko‘rsatish */}
      <ComponentCard title="Barcha test-itemlar (API dan)">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs border">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Savol</th>
                <th className="p-2 border">A</th>
                <th className="p-2 border">B</th>
                <th className="p-2 border">C</th>
                <th className="p-2 border">D</th>
                <th className="p-2 border">To‘g‘ri javob</th>
                <th className="p-2 border">Test ID</th>
              </tr>
            </thead>
            <tbody>
              {allTestItems.map((item, idx) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{item.question}</td>
                  <td className="p-2 border">{item.answer_A}</td>
                  <td className="p-2 border">{item.answer_B}</td>
                  <td className="p-2 border">{item.answer_C}</td>
                  <td className="p-2 border">{item.answer_D}</td>
                  <td className="p-2 border font-bold">{item.answer?.toUpperCase()}</td>
                  <td className="p-2 border">{item.test_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      if (generatedTest.items.length < pendingTest.testConfig.questionCount) {
        toast.warning(
          `Faqat ${generatedTest.items.length} ta savol topildi. ` +
          `So'ralgan: ${pendingTest.testConfig.questionCount} ta`
        );
      }

      const testWithGenerated = { ...pendingTest, generatedTest };
      console.log('💾 Saqlash uchun test:', testWithGenerated);

      if (editingTest) {
        // Update existing test
        setData(data.map(test => test.id === editingTest.id ? testWithGenerated : test));
        toast.success('Test yangilandi');
      } else {
        // Create new test
        setData([...data, testWithGenerated]);
        toast.success('Test muvaffaqiyatli tuzildi');
      }

      setPendingTest(null);
      closeConfirmModal();
    } catch (error) {
      console.error('❌ Test tuzishda xatolik:', error);
      toast.error('Test tuzishda xatolik yuz berdi');
      closeConfirmModal();
    }
  };

  // Real random test tuzish funksiyasi
  const generateRandomTest = (specialTest: SpecialTest): GeneratedTest => {
    const { testConfig } = specialTest;
    let availableItems: TestItem[] = [];

    // 1. Bo'limlar tanlangan bo'lsa
    if (testConfig.sectionIds && testConfig.sectionIds.length > 0) {
      // Tanlangan bo'limlardagi testlarni topish (ichma-ich filter)
      const sectionTests = tests.filter(t => testConfig.sectionIds!.includes(t.section_id));
      const testIds = sectionTests.map(t => t.id);
  availableItems = allTestItems.filter(item => item.test_id !== undefined && testIds.includes(item.test_id));
    }
    // 2. Kitob tanlangan bo'lsa
    else if (testConfig.bookId) {
      // Kitobdagi bo'limlarni topish
      const bookSections = sections.filter(s => s.book_id === testConfig.bookId);
      const sectionIds = bookSections.map(s => s.id);
      const sectionTests = tests.filter(t => sectionIds.includes(t.section_id));
      const testIds = sectionTests.map(t => t.id);
      availableItems = allTestItems.filter(item => testIds.includes(item.test_id));
    }
    // 3. Faqat fan tanlangan bo'lsa
    else {
      // Fanga tegishli barcha kitoblarni topish
      const subjectBooks = books.filter(b => b.subject_id === testConfig.subjectId);
      const bookIds = subjectBooks.map(b => b.id);
      // Kitoblarga tegishli barcha bo'limlarni topish
      const subjectSections = sections.filter(s => bookIds.includes(s.book_id));
      const sectionIds = subjectSections.map(s => s.id);
      // Bo'limlarga tegishli barcha testlarni topish
      const subjectTests = tests.filter(t => sectionIds.includes(t.section_id));
      const testIds = subjectTests.map(t => t.id);
      // Testlarga tegishli barcha test-itemlarni topish
      availableItems = allTestItems.filter(item => testIds.includes(item.test_id));
    }

    // Fallback: Agar yuqoridagi zanjir bo'yicha hech narsa topilmasa, hammasini olish
    if (availableItems.length === 0) {
      availableItems = allTestItems;
    }

    // Random tanlash
    const shuffled = [...availableItems].sort(() => Math.random() - 0.5);
    const selectedItems = shuffled.slice(0, Math.min(testConfig.questionCount, shuffled.length));

    // Javoblar kalitini tuzish
    const answerKey: { [key: number]: string } = {};
    selectedItems.forEach((item, index) => {
  answerKey[index + 1] = item.answer ?? "";
    });

    return {
      id: `gen_${Date.now()}`,
      specialTestId: specialTest.id!,
      items: selectedItems.map((item, index) => ({ ...item, number: index + 1 })),
      createdAt: new Date().toISOString(),
      answerKey,
    };
  };

  // Testni ko'rish
  const handleViewTest = (test: SpecialTest) => {
    if (!test.generatedTest) {
      toast.error('Test hali tuzilmagan');
      return;
    }
    setViewingTest(test);
    openViewModal();
  };

  // PDF export qilish
  const exportToPDF = (test: SpecialTest) => {
    if (!test.generatedTest) {
      toast.error('Test hali tuzilmagan');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${test.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          .question { margin: 20px 0; page-break-inside: avoid; }
          .question-number { font-weight: bold; }
          .options { margin-left: 20px; }
          .answer-key { margin-top: 40px; page-break-before: always; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <h1>${test.name}</h1>
        <p><strong>Davomiyligi:</strong> ${test.duration} daqiqa</p>
        <p><strong>Savollar soni:</strong> ${test.generatedTest.items.length} ta</p>
        <hr>
        
        ${test.generatedTest.items.map((item, index) => `
          <div class="question">
            <p class="question-number">${index + 1}. ${item.question}</p>
            <div class="options">
              <p>A) ${item.answer_A}</p>
              <p>B) ${item.answer_B}</p>
              <p>C) ${item.answer_C}</p>
              <p>D) ${item.answer_D}</p>
            </div>
          </div>
        `).join('')}
        
        <div class="answer-key">
          <h2>Javoblar kaliti</h2>
          <p>${Object.entries(test.generatedTest.answerKey).map(([num, ans]) => 
            `${num}-${ans.toUpperCase()}`
          ).join(', ')}</p>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px;">
            Chop etish
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // DOCX export qilish
  const exportToDOCX = (test: SpecialTest) => {
    if (!test.generatedTest) {
      toast.error('Test hali tuzilmagan');
      return;
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: test.name,
              heading: HeadingLevel.HEADING_1,
              alignment: "center"
            }),
            new Paragraph({ text: `Davomiyligi: ${test.duration} daqiqa` }),
            new Paragraph({ text: `Savollar soni: ${test.generatedTest.items.length} ta` }),
            new Paragraph({ text: "" }),
            ...test.generatedTest.items.map((item, idx) => [
              new Paragraph({
                text: `${idx + 1}. ${item.question}`,
                spacing: { after: 100 }
              }),
              new Paragraph({ text: `A) ${item.answer_A}` }),
              new Paragraph({ text: `B) ${item.answer_B}` }),
              new Paragraph({ text: `C) ${item.answer_C}` }),
              new Paragraph({ text: `D) ${item.answer_D}` }),
              new Paragraph({ text: "" })
            ]).flat(),
            new Paragraph({ text: "Javoblar kaliti", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({
              text: Object.entries(test.generatedTest.answerKey)
                .map(([num, ans]) => `${num}-${ans.toUpperCase()}`)
                .join(", ")
            })
          ]
        }
      ]
    });

    Packer.toBlob(doc).then(blob => {
      FileSaver.saveAs(blob, `${test.name}.docx`);
    });
  };

  const deleteSpecialTest = (id: number) => {
    setData(data.filter(test => test.id !== id));
    toast.success("Maxsus test o'chirildi");
  };

  const getGroupNames = (groupIds: number[]) => {
    if (!groupIds || groupIds.length === 0) return "0 guruh";
    if (!groups.length) return `${groupIds.length} guruh`;
    
    const groupNames = groupIds
      .map(id => groups.find(g => g.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    
    return groupNames || `${groupIds.length} guruh`;
  };

  // Test config ma'lumotlarini olish
  const getTestConfigDisplay = (test: SpecialTest) => {
    const subject = subjects.find(s => s.id === test.testConfig.subjectId);
    let display = subject ? `Fan: ${subject.name}` : 'Fan';
    
    if (test.testConfig.bookId) {
      const book = books.find(b => b.id === test.testConfig.bookId);
      if (book) display += ` → Kitob: ${book.name}`;
    }
    
    if (test.testConfig.sectionIds && test.testConfig.sectionIds.length > 0) {
      display += ` → ${test.testConfig.sectionIds.length} ta bo'lim`;
    }
    
    return display;
  };

  return (
    <>
      <PageMeta
        title="Maxsus Testlar | Test Dashboard"
        description="Test Dashboard"
      />
      <PageBreadcrumb pageTitle="Maxsus Testlar" />

      <div className="space-y-6">
        {isLoading && (
          <div className="min-h-[450px] flex-col flex justify-center">
            <div className="text-center">Loading...</div>
          </div>
        )}

        {data && (
          <ComponentCard
            title="Maxsus testlar"
            action={
              <>
                <Button
                  size="sm"
                  variant="primary"
                  startIcon={<PlusIcon className="size-5 fill-white" />}
                  onClick={handleOpenModal}
                >
                  Qo'shish
                </Button>
              </>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {data.map((test) => (
                <div
                  key={test.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {test.name}
                      </h3>
                      <div className="mt-2">
                        <Badge
                          size="sm"
                          color={
                            test.status === "active"
                              ? "success"
                              : test.status === "completed"
                              ? "info"
                              : "warning"
                          }
                        >
                          {test.status === "active" 
                            ? "Faol" 
                            : test.status === "completed" 
                            ? "Tugallangan" 
                            : "Kutilmoqda"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {/* Edit - faqat Faol va Kutilmoqda uchun */}
                      {(test.status === "Faol" || test.status === "Kutilmoqda") && (
                        <Button
                          size="mini"
                          variant="outline"
                          onClick={() => handleEditTest(test)}
                        >
                          <EditIcon className="w-4 h-4" />
                        </Button>
                      )}
                      {/* Ko'rish - test tuzilgan bo'lsa */}
                      {test.generatedTest && (
                        <Button
                          size="mini"
                          variant="outline"
                          onClick={() => handleViewTest(test)}
                          aria-label="Ko'rish"
                        >
                          <FiEye className="w-5 h-5 font-bold text-gray-700" />
                        </Button>
                      )}
                      {/* DOCX Download - test tuzilgan bo'lsa */}
                      {test.generatedTest && (
                        <Button
                          size="mini"
                          variant="outline"
                          onClick={() => exportToDOCX(test)}
                          aria-label="DOCX yuklab olish"
                        >
                          <FiDownload className="w-5 h-5 font-bold text-blue-700" />
                        </Button>
                      )}
                      {/* O'chirish */}
                      <Button
                        size="mini"
                        variant="outline"
                        onClick={() => deleteSpecialTest(test.id!)}
                      >
                        <DeleteIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-3">
                    {/* Ruhsat etilgan vaqt */}
                    <div className="flex items-start gap-2">
                      <TimeIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Ruhsat etilgan vaqt</p>
                        <p className="text-sm text-gray-800 dark:text-white">
                          {Moment(test.activationStartTime).format("DD MMM, HH:mm")} -{" "}
                          {Moment(test.activationEndTime).format("DD MMM, HH:mm")}
                        </p>
                      </div>
                    </div>

                    {/* Davomiyligi */}
                    <div className="flex items-start gap-2">
                      <TimeIcon className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Test davomiyligi</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {test.duration} daqiqa
                        </p>
                      </div>
                    </div>

                    {/* Guruhlar */}
                    <div className="flex items-start gap-2">
                      <UserCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Guruhlar</p>
                        <p className="text-sm text-gray-800 dark:text-white">
                          {getGroupNames(test.groupIds)}
                        </p>
                      </div>
                    </div>

                    {/* Test konfiguratsiyasi */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 mb-1">Test turi:</p>
                      <p className="text-sm text-gray-800 dark:text-white font-medium">
                        {getTestConfigDisplay(test)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {test.testConfig.questionCount} ta savol
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
        <div className="relative w-full p-4 bg-white rounded-3xl dark:bg-gray-900 lg:p-11 max-h-[90vh] flex flex-col">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {editingTest ? "Maxsus testni tahrirlash" : "Maxsus test qo'shish"}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Vaqt, guruhlar va bo'limlarni tanlang
            </p>
          </div>
          <form className="flex flex-col flex-1 overflow-hidden" onSubmit={createOrUpdateTest}>
            <div className="px-2 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                <div>
                  <Label>Test nomi</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Maxsus test nomi"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ruhsat etilgan vaqt (dan)</Label>
                    <Input
                      type="datetime-local"
                      value={activationStartTime}
                      onChange={(e) => setActivationStartTime(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Qaysi vaqtdan ko'rish mumkin</p>
                  </div>
                  <div>
                    <Label>Ruhsat etilgan vaqt (gacha)</Label>
                    <Input
                      type="datetime-local"
                      value={activationEndTime}
                      onChange={(e) => setActivationEndTime(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Qaysi vaqtgacha ko'rish mumkin</p>
                  </div>
                </div>

                <div>
                  <Label>Test ishlash davomiyligi (daqiqa)</Label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    placeholder="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Har bir student uchun test davomiyligi</p>
                </div>

                <div>
                  <Label>Guruhlar</Label>
                  <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg p-3 space-y-2">
                    {groups.length === 0 ? (
                      <p className="text-sm text-gray-500">Guruhlar yuklanmoqda...</p>
                    ) : (
                      groups.map((group) => (
                        <label
                          key={group.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedGroups.includes(group.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGroups([...selectedGroups, group.id]);
                              } else {
                                setSelectedGroups(selectedGroups.filter((id) => id !== group.id));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-800 dark:text-white">{group.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedGroups.length} ta guruh tanlandi
                  </p>
                </div>

                {/* Fan tanlash - MAJBURIY */}
                <div>
                  <Label>Fan <span className="text-red-500">*</span></Label>
                  <select
                    className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white/90"
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(Number(e.target.value));
                      setSelectedBook(0); // Fan o'zgarganda kitob va bo'limlarni reset qilish
                      setSelectedSectionIds([]);
                    }}
                    required
                  >
                    <option value="">Fan tanlang</option>
                    {subjects.map(subj => (
                      <option key={subj.id} value={subj.id}>{subj.name}</option>
                    ))}
                  </select>
                </div>

                {/* Kitob tanlash - IXTIYORIY (faqat fan tanlangan bo'lsa) */}
                {selectedSubject > 0 && (
                  <div>
                    <Label>Kitob (ixtiyoriy)</Label>
                    <select
                      className="h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm dark:bg-gray-900 dark:text-white/90"
                      value={selectedBook}
                      onChange={(e) => {
                        setSelectedBook(Number(e.target.value));
                        setSelectedSectionIds([]); // Kitob o'zgarganda bo'limlarni reset qilish
                      }}
                    >
                      <option value="0">Barcha kitoblar</option>
                      {books
                        .filter(book => book.subject_id === selectedSubject)
                        .map(book => (
                          <option key={book.id} value={book.id}>{book.name}</option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Bo'limlar tanlash - IXTIYORIY (faqat fan yoki kitob tanlangan bo'lsa) */}
                {selectedSubject > 0 && (
                  <div>
                    <Label>Bo'limlar (ixtiyoriy)</Label>
                    <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 max-h-48 overflow-y-auto mt-2">
                      {sections
                        .filter(section => {
                          // Agar kitob tanlangan bo'lsa, faqat shu kitobdagi bo'limlar
                          if (selectedBook > 0) {
                            return section.book_id === selectedBook;
                          }
                          // Aks holda, fan bo'yicha filter qilish
                          const book = books.find(b => b.id === section.book_id);
                          return book && book.subject_id === selectedSubject;
                        })
                        .map(section => (
                          <label
                            key={section.id}
                            className="flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSectionIds.includes(section.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedSectionIds([...selectedSectionIds, section.id]);
                                } else {
                                  setSelectedSectionIds(selectedSectionIds.filter((id) => id !== section.id));
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-800 dark:text-white">{section.name}</span>
                          </label>
                        ))}
                    </div>
                    {selectedSectionIds.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedSectionIds.length} ta bo'lim tanlandi
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <Label>Savollar soni</Label>
                  <Input
                    type="number"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    placeholder="10"
                    min="1"
                  />
                </div>

                {/* ESKI FORM - Comment qilingan */}
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={(e) => {
                  e.preventDefault();
                  closeModal();
                }} 
                type="button"
              >
                Bekor qilish
              </Button>
              <Button 
                size="sm" 
                type="submit"
                onClick={() => {
                  console.log('🟠 Test tuzish tugmasi bosildi');
                }}
              >
                {editingTest ? "Yangilash" : "Test tuzish"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Tasdiqlash modali */}
      <Modal isOpen={isConfirmOpen} onClose={closeConfirmModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900">
          <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
            Test tuzilsinmi?
          </h4>
          {pendingTest && (
            <div className="space-y-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Test nomi:</p>
                <p className="font-semibold text-gray-800 dark:text-white">{pendingTest.name}</p>
              </div>
              
              <div className="border-t dark:border-gray-700 pt-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Konfiguratsiya:</p>
                <div className="ml-3 space-y-1">
                  <p className="text-sm text-gray-800 dark:text-white">
                    <span className="font-medium">Fan:</span> {subjects.find(s => s.id === pendingTest.testConfig.subjectId)?.name || 'N/A'}
                  </p>
                  {pendingTest.testConfig.bookId && (
                    <p className="text-sm text-gray-800 dark:text-white">
                      <span className="font-medium">Kitob:</span> {books.find(b => b.id === pendingTest.testConfig.bookId)?.name || 'N/A'}
                    </p>
                  )}
                  {pendingTest.testConfig.sectionIds && pendingTest.testConfig.sectionIds.length > 0 && (
                    <p className="text-sm text-gray-800 dark:text-white">
                      <span className="font-medium">Bo'limlar:</span> {pendingTest.testConfig.sectionIds.length} ta
                    </p>
                  )}
                </div>
              </div>
              
              <div className="border-t dark:border-gray-700 pt-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Savollar:</p>
                <p className="font-semibold text-lg text-primary">{pendingTest.testConfig.questionCount} ta</p>
              </div>
              
              <div className="border-t dark:border-gray-700 pt-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Guruhlar:</p>
                <p className="text-sm text-gray-800 dark:text-white font-medium">
                  {getGroupNames(pendingTest.groupIds)}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 justify-end">
            <Button variant="outline" onClick={closeConfirmModal}>
              Bekor qilish
            </Button>
            <Button variant="outline" onClick={() => setIsAllItemsModalOpen(true)}>
              Barcha savollarni ko‘rish
            </Button>
            <Button onClick={confirmAndSaveTest}>
              Ha, test tuzilsin
            </Button>
          </div>
      {/* Barcha test-itemlar modal */}
      <Modal isOpen={isAllItemsModalOpen} onClose={() => setIsAllItemsModalOpen(false)} className="max-w-5xl m-4">
        <div className="p-6">
          <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Barcha test-itemlar (API dan)</h4>
          <div className="max-h-[70vh] overflow-y-auto space-y-6">
            {allTestItems
              .slice()
              .sort(() => Math.random() - 0.5)
              .map((item: TestItem, idx: number) => {
                // Savol boshidagi raqam va nuqtani olib tashlash ("1. Savol ..." -> "Savol ...")
                const cleanQuestion = item.question?.replace(/^\s*\d+\.?\s*/, "") || "";
                return (
                  <div key={item.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 shadow-sm">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="shrink-0 w-8 h-8 bg-gray-200 dark:bg-gray-700 text-primary dark:text-white rounded-full flex items-center justify-center font-semibold text-sm">{idx + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-white mb-2">{cleanQuestion}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className="font-semibold">A)</span> {item.answer_A}</div>
                          <div><span className="font-semibold">B)</span> {item.answer_B}</div>
                          <div><span className="font-semibold">C)</span> {item.answer_C}</div>
                          <div><span className="font-semibold">D)</span> {item.answer_D}</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-center">
                      <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-semibold">Kalit: {item.answer?.toUpperCase()}</span>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsAllItemsModalOpen(false)}>Yopish</Button>
          </div>
        </div>
      </Modal>
        </div>
      </Modal>

      {/* Ko'rish Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={closeViewModal}
        className="max-w-[900px] m-4"
      >
        <div className="relative w-full p-4 bg-white rounded-3xl dark:bg-gray-900 lg:p-11 max-h-[90vh] flex flex-col">
          <div className="px-2 pr-14 mb-6">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Test savollarini ko'rish
            </h4>
            {viewingTest && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {viewingTest.name} - {viewingTest.generatedTest?.items.length} ta savol
              </p>
            )}
          </div>

          {viewingTest && viewingTest.generatedTest && (
            <div className="flex-1 overflow-y-auto px-2">
              {/* Test haqida ma'lumot */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Yaratilgan:</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {Moment(viewingTest.generatedTest.createdAt).format('DD.MM.YYYY HH:mm')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Savollar soni:</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {viewingTest.generatedTest.items.length} ta
                    </p>
                  </div>
                </div>
              </div>

              {/* Savollar ro'yxati */}
              <div className="space-y-4 mb-6">
                {viewingTest.generatedTest.items.map((item, index) => {
                  const answerKey = viewingTest.generatedTest!.answerKey[index + 1];
                  return (
                    <div key={item.id} className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </span>
                        <div className="flex-1 space-y-3">
                          <p className="font-medium text-gray-800 dark:text-white">{item.question}</p>
                          <div className="space-y-2">
                            <div className={`p-3 rounded-lg transition-colors ${
                              answerKey === 'a' 
                                ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500' 
                                : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                            }`}>
                              <span className="font-semibold mr-2">A)</span>
                              <span className={answerKey === 'a' ? 'font-medium' : ''}>
                                {item.answer_A}
                              </span>
                            </div>
                            <div className={`p-3 rounded-lg transition-colors ${
                              answerKey === 'b' 
                                ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500' 
                                : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                            }`}>
                              <span className="font-semibold mr-2">B)</span>
                              <span className={answerKey === 'b' ? 'font-medium' : ''}>
                                {item.answer_B}
                              </span>
                            </div>
                            <div className={`p-3 rounded-lg transition-colors ${
                              answerKey === 'c' 
                                ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500' 
                                : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                            }`}>
                              <span className="font-semibold mr-2">C)</span>
                              <span className={answerKey === 'c' ? 'font-medium' : ''}>
                                {item.answer_C}
                              </span>
                            </div>
                            <div className={`p-3 rounded-lg transition-colors ${
                              answerKey === 'd' 
                                ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500' 
                                : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                            }`}>
                              <span className="font-semibold mr-2">D)</span>
                              <span className={answerKey === 'd' ? 'font-medium' : ''}>
                                {item.answer_D}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Modal footer */}
          <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-700 px-2">
            {viewingTest && (
              <Button
                variant="outline"
                onClick={() => exportToPDF(viewingTest)}
              >
                📄 PDF yuklab olish
              </Button>
            )}
            <Button onClick={closeViewModal}>
              Yopish
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
