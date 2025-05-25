import { Star } from 'lucide-react';
import React from 'react';
import Image from 'next/image';

const TestimonialBox = ({ avatar, name, rating, testimonial }: {
    avatar?: string,
    name: string,
    rating: number,
    testimonial: string
}) => {
    // Function to generate stars based on rating value
    const renderStars = (rating: number) => {
        const starArray = [];
        for (let i = 0; i < rating; i++) {
            starArray.push(<span key={i} className="text-yellow-500"><Star size={15} fill='#FFC700' /></span>);
        }
        return starArray;
    };

    return (
        <div className="border border-black bg-white px-3 py-2 w-72 h-40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Avatar Section */}
            <div className="flex items-center mb-3">
                <div className="avatar w-10 h-10 rounded-full bg-gray-300 flex-shrink-0">
                    {avatar ? (
                        <Image
                            src={avatar}
                            alt={name}
                            width={40}
                            height={40}
                            className="w-full h-full rounded-full"
                        />
                    ) : (
                        <div className="bg-gray-500 w-full h-full rounded-full"></div>
                    )}
                </div>
                <h4 className="text-lg font-helvetica-medium font-bold text-black ml-3">{name}</h4>
                <div className="flex items-center gap-1 ml-8">{renderStars(rating)}</div>
            </div>
            {/* Testimonial Content */}
            <p className="text-black text-lg font-semibold font-helvetica-medium">
                {testimonial.length > 100 ? `${testimonial.slice(0, 100)}...` : testimonial}
            </p>
        </div>
    );
};

export default TestimonialBox;
