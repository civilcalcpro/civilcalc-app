export const metadata = {
  title: 'Contact Us',
  description:
    'Contact CivilCalc Pro for support, feedback, feature requests, partnerships, and business inquiries.',
}

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>

        <p className="text-slate-400 mb-10">
          Have questions, feedback, feature suggestions, or partnership opportunities?
          We'd love to hear from you.
        </p>

        <div className="grid gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-3">General Support</h2>
            <p className="text-slate-300">
              Need help using CivilCalc Pro or have a technical issue?
            </p>

            <div className="mt-4">
              <p className="text-slate-400">Email</p>
              <a
                href="mailto:civilcalc592005@gmail.com"
                className="text-orange-400 hover:text-orange-300"
              >
                sujalkalal227@gmail.com
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-3">Feature Requests</h2>

            <p className="text-slate-300">
              Have an idea for a new calculator, engineering tool, or platform
              improvement? Send us your suggestion.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-3">Bug Reports</h2>

            <p className="text-slate-300">
              Found an issue or incorrect calculation? Please report it with
              detailed information so we can investigate and improve the platform.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-3">Business & Partnerships</h2>

            <p className="text-slate-300">
              Interested in collaboration, sponsorships, partnerships, or
              business opportunities? Contact us directly.
            </p>
          </div>

          <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-6">
            <h2 className="text-xl font-semibold mb-3 text-orange-400">
              About CivilCalc Pro
            </h2>

            <p className="text-slate-300">
              CivilCalc Pro is an AI-powered civil engineering platform designed
              for engineers, contractors, students, and construction professionals.
              Our mission is to simplify engineering calculations, estimation,
              structural design workflows, and project planning.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
