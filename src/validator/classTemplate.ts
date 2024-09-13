// export interface DateOffset {
//     weeks?: number;
//     days?: number;
//   }

import type { Template } from "../store/template";
import { extraKeys, hasProperty, isArray, isObject } from "./validate";

//   export interface Assignment {
//     id?: string;
//     name: string;
//     start?: DateOffset;
//     due: DateOffset;
//     end?: DateOffset;
//   }

//   export interface Quiz {
//     id?: string;
//     name: string;
//     start?: DateOffset;
//     due: DateOffset;
//     end?: DateOffset;
//   }

//   export interface News {
//     name: string;
//     content: string;
//     start?: DateOffset;
//     end?: DateOffset;
//   }

//   export interface Template {
//     assignments?: Assignment[];
//     quizzes?: Quiz[];
//     news?: News[];
//   }

export const isTemplate = (
  v: unknown,
): [Template, undefined] | [undefined, string] => {
  if (v == null) {
    return [undefined, "template is null"];
  }
  if (!isObject(v)) {
    return [undefined, "template is not an object"];
  }
  const assignmentsKey: keyof Template = "assignments";
  const quizzesKey: keyof Template = "quizzes";
  const newsKey: keyof Template = "news";
  const templateKeys: (keyof Template)[] = [
    assignmentsKey,
    quizzesKey,
    newsKey,
  ];
  const extra = extraKeys(v, templateKeys);
  if (extra.length > 0) {
    return [undefined, `template has extra keys [${extra.join(", ")}]`];
  }
  if (hasProperty(v, assignmentsKey)) {
    const { assignments } = v;
    if (!isArray(assignments))
      return [undefined, `template.assignments is not an array`];
    // assignments;
  }

  return [v as Template, undefined];
};
