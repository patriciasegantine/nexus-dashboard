import { Task } from "@/types/task"

export interface BoardColumn {
  id: string
  title: string
  tasks: Task[]
}

export interface Board {
  columns: {
    [key: string]: BoardColumn
  }
}
