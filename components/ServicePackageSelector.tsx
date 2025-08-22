"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define package types for the service
type ServicePackage = {
  name: string;
  price: number;
  description: string;
  deliveryTime: string;
  features: string[];
};

// Client component for package selection
export default function ServicePackageSelector({ packages }: { packages: ServicePackage[] }) {
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage>(packages[1]); // Default to Standard package

  return (
    <div>
      <div className="flex flex-col space-y-4 mb-6">
        {packages.map((pkg: ServicePackage) => (
          <div 
            key={pkg.name}
            onClick={() => setSelectedPackage(pkg)}
            className={`p-4 rounded-xl border ${selectedPackage.name === pkg.name 
              ? 'border-[#9945FF] bg-[#9945FF]/10' 
              : 'border-gray-800 bg-gray-900/50 hover:bg-gray-900'} 
              cursor-pointer transition-all duration-200`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">{pkg.name}</h3>
                <p className="text-gray-400 text-sm">{pkg.description}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-xl">${pkg.price}</p>
                <p className="text-gray-400 text-xs">{pkg.deliveryTime}</p>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-800">
              <p className="text-gray-400 text-xs mb-2">Package includes:</p>
              <ul className="space-y-1">
                {pkg.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="h-4 w-4 text-[#9945FF] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <Button className="w-full py-6 text-lg bg-gradient-to-r from-[#9945FF] to-[#00a2ff] hover:shadow-lg hover:shadow-[#9945FF]/20">
        Continue with {selectedPackage.name} Package
      </Button>
    </div>
  );
}
