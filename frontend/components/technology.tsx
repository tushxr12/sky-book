// import React from 'react'

// export function Technology() {
//     return (
//         <section className="w-full bg-gray-50 dark:bg-gray-900 py-16 border-t">
//             <div className="max-w-5xl mx-auto px-6 text-center">
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Built With</h2>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-center">
//                     <span className="text-sm text-gray-600 dark:text-gray-400">Next.js</span>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">Tailwind CSS</span>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">.NET Core</span>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">SQLite</span>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">REST APIs</span>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">ShadCN UI</span>
//                 </div>
//             </div>
//         </section>
//     )
// }

import Image from 'next/image';
import NextLogo from '../public/nextdotjs.svg';
import TailwindLogo from '../public/tailwindcss.svg';
import DotNetLogo from '../public/dotnet.svg';
import SQLiteLogo from '../public/sqlite.svg';
import RestApiLogo from '../public/rest-api-icon.webp';
import ShadCNLogo from '../public/shadcnui.svg';
import ActernityLogo from "../public/acternitylogo.png"
import TypescriptLogo from "../public/typescriptlogo.png"

export function Technology() {
    const technologies = [
        { name: 'Next.js', logo: NextLogo },
        { name: 'Tailwind CSS', logo: TailwindLogo },
        { name: '.NET Core', logo: DotNetLogo },
        { name: 'SQLite', logo: SQLiteLogo },
        { name: 'REST APIs', logo: RestApiLogo },
        { name: 'ShadCN UI', logo: ShadCNLogo },
        { name: 'Acternity UI', logo: ActernityLogo},
        { name: 'TypeScript', logo: TypescriptLogo}
    ];

    return (
        <section className="w-full bg-gray-50 dark:bg-gray-900 py-16 border-t">
            <div className="max-w-4xl mx-auto px-10 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Built With</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {technologies.map((tech, index) => (
                        <div key={index} className="flex flex-col items-center bg-white dark:bg-indigo-200 p-4 rounded-lg shadow-md">
                            <Image src={tech.logo} alt={tech.name} width={64} height={64} className="mb-4" />
                            <span className="text-sm text-gray-600 dark:text-gray-800">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

