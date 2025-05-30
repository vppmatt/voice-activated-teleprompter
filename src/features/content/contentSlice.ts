import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../app/createAppSlice"
import { type TextElement, tokenize } from "../../lib/word-tokenizer"
import { toggleEdit } from "../navbar/navbarSlice"
import { createAsyncThunk } from "@reduxjs/toolkit"

export interface ContentSliceState {
  rawText: string
  textElements: TextElement[]
  finalTranscriptIndex: number
  interimTranscriptIndex: number
}

const initialText = 'Click on the "Edit" button and paste your content here...'

const initialState: ContentSliceState = {
  rawText: initialText,
  textElements: tokenize(initialText),
  finalTranscriptIndex: -1,
  interimTranscriptIndex: -1,
}

// Add async thunk for loading content
export const loadContent = createAsyncThunk(
  "content/loadContent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://svr01:3334/store")
      const data = await response.json()
      if (typeof data?.data === "string") {
        return data.data
      } else {
        return rejectWithValue("Invalid data format")
      }
    } catch (error : any) {
      return rejectWithValue(error.toString())
    }
  }
)

export const contentSlice = createAppSlice({
  name: "content",

  // `createSlice` will infer the state type from the `initialState` argument
  initialState,

  // The `reducers` field lets us define reducers and generate associated actions
  reducers: create => ({
    setContent: create.reducer((state, action: PayloadAction<string>) => {
      state.rawText = action.payload
      state.finalTranscriptIndex = -1
      state.interimTranscriptIndex = -1
    }),

    saveContent: create.reducer((state) => {
      fetch("http://svr01:3334/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({data : state.rawText }),
      }).catch((error) => {
        console.error("Failed to save content:", error);
      }).then((response) => {
        console.log("Content saved successfully:", response);
      });
    }),

    setFinalTranscriptIndex: create.reducer(
      (state, action: PayloadAction<number>) => {
        state.finalTranscriptIndex = action.payload
      },
    ),

    setInterimTranscriptIndex: create.reducer(
      (state, action: PayloadAction<number>) => {
        state.interimTranscriptIndex = action.payload
      },
    ),

    resetTranscriptionIndices: create.reducer(state => {
      state.finalTranscriptIndex = -1
      state.interimTranscriptIndex = -1
    }),
  }),

  extraReducers: builder => {
    builder.addCase(toggleEdit, state => {
      state.textElements = tokenize(state.rawText)
    })
    // Handle fulfilled state of loadContent thunk
    builder.addCase(loadContent.fulfilled, (state, action) => {
      state.rawText = action.payload
      state.textElements = tokenize(action.payload)
      state.finalTranscriptIndex = -1
      state.interimTranscriptIndex = -1
      console.log("content loaded successfully:", action.payload)
    })
    builder.addCase(loadContent.rejected, (state, action) => {
      console.error("Failed to load content:", action.payload)
    })
  },

  selectors: {
    selectRawText: state => state.rawText,
    selectTextElements: state => state.textElements,
    selectFinalTranscriptIndex: state => state.finalTranscriptIndex,
    selectInterimTranscriptIndex: state => state.interimTranscriptIndex,
  },
})

export const {
  setContent,
  setFinalTranscriptIndex,
  setInterimTranscriptIndex,
  resetTranscriptionIndices,
  saveContent
} = contentSlice.actions

export const {
  selectRawText,
  selectTextElements,
  selectFinalTranscriptIndex,
  selectInterimTranscriptIndex,
} = contentSlice.selectors
