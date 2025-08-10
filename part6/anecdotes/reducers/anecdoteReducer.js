import { createSlice } from '@reduxjs/toolkit'

const initialAnecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
  'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  'The only way to go fast, is to go well.'
].map((content, index) => ({
  content,
  votes: 0,
  id: index.toString()
}))

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: {
    list: initialAnecdotes,
    selected: 0
  },
  reducers: {
    vote(state) {
      state.list[state.selected].votes += 1
    },
    next(state) {
      const randomIndex = Math.floor(Math.random() * state.list.length)
      state.selected = randomIndex
    }
  }
})

export const { vote, next } = anecdoteSlice.actions
export default anecdoteSlice.reducer
