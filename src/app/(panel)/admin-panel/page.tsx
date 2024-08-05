import Models from "@/components/Models";
import Users from "@/components/Users";
import Header from "@/components/header";

export default async function Page() {
    return (<>
        <Header adminPanel={false}/>
        <div className=" mt-1 flex flex-col items-center justify-center gap-4 surface p-8 rounded-lg w-full max-h-screen overflow-y-auto">
            <Models / >
        </div>
        <div className=" mt-1 flex flex-col items-center justify-center gap-4 surface p-8 rounded-lg w-full max-h-screen overflow-y-auto">
            <Users />
        </div>
    </>)
}