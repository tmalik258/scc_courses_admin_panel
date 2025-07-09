export interface Instructor {
  id: string
  profile?: string
  name: string
  role: string
  company: string
}

export interface InstructorDetails extends Instructor {
  courses: Array<{
    id: string
    title: string
    category: string
    totalLessons: number
  }>
}
