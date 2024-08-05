export default function Footer() {
    return (
        <footer className="h-8 w-full flex items-center bg-transparent py-1">
          <div className="mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Subhadra Poshita
          </div>
        </footer>
    )
}

// (<footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white py-4 shadow-md">
//   <div className="container mx-auto px-4 text-center">
//     &copy; {new Date().getFullYear()} Subhadra Poshita
//   </div>
// </footer>)