import React from "react";
import Image from "next/image";
import { Video, ArrowRight } from "lucide-react";
import { Button } from "@/components/atoms";

const TutelaBanner = () => {
  return (
    <div className="w-full bg-[#1C1C1E] border border-gray-800 rounded-lg overflow-hidden mb-6">
      <div className="flex flex-col md:flex-row items-center h-full">
        {/* Image Section */}
        <div className="relative w-full md:w-1/3 h-48 md:h-64 transform md:-skew-x-12 md:-ml-8 overflow-hidden bg-purple-900/50">
          <div className="absolute inset-0 md:skew-x-12">
            <Image
              width={500} // Reasonable width for 1/3 of container
              height={256}
              src="/device.png"
              alt="IoT Monitoring Device"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 md:p-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              TUTELA
              <span className="ml-2 text-sm font-normal text-purple-400">
                Infrared Sensor
              </span>
            </h2>
            <p className="text-gray-400 text-sm">
              Advanced monitoring system for real-time pig health tracking
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-4">
              <Button
                className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                onClick={() =>
                  window.open("https://vimeo.com/1040586569", "_blank")
                }
              >
                <Video className="w-4 h-4" />
                Watch Demo
                <ArrowRight className="w-4 h-4" />
              </Button>
              <span className="text-purple-400 text-sm italic">
                Pre-order coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutelaBanner;
