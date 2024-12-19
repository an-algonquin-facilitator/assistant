import type { News as BNews } from "../api/news";
import type { Quiz as BQuiz } from "../api/quiz";
import type { Folder } from "../api/folder";
import type {
  AssignmentTemplate,
  QuizTemplate as TQuiz,
  NewsTemplate as TNews,
} from "../store/template";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { CourseTemplate } from "./template";
import type { Response } from "../api/utils";
import type { SelectedCourse } from "./course";
import { useAppSelector } from "./hooks";
import { isValidTemplate, validateTemplate } from "./templateValidation";

export interface ValidatedTemplate {
  validAssignments: AssignmentTemplate[];
  missingBrightspaceAssignments: Folder[];
  missingTemplateAssignments: AssignmentTemplate[];

  validQuizzes: TQuiz[];
  missingBrightspaceQuizzes: BQuiz[];
  missingTemplateQuizzes: TQuiz[];

  validNews: TNews[];
  missingBrightspaceNews: BNews[];
  missingTemplateNews: TNews[];
}

export interface TemplateFile {
  filename: string;
  template: CourseTemplate;
}

interface TemplateStepState {
  file?: TemplateFile;
  course: Response<SelectedCourse>;
  validatedTemplate: ValidatedTemplate;
}

const initialState: TemplateStepState = {
  course: { loading: false },
  validatedTemplate: {
    validAssignments: [],
    missingBrightspaceAssignments: [],
    missingTemplateAssignments: [],
    validQuizzes: [],
    missingBrightspaceQuizzes: [],
    missingTemplateQuizzes: [],
    validNews: [],
    missingBrightspaceNews: [],
    missingTemplateNews: [],
  },
};

const templateStepSlice = createSlice({
  name: "templateStep",
  initialState,
  reducers: {
    setTemplateFile(state, action: PayloadAction<TemplateFile | undefined>) {
      state.file = action.payload;
    },
    setSelectedCourse(state, action: PayloadAction<Response<SelectedCourse>>) {
      state.course = action.payload;
      if (state.course.data)
        state.validatedTemplate = validateTemplate(
          state.file,
          state.course.data,
        );
    },
    resetTemplateStep(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setTemplateFile, setSelectedCourse, resetTemplateStep } =
  templateStepSlice.actions;

export const templateStepReducer = templateStepSlice.reducer;

export const useTemplateFile = (): TemplateFile | undefined =>
  useAppSelector((s) => s.templateStep.file);

export const useSelectedCourse = (): Response<SelectedCourse> =>
  useAppSelector((s) => s.templateStep.course);

export const useTemplateFileName = (): string | undefined =>
  useAppSelector((s) => s.templateStep.file?.filename);

export const useValidatedTemplate = (): ValidatedTemplate =>
  useAppSelector((s) => s.templateStep.validatedTemplate);

export const useIsTemplateValid = (): boolean =>
  useAppSelector((s) => isValidTemplate(s.templateStep.validatedTemplate));
