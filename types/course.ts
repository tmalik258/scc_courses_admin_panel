export interface Course {
  id: string
  name: string
  category: string
  instructor: string
  sales: number
  price: number
  lessons: number
}

export interface CourseFormData {
  title: string
  description: string
  category: string
  price: string
  instructor: string
  thumbnail: File | null
  modules: Array<{
    title: string
    sections: Array<{
      name: string
      reading: string
      videoUrl: string
    }>
  }>
  resources: Array<{
    title: string
    url: string
  }>
}