// // types.ts yoki shu fayl ichida yozishingiz mumkin
// export interface Answer {
//   text: string;
//   correct: boolean;
// }

// export interface Question {
//   number?: number;
//   question: string;
//   answers: Record<string, string>;
//   correctAnswer: string;
//   _tempAnswers?: Answer[];
// }

// export interface ParsedResult {
//   title: string | null;
//   questions: Question[];
// }

// // parseQuestions.ts
// export function parseQuestions(text: string): ParsedResult {
//   const lines: string[] = text
//     .split("\n")
//     .map((line) => line.trim())
//     .filter(Boolean);

//   let title: string | null = null;
//   const questions: Question[] = [];
//   let currentQuestion: Question | null = null;
//   let answerCount = 0;
//   let isFirstLine = true;
//   let isCollectingAnswers = false;

//   for (const line of lines) {
//     if (isFirstLine) {
//       title = line;
//       isFirstLine = false;
//       continue;
//     }

//     // New question detection
//     if (
//       !isCollectingAnswers &&
//       line.length > 0 &&
//       !line.startsWith("+") &&
//       !line.startsWith("-")
//     ) {
//       if (currentQuestion) {
//         questions.push(currentQuestion);
//       }
//       currentQuestion = {
//         question: line,
//         answers: {},
//         correctAnswer: "",
//         _tempAnswers: [],
//       };
//       answerCount = 0;
//       isCollectingAnswers = true;
//     } else if (isCollectingAnswers && currentQuestion) {
//       if (line.startsWith("+")) {
//         // Correct answer
//         currentQuestion._tempAnswers?.push({
//           text: line.slice(1).trim(),
//           correct: true,
//         });
//         answerCount++;
//       } else if (line.startsWith("-") || line.length > 0) {
//         // Incorrect answer, remove "-" if present
//         currentQuestion._tempAnswers?.push({
//           text: line.replace(/^-/, "").trim(),
//           correct: false,
//         });
//         answerCount++;
//       }

//       if (answerCount === 4) {
//         isCollectingAnswers = false;
//       }
//     }
//   }

//   if (currentQuestion) {
//     questions.push(currentQuestion);
//   }

//   // Assign a, b, c, d to answers
//   const letters = ["a", "b", "c", "d"];
//   questions.forEach((q, index) => {
//     q.number = index + 1;
//     q._tempAnswers?.forEach((ans, idx) => {
//       const key = letters[idx];
//       q.answers[key] = ans.text;
//       if (ans.correct) {
//         q.correctAnswer = key;
//       }
//     });
//     delete q._tempAnswers;
//   });

//   return { title, questions };
// }




// // utils/readDocx.ts
// import PizZip from "pizzip";
// import Docxtemplater from "docxtemplater";

// export async function readDocx(file: File): Promise<string> {
//   const arrayBuffer = await file.arrayBuffer();
//   const zip = new PizZip(arrayBuffer);
//   const doc = new Docxtemplater(zip);
//   return doc.getFullText().replace(/\. /g, ".\n");; // butun matn string sifatida
// }

import * as fs from "fs";
import * as mammoth from "mammoth";

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  number: number;
  text: string;
  options: Option[];
}

export interface ParsedResult {
  title: string;
  questions: Question[];
}

// export async function parseQuestions(text: string): Promise<ParsedResult> {
  
//   const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

//   // 1️⃣ Faylning boshidagi title
//   const title = lines.shift() || "Untitled Quiz";

//   const questions: Question[] = [];
//   let currentQuestion: Question | null = null;

//   for (const line of lines) {
//     // Savolni aniqlash (raqam + nuqta bilan boshlansa)
//     const questionMatch = line.match(/^(\d+)\.\s*(.*)/);
//     if (questionMatch) {
//       if (currentQuestion) {
//         questions.push(currentQuestion);
//       }

//       currentQuestion = {
//         number: parseInt(questionMatch[1], 10),
//         text: questionMatch[2].trim(),
//         options: [],
//       };
//       continue;
//     }

//     // Variantlarni aniqlash
//     if (currentQuestion) {
//       if (line.startsWith("+")) {
//         currentQuestion.options.push({
//           text: line.substring(1).trim(),
//           isCorrect: true,
//         });
//       } else if (line.startsWith("-")) {
//         currentQuestion.options.push({
//           text: line.substring(1).trim(),
//           isCorrect: false,
//         });
//       }
//     }
//   }

