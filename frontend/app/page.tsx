"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Waves, AlertCircle, Wind, ArrowRight, Shield, Zap, Globe } from "lucide-react"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Waves className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">OceanGuard</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition">
              About
            </a>
            <Link href="/auth/signin">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-accent hover:bg-accent/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/20 blur-3xl rounded-full opacity-50 animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/20 blur-3xl rounded-full opacity-50 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-accent/20 border border-accent/50 rounded-full text-sm font-medium text-accent">
                Real-time Marine Monitoring
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-balance">
                Protect Our{" "}
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Oceans</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
                AI-powered marine ecosystem monitoring system. Detect oil spills and debris in real-time and alert
                authorities instantly.
              </p>
            </div>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-accent hover:bg-accent/90 gap-2">
                  Start Monitoring <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-border hover:bg-card bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 blur-3xl rounded-full"></div>
            <div className="relative bg-card border border-border/50 rounded-2xl p-8 backdrop-blur-sm">
              <img
                src="/ocean-monitoring-dashboard-interface-with-marine-d.jpg"
                alt="OceanGuard Dashboard"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Powerful Detection Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time monitoring powered by advanced AI and machine learning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border/50 rounded-xl p-8 hover:border-accent/50 transition space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Oil Spill Detection</h3>
              <p className="text-muted-foreground">
                Instantly detect and classify oil spills from satellite and UAV imagery with AI-powered analysis
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border/50 rounded-xl p-8 hover:border-accent/50 transition space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Debris Tracking</h3>
              <p className="text-muted-foreground">
                Identify and track floating debris and plastic waste across marine environments
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border/50 rounded-xl p-8 hover:border-accent/50 transition space-y-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Wind className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Wind Analytics</h3>
              <p className="text-muted-foreground">
                Predict waste movement and accumulation using wind speed data and ocean currents
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card border border-border/50 rounded-xl p-8 hover:border-accent/50 transition space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Authority Alerts</h3>
              <p className="text-muted-foreground">
                Automatic notifications to nearby authorities for rapid response and intervention
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card border border-border/50 rounded-xl p-8 hover:border-accent/50 transition space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Real-time Monitoring</h3>
              <p className="text-muted-foreground">
                Continuous 24/7 marine ecosystem monitoring across multiple regions
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card border border-border/50 rounded-xl p-8 hover:border-accent/50 transition space-y-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Waves className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Wildlife Protection</h3>
              <p className="text-muted-foreground">Analyze acoustic patterns to assess threats to marine wildlife</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/30 rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Protect Marine Ecosystems?</h2>
          <p className="text-lg text-muted-foreground">
            Join authorities and environmental organizations in monitoring and protecting our oceans
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-accent hover:bg-accent/90">
              Start Your Dashboard Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 OceanGuard. Protecting marine ecosystems one alert at a time.</p>
        </div>
      </footer>
    </div>
  )
}
