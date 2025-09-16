"use client";


import { logout } from "@/actions/logout";

export const Navbar = ({ sidebarHandler, setSidebarHandler }: { sidebarHandler: boolean, setSidebarHandler: any }) => {


  return (
    <header className="text-gray-600 body-font bg-black border border-temp border-l-0 border-r-0">
      <div className="mx-auto flex flex-wrap p-4 flex-col md:flex-row items-center justify-between">
        <div onClick={() => setSidebarHandler(!sidebarHandler)} className="cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white cursor-pointer ml-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>

        <div className="flex flex-wrap items-center justify-center mr-4">
          <button className="bg-current hover:bg-gray-200 text-black hover:text-black py-2 px-4 rounded ml-4 cursor-pointer flex items-center gap-2"
            onClick={() => logout()}
          >

            Logout
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-black cursor-pointer">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>

          </button>
        </div>
      </div>
    </header>

  );
};
