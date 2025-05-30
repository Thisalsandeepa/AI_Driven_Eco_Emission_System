// import { useState } from 'react';
// import { Send, AlertCircle } from 'lucide-react';

// interface FormData {
//   name: string;
//   email: string;
//   message: string;
// }

// const ContactForm = () => {
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     email: '',
//     message: ''
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when field is edited
//     if (errors[name]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};
    
//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }
    
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
    
//     if (!formData.message.trim()) {
//       newErrors.message = 'Message is required';
//     } else if (formData.message.trim().length < 10) {
//       newErrors.message = 'Message should be at least 10 characters';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     try {
//       // In a real app, this would be a fetch call to your backend
//       // For demo purposes, we're simulating an API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       setSubmitSuccess(true);
//       setFormData({
//         name: '',
//         email: '',
//         message: ''
//       });
      
//       // Reset success message after 5 seconds
//       setTimeout(() => {
//         setSubmitSuccess(false);
//       }, 5000);
//     } catch (error) {
//       setErrors({
//         submit: 'There was an error submitting your form. Please try again.'
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {submitSuccess && (
//         <div className="rounded-md bg-green-50 p-4 text-green-800">
//           <p className="flex items-center">
//             <Check className="mr-2 h-5 w-5 text-green-600" />
//             Your message has been sent successfully. We'll be in touch soon!
//           </p>
//         </div>
//       )}
      
//       {errors.submit && (
//         <div className="rounded-md bg-red-50 p-4 text-red-800">
//           <p className="flex items-center">
//             <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
//             {errors.submit}
//           </p>
//         </div>
//       )}

//       <div>
//         <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//           Name
//         </label>
//         <input
//           type="text"
//           id="name"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           className={`mt-1 block w-full rounded-md border ${
//             errors.name ? 'border-red-500' : 'border-gray-300'
//           } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
//         />
//         {errors.name && (
//           <p className="mt-1 flex items-center text-xs text-red-600">
//             <AlertCircle className="mr-1 h-3 w-3" />
//             {errors.name}
//           </p>
//         )}
//       </div>

//       <div>
//         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//           Email
//         </label>
//         <input
//           type="email"
//           id="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           className={`mt-1 block w-full rounded-md border ${
//             errors.email ? 'border-red-500' : 'border-gray-300'
//           } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
//         />
//         {errors.email && (
//           <p className="mt-1 flex items-center text-xs text-red-600">
//             <AlertCircle className="mr-1 h-3 w-3" />
//             {errors.email}
//           </p>
//         )}
//       </div>

//       <div>
//         <label htmlFor="message" className="block text-sm font-medium text-gray-700">
//           Message
//         </label>
//         <textarea
//           id="message"
//           name="message"
//           rows={5}
//           value={formData.message}
//           onChange={handleChange}
//           className={`mt-1 block w-full rounded-md border ${
//             errors.message ? 'border-red-500' : 'border-gray-300'
//           } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
//         />
//         {errors.message && (
//           <p className="mt-1 flex items-center text-xs text-red-600">
//             <AlertCircle className="mr-1 h-3 w-3" />
//             {errors.message}
//           </p>
//         )}
//       </div>

//       <div>
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="btn btn-primary flex w-full items-center justify-center"
//         >
//           {isSubmitting ? (
//             <span className="flex items-center">
//               <svg className="mr-2 h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                   fill="none"
//                 />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 />
//               </svg>
//               Sending...
//             </span>
//           ) : (
//             <span className="flex items-center">
//               <Send className="mr-2 h-4 w-4" />
//               Send Message
//             </span>
//           )}
//         </button>
//       </div>
//     </form>
//   );
// };

// const Check = ({ className }: { className?: string }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className={className}
//   >
//     <polyline points="20 6 9 17 4 12" />
//   </svg>
// );

// export default ContactForm;

import { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/contact', {
        name: formData.name,
        email: formData.email,
        subject: 'Website Contact',
        message: formData.message
      });

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Submit Error:', error);
      setErrors({
        submit: 'There was an error submitting your form. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitSuccess && (
        <div className="rounded-md bg-green-50 p-4 text-green-800">
          <p className="flex items-center">
            <Check className="mr-2 h-5 w-5 text-green-600" />
            Your message has been sent successfully. We'll be in touch soon!
          </p>
        </div>
      )}

      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4 text-red-800">
          <p className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
            {errors.submit}
          </p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
        />
        {errors.name && (
          <p className="mt-1 flex items-center text-xs text-red-600">
            <AlertCircle className="mr-1 h-3 w-3" />
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
        />
        {errors.email && (
          <p className="mt-1 flex items-center text-xs text-red-600">
            <AlertCircle className="mr-1 h-3 w-3" />
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
        />
        {errors.message && (
          <p className="mt-1 flex items-center text-xs text-red-600">
            <AlertCircle className="mr-1 h-3 w-3" />
            {errors.message}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary flex w-full items-center justify-center"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="mr-2 h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sending...
            </span>
          ) : (
            <span className="flex items-center">
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

const Check = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default ContactForm;
