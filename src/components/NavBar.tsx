import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 text-white shadow-2xl border-b border-white/10">
            {/* Background blur effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 backdrop-blur-sm"></div>

            <div className="relative container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo with gradient text */}
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                            CourtDocs
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <ul className="hidden md:flex items-center space-x-1">
                        <li>
                            <Link
                                href="/records"
                                className="group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm border border-transparent hover:border-white/20"
                            >
                                <span className="relative z-10 group-hover:text-blue-300 transition-colors duration-300">Records</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"></div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/verify"
                                className="group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm border border-transparent hover:border-white/20"
                            >
                                <span className="relative z-10 group-hover:text-purple-300 transition-colors duration-300">Verify</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-teal-500/0 group-hover:from-purple-500/10 group-hover:to-teal-500/10 rounded-xl transition-all duration-300"></div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/upload"
                                className="group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm border border-transparent hover:border-white/20"
                            >
                                <span className="relative z-10 group-hover:text-teal-300 transition-colors duration-300">Add</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-blue-500/0 group-hover:from-teal-500/10 group-hover:to-blue-500/10 rounded-xl transition-all duration-300"></div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/new"
                                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>New Case</span>
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile menu button */}
                    <button className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Subtle bottom border with gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </nav>
    );
};

export default Navbar;