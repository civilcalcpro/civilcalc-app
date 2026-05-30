'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Calculator, 
  Ruler, 
  Building2, 
  FileText, 
  Sparkles, 
  Shield, 
  Zap, 
  ArrowRight,
  Check,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Home,
  HardHat,
  Boxes,
  Database,
  Bot,
  Linkedin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/95 backdrop-blur-lg border-b border-slate-800' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                CivilCalc Pro
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-300 hover:text-white transition">Features</Link>
              <Link href="#tools" className="text-slate-300 hover:text-white transition">Tools</Link>
              <Link href="/dashboard" className="text-slate-300 hover:text-white transition">Dashboard</Link>
              <a href="https://www.linkedin.com/in/civilcal-pro-6ba230411" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#70b5f9] transition" title="Follow on LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 pb-4 space-y-4"
            >
              <Link href="#features" className="block text-slate-300 hover:text-white">Features</Link>
              <Link href="#tools" className="block text-slate-300 hover:text-white">Tools</Link>
              <Link href="/dashboard" className="block text-slate-300 hover:text-white">Dashboard</Link>
              <a href="https://www.linkedin.com/in/civilcal-pro-6ba230411" target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-300 hover:text-[#70b5f9]">
                <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
              </a>
              <Link href="/login" className="block text-slate-300 hover:text-white">Login</Link>
              <Link href="/signup">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600">
                  Get Started Free
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-400">AI-Powered Engineering Platform</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                India's Most Advanced{' '}
                <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
                  Civil Engineering
                </span>{' '}
                Platform
              </h1>

              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                Design RCC structures, estimate quantities, generate structural reports, access IS codes, 
                and automate civil engineering workflows — all in one intelligent platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-lg px-8 h-14 w-full sm:w-auto">
                    Get Started — It&apos;s Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#tools">
                  <Button size="lg" variant="outline" className="border-slate-700 bg-slate-900/40 text-white hover:bg-slate-800 hover:text-white text-lg px-8 h-14 w-full sm:w-auto">
                    Explore Calculators
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

             <div className="mt-12 grid grid-cols-3 gap-6">
  <div>
    <div className="text-3xl font-bold text-orange-500">25+</div>
    <div className="text-sm text-slate-400">Calculators</div>
  </div>
  <div>
    <div className="text-3xl font-bold text-orange-500">SFD/BMD</div>
    <div className="text-sm text-slate-400">Structural Analysis</div>
  </div>
  <div>
    <div className="text-3xl font-bold text-orange-500">AI</div>
    <div className="text-sm text-slate-400">Assistant</div>
  </div>
</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Glassmorphism Dashboard Preview */}
                <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">RCC Beam Design</span>
                        <Check className="h-4 w-4 text-green-400" />
                      </div>
                      <div className="text-2xl font-bold">Safe Design</div>
                      <div className="text-xs text-slate-500 mt-1">Moment: 85.6 kNm</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Steel Required</div>
                        <div className="text-lg font-bold text-orange-400">4-20mm Ø</div>
                      </div>
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                        <div className="text-xs text-slate-400 mb-1">Concrete</div>
                        <div className="text-lg font-bold text-blue-400">M25 Grade</div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Analysis Progress</span>
                        <span className="text-xs text-green-400">Complete</span>
                      </div>
                      <div className="mt-2 bg-slate-900 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-500 to-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-4"
                >
                  <Check className="h-6 w-6 text-green-400" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-6 -left-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4"
                >
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need for{' '}
              <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                Engineering Excellence
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Professional-grade tools designed for Indian civil engineers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Calculator,
                title: 'RCC Design Tools',
                description: 'Design slabs, beams, columns with IS 456:2000 compliant calculations',
                color: 'orange'
              },
              {
                icon: Boxes,
                title: 'Quantity Estimation',
                description: 'Accurate material estimation for concrete, steel, brickwork, and more',
                color: 'blue'
              },
              {
                icon: FileText,
                title: 'Instant Reports',
                description: 'Generate professional PDF reports with detailed calculations',
                color: 'green'
              },
              {
                icon: Bot,
                title: 'AI Assistant',
                description: 'Get instant engineering guidance and IS code references',
                color: 'purple'
              },
              {
                icon: Database,
                title: 'IS Code Library',
                description: 'Searchable database of IS 456, IS 875, IS 1893 standards',
                color: 'yellow'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Instant calculations with cloud-based processing',
                color: 'red'
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-slate-800/30 backdrop-blur-xl border-slate-700/50 p-6 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 h-full">
                  <div className={`inline-flex p-3 rounded-lg bg-${feature.color}-500/10 border border-${feature.color}-500/20 mb-4`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Tools Grid */}
      <section id="tools" className="py-20 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Comprehensive{' '}
              <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                Engineering Toolkit
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              From structural design to quantity estimation
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
             { name: 'One-Way Slab', href: '/one-way-slab-calculator', icon: Home },

{ name: 'Two-Way Slab', href: '/two-way-slab-calculator', icon: Home },
{ name: 'Beam Design', href: '/beam-design', icon: Ruler },

{ name: 'Column Design', href: '/column-design', icon: Building2 },

{ name: 'Footing Design', href: '/footing-design', icon: HardHat },

{ name: 'Concrete Volume', href: '/concrete-volume-calculator', icon: Boxes },

{ name: 'Steel Weight', href: '/steel-weight-calculator', icon: BarChart3 },

{ name: 'Brickwork', href: '/brickwork-calculator', icon: Building2 },

{ name: 'Excavation', href: '/excavation-calculator', icon: HardHat },

{ name: 'Plaster Work', href: '/plaster-calculator', icon: Home },

{ name: 'Rate Analysis', href: '/dashboard/calculators/rate-analysis', icon: Calculator },

{ name: 'Unit Converter', href: '/dashboard/calculators/unit-converter', icon: Zap },
            ].map((tool, idx) => (
  <Link href={tool.href} key={idx}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05 }}
      className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/50 transition-all hover:border-orange-500/30 cursor-pointer"
    >
      <tool.icon className="h-5 w-5 text-orange-400 mb-2" />
      <div className="text-sm font-medium">{tool.name}</div>
    </motion.div>
  </Link>
))}
          </div>
        </div>
      </section>

      {/* Pricing Section — Removed. CivilCalc Pro is now 100% free. */}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              Ready to Transform Your Engineering Workflow?
            </h2>
           <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
  RCC design, structural analysis, IS code tools, AI assistant and estimation calculators — free for civil engineers and students.
</p>

<p className="text-orange-100 mb-8">
  Available at: <strong>civilcalcpro.in</strong>
</p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-slate-100 text-lg px-8 h-14">
                Get Started — It&apos;s Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">CivilCalc Pro</span>
              </div>
              <p className="text-slate-400 text-sm">
                India's most advanced AI-powered civil engineering platform
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#tools" className="hover:text-white">Tools</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="#" className="hover:text-white">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white">IS Codes</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
           <div>
  <p>© 2025 CivilCalc Pro. All rights reserved.</p>
  <p className="text-slate-500 text-xs mt-1">
    civilcalcpro.in
  </p>
</div>
            <a
              href="https://www.linkedin.com/in/civilcal-pro-6ba230411"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-800 hover:border-[#0a66c2]/60 hover:bg-[#0a66c2]/10 transition"
            >
              <Linkedin className="h-4 w-4 text-[#70b5f9] group-hover:scale-110 transition" />
              <span className="text-slate-300 group-hover:text-white">Follow on LinkedIn</span>
            </a>
          </div>
                </div>
</footer>
</div>
)
}
