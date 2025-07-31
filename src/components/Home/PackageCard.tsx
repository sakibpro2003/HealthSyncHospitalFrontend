// "use client";
// import React from "react";
// import { useGetAllhealthPackageQuery } from "@/redux/features/healthPackage/healthPackageApi";
// import { useCreateSubscriptionMutation } from "@/redux/features/subscription/subscriptionApi";

// const PackageCard = () => {
//   const { data, isLoading, error } = useGetAllhealthPackageQuery(undefined);
//   const [createSubscription, { isLoading, errorCreate }] =
//     useCreateSubscriptionMutation();
  

//   const handleSubscription = async()=>{
//     const subscriptionInfo = {
//     patientId: "685797e4fcc3e3cb87970461",
//     packageId: "688786973c30d4c188eb171a",
//   };

//   try{
//     const res = await createSubscription(subscriptionInfo).unwrap();
//     console.log(res,'res from create sub')

//   }catch(err){
//     console.log(err)
//   }

//   }

//   }
//   return (
//     <div className="mt-10">
//       <h5 className="text-center font-bold text-3xl">
//         Health Checkup Packages
//       </h5>
//       <div className="grid grid-cols-4 w-11/12 mx-auto gap-12">
//         {data?.data?.result?.map((single) => (
//           <div
//             key={single._id}
//             className="w-full flex flex-col mt-auto h-max  max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700"
//           >
//             <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
//               {single.title}
//             </h5>
//             <h5 className="mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
//               {single.idealFor}
//             </h5>
//             <div className="flex items-baseline text-gray-900 dark:text-white">
//               <span className="text-3xl font-semibold">TK</span>
//               <span className="text-5xl font-extrabold tracking-tight">
//                 {single.price}
//               </span>
//               <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">
//                 /month
//               </span>
//             </div>
//             <ul role="list" className="space-y-5 my-7">
//               {/* <li className="flex items-center">
//               <svg
//                 className="shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
//               </svg>
//               <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
//                 2 team members
//               </span>
//             </li> */}
//               {/* <li className="flex">
//               <svg
//                 className="shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
//               </svg>
//               <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
//                 20GB Cloud storage
//               </span>
//             </li> */}
//               {single.includes.map((e) => (
//                 <li key={"s"} className="flex">
//                   <svg
//                     className="shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
//                   </svg>
//                   <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
//                     {e}
//                   </span>
//                 </li>
//               ))}
//               {/* <li className="flex line-through decoration-gray-500">
//               <svg
//                 className="shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
//               </svg>
//               <span className="text-base font-normal leading-tight text-gray-500 ms-3">
//                 Sketch Files
//               </span>
//             </li>
//             <li className="flex line-through decoration-gray-500">
//               <svg
//                 className="shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
//               </svg>
//               <span className="text-base font-normal leading-tight text-gray-500 ms-3">
//                 API Access
//               </span>
//             </li>
//             <li className="flex line-through decoration-gray-500">
//               <svg
//                 className="shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
//               </svg>
//               <span className="text-base font-normal leading-tight text-gray-500 ms-3">
//                 Complete documentation
//               </span>
//             </li>
//             <li className="flex line-through decoration-gray-500">
//               <svg
//                 className="shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
//               </svg>
//               <span className="text-base font-normal leading-tight text-gray-500 ms-3">
//                 24×7 phone & email support
//               </span>
//             </li> */}
//             </ul>
//             <button
//               type="button"
//               className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
//             >
//               Choose plan
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PackageCard;

"use client";
import { useGetAllhealthPackageQuery } from "@/redux/features/healthPackage/healthPackageApi";
import { useCreateSubscriptionMutation } from "@/redux/features/subscription/subscriptionApi";
import React from "react";
// import { useGetAllHealthPackageQuery } from "@/redux/features/healthPackage/healthPackage.api";
// import { useCreateSubscriptionMutation } from "@/redux/features/subscription/subscription.api";

const PackageCard = () => {
  const { data } = useGetAllhealthPackageQuery(undefined);
  console.log(data,'dataaaaaaaaaaaaa5')
  const [createSubscription] = useCreateSubscriptionMutation();

  const handleSubscription = async (packageId: string) => {
    const subscriptionInfo = {
      patientId: "685797e4fcc3e3cb87970461", // replace with dynamic ID later
      packageId,
    };
    try {
      const res = await createSubscription({ subscriptionInfo }).unwrap();
      console.log("Subscribed:", res);
    } catch (err) {
      console.error("Error subscribing:", err);
    }
  };

  return (
    <div className="mt-10">
      <h5 className="text-center font-bold text-3xl">Health Checkup Packages</h5>
      <div className="grid grid-cols-4 w-11/12 mx-auto gap-12">
        {data?.data?.result?.map((single) => (
          <div
            key={single._id}
            className="w-full flex flex-col mt-auto h-max max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700"
          >
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">{single.title}</h5>
            <h5 className="mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">{single.idealFor}</h5>
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">TK</span>
              <span className="text-5xl font-extrabold tracking-tight">{single.price}</span>
              <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <ul className="space-y-5 my-7">
              {single.includes.map((e, index) => (
                <li key={index} className="flex">
                  <svg
                    className="shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                    {e}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscription(single._id)}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
            >
              Choose plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageCard;

