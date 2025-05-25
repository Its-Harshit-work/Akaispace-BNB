import { z } from "zod";

export const getTouchIndividualForm = z.object({
  firstName: z.string().min(2, { message: "Please enter a valid First Name" }),
  lastName: z.string().min(2, { message: "Please enter a valid Last Name" }),
  workEmail: z.string().email({ message: "Please enter a valid email" }),
  contact: z
    .string()
    .length(10, { message: "Please enter a valid contact number" }),
  interests: z
    .array(z.string())
    .min(1, { message: "Please select at least one interest" }),
  budget: z.string().min(1, { message: "Please select a budget" }),
  country: z.string().min(1, { message: "Please select a country" }),
  isAgreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export const getTouchCompanyForm = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(200, "Company name is too long"),
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .max(100, "Job title is too long"),
  workEmail: z
    .string()
    .email("Invalid email format")
    .min(1, "Work email is required")
    .max(100, "Work email is too long"),
  projectBudget: z.string().min(1, "Please select a project budget"),
  datasetsOfInterest: z
    .array(z.string())
    .min(1, "Please select at least one dataset of interest"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});
