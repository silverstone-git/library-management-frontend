//import { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";

const Navbar = () => {

  // navbar contains the home page, login page, and list of books page
  //

  const { authLevel, logOut } = useAuth();


  return <div className='w-full h-24 flex items-center px-24'>

    <div className="rounded-full h-12 w-12 bg-red-500"></div>
    <div className="flex w-full gap-8 items-center justify-end">
    { authLevel > 0 ?

        <div className="flex gap-8 items-center justify-between"><div>Transactions</div>
        <div>Dashboard</div>
        <div>Users</div></div>
        : null

      }

      <div>Books</div>
      {
        authLevel > 0 ? <div onClick={() => logOut()} className="px-6 py-2 bg-primarybg text-white rounded-full">Log Out</div>
        : <div className="px-6 py-2 bg-primarybg text-white rounded-full">Log In</div>

      }
    </div>

  </div>;

}

export default Navbar;
