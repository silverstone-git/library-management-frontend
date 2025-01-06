const Navbar = () => {

  // navbar contains the home page, login page, and list of books page
  //

  const isLoggedin = true;

  return <div className='w-full h-24 flex items-center px-24'>

    <div className="rounded-full h-12 w-12 bg-red-500"></div>
    <div className="flex w-full gap-8 items-center justify-end">
    { isLoggedin ?

        <div className="flex gap-8 items-center justify-between"><div>Transactions</div>
        <div>Dashboard</div>
        <div>Users</div></div>
        : null

      }

      <div>Books</div>
      <div className="px-6 py-2 bg-primarybg text-white rounded-full">Login</div>
    </div>

  </div>;

}

export default Navbar;
