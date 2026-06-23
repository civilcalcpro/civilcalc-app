export const metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for CivilCalc Pro - Learn how we collect, use, and protect your information.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>

        <p className="text-slate-400 mb-10">
          Last Updated: {new Date().toLocaleDateString('en-IN')}
        </p>

        <div className="space-y-8 text-slate-300 leading-7">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Introduction
            </h2>
            <p>
              CivilCalc Pro respects your privacy and is committed to protecting
              your personal information. This Privacy Policy explains how we
              collect, use, and safeguard information when you use our website
              and engineering tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Information We Collect
            </h2>
            <p>
              We may collect information that you voluntarily provide when
              creating an account, contacting us, or using certain features of
              CivilCalc Pro.
            </p>

            <ul className="list-disc ml-6 mt-3 space-y-2">
              <li>Name and email address</li>
              <li>Account information</li>
              <li>Calculation history</li>
              <li>Website usage analytics</li>
              <li>Technical device information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              How We Use Information
            </h2>

            <ul className="list-disc ml-6 space-y-2">
              <li>Provide engineering calculation tools</li>
              <li>Improve website performance and user experience</li>
              <li>Respond to support requests</li>
              <li>Maintain platform security</li>
              <li>Analyze website traffic and usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Cookies & Analytics
            </h2>

            <p>
              CivilCalc Pro uses cookies, Google Analytics, Microsoft Clarity,
              and similar technologies to understand website performance and
              improve user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Data Security
            </h2>

            <p>
              We implement reasonable security measures to protect your
              information. However, no method of internet transmission is 100%
              secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Third-Party Services
            </h2>

            <p>
              CivilCalc Pro may use trusted third-party services such as Google
              Analytics, Vercel Analytics, Microsoft Clarity, and authentication
              providers to operate the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Your Rights
            </h2>

            <p>
              You may request access, correction, or deletion of your personal
              information by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              Contact Us
            </h2>

            <p>
              If you have questions regarding this Privacy Policy, please
              contact:
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
              <p>Email: civilcal592005@gmail.com.com</p>
              <p>Website: https://civilcalcpro.in</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
