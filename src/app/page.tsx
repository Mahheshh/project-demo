export default function Landing() {
  return (
    <div>
      <section className="bg-teal-600 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold">Effortless Court Document Management</h2>
          <p className="mt-4 text-lg">
            A secure platform for managing and accessing court documents with ease.
          </p>
          <a
            href="/login"
            className="inline-block mt-8 px-8 py-3 text-lg font-semibold bg-white text-teal-600 rounded hover:bg-gray-200"
          >
            Get Started
          </a>
        </div>
      </section>

      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-teal-700">Why Choose CourtDocs?</h3>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="text-teal-600 mb-4 text-5xl">🔒</div>
              <h4 className="text-xl font-semibold text-teal-700">Secure Access</h4>
              <p className="mt-2 text-gray-600">
                Ensure your documents are protected with top-notch security protocols.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="text-teal-600 mb-4 text-5xl">📂</div>
              <h4 className="text-xl font-semibold text-teal-700">Easy Document Upload</h4>
              <p className="mt-2 text-gray-600">
                Quickly upload and manage case files for efficient workflows.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center">
              <div className="text-teal-600 mb-4 text-5xl">🔍</div>
              <h4 className="text-xl font-semibold text-teal-700">Quick Search</h4>
              <p className="mt-2 text-gray-600">
                Find documents instantly using document hashes or case numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-teal-700 text-white py-16 text-center">
        <h3 className="text-3xl font-bold">Ready to streamline your document management?</h3>
        <p className="mt-4 text-lg">
          Join now and experience seamless, secure, and efficient workflows.
        </p>
        <a
          href="/login"
          className="inline-block mt-8 px-8 py-3 text-lg font-semibold bg-white text-teal-700 rounded hover:bg-gray-200"
        >
          Get Started
        </a>
      </section>
    </div>
  );
}
