import React from "react";
import PublicLayout from "../../components/PublicLayout";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();

  return (
      <div className="min-h-screen flex flex-col">

        {/* HERO SECTION */}
        <section className="text-center px-4 sm:px-6 py-12 sm:py-16 bg-accent text-white rounded-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            Manage Your Equb Easily
          </h1>

          <p className="text-base sm:text-lg md:text-xl mb-6 opacity-90 max-w-2xl mx-auto">
            Join groups, contribute, and receive your payout in a transparent and secure way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/login')} className="bg-white cursor-pointer dark:bg-gray-900 text-accent dark:text-white px-6 py-3 rounded-xl font-semibold w-full sm:w-auto">
              Get Started
            </button>
            
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-4 sm:px-6 py-12">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">
            How It Works
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 text-center max-w-6xl mx-auto">
            <div className="card">
              <h3 className="font-semibold text-lg mb-2">1. Join or Create</h3>
              <p>Start a group or join an existing Equb.</p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-lg mb-2">2. Contribute</h3>
              <p>Each member contributes regularly.</p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-lg mb-2">3. Get Paid</h3>
              <p>Members receive payouts in rotation.</p>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="px-4 sm:px-6 py-12 bg-[var(--neutral-100)] dark:bg-[var(--card-bg)]">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-8">
            Features
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 max-w-6xl mx-auto">
            <div className="card">
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p>All transactions are protected and tracked.</p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Transparency</h3>
              <p>See all contributions and payouts clearly.</p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Group Management</h3>
              <p>Create and manage your own Equb groups.</p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Easy Access</h3>
              <p>Access your Equb anytime, anywhere.</p>
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="px-4 sm:px-6 py-12 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Trusted & Secure
          </h2>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-[var(--muted)]">
            Your data and money are handled with care. We prioritize transparency and trust so you can save confidently.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center px-4 sm:px-6 py-12 bg-accent text-white rounded-3xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Start Your Equb Today
          </h2>

          <button onClick={() => navigate('/register')} className="bg-white dark:bg-gray-900 cursor-pointer text-accent dark:text-white px-6 py-3 rounded-xl font-semibold w-full sm:w-auto ">
            Create Account
          </button>
        </section>

      </div>
  );
};

export default Home;