"use client";

import React from 'react';
import { Button } from './ui/button';
import { Workflow } from 'lucide-react';

const FeaturedWorkflows = () => {
  const workflows = [
    { id: 1, title: 'Automated Social Media Posting', description: 'Workflow untuk otomatis posting ke semua akun media sosial Anda.' },
    { id: 2, title: 'E-commerce Order Management', description: 'Streamline proses pengelolaan pesanan e-commerce Anda.' },
    { id: 3, title: 'WhatsApp Business Integration', description: 'Integrasikan WhatsApp Business dengan sistem CRM dan database.' },
    { id: 4, title: 'Data Sync & Backup', description: 'Sinkronisasi dan backup data otomatis antar platform.' },
  ];

  return (
    <section className="py-16 animated-gradient-workflows">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center text-white mb-12">Workflow Populer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700
                         hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <div className="flex items-center mb-4">
                <Workflow className="h-8 w-8 text-blue-600 mr-4" />
                <h3 className="text-2xl font-bold text-white">{workflow.title}</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">{workflow.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" className="px-8 py-3 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300">
            <a href="/workflows">Lihat Semua Workflow</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorkflows;
