"use client"

import { useState } from "react"
import Link from "next/link"
import { useGetCoursesQuery } from "@/src/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [sort, setSort] = useState("")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetCoursesQuery({
    search,
    category,
    sort,
    page,
    limit: 12,
  })

  const courses = data?.courses || []
  const totalPages = data ? Math.ceil(data.totalCount / 12) : 1

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">CourseMaster</h1>
          <nav className="flex items-center gap-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Courses
            </Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/auth" className="hover:text-primary transition-colors">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto py-12">
        {/* Hero */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold mb-2">Explore Our Courses</h2>
          <p className="text-muted-foreground text-lg">Learn from industry experts and advance your skills</p>
        </section>

        {/* Filters */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Filter Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-input rounded-md bg-background"
            >
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
            </select>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-input rounded-md bg-background"
            >
              <option value="">Sort By</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <Button
              onClick={() => {
                setSearch("")
                setCategory("")
                setSort("")
                setPage(1)
              }}
              variant="outline"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        ) : courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {courses.map((course: any) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={course.imageUrl || "/placeholder.svg?height=160&width=400"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">${course.price}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{course.category}</span>
                    </div>
                    <Link href={`/courses/${course.id}`} className="w-full block">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} variant="outline">
                Previous
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum = Math.max(1, page - 2) + i
                if (pageNum > totalPages) return null
                return (
                  <Button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    variant={page === pageNum ? "default" : "outline"}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              <Button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No courses found</p>
            <Button
              onClick={() => {
                setSearch("")
                setCategory("")
                setSort("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