//   if (currentQuestion) {
//     questions.push(currentQuestion);
//   }

//   return { title, questions };
// }



export async function parseQuestions(text: string): Promise<ParsedResult> {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  // 1️⃣ Faylning boshidagi title
  let title: string;
  if (/^\d+\./.test(lines[0])) {
    // agar birinchi qatorda raqam bo‘lsa → title yo‘q
    title = "";
  } else {
    title = lines.shift() || "";
  }

  const questions: Question[] = [];
  let currentQuestion: Question | null = null;

  for (const line of lines) {
    // Savolni aniqlash (raqam + nuqta bilan boshlansa)
    const questionMatch = line.match(/^(\d+)\.\s*(.*)/);
    if (questionMatch) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }

      currentQuestion = {
        number: parseInt(questionMatch[1], 10),
        text: questionMatch[2].trim(),
        options: [],
      };
      continue;
    }

    // Variantlarni aniqlash
    if (currentQuestion) {
      if (line.startsWith("+")) {
        currentQuestion.options.push({
          text: line.substring(1).trim(),
          isCorrect: true,
        });
      } else if (line.startsWith("-")) {
        currentQuestion.options.push({
          text: line.substring(1).trim(),
          isCorrect: false,
        });
      }
    }
  }

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  return { title, questions };
}

// === Test ===
// (async () => {
//   const result = await parseQuestions("questions.docx");
//   console.log(JSON.stringify(result, null, 2));
// })();

import { renderAsync } from "docx-preview";



export async function readDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();


  // Document uchun vaqtinchalik container yaratamiz
  const container = document.createElement("div");

  // docx-preview orqali render qilamiz
  await renderAsync(arrayBuffer, container, undefined, {
   inWrapper: false,
    ignoreWidth: true,
    ignoreHeight: true,
    breakPages: false,
    ignoreLastRenderedPageBreak: true,
    experimental: false,
  });
  container.querySelectorAll("style").forEach(el => el.remove());
  console.log(container.innerText);
  
  // Endi container ichidagi textni stringga aylantiramiz
//   return container.innerText
//     .split("\n")
//     .map(line => line.trim())
//     .filter(Boolean)
//     .join("\n");
  return extractTextWithNewlines(container);

//   // Mammoth bilan matnni o‘qiymiz
//   const { value } = await mammoth.extractRawText({ arrayBuffer });

//   // Har paragraf oxiriga new line qo‘shamiz
//   return value
//     .split("\n")
//     .map(line => line.trim())
//     .filter(Boolean)
//     .join("\n");
}










const BLOCKS = new Set(["P","DIV","LI","H1","H2","H3","H4","H5","H6","TR"]);

function extractTextWithNewlines(root: HTMLElement): string {
  const out: string[] = [];

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      out.push((node as Text).data);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as HTMLElement;
    const tag = el.tagName;

    if (tag === "BR") { out.push("\n"); return; }

    // children
    for (const child of Array.from(el.childNodes)) walk(child);

    // table cells -> tab; row -> newline
    if (tag === "TD" || tag === "TH") out.push("\t");
    if (BLOCKS.has(tag)) out.push("\n");
  };

  walk(root);

  // normalize
  return out.join("")
    .replace(/\u00A0/g, " ")    // non-breaking space
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}









// 
export type AnswerLetter = "A" | "B" | "C" | "D" | "E";

export interface CreateTestItemDto {
  question: string;
  number: number;
  testId: number;
  answer: AnswerLetter;
  answer_A: string;
  answer_B: string;
  answer_C: string;
  answer_D?: string;
  answer_E?: string;
}


const letters = ["A", "B", "C", "D", "E"];

export function mapQuestionToDto(question: Question, testId: number): CreateTestItemDto {
  const answers = question.options.reduce((acc, opt, idx) => {
    acc[letters[idx]] = opt.text;
    return acc;
  }, {} as Record<string, string>);

  const correctIndex = question.options.findIndex(opt => opt.isCorrect);
  const correctLetter = letters[correctIndex] as keyof typeof answers;

  return {
    question: question.text,
    number: question.number,
    testId,
    answer: correctLetter as any,
    answer_A: answers.A || "",
    answer_B: answers.B || "",
    answer_C: answers.C || "",
    answer_D: answers.D || "",
    answer_E: answers.E || "",
  };
}
