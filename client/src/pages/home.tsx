import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import HeroBanner from "@/components/home/HeroBanner";
import Features from "@/components/home/Features";
import { FaFutbol, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FaFutbol className="text-primary text-xl mr-2" />
              <span className="font-bold text-xl text-gray-800">Naija<span className="text-primary">Talent</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/features" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                Contact
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <HeroBanner />

        {/* Features Section */}
        <Features />

        {/* Testimonials */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from players, scouts, and academies who have found success on our platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    AO
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Ahmed Okafor</h4>
                    <p className="text-sm text-gray-600">Professional Player</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "This platform helped me get discovered by a top academy in Lagos. The video highlights feature was especially useful in showcasing my skills."
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    IB
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Ibrahim Babangida</h4>
                    <p className="text-sm text-gray-600">Scout, Enyimba FC</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "The search and filtering tools have revolutionized how we find talent. We've discovered several promising players who may have gone unnoticed otherwise."
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    KA
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Kano Pillars Academy</h4>
                    <p className="text-sm text-gray-600">NPFL</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "The trial management system has streamlined our recruitment process. We can easily post opportunities and review applications all in one place."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Elevate Your Football Journey?</h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of Nigerian players, scouts, and academies on our platform today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                <Link href="/register">Get Started Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FaFutbol className="text-white text-xl mr-2" />
                <span className="font-bold text-xl">Naija<span className="text-secondary">Talent</span></span>
              </div>
              <p className="text-gray-400">
                Connecting Nigerian football talent with opportunities worldwide.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaTwitter />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaFacebook />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaInstagram />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaLinkedin />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link href="/security" className="text-gray-400 hover:text-white">Security</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/team" className="text-gray-400 hover:text-white">Team</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
                <li><Link href="/compliance" className="text-gray-400 hover:text-white">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-gray-400 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} NaijaTalent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
