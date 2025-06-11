import Link from "next/link";

const Navbar = () => {

    return (
        <nav className="bg-teal-600 text-white">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold hover:text-gray-200">
                    CourtDocs
                </Link>

                <ul className="hidden md:flex space-x-8 font-semibold">
                    <li>
                        <Link href="/records" className="hover:text-gray-200 transition duration-200">
                            Records
                        </Link>
                    </li>
                    <li>
                        <Link href="/verify" className="hover:text-gray-200 transition duration-200">
                            Verify
                        </Link>
                    </li>
                    <li>
                        <Link href="/upload" className="hover:text-gray-200 transition duration-200">
                            Add
                        </Link>
                    </li>
                    <li>
                        <Link href="/new" className="hover:text-gray-200 transition duration-200">
                            New Case
                        </Link>
                    </li>

                </ul>

            </div>

        </nav>
    );
};

export default Navbar;
