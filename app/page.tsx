import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Users, Award, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="size-4" />
              <span>Welcome to the Future of Learning</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Master New Skills with
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Course Master
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners worldwide. Access expert-led courses, track your progress,
              and achieve your learning goals with our comprehensive platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="gap-2 group">
                  Browse Courses
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Course Master?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="size-6 text-primary" />
                </div>
                <CardTitle>Expert Content</CardTitle>
                <CardDescription>
                  Learn from industry professionals with real-world experience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="size-6 text-primary" />
                </div>
                <CardTitle>Active Community</CardTitle>
                <CardDescription>
                  Join a vibrant community of learners and mentors
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="size-6 text-primary" />
                </div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor your learning journey with detailed analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="size-6 text-primary" />
                </div>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>
                  Earn recognized certificates upon course completion
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join Course Master today and unlock your potential
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Create Free Account
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
