import React from 'react'

export function Contact() {
    return (
        <section className="w-full bg-white dark:bg-gray-950 py-16 border-t">
            <div className="max-w-xl mx-auto px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Questions / Feedback / Suggestions?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">This is a sample project built for learning and showcasing full-stack development. Want to connect?</p>
                <a
                    href="mailto:tushxr.work@gmail.com"
                    className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                    📩 Email Me
                </a>
            </div>
        </section>
    )
}
