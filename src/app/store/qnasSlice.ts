import type { RootState } from "@/app/store/store";
import type { QnA } from "@/domain/core";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type State = {
  qnas: QnA[];
  editing: QnA | null;
};

const initialState: State = {
  qnas: [],
  editing: null,
};

const compareStrings = (a: string, b: string) => {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export const qnasSlice = createSlice({
  name: "qnas",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<QnA>) => {
      state.qnas.push(action.payload);
    },

    remove: (state, action: PayloadAction<QnA>) => {
      state.editing =
        state.editing?.id === action.payload.id ? null : state.editing;
      state.qnas = state.qnas.filter((qna) => qna.id !== action.payload.id);
    },
    update: (state, action: PayloadAction<QnA>) => {
      state.editing = null;
      state.qnas = state.qnas.map((qna) =>
        qna.id === action.payload.id ? action.payload : qna
      );
    },
    edit: (state, action: PayloadAction<QnA>) => {
      state.editing =
        state.editing?.id === action.payload.id ? null : action.payload;
    },
    sort: (state) => {
      state.qnas.sort((a, b) => compareStrings(a.question, b.question));
    },
    removeAll: (state) => {
      state.qnas = [];
      state.editing = null;
    },
  },
});

export const { add, remove, update, edit, sort, removeAll } = qnasSlice.actions;
export const selectQnAs = (state: RootState) => state.qnas.qnas;
export const selectEditing = (state: RootState) => state.qnas.editing;
export default qnasSlice.reducer;
