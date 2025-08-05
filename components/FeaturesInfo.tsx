import React from 'react';
import { FEATURES } from '../constants';

const FeatureItem: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-4 rounded-lg text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <div className="text-2xl mb-2">{icon}</div>
        <strong className="text-gray-800">{title}</strong>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

const FeaturesInfo: React.FC = () => {
    return (
        <div className="mt-8 p-5 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl border-l-4 border-[#667eea]">
            <h4 className="text-[#667eea] mb-4 text-lg font-bold">🎯 Ne yapabilirim?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {FEATURES.map((feature, index) => {
                    return <FeatureItem key={index} {...feature} />
                })}
            </div>
        </div>
    );
};

export default FeaturesInfo;
