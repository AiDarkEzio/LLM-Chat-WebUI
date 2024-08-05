import Header from '@/components/header'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen flex flex-col">
      <Header></Header>
      <main className="flex justify-stretch flex-row flex-grow">
        {children}
      </main>
      {/* <footer className="h-12 px-4 flex items-center justify-center surface"> */}
        {/* Your footer content here */}
      {/* </footer> */}
    </div>
  );
}
