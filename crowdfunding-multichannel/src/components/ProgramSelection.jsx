import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgramCard from "./ProgramCard";
import { useEthers } from "@usedapp/core";

const programs = [
  {
    id: 1,
    title: "Mandiri",
    img: "public/icons-restaurant.png",
    description:
      "The Economic Program aims to improve the welfare of beneficiaries to achieve greater independence through increased income and financial stability.",
  },
  {
    id: 2,
    title: "Cendekia",
    img: "public/icons-education.png",
    description:
      "The Scholarship Program aims to produce experts, intellectuals, and professionals through coaching that focuses on career development.",
  },
  {
    id: 3,
    title: "Sejahtera",
    img: "public/icons-organ-transplantation.png",
    description:
      "The Health Program aims to create a healthier generation, both physically and mentally.",
  },
  {
    id: 4,
    title: "Lestari",
    img: "public/icons-recycle.png",
    description:
      "This program aims to increase public awareness in preserving the environment.",
  },
  {
    id: 5,
    title: "Harmoni",
    img: "public/icons-get-along.png",
    description:
      "The program focuses on spreading the values of peace in Islam.",
  },
  {
    id: 6,
    title: "Peduli",
    img: "public/icons-helping-hand.png",
    description:
      "Humanitarian programs that focus on emergency relief, disaster management, and support for vulnerable groups and crisis-affected communities.",
  }  
];

const ProgramSelection = () => {
  const { account, activateBrowserWallet } = useEthers();

  const navigate = useNavigate();
  const [selectedPrograms, setSelectedPrograms] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedPrograms")) || [];
  });

  useEffect(() => {
    localStorage.setItem("selectedPrograms", JSON.stringify(selectedPrograms));
  }, [selectedPrograms]);

  const toggleProgram = (program) => {
    setSelectedPrograms((prev) => {
      const isExist = prev.some((p) => p.id === program.id);
      
      if (isExist) {
        return prev.filter((p) => p.id !== program.id);
      } else {
        return [...prev, program];
      }
    });
  };

  const handleSubmit = () => {
    localStorage.setItem("selectedPrograms", JSON.stringify(selectedPrograms));
    navigate("/transfer");
  };

  return (
    <div>
      <div className="info-wrapper text-center">
        <div className="info-wrapper-item flex flex-col items-center">
          <img
            src="public/donation.jpg"
            alt=""
            className="w-30 h-30"
          />
          <span className="mt-2 font-semibold">Infaq/Sadaqah</span>
        </div>
        <span className="app-description block mt-2 text-gray-700">
        Let's share kindness and purify our hearts through Infaq/Sedekah at Babagi Yuk, and choose the program you want to support, with the option to support more than one program as desired.
        </span>
      </div>
      {/* <span className="app-list-description block mt-4 text-gray-600">
      Silakan pilih program yang ingin Anda dukung. Anda dapat memilih lebih dari satu program sesuai keinginan. */}
      {/* (
        <u>
          <strong>
            <a
              href=""
              target="_blank"
              className="text-blue-600 underline"
            >
              Baca lebih lanjut tentang Program Babagi Yuk
            </a>
          </strong>
        </u>
        ): */}
      {/* </span> */}

      <div className="program-wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-4">
        {programs.map((program, index) => (
          <ProgramCard
            key={program.id}
            title={program.title}
            image={program.img}
            description={program.description}
            isSelected={selectedPrograms.some((p) => p.id === program.id)}
            onToggle={() => toggleProgram(program)}
          />
        ))}
      </div>
        
      {account ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedPrograms.length === 0}
            className={`btn-primary w-full mt-6 py-2 text-white rounded-lg ${
              selectedPrograms.length === 0 ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
          Continue
        </button>
      ) : (
          <button
            onClick={() => activateBrowserWallet()}
            className="btn-primary w-full mt-6 py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700"
            >
            Connect
          </button>
      )}
      

    </div>
  );
};

export default ProgramSelection;
