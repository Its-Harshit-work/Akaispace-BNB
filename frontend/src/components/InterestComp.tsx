'use client';

import { FC } from 'react';
import CustomBtn from './ui/CustomBtn';

interface InterestCompProps {
  selectedInterest: string[]; // Array of selected interests
  setselectedInterest: (value: string[]) => void; // Function to update selected interests
}

const InterestComp: FC<InterestCompProps> = ({
  selectedInterest,
  setselectedInterest,
}) => {
  const data = ['AI', 'Blockchain', 'Cloud', 'Data Science', 'Cybersecurity'];

  // Function to toggle an interest
  const toggleInterest = (interest: string) => {
    if (selectedInterest.includes(interest)) {
      // Remove the interest if already selected
      setselectedInterest(
        selectedInterest.filter((item) => item !== interest)
      );
    } else {
      // Add the interest if not already selected
      setselectedInterest([...selectedInterest, interest]);
    }
  };

  return (
    <div className="w-full px-2">
      <p className="font-helvetica-medium text-center text-sm my-3">
        Select Datasets of Interest
      </p>
      <div className="flex justify-center gap-3 mx-auto flex-wrap w-full px-2 py-4">
        {data.map((d) => (
          <CustomBtn
            key={d}
            onClick={() => toggleInterest(d)}
            variant={selectedInterest.includes(d) ? 'smallActive' : 'small'}
          >
            {d}
          </CustomBtn>
        ))}
      </div>
    </div>
  );
};

export default InterestComp;
