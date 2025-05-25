"use client";

import { FC, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputAkai from "./ui/InputAkai";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";
import CustomBtn from "./ui/CustomBtn";
import {
  CustomSelect,
  CustomSelectContent,
  CustomSelectGroup,
  CustomSelectItem,
  CustomSelectTrigger,
  CustomSelectValue,
} from "./ui/CustomSelect";
import { z } from "zod";
import { getTouchIndividualForm } from "@/lib/validations/get-touch-individual";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const data = ["AI", "Blockchain", "Cloud", "Data Science", "Cybersecurity"];

type FormData = z.infer<typeof getTouchIndividualForm>;

const GetInTouchIndividual: FC = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // State for handling Datasets of Interest
  const [selectedInterest, setSelectedInterest] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  // State for Project Budget
  const [budget, setBudget] = useState<string>("");

  // State for Country Selection
  const [country, setCountry] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(getTouchIndividualForm),
    mode: "all",
  });

  // Set default values for the form after initialization
  useEffect(() => {
    setValue("interests", []);
    setValue("budget", "");
    setValue("country", "");
    setValue("isAgreed", false);
  }, [setValue]);

  const toggleInterest = (e: React.MouseEvent, interest: string) => {
    e.preventDefault(); // Prevent the button from submitting the form

    if (selectedInterest.includes(interest)) {
      const newInterests = selectedInterest.filter((item) => item !== interest);
      setSelectedInterest(newInterests);
      setValue("interests", newInterests);
    } else {
      const newInterests = [...selectedInterest, interest];
      setSelectedInterest(newInterests);
      setValue("interests", newInterests);
    }
  };

  const handleBudgetChange = (value: string) => {
    setBudget(value);
    setValue("budget", value);
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setValue("country", value);
  };

  const handleCheckboxChange = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the checkbox from submitting the form
    const newValue = !isChecked;
    setIsChecked(newValue);
    setValue("isAgreed", newValue);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      console.log("Form submitted:", data);

      // Show success message
      toast.success("Form submitted successfully!");

      // Redirect to label-data projects page
      setTimeout(() => {
        window.location.href = "/label-data/projects"; // Changed from /label-data to /label-data/projects
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  // Calculate if form is valid
  const isFormValid =
    !!watch("firstName") &&
    !!watch("lastName") &&
    !!watch("workEmail") &&
    !!watch("contact") &&
    selectedInterest.length > 0 &&
    !!budget &&
    !!country &&
    isChecked;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center gap-4 my-5 pb-10"
    >
      <div className="w-[50%]">
        <div className="w-full grid grid-cols-2 gap-6">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <InputAkai
                title="First Name"
                htmlFor="FirstName"
                error={errors.firstName?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <InputAkai
                title="Last Name"
                htmlFor="LastName"
                error={errors.lastName?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="workEmail"
            control={control}
            render={({ field }) => (
              <InputAkai
                title="Work Email"
                htmlFor="WorkEmail"
                error={errors.workEmail?.message}
                inputType="email"
                {...field}
              />
            )}
          />
          <Controller
            name="contact"
            control={control}
            render={({ field }) => (
              <InputAkai
                title="Contact Number"
                htmlFor="mobile-no"
                error={errors.contact?.message}
                inputType="number"
                {...field}
              />
            )}
          />
        </div>

        <p>Select Datasets of Interest</p>
        <div className="flex justify-center w-full gap-3 flex-wrap px-2 py-4">
          {data.map((d) => (
            <CustomBtn
              key={d}
              onClick={(e) => toggleInterest(e, d)}
              variant={selectedInterest.includes(d) ? "smallActive" : "small"}
              type="button" // Explicitly set button type to prevent form submission
            >
              {d}
            </CustomBtn>
          ))}
        </div>
        {selectedInterest.length === 0 && (
          <p className="text-red-500 text-sm">
            Please select at least one interest
          </p>
        )}

        <div className="mt-5">
          <p>Project Budget</p>
          <Select value={budget} onValueChange={handleBudgetChange}>
            <SelectTrigger className="w-[380px] rounded-md">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="font-albert-sans rounded-md">
              <SelectItem value="under50">Under 50K</SelectItem>
              <SelectItem value="50-100">50K-100K</SelectItem>
              <SelectItem value="more100">More Than 100K</SelectItem>
            </SelectContent>
          </Select>
          {!budget && (
            <p className="text-red-500 text-sm">Please select a budget</p>
          )}
        </div>

        <div className="mt-5">
          <p>Select your Country</p>
          <CustomSelect value={country} onValueChange={handleCountryChange}>
            <CustomSelectTrigger className="w-[380px]">
              <CustomSelectValue placeholder="Select Country" />
            </CustomSelectTrigger>
            <CustomSelectContent>
              <CustomSelectGroup>
                <CustomSelectItem value="India">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 480"
                      width="30"
                      height="20"
                    >
                      <rect width="640" height="160" fill="#ff9933" />
                      <rect y="160" width="640" height="160" fill="#ffffff" />
                      <rect y="320" width="640" height="160" fill="#138808" />
                    </svg>
                    India
                  </div>
                </CustomSelectItem>
                <CustomSelectItem value="UK">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 480"
                      width="30"
                      height="20"
                    >
                      <rect width="640" height="480" fill="#00247d" />
                      <rect width="640" height="160" y="160" fill="#fff" />
                      <rect width="640" height="160" y="320" fill="#cf142b" />
                    </svg>
                    United Kingdom
                  </div>
                </CustomSelectItem>
                <CustomSelectItem value="Russia">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 480"
                      width="30"
                      height="20"
                    >
                      <rect width="640" height="480" fill="#d52b1e" />
                      <rect y="160" width="640" height="160" fill="#fff" />
                      <rect y="320" width="640" height="160" fill="#6cace4" />
                    </svg>
                    Russia
                  </div>
                </CustomSelectItem>
              </CustomSelectGroup>
            </CustomSelectContent>
          </CustomSelect>
          {!country && (
            <p className="text-red-500 text-sm">Please select a country</p>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer w-fit">
        <Checkbox
          checked={isChecked}
          onClick={handleCheckboxChange}
          type="button" // Explicitly set button type to prevent form submission
        />
        <p>Agree to terms and conditions</p>
      </label>
      {!isChecked && (
        <p className="text-red-500 text-sm">
          You must agree to the terms and conditions
        </p>
      )}

      <button
        type="submit"
        className={`mt-5 px-3 py-2 text-white font-albert-sans text-lg font-semibold w-32 rounded-lg 
        ${
          isFormValid
            ? "bg-bigRed hover:opacity-90"
            : "bg-gray-400 cursor-not-allowed"
        } 
        ${submitting ? "opacity-70 cursor-wait" : ""}`}
        disabled={!isFormValid || submitting}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default GetInTouchIndividual;
