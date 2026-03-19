import React from 'react';

export const PrivacyPolicy = () => {
  return (
    <div className="w-full h-full bg-slate-900 text-white p-6 overflow-y-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <p className="mb-4 text-slate-300">Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2 className="text-2xl font-semibold mt-6 mb-3 text-indigo-300">1. Information We Collect</h2>
      <p className="mb-4 text-slate-300">
        When you use our application and log in via Google, we collect basic profile information provided by Google, such as your email address and name. We also collect gameplay data (scores, levels completed, coins) to save your progress.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-indigo-300">2. How We Use Your Information</h2>
      <p className="mb-4 text-slate-300">
        We use your information solely to provide and improve the game experience, including saving your progress across devices and maintaining leaderboards.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-indigo-300">3. Data Storage and Security</h2>
      <p className="mb-4 text-slate-300">
        Your data is securely stored using Google Firebase. We implement industry-standard security measures to protect your personal information from unauthorized access.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-indigo-300">4. Third-Party Services</h2>
      <p className="mb-4 text-slate-300">
        We use Google Authentication for login and Firebase for database storage. These services have their own privacy policies regarding how they handle your data.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3 text-indigo-300">5. Contact Us</h2>
      <p className="mb-4 text-slate-300">
        If you have any questions about this Privacy Policy, please contact us.
      </p>

      <button 
        onClick={() => window.location.href = '/'}
        className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg w-full"
      >
        Back to Game
      </button>
    </div>
  );
};
