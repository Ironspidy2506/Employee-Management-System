import React from 'react'
import Header from '../components/HeaderFooter/Header'
import Footer from '../components/HeaderFooter/Footer'

const EndingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <Header />

                    {/* Letter Content */}
                    <div className="space-y-6 text-gray-800">
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}</p>
                        </div>

                        <div>
                            <p className="text-lg font-semibold mb-4">Dear All,</p>

                            <p className="mb-4 leading-relaxed">
                                I hope this message finds you well. I am writing to inform you about an important update regarding our Employee Management System (EMS).
                            </p>

                            <p className="mb-4 leading-relaxed">
                                After careful consideration and in my continuous effort to provide you with the best possible tools and services, I have made the decision to transition to a new and improved software platform. The current Korus EMS system is now <strong>non-functional</strong>.
                            </p>

                            <p className="mb-4 leading-relaxed">
                                I am pleased to announce that we have successfully migrated to a new software system that offers improved user experience, and better performance. The new system is now live and ready for use.
                            </p>

                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                                <h3 className="font-semibold text-blue-800 mb-2">Important Information:</h3>
                                <ul className="text-blue-700 space-y-1">
                                    <li>• <strong>New System Link:</strong> <a href="https://korus-ems.vercel.app" target='_blank' className="text-blue-600 underline hover:text-blue-800">[https://korus-ems.vercel.app]</a></li>
                                    <li>• <strong>Login Credentials:</strong> You can use your registered email and password from the previous system</li>
                                    <li>• <strong>No Password Reset Required:</strong> Your existing credentials will work seamlessly</li>
                                </ul>
                            </div>

                            <p className="mb-4 leading-relaxed">
                                I understand that transitions can sometimes be challenging, and I want to assure you that I have taken every measure to ensure a smooth migration process. Your data has been securely transferred to the new system, and all your previous information remains intact.
                            </p>

                            <p className="mb-4 leading-relaxed">
                                I appreciate your understanding and cooperation during this transition. I believe this new system will provide you with an even better experience and more efficient tools to support your daily work.
                            </p>

                            <div className="mt-8">
                                <p className="mb-2">Thank You</p>
                                <p className="font-semibold">Priyanshu Sahu</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}

                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default EndingPage
