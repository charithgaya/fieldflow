export default function Footer() {
    return (
        <footer className="border-t border-gray-800 py-6 px-2 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} FieldFlow - Field Service Management System. All rights reserved.
        </footer>
    );
}