'use client'

import { FC, useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import InputAkai from './ui/InputAkai'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from './ui/checkbox'
import CustomBtn from './ui/CustomBtn'
import { z } from 'zod'

// Define the validation schema
const getTouchCompanyForm = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    companyName: z.string().min(1, "Company name is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    workEmail: z.string().email("Invalid email address"),
    projectBudget: z.string().min(1, "Project budget is required"),
    projectDescription: z.string().min(1, "Project description is required"),
});

type FormData = z.infer<typeof getTouchCompanyForm>;

const projectBudgets = ['Under 50K', '50K-100K', 'More Than 100K']

const helpOptionsList = [
    'Data Annotation Services',
    'Machine Learning Development',
    'AI Model Training',
    'Quality Assurance',
    'Consulting Services',
    'Custom Solutions'
];

const GetInTouchCompany: FC = () => {
    const { control, handleSubmit, formState: { errors, isValid }, setValue, watch, register } = useForm<FormData>({
        resolver: zodResolver(getTouchCompanyForm),
        mode: 'all',
        defaultValues: {
            firstName: '',
            lastName: '',
            companyName: '',
            jobTitle: '',
            workEmail: '',
            projectBudget: '',
            projectDescription: ''
        }
    });

    // State for handling Project Budget and Checkbox
    const [budget, setBudget] = useState<string>('');
    const [isChecked, setIsChecked] = useState(false);
    const [helpOptions, setHelpOptions] = useState<string[]>([]);

    // Update form when budget changes
    useEffect(() => {
        setValue('projectBudget', budget);
    }, [budget, setValue]);

    const onSubmit = (data: FormData) => {
        // Combine form data with other state
        const finalData = {
            ...data,
            helpOptions,
            termsAccepted: isChecked
        };
        console.log('Form submitted:', finalData);
    };

    const handleHelpOptionToggle = (option: string) => {
        setHelpOptions(prev =>
            prev.includes(option)
                ? prev.filter(item => item !== option)
                : [...prev, option]
        );
    };

    // Watch all form fields for validation
    const watchFields = watch();

    // Check if form is valid - all fields filled and required states set
    const isFormValid = isValid &&
        isChecked &&
        budget &&
        helpOptions.length > 0 &&
        Object.values(watchFields).every(Boolean);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center gap-4 my-5 pb-10'>
            <div className='w-[50%]'>
                <div className='w-full grid grid-cols-2 gap-6'>
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <InputAkai
                                title='First Name'
                                htmlFor='FirstName'
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
                                title='Last Name'
                                htmlFor='LastName'
                                error={errors.lastName?.message}
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        name="companyName"
                        control={control}
                        render={({ field }) => (
                            <InputAkai
                                title='Company Name'
                                htmlFor='CompanyName'
                                error={errors.companyName?.message}
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        name="jobTitle"
                        control={control}
                        render={({ field }) => (
                            <InputAkai
                                title='Job Title'
                                htmlFor='JobTitle'
                                error={errors.jobTitle?.message}
                                {...field}
                            />
                        )}
                    />
                    <Controller
                        name="workEmail"
                        control={control}
                        render={({ field }) => (
                            <InputAkai
                                title='Work Email'
                                htmlFor='WorkEmail'
                                error={errors.workEmail?.message}
                                inputType='email'
                                {...field}
                            />
                        )}
                    />
                </div>

                <div className='mt-5'>
                    <p>Project Budget</p>
                    <Select value={budget} onValueChange={setBudget}>
                        <SelectTrigger className="w-[380px] rounded-md">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className='font-albert-sans rounded-md'>
                            {projectBudgets.map((budgetOption, index) => (
                                <SelectItem key={index} value={budgetOption}>
                                    {budgetOption}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.projectBudget && (
                        <p className="text-red-500 text-sm mt-1">{errors.projectBudget.message}</p>
                    )}
                </div>

                <div className='mt-5'>
                    <p>What can we help with? Select all that apply.</p>
                    <div className='grid grid-cols-2 gap-4 mt-3'>
                        {helpOptionsList.map((option, i) => (
                            <label key={i} className='flex items-center w-fit gap-2 cursor-pointer'>
                                <Checkbox
                                    checked={helpOptions.includes(option)}
                                    onCheckedChange={() => handleHelpOptionToggle(option)}
                                />
                                <p>{option}</p>
                            </label>
                        ))}
                    </div>
                    {helpOptions.length === 0 && (
                        <p className="text-red-500 text-sm mt-1">Please select at least one option</p>
                    )}
                </div>
            </div>

            <textarea
                {...register('projectDescription')}
                placeholder='Please describe your project in detail'
                className='w-[80%] h-32 mt-4 p-2 border border-gray-700 rounded-md bg-inputBg font-albert-sans'
            />
            {errors.projectDescription && (
                <p className="text-red-500 text-sm">{errors.projectDescription.message}</p>
            )}

            <label className='flex items-center gap-2 cursor-pointer w-fit'>
                <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => setIsChecked(!!checked)}
                />
                <p>Agree to terms and conditions</p>
            </label>
            {!isChecked && (
                <p className="text-red-500 text-sm">Please accept the terms and conditions</p>
            )}

            <button
                type="submit"
                className='mt-5 px-3 py-2 bg-bigRed text-white font-albert-sans text-lg font-semibold w-32 rounded-lg hover:opacity-90 disabled:bg-gray-700'
                disabled={!isFormValid}
            >
                Submit
            </button>
        </form>
    );
}

export default GetInTouchCompany;